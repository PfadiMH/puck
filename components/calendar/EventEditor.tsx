"use client";

import Button from "@components/ui/Button";
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogTitle,
} from "@components/ui/Dialog";
import Input from "@components/ui/Input";
import type {
  CalendarEvent,
  CalendarEventInput,
  CalendarEventType,
  CalendarGroup,
  MitnehmenItem,
} from "@lib/calendar/types";
import {
  saveCalendarEvent,
  updateCalendarEvent,
} from "@lib/db/calendar-actions";
import DatePicker, {
  formatLocalDate,
  isSaturday,
  parseLocalDate,
} from "@components/ui/DatePicker";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getPackingIcon, PACKING_ICONS } from "@lib/packing-icons";

type EventEditorProps = {
  event: CalendarEvent | null;
  groups: CalendarGroup[];
  onClose: () => void;
  onSaved: (savedId?: string) => void;
};

// Generate time options (00:00 to 23:45 in 15min increments) at module scope
const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 15) {
    TIME_OPTIONS.push(
      `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
    );
  }
}

export function EventEditor({
  event,
  groups,
  onClose,
  onSaved,
}: EventEditorProps) {
  const isEditing = !!event;

  const [eventType, setEventType] = useState<CalendarEventType>(
    event?.eventType ?? "aktivitaet"
  );
  const [title, setTitle] = useState(event?.title ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [date, setDate] = useState(
    event?.date ??
      (() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      })()
  );
  const [startTime, setStartTime] = useState(event?.startTime ?? "14:00");
  const [endTime, setEndTime] = useState(event?.endTime ?? "17:00");
  const [locationName, setLocationName] = useState(
    event?.location?.name ?? ""
  );
  const [locationMapsLink, setLocationMapsLink] = useState(
    event?.location?.mapsLink ?? ""
  );
  const [endLocationName, setEndLocationName] = useState(
    event?.endLocation?.name ?? ""
  );
  const [endLocationMapsLink, setEndLocationMapsLink] = useState(
    event?.endLocation?.mapsLink ?? ""
  );
  const [selectedGroups, setSelectedGroups] = useState<string[]>(
    event?.groups ?? []
  );
  const [allGroups, setAllGroups] = useState(event?.allGroups ?? false);
  const [mitnehmen, setMitnehmen] = useState<MitnehmenItem[]>(
    event?.mitnehmen ?? []
  );
  const [bemerkung, setBemerkung] = useState(event?.bemerkung ?? "");
  const [saving, setSaving] = useState(false);

  function handleGroupToggle(slug: string) {
    setSelectedGroups((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug]
    );
  }

  function addMitnehmenItem() {
    setMitnehmen([...mitnehmen, { name: "", icon: undefined }]);
  }

  function removeMitnehmenItem(index: number) {
    setMitnehmen(mitnehmen.filter((_, i) => i !== index));
  }

  function updateMitnehmenItem(
    index: number,
    updates: Partial<MitnehmenItem>
  ) {
    const updated = [...mitnehmen];
    updated[index] = { ...updated[index], ...updates };
    setMitnehmen(updated);
  }

  async function handleSave() {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!date) {
      toast.error("Date is required");
      return;
    }
    if (endTime <= startTime) {
      toast.error("End time must be after start time");
      return;
    }
    if (!allGroups && selectedGroups.length === 0) {
      toast.error(
        "Select at least one group or enable 'All Groups'"
      );
      return;
    }

    setSaving(true);
    try {
      const hideExtras =
        eventType === "lager" || eventType === "leitersitzung";
      const input: CalendarEventInput = {
        eventType,
        title: title.trim(),
        description: description.trim() || undefined,
        date,
        startTime,
        endTime,
        location:
          locationName.trim()
            ? { name: locationName.trim(), mapsLink: locationMapsLink.trim() || undefined }
            : undefined,
        endLocation:
          hideExtras
            ? undefined
            : endLocationName.trim()
              ? {
                  name: endLocationName.trim(),
                  mapsLink: endLocationMapsLink.trim() || undefined,
                }
              : undefined,
        groups: allGroups ? [] : selectedGroups,
        allGroups,
        mitnehmen: hideExtras ? [] : mitnehmen.filter((m) => m.name?.trim()),
        bemerkung: hideExtras ? undefined : bemerkung.trim() || undefined,
      };

      if (isEditing && event) {
        const result = await updateCalendarEvent(event._id, input);
        if (!result) {
          toast.error("Could not update activity");
          return;
        }
        toast.success("Activity updated");
        onSaved(event._id);
      } else {
        const created = await saveCalendarEvent(input);
        toast.success("Activity created");
        onSaved(created._id);
      }
    } catch {
      toast.error("Error saving");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog className="max-w-[700px] max-h-[85vh] overflow-y-auto">
      <DialogTitle>
        {isEditing
          ? eventType === "lager"
            ? "Edit Camp"
            : eventType === "leitersitzung"
              ? "Edit Meeting"
              : "Edit Activity"
          : eventType === "lager"
            ? "New Camp"
            : eventType === "leitersitzung"
              ? "New Meeting"
              : "New Activity"}
      </DialogTitle>

      <div className="space-y-5 mt-4">
        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium mb-1" id="event-type-label">Type *</label>
          <div
            className="flex gap-2"
            role="radiogroup"
            aria-labelledby="event-type-label"
          >
            {(
              [
                { value: "aktivitaet", label: "Activity" },
                { value: "lager", label: "Camp" },
                { value: "leitersitzung", label: "Meeting" },
              ] as const
            ).map(({ value, label }) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={eventType === value}
                tabIndex={eventType === value ? 0 : -1}
                onClick={() => setEventType(value)}
                onKeyDown={(e) => {
                  const types: CalendarEventType[] = [
                    "aktivitaet",
                    "lager",
                    "leitersitzung",
                  ];
                  const idx = types.indexOf(eventType);
                  let nextIdx = -1;
                  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                    e.preventDefault();
                    nextIdx = (idx + 1) % types.length;
                  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                    e.preventDefault();
                    nextIdx = (idx - 1 + types.length) % types.length;
                  }
                  if (nextIdx >= 0) {
                    setEventType(types[nextIdx]);
                    const buttons =
                      e.currentTarget.parentElement?.querySelectorAll<HTMLElement>(
                        "[role=radio]"
                      );
                    buttons?.[nextIdx]?.focus();
                  }
                }}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                  eventType === value
                    ? "border-primary bg-primary/15 text-primary font-medium"
                    : "border-contrast-ground/20 hover:border-contrast-ground/40"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Saturday afternoon"
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Date *</label>
            <DatePicker
              value={parseLocalDate(date)}
              onChange={(d) => {
                if (d) setDate(formatLocalDate(d));
              }}
              calendarProps={{
                modifiers: {
                  saturday: (d) => d.getDay() === 6,
                },
                modifiersClassNames: {
                  saturday:
                    "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-yellow-400 after:rounded-full",
                },
              }}
            />
            {parseLocalDate(date) && isSaturday(parseLocalDate(date)!) && (
              <div className="flex items-center gap-1.5 text-xs text-yellow-600 font-medium mt-1">
                <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                Saturday
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Start time *
            </label>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-elevated border-2 border-primary rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/60"
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End time *</label>
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-elevated border-2 border-primary rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/60"
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Groups */}
        <div>
          <label className="block text-sm font-medium mb-2">Groups *</label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={allGroups}
              onChange={(e) => setAllGroups(e.target.checked)}
              id="event-all-groups"
              className="rounded"
            />
            <label
              htmlFor="event-all-groups"
              className="text-sm font-medium"
            >
              All Groups
            </label>
          </div>
          {!allGroups && (
            <div className="flex flex-wrap gap-2">
              {groups.length === 0 ? (
                <p className="text-sm text-contrast-ground/50">
                  No groups available. Create groups first in the
                  &quot;Groups&quot; tab.
                </p>
              ) : (
                groups.map((g) => (
                  <button
                    key={g._id}
                    type="button"
                    onClick={() => handleGroupToggle(g.slug)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      selectedGroups.includes(g.slug)
                        ? "border-primary bg-primary/15 text-primary font-medium"
                        : "border-contrast-ground/20 hover:border-contrast-ground/40"
                    }`}
                  >
                    {g.name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Location
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Location name"
            />
            <Input
              value={locationMapsLink}
              onChange={(e) => setLocationMapsLink(e.target.value)}
              placeholder="Google Maps Link (optional)"
            />
          </div>
        </div>

        {/* End Location (hidden for Lager/Leitersitzung) */}
        {eventType === "aktivitaet" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              End location (for hikes etc.)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input
                value={endLocationName}
                onChange={(e) => setEndLocationName(e.target.value)}
                placeholder="Location name"
              />
              <Input
                value={endLocationMapsLink}
                onChange={(e) => setEndLocationMapsLink(e.target.value)}
                placeholder="Google Maps Link (optional)"
              />
            </div>
          </div>
        )}

        {/* Mitnehmen (hidden for Lager/Leitersitzung) */}
        {eventType === "aktivitaet" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">
                Packing List
              </label>
              <button
                type="button"
                className="text-sm text-primary hover:underline flex items-center gap-1"
                onClick={addMitnehmenItem}
              >
                <Plus className="w-3.5 h-3.5" /> Item
              </button>
            </div>
            <div className="space-y-3">
              {mitnehmen.map((item, idx) => {
                const SelectedIcon = getPackingIcon(item.icon);
                return (
                  <div
                    key={idx}
                    className="border border-contrast-ground/10 rounded-lg p-3"
                  >
                    {/* Name + remove row */}
                    <div className="flex items-center gap-2 mb-2">
                      <Input
                        value={item.name}
                        onChange={(e) =>
                          updateMitnehmenItem(idx, { name: e.target.value })
                        }
                        placeholder="Item"
                        className="flex-1"
                        size="small"
                      />
                      <button
                        type="button"
                        className="p-1.5 text-brand-red hover:bg-brand-red/10 rounded shrink-0"
                        onClick={() => removeMitnehmenItem(idx)}
                        title="Remove"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Selected icon display */}
                    {SelectedIcon && (
                      <div className="flex items-center gap-2 mb-2 px-2 py-1.5 bg-primary/10 rounded-md">
                        <SelectedIcon className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">
                          {PACKING_ICONS.find((i) => i.id === item.icon)?.label}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateMitnehmenItem(idx, { icon: undefined })
                          }
                          className="ml-auto text-xs text-brand-red hover:text-brand-red/80"
                          aria-label="Remove icon"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {/* Icon grid */}
                    <div className="grid grid-cols-10 gap-1">
                      {PACKING_ICONS.map(({ id: iconId, icon: Icon, label }) => (
                        <button
                          key={iconId}
                          type="button"
                          onClick={() =>
                            updateMitnehmenItem(idx, { icon: iconId })
                          }
                          title={label}
                          className={`p-1.5 rounded-md transition-colors ${
                            item.icon === iconId
                              ? "bg-primary/30 ring-2 ring-primary"
                              : "bg-contrast-ground/5 hover:bg-primary/15"
                          }`}
                        >
                          <Icon className="w-4 h-4 mx-auto text-contrast-ground/70" />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description (for calendar feed)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Additional information for the ICS feed..."
            rows={2}
            className="w-full bg-elevated border-2 border-primary rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/60 placeholder:opacity-70"
          />
        </div>

        {/* Bemerkung (hidden for Lager/Leitersitzung) */}
        {eventType === "aktivitaet" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Remarks
            </label>
            <textarea
              value={bemerkung}
              onChange={(e) => setBemerkung(e.target.value)}
              placeholder="Internal remarks..."
              rows={2}
              className="w-full bg-elevated border-2 border-primary rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/60 placeholder:opacity-70"
            />
          </div>
        )}
      </div>

      <DialogActions>
        <DialogClose>
          <Button size="medium" onClick={onClose}>
            Cancel
          </Button>
        </DialogClose>
        <Button
          color="primary"
          size="medium"
          onClick={handleSave}
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : isEditing
              ? "Update"
              : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
