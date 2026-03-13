"use client";

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
import Input from "@components/ui/Input";
import {
  deleteAppAlbum,
  getAppAlbums,
  saveAppAlbum,
  updateAppAlbum,
} from "@lib/db/gallery-actions";
import { getAllFiles } from "@lib/files/file-actions";
import type { AppAlbum, AppAlbumInput } from "@lib/gallery/types";
import type { FileRecord } from "@lib/storage/file-record";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  GripVertical,
  Image as ImageIcon,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function GalleryAdmin() {
  return (
    <div className="space-y-8">
      <Link href="/admin" className="text-sm text-contrast-ground/70 hover:text-contrast-ground flex items-center gap-1 mb-4">
        ← Zurück zur Übersicht
      </Link>
      <div className="flex items-center gap-3">
        <ImageIcon className="size-7" />
        <h1 className="text-2xl font-bold">App Galerie</h1>
      </div>
      <AlbumsSection />
    </div>
  );
}

function AlbumsSection() {
  const queryClient = useQueryClient();
  const [editingAlbum, setEditingAlbum] = useState<AppAlbum | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: albums, isLoading } = useQuery({
    queryKey: ["app-albums"],
    queryFn: getAppAlbums,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAppAlbum(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app-albums"] });
      toast.success("Album gelöscht");
    },
    onError: () => toast.error("Fehler beim Löschen"),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ImageIcon className="size-5" />
          Alben
        </h2>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="size-4 mr-1" />
          Neues Album
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-contrast-ground/60">Laden...</p>
      ) : !albums || albums.length === 0 ? (
        <p className="text-sm text-contrast-ground/60">
          Noch keine Alben erstellt.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Cover</TableHead>
              <TableHead>Titel</TableHead>
              <TableHead>Bilder</TableHead>
              <TableHead>Sichtbar</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {albums.map((album) => (
              <TableRow key={album._id}>
                <TableCell>
                  <GripVertical className="size-4 text-contrast-ground/40" />
                </TableCell>
                <TableCell>
                  {album.coverUrl ? (
                    <img
                      src={album.coverUrl}
                      alt=""
                      className="size-10 rounded object-cover"
                    />
                  ) : (
                    <div className="size-10 rounded bg-contrast-ground/10 flex items-center justify-center">
                      <ImageIcon className="size-5 text-contrast-ground/30" />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{album.title}</div>
                    {album.description && (
                      <div className="text-xs text-contrast-ground/60 mt-0.5">
                        {album.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{album.imageIds.length}</TableCell>
                <TableCell>
                  {album.isVisible ? (
                    <Eye className="size-4 text-green-600" />
                  ) : (
                    <EyeOff className="size-4 text-contrast-ground/40" />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setEditingAlbum(album)}
                      className="p-1.5 rounded hover:bg-contrast-ground/10 transition-colors"
                      title="Bearbeiten"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <DeleteAlbumButton
                      album={album}
                      onConfirm={() => deleteMutation.mutate(album._id)}
                      isDeleting={deleteMutation.isPending}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {isCreateOpen && (
        <AlbumEditor
          onClose={() => setIsCreateOpen(false)}
          onSaved={() => {
            setIsCreateOpen(false);
            queryClient.invalidateQueries({ queryKey: ["app-albums"] });
          }}
        />
      )}

      {editingAlbum && (
        <AlbumEditor
          album={editingAlbum}
          onClose={() => setEditingAlbum(null)}
          onSaved={() => {
            setEditingAlbum(null);
            queryClient.invalidateQueries({ queryKey: ["app-albums"] });
          }}
        />
      )}
    </div>
  );
}

function DeleteAlbumButton({
  album,
  onConfirm,
  isDeleting,
}: {
  album: AppAlbum;
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  return (
    <DialogRoot>
      <DialogTrigger>
        <button
          className="p-1.5 rounded hover:bg-red-100 text-red-600 transition-colors"
          title="Löschen"
        >
          <Trash2 className="size-4" />
        </button>
      </DialogTrigger>
      <Dialog>
        <DialogTitle>Album löschen?</DialogTitle>
        <div className="flex items-start gap-3 my-4">
          <AlertTriangle className="size-5 text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm">
            Soll das Album <strong>&ldquo;{album.title}&rdquo;</strong>{" "}
            wirklich gelöscht werden? Die Bilder in S3 bleiben erhalten.
          </p>
        </div>
        <DialogActions>
          <DialogClose>
            <Button color="secondary">Abbrechen</Button>
          </DialogClose>
          <Button
            color="primary"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Löschen..." : "Löschen"}
          </Button>
        </DialogActions>
      </Dialog>
    </DialogRoot>
  );
}

// --- Album Editor ---

interface AlbumEditorProps {
  album?: AppAlbum;
  onClose: () => void;
  onSaved: () => void;
}

function AlbumEditor({ album, onClose, onSaved }: AlbumEditorProps) {
  const [title, setTitle] = useState(album?.title || "");
  const [description, setDescription] = useState(album?.description || "");
  const [isVisible, setIsVisible] = useState(album?.isVisible ?? true);
  const [order, setOrder] = useState(album?.order ?? 0);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>(
    album?.imageIds || []
  );
  const [coverImageId, setCoverImageId] = useState<string | undefined>(
    album?.coverImageId
  );
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Titel ist erforderlich");
      return;
    }

    setIsSaving(true);
    try {
      const input: AppAlbumInput = {
        title: title.trim(),
        description: description.trim() || undefined,
        coverImageId,
        imageIds: selectedImageIds,
        isVisible,
        order,
      };

      if (album) {
        await updateAppAlbum(album._id, input);
        toast.success("Album aktualisiert");
      } else {
        await saveAppAlbum(input);
        toast.success("Album erstellt");
      }
      onSaved();
    } catch {
      toast.error("Fehler beim Speichern");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-ground rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 m-4">
        <h2 className="text-xl font-bold mb-6">
          {album ? "Album bearbeiten" : "Neues Album"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titel</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Album-Titel"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Beschreibung
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optionale Beschreibung"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Reihenfolge
            </label>
            <Input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="visibility"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              className="size-4"
            />
            <label htmlFor="visibility" className="text-sm">
              Sichtbar in der App
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">
                Bilder ({selectedImageIds.length})
              </label>
              <Button
                color="secondary"
                onClick={() => setShowImagePicker(true)}
              >
                <ImageIcon className="size-4 mr-1" />
                Bilder wählen
              </Button>
            </div>
            {selectedImageIds.length > 0 && (
              <div className="text-xs text-contrast-ground/60">
                {selectedImageIds.length} Bilder ausgewählt
                {coverImageId && " (Cover gesetzt)"}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button color="secondary" onClick={onClose}>
            Abbrechen
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Speichern..." : "Speichern"}
          </Button>
        </div>

        {showImagePicker && (
          <ImagePickerModal
            selectedIds={selectedImageIds}
            coverId={coverImageId}
            onDone={(ids, cover) => {
              setSelectedImageIds(ids);
              setCoverImageId(cover);
              setShowImagePicker(false);
            }}
            onClose={() => setShowImagePicker(false)}
          />
        )}
      </div>
    </div>
  );
}

// --- Image Picker ---

interface ImagePickerModalProps {
  selectedIds: string[];
  coverId?: string;
  onDone: (ids: string[], coverId?: string) => void;
  onClose: () => void;
}

function ImagePickerModal({
  selectedIds: initialIds,
  coverId: initialCoverId,
  onDone,
  onClose,
}: ImagePickerModalProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(initialIds)
  );
  const [cover, setCover] = useState<string | undefined>(initialCoverId);

  const { data: filesResult, isLoading } = useQuery({
    queryKey: ["files-for-gallery"],
    queryFn: async () => {
      const result = await getAllFiles();
      if (!result.success) return [];
      return result.data.filter((f: FileRecord & { url: string }) =>
        f.contentType.startsWith("image/")
      );
    },
  });

  const files = filesResult || [];

  const toggleImage = useCallback(
    (id: string) => {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
          if (cover === id) setCover(undefined);
        } else {
          next.add(id);
        }
        return next;
      });
    },
    [cover]
  );

  const handleSetCover = useCallback((id: string) => {
    setCover((prev) => (prev === id ? undefined : id));
  }, []);

  // Maintain order: keep initial order for existing, append new
  const orderedIds = [
    ...initialIds.filter((id) => selected.has(id)),
    ...[...selected].filter((id) => !initialIds.includes(id)),
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
      <div className="bg-ground rounded-xl shadow-xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col m-4">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">
            Bilder wählen ({selected.size} ausgewählt)
          </h3>
          <div className="flex gap-2">
            <Button color="secondary" onClick={onClose}>
              Abbrechen
            </Button>
            <Button onClick={() => onDone(orderedIds, cover)}>
              Übernehmen
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <p className="text-sm text-contrast-ground/60">Laden...</p>
          ) : files.length === 0 ? (
            <p className="text-sm text-contrast-ground/60">
              Keine Bilder gefunden. Lade zuerst Bilder im Datei-Manager hoch.
            </p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
              {files.map((file: FileRecord & { url: string }) => {
                const isSelected = selected.has(file._id);
                const isCover = cover === file._id;

                return (
                  <div
                    key={file._id}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      isSelected
                        ? isCover
                          ? "border-yellow-500 ring-2 ring-yellow-300"
                          : "border-blue-500 ring-2 ring-blue-300"
                        : "border-transparent hover:border-contrast-ground/20"
                    }`}
                    onClick={() => toggleImage(file._id)}
                  >
                    <img
                      src={file.url}
                      alt={file.filename}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {isSelected && (
                      <div className="absolute top-1 left-1 size-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {orderedIds.indexOf(file._id) + 1}
                      </div>
                    )}
                    {isSelected && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetCover(file._id);
                        }}
                        className={`absolute bottom-1 right-1 text-xs px-1.5 py-0.5 rounded ${
                          isCover
                            ? "bg-yellow-500 text-white"
                            : "bg-black/60 text-white hover:bg-black/80"
                        }`}
                      >
                        {isCover ? "Cover" : "Cover"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
