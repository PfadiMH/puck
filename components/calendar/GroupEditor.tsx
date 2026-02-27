"use client";

import Button from "@components/ui/Button";
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogTitle,
} from "@components/ui/Dialog";
import Input from "@components/ui/Input";
import {
  saveCalendarGroup,
  updateCalendarGroup,
} from "@lib/db/calendar-actions";
import type { CalendarGroup, CalendarGroupInput } from "@lib/calendar/types";
import { useState } from "react";
import { toast } from "sonner";

type GroupEditorProps = {
  group: CalendarGroup | null;
  existingGroups: CalendarGroup[];
  onClose: () => void;
  onSaved: (savedId?: string) => void;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[äÄ]/g, "ae")
    .replace(/[öÖ]/g, "oe")
    .replace(/[üÜ]/g, "ue")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function GroupEditor({
  group,
  existingGroups,
  onClose,
  onSaved,
}: GroupEditorProps) {
  const isEditing = !!group;

  const [name, setName] = useState(group?.name ?? "");
  const [slug, setSlug] = useState(group?.slug ?? "");
  const [order, setOrder] = useState(
    group?.order ?? (existingGroups.length > 0
      ? Math.max(...existingGroups.map((g) => g.order)) + 1
      : 0)
  );
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugManuallyEdited) {
      setSlug(slugify(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlugManuallyEdited(true);
    setSlug(slugify(value));
  }

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Name ist erforderlich");
      return;
    }
    if (!slug.trim()) {
      toast.error("Slug ist erforderlich");
      return;
    }

    // Check for duplicate slug
    const duplicate = existingGroups.find(
      (g) => g.slug === slug && g._id !== group?._id
    );
    if (duplicate) {
      toast.error(`Slug "${slug}" wird bereits verwendet`);
      return;
    }

    setSaving(true);
    try {
      const input: CalendarGroupInput = {
        name: name.trim(),
        slug: slug.trim(),
        order,
      };

      if (isEditing && group) {
        await updateCalendarGroup(group._id, input);
        toast.success("Gruppe aktualisiert");
        onSaved(group._id);
      } else {
        const created = await saveCalendarGroup(input);
        toast.success("Gruppe erstellt");
        onSaved(created._id);
      }
    } catch {
      toast.error("Fehler beim Speichern");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog className="max-w-[500px]">
      <DialogTitle>
        {isEditing ? "Gruppe bearbeiten" : "Neue Gruppe"}
      </DialogTitle>

      <div className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="z.B. Wölfli"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Slug (URL-Kennung)
          </label>
          <Input
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="z.B. woelfli"
          />
          <p className="text-xs text-contrast-ground/50 mt-1">
            Wird in der Kalender-URL verwendet: /cal/{slug || "..."}.ics
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Reihenfolge
          </label>
          <Input
            type="number"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
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
