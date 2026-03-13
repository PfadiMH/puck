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
    .replace(/[äÄ]/g, "ae")
    .replace(/[öÖ]/g, "oe")
    .replace(/[üÜ]/g, "ue")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip remaining diacritics
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
  const [isLeiterGroup, setIsLeiterGroup] = useState(group?.isLeiterGroup ?? false);
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
      toast.error("Name is required");
      return;
    }
    if (!slug.trim()) {
      toast.error("Slug is required");
      return;
    }

    // Check for duplicate slug
    const duplicate = existingGroups.find(
      (g) => g.slug === slug && g._id !== group?._id
    );
    if (duplicate) {
      toast.error(`Slug "${slug}" is already in use`);
      return;
    }

    // Check for reserved slugs
    const reservedSlugs = ["all", "feed"];
    if (reservedSlugs.includes(slug)) {
      toast.error(
        `Slug "${slug}" is reserved and cannot be used`
      );
      return;
    }

    setSaving(true);
    try {
      const input: CalendarGroupInput = {
        name: name.trim(),
        slug: slug.trim(),
        order,
        isLeiterGroup,
      };

      if (isEditing && group) {
        const result = await updateCalendarGroup(group._id, input);
        if (!result) {
          toast.error("Could not update group");
          return;
        }
        toast.success("Group updated");
        onSaved(group._id);
      } else {
        const created = await saveCalendarGroup(input);
        toast.success("Group created");
        onSaved(created._id);
      }
    } catch {
      toast.error("Error saving");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog className="max-w-[500px]">
      <DialogTitle>
        {isEditing ? "Edit Group" : "New Group"}
      </DialogTitle>

      <div className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Cubs"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Slug (URL identifier)
          </label>
          <Input
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="e.g. cubs"
          />
          <p className="text-xs text-contrast-ground/50 mt-1">
            Used in calendar URL: /cal/{slug || "..."}.ics
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Order
          </label>
          <Input
            type="number"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isLeiterGroup}
            onChange={(e) => setIsLeiterGroup(e.target.checked)}
            id="is-leiter-group"
            className="rounded"
          />
          <label htmlFor="is-leiter-group" className="text-sm">
            Leader group
          </label>
        </div>
        <p className="text-xs text-contrast-ground/50 -mt-2">
          Leader groups see all events including meetings in the calendar feed.
        </p>
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
