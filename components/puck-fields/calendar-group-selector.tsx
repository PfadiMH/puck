"use client";

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
  const [groups, setGroups] = useState<
    { _id: string; slug: string; name: string }[]
  >([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/calendar/groups")
      .then((res) => res.json())
      .then((data) => {
        setGroups(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

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
