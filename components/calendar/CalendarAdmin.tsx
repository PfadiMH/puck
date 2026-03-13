"use client";

import { PermissionGuard } from "@components/security/PermissionGuard";
import Button from "@components/ui/Button";
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/Dialog";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/Table";
import {
  deleteCalendarEvent,
  deleteCalendarGroup,
  getCalendarEvents,
  getCalendarGroups,
} from "@lib/db/calendar-actions";
import type { CalendarEvent, CalendarGroup } from "@lib/calendar/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CalendarDays,
  Check,
  Copy,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { EventEditor } from "./EventEditor";
import { GroupEditor } from "./GroupEditor";

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const days = [
    "So",
    "Mo",
    "Di",
    "Mi",
    "Do",
    "Fr",
    "Sa",
  ];
  return `${days[date.getDay()]}, ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed");
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-contrast-ground/10 transition-colors"
      title="Copy link"
      aria-label="Copy link"
    >
      {copied ? (
        <Check className="w-4 h-4 text-primary" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );
}

export function CalendarAdmin() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"events" | "groups">("events");
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState<CalendarEvent | null>(
    null
  );
  const [editingGroup, setEditingGroup] = useState<CalendarGroup | null>(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState<CalendarGroup | null>(
    null
  );
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [createEventCounter, setCreateEventCounter] = useState(0);

  const {
    data: events = [],
    isLoading: eventsLoading,
    isError: eventsError,
  } = useQuery({
    queryKey: ["admin-calendar-events"],
    queryFn: () => getCalendarEvents(),
  });

  const {
    data: groups = [],
    isLoading: groupsLoading,
    isError: groupsError,
  } = useQuery({
    queryKey: ["admin-calendar-groups"],
    queryFn: () => getCalendarGroups(),
  });

  // Scroll to and briefly highlight a row after save
  useEffect(() => {
    if (highlightId) {
      const el = document.getElementById(`cal-row-${highlightId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      const timer = setTimeout(() => setHighlightId(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [highlightId, events, groups]);

  const deleteEventMutation = useMutation({
    mutationFn: (id: string) => deleteCalendarEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-calendar-events"],
      });
      setDeletingEvent(null);
      toast.success("Activity deleted");
    },
    onError: () => toast.error("Error deleting activity"),
  });

  const deleteGroupMutation = useMutation({
    mutationFn: (id: string) => deleteCalendarGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-calendar-groups"],
      });
      setDeletingGroup(null);
      toast.success("Group deleted");
    },
    onError: () => toast.error("Error deleting group"),
  });

  // Build webcal base URL from current location
  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";
  const webcalBase = baseUrl.replace(/^https?:/, "webcal:");

  function getGroupNames(event: CalendarEvent): string {
    if (event.allGroups) return "All Groups";
    return event.groups
      .map((slug) => groups.find((g) => g.slug === slug)?.name ?? slug)
      .join(", ");
  }

  return (
    <div>
      <Link href="/admin" className="text-sm text-contrast-ground/70 hover:text-contrast-ground flex items-center gap-1 mb-4">
        ← Back to Overview
      </Link>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-contrast-ground/60 mt-1">
            Manage activities and groups
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            size="small"
            color={activeTab === "events" ? "primary" : "secondary"}
            onClick={() => setActiveTab("events")}
          >
            Activities
          </Button>
          <Button
            size="small"
            color={activeTab === "groups" ? "primary" : "secondary"}
            onClick={() => setActiveTab("groups")}
          >
            Groups
          </Button>
        </div>
      </div>

      {/* --- Events Tab --- */}
      {activeTab === "events" && (
        <div>
          <div className="flex justify-end mb-4">
            <PermissionGuard policy={{ all: ["calendar:update"] }}>
              <DialogRoot
                open={isCreatingEvent || !!editingEvent}
                onOpenChange={(open) => {
                  if (!open) {
                    setIsCreatingEvent(false);
                    setEditingEvent(null);
                  }
                }}
              >
                <DialogTrigger>
                  <Button
                    color="primary"
                    onClick={() => {
                      setCreateEventCounter((c) => c + 1);
                      setIsCreatingEvent(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Activity
                  </Button>
                </DialogTrigger>

                <EventEditor
                  key={editingEvent?._id ?? `new-${createEventCounter}`}
                  event={editingEvent}
                  groups={groups}
                  onClose={() => {
                    setIsCreatingEvent(false);
                    setEditingEvent(null);
                  }}
                  onSaved={(savedId?: string) => {
                    queryClient.invalidateQueries({
                      queryKey: ["admin-calendar-events"],
                    });
                    setIsCreatingEvent(false);
                    setEditingEvent(null);
                    if (savedId) setHighlightId(savedId);
                  }}
                />
              </DialogRoot>
            </PermissionGuard>
          </div>

          {eventsError ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-10 h-10 mx-auto text-brand-red/60 mb-3" />
              <p className="text-brand-red/80">
                Error loading activities.
              </p>
            </div>
          ) : eventsLoading ? (
            <p className="text-contrast-ground/60 text-center py-12">
              Loading...
            </p>
          ) : events.length === 0 ? (
            <div className="text-center py-16">
              <CalendarDays className="w-12 h-12 mx-auto text-contrast-ground/30 mb-4" />
              <p className="text-contrast-ground/60">
                No activities yet.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-contrast-ground/10 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Activity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Groups</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow
                      key={event._id}
                      id={`cal-row-${event._id}`}
                      className={
                        event._id === highlightId
                          ? "animate-pulse bg-primary/10"
                          : undefined
                      }
                    >
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-medium">{event.title}</p>
                            {(event.eventType === "lager" ||
                              event.eventType === "leitersitzung") && (
                              <span
                                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium leading-none ${
                                  event.eventType === "leitersitzung"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {event.eventType === "leitersitzung"
                                  ? "Höck"
                                  : "Lager"}
                              </span>
                            )}
                          </div>
                          {event.location?.name && (
                            <p className="text-xs text-contrast-ground/50">
                              {event.location.name}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(event.date)}</TableCell>
                      <TableCell>
                        {event.startTime} - {event.endTime}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {event.allGroups ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/15 text-primary">
                              All
                            </span>
                          ) : (
                            event.groups.map((slug) => (
                              <span
                                key={slug}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-contrast-ground/10 text-contrast-ground/70"
                              >
                                {groups.find((g) => g.slug === slug)
                                  ?.name ?? slug}
                              </span>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <PermissionGuard
                            policy={{ all: ["calendar:update"] }}
                          >
                            <button
                              className="p-1.5 rounded hover:bg-contrast-ground/10 transition-colors"
                              onClick={() => setEditingEvent(event)}
                              title="Edit"
                              aria-label="Edit activity"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 rounded hover:bg-brand-red/10 text-brand-red transition-colors"
                              onClick={() => setDeletingEvent(event)}
                              title="Delete"
                              aria-label="Delete activity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </PermissionGuard>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      {/* --- Groups Tab --- */}
      {activeTab === "groups" && (
        <div>
          {/* ICS Feed Links */}
          {groups.length > 0 && (
            <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/15">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                Calendar Subscription Links
              </h3>
              <div className="space-y-2 text-sm">
                {groups.map((g) => (
                  <div
                    key={g._id}
                    className="flex items-center gap-2"
                  >
                    <span className="font-medium min-w-[80px]">
                      {g.name}{g.isLeiterGroup ? " (L)" : ""}:
                    </span>
                    <code className="flex-1 text-xs bg-contrast-ground/5 px-2 py-1 rounded truncate">
                      {webcalBase}/cal/{g.slug}.ics
                    </code>
                    <CopyButton
                      text={`${webcalBase}/cal/${g.slug}.ics`}
                    />
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-1 border-t border-primary/10">
                  <span className="font-medium min-w-[80px]">All:</span>
                  <code className="flex-1 text-xs bg-contrast-ground/5 px-2 py-1 rounded truncate">
                    {webcalBase}/cal/all.ics
                  </code>
                  <CopyButton text={`${webcalBase}/cal/all.ics`} />
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-primary/10">
                  <span className="font-medium min-w-[80px] text-contrast-ground/60">Custom:</span>
                  <code className="flex-1 text-xs bg-contrast-ground/5 px-2 py-1 rounded truncate">
                    {webcalBase}/cal/feed.ics?groups=slug1,slug2
                  </code>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end mb-4">
            <PermissionGuard policy={{ all: ["calendar:update"] }}>
              <DialogRoot
                open={isCreatingGroup || !!editingGroup}
                onOpenChange={(open) => {
                  if (!open) {
                    setIsCreatingGroup(false);
                    setEditingGroup(null);
                  }
                }}
              >
                <DialogTrigger>
                  <Button
                    color="primary"
                    onClick={() => setIsCreatingGroup(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Group
                  </Button>
                </DialogTrigger>

                <GroupEditor
                  key={editingGroup?._id ?? "new"}
                  group={editingGroup}
                  existingGroups={groups}
                  onClose={() => {
                    setIsCreatingGroup(false);
                    setEditingGroup(null);
                  }}
                  onSaved={(savedId?: string) => {
                    queryClient.invalidateQueries({
                      queryKey: ["admin-calendar-groups"],
                    });
                    queryClient.invalidateQueries({
                      queryKey: ["admin-calendar-events"],
                    });
                    setIsCreatingGroup(false);
                    setEditingGroup(null);
                    if (savedId) setHighlightId(savedId);
                  }}
                />
              </DialogRoot>
            </PermissionGuard>
          </div>

          {groupsError ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-10 h-10 mx-auto text-brand-red/60 mb-3" />
              <p className="text-brand-red/80">
                Error loading groups.
              </p>
            </div>
          ) : groupsLoading ? (
            <p className="text-contrast-ground/60 text-center py-12">
              Loading...
            </p>
          ) : groups.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-12 h-12 mx-auto text-contrast-ground/30 mb-4" />
              <p className="text-contrast-ground/60">
                No groups yet.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-contrast-ground/10 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groups.map((group) => (
                    <TableRow
                      key={group._id}
                      id={`cal-row-${group._id}`}
                      className={
                        group._id === highlightId
                          ? "animate-pulse bg-primary/10"
                          : undefined
                      }
                    >
                      <TableCell>
                        <p className="font-medium">{group.name}</p>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-contrast-ground/5 px-1.5 py-0.5 rounded">
                          {group.slug}
                        </code>
                      </TableCell>
                      <TableCell>{group.order}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <PermissionGuard
                            policy={{ all: ["calendar:update"] }}
                          >
                            <button
                              className="p-1.5 rounded hover:bg-contrast-ground/10 transition-colors"
                              onClick={() => setEditingGroup(group)}
                              title="Edit"
                              aria-label="Edit group"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 rounded hover:bg-brand-red/10 text-brand-red transition-colors"
                              onClick={() => setDeletingGroup(group)}
                              title="Delete"
                              aria-label="Delete group"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </PermissionGuard>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      {/* Delete event confirmation */}
      <DialogRoot
        open={!!deletingEvent}
        onOpenChange={(open) => {
          if (!open) setDeletingEvent(null);
        }}
      >
        <Dialog>
          <DialogTitle>Delete Activity</DialogTitle>
          <p className="text-contrast-ground/70">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              &ldquo;{deletingEvent?.title}&rdquo;
            </span>
            ? This action cannot be undone.
          </p>
          <DialogActions>
            <DialogClose>
              <Button size="medium">Cancel</Button>
            </DialogClose>
            <Button
              size="medium"
              color="primary"
              className="!bg-brand-red hover:!bg-brand-red/90 active:!bg-brand-red/80"
              disabled={deleteEventMutation.isPending}
              onClick={() => {
                if (deletingEvent) {
                  deleteEventMutation.mutate(deletingEvent._id);
                }
              }}
            >
              {deleteEventMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </DialogRoot>

      {/* Delete group confirmation */}
      <DialogRoot
        open={!!deletingGroup}
        onOpenChange={(open) => {
          if (!open) setDeletingGroup(null);
        }}
      >
        <Dialog>
          <DialogTitle>Delete Group</DialogTitle>
          <p className="text-contrast-ground/70">
            Are you sure you want to delete the group{" "}
            <span className="font-semibold">
              &ldquo;{deletingGroup?.name}&rdquo;
            </span>
            ? Existing activities assigned to this group will not be deleted.
          </p>
          <DialogActions>
            <DialogClose>
              <Button size="medium">Cancel</Button>
            </DialogClose>
            <Button
              size="medium"
              color="primary"
              className="!bg-brand-red hover:!bg-brand-red/90 active:!bg-brand-red/80"
              disabled={deleteGroupMutation.isPending}
              onClick={() => {
                if (deletingGroup) {
                  deleteGroupMutation.mutate(deletingGroup._id);
                }
              }}
            >
              {deleteGroupMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </DialogRoot>
    </div>
  );
}
