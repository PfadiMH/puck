"use client";

import cn from "@lib/cn";
import type {
  OrganigrammMember,
  OrganigrammNode,
  OrganigrammResponse,
} from "@lib/hitobito/types";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ChevronDown, ChevronRight, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HoverCard } from "radix-ui";
import type { OrganigrammProps } from "./Organigramm";

// ---------------------------------------------------------------------------
// Data fetching & filtering
// ---------------------------------------------------------------------------

function useOrganigrammData(groupId: number) {
  return useQuery<OrganigrammResponse>({
    queryKey: ["organigramm", groupId],
    queryFn: async () => {
      const res = await fetch(`/api/organigramm?groupId=${groupId}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      return res.json();
    },
    enabled: groupId > 0,
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });
}

function parseExcludedRoles(excludedRoles: string): Set<string> {
  if (!excludedRoles.trim()) return new Set();
  return new Set(
    excludedRoles
      .split(",")
      .map((r) => r.trim().toLowerCase())
      .filter(Boolean)
  );
}

function isRoleExcluded(member: OrganigrammMember, excluded: Set<string>): boolean {
  if (excluded.size === 0) return false;
  const roleTypeLower = member.role.toLowerCase();
  const roleNameLower = (member.roleName ?? "").toLowerCase();
  for (const pattern of excluded) {
    if (roleTypeLower.includes(pattern) || roleNameLower === pattern) {
      return true;
    }
  }
  return false;
}

function filterTree(
  node: OrganigrammNode,
  excluded: Set<string>
): OrganigrammNode {
  const filteredMembers = node.members.filter((m) => !isRoleExcluded(m, excluded));
  const filteredChildren = node.children
    .map((child) => filterTree(child, excluded))
    .filter((child) => child.members.length > 0 || child.children.length > 0);
  return { ...node, members: filteredMembers, children: filteredChildren };
}

/** Collect group IDs down to a given depth (for default expanded state). */
function collectIds(node: OrganigrammNode, depth: number): number[] {
  if (depth <= 0) return [];
  const ids = [node.group.id];
  for (const child of node.children) {
    ids.push(...collectIds(child, depth - 1));
  }
  return ids;
}

// ---------------------------------------------------------------------------
// Hover detail: avatar + member row (only shown in popover)
// ---------------------------------------------------------------------------

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function stringToColor(str: string): string {
  const colors = [
    "bg-amber-600", "bg-emerald-600", "bg-sky-600", "bg-violet-600",
    "bg-rose-600", "bg-teal-600", "bg-indigo-600", "bg-orange-600",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function MemberAvatar({
  member,
  showPicture,
}: {
  member: OrganigrammMember;
  showPicture: boolean;
}) {
  const initials = getInitials(member.firstName, member.lastName);
  const colorClass = stringToColor(`${member.firstName}${member.lastName}`);

  if (showPicture && member.picture) {
    return (
      <div className="relative size-8 shrink-0 overflow-hidden rounded-full ring-1 ring-contrast-ground/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={member.picture}
          alt={`${member.firstName} ${member.lastName}`}
          className="size-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white ring-1 ring-contrast-ground/20",
        colorClass
      )}
      aria-label={`${member.firstName} ${member.lastName}`}
    >
      {initials}
    </div>
  );
}

function HoverMemberRow({
  member,
  showPicture,
}: {
  member: OrganigrammMember;
  showPicture: boolean;
}) {
  const displayName = member.nickname
    ? `«${member.nickname}» ${member.firstName} ${member.lastName}`
    : `${member.firstName} ${member.lastName}`;

  return (
    <div className="flex items-center gap-2 py-0.5">
      <MemberAvatar member={member} showPicture={showPicture} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium leading-tight text-contrast-ground">
          {displayName}
        </p>
        {member.roleName && (
          <p className="truncate text-[10px] leading-tight text-contrast-ground/60">
            {member.roleName}
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Compact group card (hierarchy-focused)
// ---------------------------------------------------------------------------

/** Get comma-separated scout names for display on the compact card. */
function getScoutNames(members: OrganigrammMember[]): string {
  if (members.length === 0) return "";
  return members
    .map((m) => m.nickname ?? m.firstName)
    .join(", ");
}

function CompactCard({
  node,
  showPictures,
  isExpanded,
  onToggle,
  className,
}: {
  node: OrganigrammNode;
  showPictures: boolean;
  isExpanded: boolean;
  onToggle: (() => void) | null;
  className?: string;
}) {
  const hasChildren = node.children.length > 0;
  const scoutNames = getScoutNames(node.members);

  const card = (
    <div className={cn("flex w-28 flex-col rounded-lg border border-contrast-ground/20 bg-elevated px-2 py-1.5 text-center shadow-md transition-colors hover:border-contrast-ground/40 sm:w-36 sm:px-2.5 sm:py-2 lg:w-44 lg:px-3 lg:py-2.5", className)}>
      {/* Content area */}
      <div className="flex-1">
        {/* Group name */}
        <h3 className="text-[11px] font-semibold leading-tight text-contrast-ground sm:text-xs lg:text-sm">
          {node.group.name}
        </h3>

        {/* Short name / subtitle */}
        {node.group.shortName && node.group.shortName !== node.group.name && (
          <p className="mt-0.5 text-[9px] leading-tight text-contrast-ground/60 sm:text-[10px] lg:text-[11px]">
            {node.group.shortName}
          </p>
        )}

        {/* Scout names (comma-separated) */}
        {scoutNames && (
          <p className="mt-1 text-[10px] leading-snug text-contrast-ground/70 sm:mt-1.5 sm:text-[11px] lg:text-xs">
            {scoutNames}
          </p>
        )}
      </div>

      {/* Expand/collapse toggle — pinned to bottom */}
      {hasChildren && onToggle && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="mx-auto mt-1.5 flex items-center gap-0.5 rounded-md border border-contrast-ground/15 px-1.5 py-0.5 text-[9px] text-contrast-ground/60 transition-colors hover:bg-contrast-ground/10 hover:text-contrast-ground sm:mt-2 sm:gap-1 sm:px-2 sm:text-[10px] lg:text-[11px]"
        >
          {isExpanded ? (
            <ChevronDown className="size-2.5 shrink-0 sm:size-3" />
          ) : (
            <ChevronRight className="size-2.5 shrink-0 sm:size-3" />
          )}
          <span>
            {node.children.length}{" "}
            {node.children.length === 1 ? "Untergruppe" : "Untergruppen"}
          </span>
        </button>
      )}
    </div>
  );

  // Wrap in HoverCard if there are members to show
  if (node.members.length === 0) return card;

  return (
    <HoverCard.Root openDelay={200} closeDelay={100}>
      <HoverCard.Trigger asChild>{card}</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          side="bottom"
          align="center"
          sideOffset={8}
          className="z-50 w-56 rounded-lg border border-contrast-ground/20 bg-elevated p-3 shadow-xl"
        >
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-contrast-ground/60">
            {node.group.name}
          </p>
          <div className="space-y-0.5">
            {node.members.map((member) => (
              <HoverMemberRow
                key={`${member.id}-${member.role}`}
                member={member}
                showPicture={showPictures}
              />
            ))}
          </div>
          <HoverCard.Arrow className="fill-contrast-ground/20" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}

// ---------------------------------------------------------------------------
// Scale-to-fit container (prevents horizontal overflow on small screens)
// ---------------------------------------------------------------------------

/**
 * Measures the natural width of its children and scales them down
 * (via CSS transform) so they always fit the available container width.
 * When the content fits naturally, scale = 1 and the content is centered.
 * ResizeObserver watches both the container and the content so the scale
 * updates on viewport resize AND on content changes (expand/collapse).
 */
function FitToWidth({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ scale: 1, height: 0, offsetX: 0 });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const update = () => {
      const available = wrapper.clientWidth;
      const natural = content.scrollWidth;
      const naturalH = content.scrollHeight;
      const s = available > 0 && natural > 0 ? Math.min(1, available / natural) : 1;
      setLayout({
        scale: s,
        height: naturalH * s,
        offsetX: (available - natural * s) / 2,
      });
    };

    const ro = new ResizeObserver(update);
    ro.observe(wrapper);
    ro.observe(content);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="w-full overflow-hidden"
      style={{ height: layout.height || undefined }}
    >
      <div
        ref={contentRef}
        style={{
          transform: `translate(${layout.offsetX}px, 0) scale(${layout.scale})`,
          transformOrigin: "top left",
          width: "fit-content",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tree layout with connector lines (responsive)
// ---------------------------------------------------------------------------

/** Connector line color — visible on both light and dark themes */
const CONNECTOR = "bg-contrast-ground/40";

/**
 * CSS Grid layout for sibling nodes at the same tree level.
 *
 * Uses a 2-row grid so that Row 1 (connector + card) auto-sizes to the
 * TALLEST cell — all cards' bottoms align regardless of content height.
 * Row 2 holds each child's subtree (variable height, fine).
 *
 * Inside each Row 1 cell a `flex-1` spacer grows to fill the difference
 * between the cell's natural height and the grid-auto row height, pushing
 * the CompactCard to the bottom of the cell.
 */
function ChildrenGrid({
  nodes,
  showPictures,
  expanded,
  onToggle,
}: {
  nodes: OrganigrammNode[];
  showPictures: boolean;
  expanded: Set<number>;
  onToggle: (id: number) => void;
}) {
  const count = nodes.length;

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${count}, auto)`,
        gridTemplateRows: "auto auto",
      }}
    >
      {/* --- Row 1: connector area + card for each sibling --- */}
      {nodes.map((node, i) => {
        const isFirst = i === 0;
        const isLast = i === count - 1;
        const isOnly = count === 1;
        const hasChildren = node.children.length > 0;
        const isExpanded = expanded.has(node.group.id);

        return (
          <div
            key={`card-${node.group.id}`}
            className="relative flex flex-col items-center px-0.5 pt-3 sm:px-1 sm:pt-4 lg:px-1.5 lg:pt-5"
            style={{ gridRow: 1, gridColumn: i + 1 }}
          >
            {/* Vertical drop from horizontal bar down to card area */}
            <div
              className={cn(
                "absolute left-1/2 top-0 h-3 w-0.5 -translate-x-1/2 sm:h-4 lg:h-5",
                CONNECTOR
              )}
            />

            {/* Left half of horizontal connector */}
            {!isFirst && !isOnly && (
              <div
                className={cn(
                  "absolute left-0 right-1/2 top-0 h-0.5",
                  CONNECTOR
                )}
              />
            )}

            {/* Right half of horizontal connector */}
            {!isLast && !isOnly && (
              <div
                className={cn(
                  "absolute left-1/2 right-0 top-0 h-0.5",
                  CONNECTOR
                )}
              />
            )}

            {/* Vertical connector: stretches from drop-line to card */}
            <div className={cn("w-0.5 min-h-0 flex-1", CONNECTOR)} />

            <CompactCard
              node={node}
              showPictures={showPictures}
              isExpanded={isExpanded}
              onToggle={hasChildren ? () => onToggle(node.group.id) : null}
            />
          </div>
        );
      })}

      {/* --- Row 2: stem + recursive subtree for each child --- */}
      {nodes.map((node, i) => {
        const hasChildren = node.children.length > 0;
        const isExpanded = expanded.has(node.group.id);

        return (
          <div
            key={`sub-${node.group.id}`}
            className="flex flex-col items-center"
            style={{ gridRow: 2, gridColumn: i + 1 }}
          >
            {hasChildren && isExpanded && (
              <>
                {/* Vertical stem down from card to children */}
                <div className={cn("h-3 w-0.5 sm:h-4 lg:h-5", CONNECTOR)} />
                <ChildrenGrid
                  nodes={node.children}
                  showPictures={showPictures}
                  expanded={expanded}
                  onToggle={onToggle}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

function SkeletonCard() {
  return (
    <div className="w-28 animate-pulse rounded-lg border border-contrast-ground/20 bg-elevated px-2 py-1.5 text-center shadow-md sm:w-36 sm:px-2.5 sm:py-2 lg:w-44 lg:px-3 lg:py-2.5">
      <div className="mx-auto h-3 w-14 rounded bg-contrast-ground/10 sm:h-4 sm:w-16 lg:w-20" />
      <div className="mx-auto mt-1 h-2.5 w-10 rounded bg-contrast-ground/10 sm:h-3 sm:w-12 lg:w-16" />
      <div className="mx-auto mt-1.5 h-2.5 w-20 rounded bg-contrast-ground/10 sm:mt-2 sm:h-3 sm:w-24 lg:w-28" />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <FitToWidth>
      <div className="flex flex-col items-center px-4">
        <SkeletonCard />
        <div className={cn("h-3 w-0.5 sm:h-4 lg:h-5", CONNECTOR)} />
        <div className="flex justify-center gap-2 sm:gap-4 lg:gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </FitToWidth>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/** Number of tree levels to expand by default (root = level 1). */
const DEFAULT_EXPANDED_DEPTH = 2;

export function OrganigrammClient({
  rootGroupId,
  excludedRoles,
  // maxDepth is used server-side in the API route, not client-side
  showPictures,
}: OrganigrammProps) {
  const { data, isLoading, error } = useOrganigrammData(rootGroupId);

  const excludedSet = useMemo(
    () => parseExcludedRoles(excludedRoles),
    [excludedRoles]
  );

  const filteredTree = useMemo(() => {
    if (!data?.data) return null;
    return filterTree(data.data, excludedSet);
  }, [data, excludedSet]);

  // Collapsible state — default: first 2 levels expanded
  const defaultExpanded = useMemo(() => {
    if (!filteredTree) return new Set<number>();
    return new Set(collectIds(filteredTree, DEFAULT_EXPANDED_DEPTH));
  }, [filteredTree]);

  const [expanded, setExpanded] = useState<Set<number> | null>(null);

  // Use default until user interacts
  const activeExpanded = expanded ?? defaultExpanded;

  const handleToggle = useCallback((id: number) => {
    setExpanded((prev) => {
      const current = prev ?? defaultExpanded;
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, [defaultExpanded]);

  // --- Not configured ---
  if (rootGroupId <= 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-contrast-ground/20 p-8 text-center">
        <Users className="size-8 text-contrast-ground/60" />
        <p className="text-sm text-contrast-ground/60">
          Bitte Hitobito Gruppen-ID in den Komponenteneinstellungen konfigurieren.
        </p>
      </div>
    );
  }

  // --- Loading ---
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // --- Error ---
  if (error || !filteredTree) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-brand-red/30 bg-brand-red/10 p-6 text-center">
        <AlertCircle className="size-6 text-brand-red" />
        <p className="text-sm font-medium text-brand-red">
          Organigramm konnte nicht geladen werden
        </p>
        <p className="text-xs text-contrast-ground/60">
          {error instanceof Error ? error.message : "Unbekannter Fehler"}
        </p>
      </div>
    );
  }

  return (
    <div className="full w-full py-4">
      {/* Stale data indicator */}
      {data?.stale && (
        <p className="mb-3 text-center text-xs italic text-contrast-ground/60">
          Zwischengespeicherte Daten (Hitobito nicht erreichbar)
        </p>
      )}

      {/* Tree layout — scales down to fit on small screens */}
      <FitToWidth>
        <div className="flex flex-col items-center px-4 pb-2">
          <CompactCard
            node={filteredTree}
            showPictures={showPictures}
            isExpanded={activeExpanded.has(filteredTree.group.id)}
            onToggle={
              filteredTree.children.length > 0
                ? () => handleToggle(filteredTree.group.id)
                : null
            }
          />

          {filteredTree.children.length > 0 &&
            activeExpanded.has(filteredTree.group.id) && (
              <>
                {/* Vertical stem from root card to children grid */}
                <div className={cn("h-3 w-0.5 sm:h-4 lg:h-5", CONNECTOR)} />
                <ChildrenGrid
                  nodes={filteredTree.children}
                  showPictures={showPictures}
                  expanded={activeExpanded}
                  onToggle={handleToggle}
                />
              </>
            )}
        </div>
      </FitToWidth>
    </div>
  );
}
