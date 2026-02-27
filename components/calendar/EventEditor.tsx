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
} from "@lib/calendar/types";
import type { CalendarGroup } from "@lib/calendar/types";
import type { MitnehmenItem } from "@components/puck/Activity";
import {
  saveCalendarEvent,
  updateCalendarEvent,
} from "@lib/db/calendar-actions";
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

export function EventEditor({
  event,
  groups,
  onClose,
  onSaved,
}: EventEditorProps) {
  const isEditing = !!event;

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

  // Generate time options (00:00 to 23:45 in 15min increments)
  const timeOptions: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      timeOptions.push(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
      );
    }
  }

  async function handleSave() {
    if (!title.trim()) {
      toast.error("Titel ist erforderlich");
      return;
    }
    if (!date) {
      toast.error("Datum ist erforderlich");
      return;
    }
    if (!allGroups && selectedGroups.length === 0) {
      toast.error(
        "Wähle mindestens eine Gruppe oder aktiviere 'Alle Gruppen'"
      );
      return;
    }

    setSaving(true);
    try {
      const input: CalendarEventInput = {
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
          endLocationName.trim()
            ? {
                name: endLocationName.trim(),
                mapsLink: endLocationMapsLink.trim() || undefined,
              }
            : undefined,
        groups: allGroups ? [] : selectedGroups,
        allGroups,
        mitnehmen: mitnehmen.filter((m) => m.name?.trim()),
        bemerkung: bemerkung.trim() || undefined,
      };

      if (isEditing && event) {
        await updateCalendarEvent(event._id, input);
        toast.success("Aktivität aktualisiert");
        onSaved(event._id);
      } else {
        const created = await saveCalendarEvent(input);
        toast.success("Aktivität erstellt");
        onSaved(created._id);
      }
    } catch {
      toast.error("Fehler beim Speichern");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog className="max-w-[700px] max-h-[85vh] overflow-y-auto">
      <DialogTitle>
        {isEditing ? "Aktivität bearbeiten" : "Neue Aktivität"}
      </DialogTitle>

      <div className="space-y-5 mt-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Titel</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="z.B. Samstagnachmittag"
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Datum</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-elevated border-2 border-primary rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Startzeit
            </label>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-elevated border-2 border-primary rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/60"
            >
              {timeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Endzeit</label>
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-elevated border-2 border-primary rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/60"
            >
              {timeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Groups */}
        <div>
          <label className="block text-sm font-medium mb-2">Gruppen</label>
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
              Alle Gruppen
            </label>
          </div>
          {!allGroups && (
            <div className="flex flex-wrap gap-2">
              {groups.length === 0 ? (
                <p className="text-sm text-contrast-ground/50">
                  Keine Gruppen vorhanden. Erstelle zuerst Gruppen im
                  &quot;Gruppen&quot;-Tab.
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
            Ort (optional)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Ortsname"
            />
            <Input
              value={locationMapsLink}
              onChange={(e) => setLocationMapsLink(e.target.value)}
              placeholder="Google Maps Link (optional)"
            />
          </div>
        </div>

        {/* End Location */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Endort (optional, für Wanderungen etc.)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input
              value={endLocationName}
              onChange={(e) => setEndLocationName(e.target.value)}
              placeholder="Ortsname"
            />
            <Input
              value={endLocationMapsLink}
              onChange={(e) => setEndLocationMapsLink(e.target.value)}
              placeholder="Google Maps Link (optional)"
            />
          </div>
        </div>

        {/* Mitnehmen */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">
              Mitnehmen (optional)
            </label>
            <button
              type="button"
              className="text-sm text-primary hover:underline flex items-center gap-1"
              onClick={addMitnehmenItem}
            >
              <Plus className="w-3.5 h-3.5" /> Gegenstand
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
                      placeholder="Gegenstand"
                      className="flex-1"
                      size="small"
                    />
                    <button
                      type="button"
                      className="p-1.5 text-brand-red hover:bg-brand-red/10 rounded shrink-0"
                      onClick={() => removeMitnehmenItem(idx)}
                      title="Entfernen"
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
                      >
                        Entfernen
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

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Beschreibung (optional, für Kalender-Feed)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Zusätzliche Informationen für den ICS-Feed..."
            rows={2}
            className="w-full bg-elevated border-2 border-primary rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/60 placeholder:opacity-70"
          />
        </div>

        {/* Bemerkung */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Bemerkung (optional)
          </label>
          <textarea
            value={bemerkung}
            onChange={(e) => setBemerkung(e.target.value)}
            placeholder="Interne Bemerkung..."
            rows={2}
            className="w-full bg-elevated border-2 border-primary rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/60 placeholder:opacity-70"
          />
        </div>
      </div>

      <DialogActions>
        <DialogClose>
          <Button size="medium" onClick={onClose}>
            Abbrechen
          </Button>
        </DialogClose>
        <Button
          color="primary"
          size="medium"
          onClick={handleSave}
          disabled={saving}
        >
          {saving
            ? "Speichern..."
            : isEditing
              ? "Aktualisieren"
              : "Erstellen"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
