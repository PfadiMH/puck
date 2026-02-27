"use client";

import type { CalendarEvent } from "@lib/calendar/types";
import { getPackingIcon } from "@lib/packing-icons";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Backpack,
  Calendar,
  CalendarDays,
  Clock,
  Info,
  MapPin,
} from "lucide-react";

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const days = [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ];
  const months = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];
  return `${days[date.getDay()]}, ${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function isValidHttpUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function LocationDisplay({
  label,
  location,
}: {
  label: string;
  location: { name: string; mapsLink?: string };
}) {
  if (!location?.name) return null;

  const hasValidLink = isValidHttpUrl(location.mapsLink || "");

  return (
    <div className="flex items-start gap-2">
      <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
      <div>
        <span className="font-semibold">{label}: </span>
        {hasValidLink ? (
          <a
            href={location.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary transition-colors"
          >
            {location.name}
          </a>
        ) : (
          <span>{location.name}</span>
        )}
      </div>
    </div>
  );
}

function EventContent({ event }: { event: CalendarEvent }) {
  const hasEndLocation =
    event.endLocation?.name && event.endLocation.name.trim() !== "";
  const hasLocation =
    event.location?.name && event.location.name.trim() !== "";
  const hasMitnehmen =
    event.mitnehmen &&
    event.mitnehmen.length > 0 &&
    event.mitnehmen.some((item) => item.name?.trim());
  const hasBemerkung = event.bemerkung && event.bemerkung.trim() !== "";

  const hasAnyLocation = hasLocation || hasEndLocation;
  const hasContentBelowDateTime =
    hasAnyLocation || hasMitnehmen || hasBemerkung;
  const hasContentBelowLocation = hasMitnehmen || hasBemerkung;
  const hasContentBelowMitnehmen = hasBemerkung;

  return (
    <div className="bg-elevated rounded-lg p-6 shadow-md">
      {/* Title */}
      {event.title && (
        <h3 className="font-bold text-lg mb-3">{event.title}</h3>
      )}

      {/* Date and Time */}
      <div
        className={
          hasContentBelowDateTime
            ? "mb-4 pb-4 border-b border-primary/20"
            : ""
        }
      >
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="font-semibold text-lg">
            {formatDate(event.date)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <span>
            {event.startTime} - {event.endTime} Uhr
          </span>
        </div>
      </div>

      {/* Location(s) */}
      {hasAnyLocation && (
        <div
          className={
            hasContentBelowLocation
              ? "mb-4 pb-4 border-b border-primary/20 space-y-2"
              : "space-y-2"
          }
        >
          {hasLocation && hasEndLocation ? (
            <>
              <LocationDisplay
                label="Besammlung"
                location={event.location!}
              />
              <LocationDisplay
                label="Verabschiedung"
                location={event.endLocation!}
              />
            </>
          ) : hasLocation ? (
            <LocationDisplay label="Ort" location={event.location!} />
          ) : (
            <LocationDisplay label="Ort" location={event.endLocation!} />
          )}
        </div>
      )}

      {/* Mitnehmen */}
      {hasMitnehmen && (
        <div
          className={
            hasContentBelowMitnehmen
              ? "mb-4 pb-4 border-b border-primary/20"
              : ""
          }
        >
          <div className="flex items-center gap-2 mb-2">
            <Backpack className="w-5 h-5 text-primary" />
            <span className="font-semibold">Mitnehmen:</span>
          </div>
          <ul className="list-none pl-7 space-y-1">
            {event.mitnehmen
              .filter((item) => item.name?.trim())
              .map((item, index) => {
                const IconComponent = getPackingIcon(item.icon);
                return (
                  <li key={index} className="flex items-center gap-2">
                    {IconComponent ? (
                      <IconComponent className="w-5 h-5 text-primary" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    )}
                    <span>{item.name}</span>
                  </li>
                );
              })}
          </ul>
        </div>
      )}

      {/* Bemerkung */}
      {hasBemerkung && (
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
          <div>
            <span className="font-semibold">Bemerkung: </span>
            <span>{event.bemerkung}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function CalendarActivityClient({ group }: { group: string }) {
  const { data: event, isLoading, isError } = useQuery<CalendarEvent | null>({
    queryKey: ["calendar-next-event", group],
    queryFn: async () => {
      const res = await fetch(
        `/api/calendar/next-event?group=${encodeURIComponent(group)}`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!group,
  });

  if (isLoading) {
    return (
      <div className="bg-elevated rounded-lg p-6 shadow-md animate-pulse">
        <div className="h-5 bg-primary/10 rounded w-3/4 mb-3" />
        <div className="h-4 bg-primary/10 rounded w-1/2 mb-2" />
        <div className="h-4 bg-primary/10 rounded w-1/3" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-elevated rounded-lg p-6 shadow-md text-center">
        <AlertTriangle className="w-8 h-8 mx-auto text-brand-red/60 mb-2" />
        <p className="text-contrast-ground/60 text-sm">
          Aktivität konnte nicht geladen werden
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="bg-elevated rounded-lg p-6 shadow-md text-center">
        <CalendarDays className="w-8 h-8 mx-auto text-contrast-ground/30 mb-2" />
        <p className="text-contrast-ground/50 text-sm">
          Keine kommende Aktivität
        </p>
      </div>
    );
  }

  return <EventContent event={event} />;
}
