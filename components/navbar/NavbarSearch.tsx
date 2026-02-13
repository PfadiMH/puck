"use client";

import { getSearchIndex } from "@lib/db/db-actions";
import type { SearchIndexEntry } from "@lib/search/extract-text";
import { filterSearchIndex } from "@lib/search/filter-search";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Loader2, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const GENERIC_TITLES = new Set(["new page", "untitled", "test", ""]);

function formatPath(path: string): string {
  return path
    .replace(/^\//, "")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getDisplayTitle(title: string, path: string): string {
  if (GENERIC_TITLES.has(title.toLowerCase().trim())) {
    return formatPath(path) || path;
  }
  return title;
}

function buildResultHref(result: { path: string; snippet: string; componentId: string }, query: string): string {
  const term = extractHighlightTerm(result.snippet, query);
  return `${result.path}?highlight=${encodeURIComponent(term)}&cid=${encodeURIComponent(result.componentId)}`;
}

function extractHighlightTerm(snippet: string, query: string): string {
  const cleaned = snippet.replace(/^\.{3}|\.{3}$/g, "").trim();
  const lower = query.toLowerCase().trim();
  const words = cleaned.split(/\s+/);
  const idx = words.findIndex((w) => w.toLowerCase().includes(lower));
  if (idx === -1) return query.trim();
  const matched = words[idx];
  if (matched.length > 3) return matched;
  const neighbor = words[idx + 1] ?? words[idx - 1];
  return neighbor ? `${matched} ${neighbor}` : matched;
}

function highlightMatches(text: string, query: string): ReactNode {
  const trimmed = query.trim();
  if (!trimmed) return text;

  const escaped = trimmed
    .split(/\s+/)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(pattern);

  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="bg-[#edc600]/40 text-inherit rounded-sm">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

type NavbarSearchProps = {
  compact?: boolean;
};

export function NavbarSearch({ compact = false }: NavbarSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const router = useRouter();

  const {
    data: index = [],
    isLoading,
    isError,
  } = useQuery<SearchIndexEntry[]>({
    queryKey: ["search-index"],
    queryFn: getSearchIndex,
    enabled: open,
    staleTime: 5 * 60 * 1000,
  });

  const results = useMemo(
    () => filterSearchIndex(index, query),
    [index, query],
  );

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelectedIndex(-1);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape" && open) {
        close();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, close]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (selectedIndex >= 0) {
      resultRefs.current[selectedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!open) {
    return compact ? (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center w-10 h-10 text-black rounded-full border border-black/80 hover:border-black transition-colors"
        aria-label="Search"
      >
        <Search className="w-4 h-4" />
      </button>
    ) : (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-black rounded-xl border border-black/80 hover:border-black transition-colors min-w-[140px]"
        aria-label="Search"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Suchen</span>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="fixed top-[10%] left-1/2 -translate-x-1/2 w-[90vw] max-w-[500px] bg-ground rounded-xl shadow-lg overflow-hidden border border-contrast-ground/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={clsx(
            "flex items-center gap-2 p-3",
            (query.trim() || isLoading || isError) &&
              "border-b border-contrast-ground/10",
          )}
        >
          <Search className="w-5 h-5 text-contrast-ground/40 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) =>
                  prev < results.length - 1 ? prev + 1 : prev,
                );
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
              } else if (
                e.key === "Enter" &&
                selectedIndex >= 0 &&
                results[selectedIndex]
              ) {
                e.preventDefault();
                const r = results[selectedIndex];
                router.push(buildResultHref(r, query));
                close();
              }
            }}
            aria-label="Suchen"
            placeholder="Suchen"
            className="flex-1 outline-none text-base bg-transparent text-contrast-ground placeholder:text-contrast-ground/40"
          />
          <button
            type="button"
            onClick={close}
            className="p-1 text-contrast-ground/40 hover:text-contrast-ground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center gap-2 p-4 text-contrast-ground/50">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Laden...</span>
          </div>
        )}

        {isError && (
          <div className="p-4 text-red-500 text-center text-sm">
            Suchindex konnte nicht geladen werden
          </div>
        )}

        {!isLoading && !isError && query.trim() && (
          <ul className="max-h-[60vh] overflow-y-auto p-2 flex flex-col gap-1">
            {results.length === 0 ? (
              <li className="p-4 text-contrast-ground/50 text-center">
                Keine Ergebnisse
              </li>
            ) : (
              results.map((result, i) => (
                <li key={result.id}>
                  <Link
                    ref={(el) => { resultRefs.current[i] = el; }}
                    href={buildResultHref(result, query)}
                    onClick={close}
                    className={clsx(
                      "flex flex-col gap-0.5 w-full text-left px-3 py-2.5 rounded-lg transition-colors no-underline",
                      i === selectedIndex
                        ? "bg-elevated/40"
                        : "hover:bg-elevated/20",
                    )}
                  >
                    <span className="text-sm text-contrast-ground line-clamp-2">
                      {highlightMatches(result.snippet, query)}
                    </span>
                    <span className="text-xs text-contrast-ground/40 truncate">
                      {getDisplayTitle(result.title, result.path)}
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
