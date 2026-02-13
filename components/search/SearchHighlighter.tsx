"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

function getLuminance(element: Element): number {
  const bg = getComputedStyle(element).backgroundColor;
  const match = bg.match(/(\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return 1;
  const [r, g, b] = [+match[1], +match[2], +match[3]].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function cleanUrl(): void {
  const params = new URLSearchParams(window.location.search);
  params.delete("highlight");
  params.delete("cid");
  const newUrl =
    window.location.pathname +
    (params.toString() ? `?${params}` : "");
  window.history.replaceState({}, "", newUrl);
}

function clearMarks(marks: HTMLElement[]): void {
  for (const mark of marks) {
    const parent = mark.parentNode;
    if (parent) {
      parent.replaceChild(
        document.createTextNode(mark.textContent || ""),
        mark,
      );
      parent.normalize();
    }
  }
}

export function SearchHighlighter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const marksRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const highlight = searchParams.get("highlight");
    if (!highlight) return;

    const componentId = searchParams.get("cid") ?? undefined;
    const terms = highlight.trim().split(/\s+/);

    const escaped = terms.map((t) =>
      t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    );
    const pattern = new RegExp(`(${escaped.join("|")})`, "gi");

    const dismiss = () => {
      clearMarks(marksRef.current);
      marksRef.current = [];
      cleanUrl();
    };

    const timerId = setTimeout(() => {
      const container = componentId
        ? document.getElementById(componentId)
        : document.querySelector("main") ?? document.body;
      if (!container) return;

      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
      );

      let target: Text | null = null;
      let node = walker.nextNode();
      while (node) {
        const parent = node.parentElement;
        if (
          parent &&
          !parent.closest("nav") &&
          !parent.closest("script") &&
          !parent.closest("style") &&
          parent.tagName !== "MARK" &&
          node.textContent
        ) {
          pattern.lastIndex = 0;
          if (pattern.test(node.textContent)) {
            target = node as Text;
            break;
          }
        }
        node = walker.nextNode();
      }

      if (target) {
        pattern.lastIndex = 0;
        const text = target.textContent ?? "";
        const firstMatch = pattern.exec(text);
        if (firstMatch) {
          const matchStart = firstMatch.index;
          const fragment = document.createDocumentFragment();

          if (matchStart > 0) {
            fragment.appendChild(
              document.createTextNode(text.slice(0, matchStart)),
            );
          }

          const parentEl = target.parentElement;
          const luminance = parentEl ? getLuminance(parentEl) : 1;
          const opacity = luminance > 0.4 ? 0.5 : 0.7;

          const mark = document.createElement("mark");
          mark.className = "search-highlight";
          mark.style.backgroundColor = `rgba(237, 198, 0, ${opacity})`;
          mark.style.borderRadius = "2px";
          mark.style.color = "inherit";
          mark.textContent = firstMatch[0];
          marksRef.current.push(mark);
          fragment.appendChild(mark);

          const afterIndex = matchStart + firstMatch[0].length;
          if (afterIndex < text.length) {
            fragment.appendChild(
              document.createTextNode(text.slice(afterIndex)),
            );
          }

          target.parentNode?.replaceChild(fragment, target);
        }
      }

      if (marksRef.current.length > 0) {
        marksRef.current[0].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        document.addEventListener("click", dismiss, { once: true });
      }
    }, 150);

    return () => {
      clearTimeout(timerId);
      document.removeEventListener("click", dismiss);
      clearMarks(marksRef.current);
      marksRef.current = [];
    };
  }, [pathname, searchParams]);

  return null;
}
