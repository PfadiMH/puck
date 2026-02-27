"use client";

import type { CalendarGroup } from "@lib/calendar/types";
import cn from "@lib/cn";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, CalendarPlus } from "lucide-react";

function getWebcalUrl(slug: string): string {
  if (typeof window === "undefined") return "";
  const base = `${window.location.protocol}//${window.location.host}`;
  return base.replace(/^https?:/, "webcal:") + `/cal/${slug}.ics`;
}

function SubscribeCard({
  name,
  slug,
  size,
}: {
  name: string;
  slug: string;
  size: "gross" | "mittel" | "klein";
}) {
  const webcalUrl = getWebcalUrl(slug);

  return (
    <div
      className={cn(
        "bg-elevated rounded-xl border border-contrast-ground/10 shadow-sm hover:shadow-md transition-shadow flex flex-col",
        size === "klein" && "p-3",
        size === "mittel" && "p-4",
        size === "gross" && "p-5"
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays
          className={cn(
            "text-primary shrink-0",
            size === "klein" ? "w-4 h-4" : "w-5 h-5"
          )}
        />
        <h3
          className={cn(
            "font-semibold truncate",
            size === "klein" && "text-sm",
            size === "mittel" && "text-base",
            size === "gross" && "text-lg"
          )}
        >
          {name}
        </h3>
      </div>

      <div className="mt-auto">
        <a
          href={webcalUrl}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors w-full",
            "bg-primary text-contrast-primary hover:bg-primary/90 active:bg-primary/80",
            size === "klein" && "px-3 py-1.5 text-xs",
            size === "mittel" && "px-4 py-2 text-sm",
            size === "gross" && "px-5 py-2.5 text-sm"
          )}
        >
          <CalendarPlus
            className={cn(
              size === "klein" ? "w-3.5 h-3.5" : "w-4 h-4"
            )}
          />
          Abonnieren
        </a>
      </div>
    </div>
  );
}

export function CalendarSubscribeClient({
  size,
}: {
  size: "gross" | "mittel" | "klein";
}) {
  const { data: groups = [], isLoading } = useQuery<CalendarGroup[]>({
    queryKey: ["calendar-groups-public"],
    queryFn: async () => {
      const res = await fetch("/api/calendar/groups");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "bg-elevated rounded-xl animate-pulse",
              size === "klein" && "w-[160px] h-[100px]",
              size === "mittel" && "w-[200px] h-[120px]",
              size === "gross" && "w-[240px] h-[140px]"
            )}
          />
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-8">
        <CalendarDays className="w-10 h-10 mx-auto text-contrast-ground/20 mb-3" />
        <p className="text-contrast-ground/50 text-sm">
          Keine Kalender verfügbar.
        </p>
      </div>
    );
  }

  const cardWidth = size === "klein" ? 160 : size === "mittel" ? 200 : 240;

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {groups.map((group) => (
        <div key={group._id} style={{ width: cardWidth, minWidth: cardWidth }}>
          <SubscribeCard name={group.name} slug={group.slug} size={size} />
        </div>
      ))}
      {/* "All" card */}
      <div style={{ width: cardWidth, minWidth: cardWidth }}>
        <SubscribeCard
          name="Alle Aktivitäten"
          slug="all"
          size={size}
        />
      </div>
    </div>
  );
}
