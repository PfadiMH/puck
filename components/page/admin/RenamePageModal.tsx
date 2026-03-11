"use client";
import Button from "@components/ui/Button";
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogTitle,
} from "@components/ui/Dialog";
import ErrorLabel from "@components/ui/ErrorLabel";
import Input from "@components/ui/Input";
import { renamePage } from "@lib/db/db-actions";
import { queryClient } from "@lib/query-client";
import { useState } from "react";

type RenamePageModalProps = {
  currentPath: string;
};

function RenamePageModal({ currentPath }: RenamePageModalProps) {
  const [newPath, setNewPath] = useState(currentPath);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRename = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await renamePage(currentPath, newPath.trim());
      if (!result.success) {
        setError(result.error ?? "Unbekannter Fehler");
      } else {
        if (result.navbarWarning) {
          setError(
            "Seite umbenannt. Hinweis: Die Navigation verweist noch auf den alten Pfad und muss manuell aktualisiert werden."
          );
        }
        setSuccess(true);
        queryClient.invalidateQueries({ queryKey: ["pages"] });
      }
    } catch {
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTitle>Seite umbenennen</DialogTitle>
      <label className="text-sm font-medium text-contrast-ground/70 mb-1 block">
        Neuer Pfad
      </label>
      <Input
        type="text"
        placeholder="/neuer-pfad"
        className="w-full mb-2"
        value={newPath}
        onChange={(e) => {
          setNewPath(e.target.value);
          setError(null);
          setSuccess(false);
        }}
        disabled={loading || success}
      />
      {error && <ErrorLabel message={error} />}
      {success && !error && (
        <div className="bg-green-600 text-white p-2 rounded text-sm">
          Seite erfolgreich umbenannt.
        </div>
      )}
      <DialogActions>
        <DialogClose>
          <Button size="small">
            {success ? "Schliessen" : "Abbrechen"}
          </Button>
        </DialogClose>
        {!success && (
          <Button
            color="primary"
            size="small"
            onClick={handleRename}
            disabled={loading || newPath.trim() === currentPath}
          >
            {loading ? "Speichern..." : "Speichern"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default RenamePageModal;
