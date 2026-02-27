"use client";

import type { CalendarGroup } from "@lib/calendar/types";
import type { CustomField } from "@puckeditor/core";
import { useEffect, useState } from "react";

/**
 * Custom Puck field component that fetches calendar groups and renders a
 * select dropdown. Used inside the Puck editor sidebar when Activity mode
 * is set to "calendar".
 */
function CalendarGroupSelector({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (value: string) => void;
}) {
  const [groups, setGroups] = useState<CalendarGroup[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/calendar/groups")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch groups");
        return res.json();
      })
      .then((data) => {
        setGroups(Array.isArray(data) ? data : []);
        setLoaded(true);
      })
      .catch(() => {
        setError(true);
        setLoaded(true);
      });
  }, []);

  if (error) {
    return (
      <div
        style={{
          padding: "8px",
          color: "#b91c1c",
          fontSize: "13px",
        }}
      >
        Fehler beim Laden der Gruppen.
      </div>
    );
  }

  return (
    <div>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          fontSize: "14px",
        }}
      >
        <option value="">
          {loaded
            ? groups.length === 0
              ? "Keine Gruppen vorhanden"
              : "Gruppe wählen..."
            : "Laden..."}
        </option>
        {groups.map((g) => (
          <option key={g._id} value={g.slug}>
            {g.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export const calendarGroupSelectorField: CustomField<string | undefined> = {
  type: "custom",
  label: "Kalendergruppe",
  render: CalendarGroupSelector,
};
