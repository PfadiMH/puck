import Button from "@components/ui/Button";
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "@components/ui/Dialog";

type ConfirmModalProps = {
  title: string;
  message?: string;
  onConfirm?: () => void;
};

function ConfirmModal({ title, message, onConfirm }: ConfirmModalProps) {
  return (
    <Dialog>
      {title && <DialogTitle>title</DialogTitle>}
      {message && <DialogDescription>{message}</DialogDescription>}
      <DialogActions>
        <DialogClose>
          <Button>Cancel</Button>
        </DialogClose>
        <Button color="primary" onClick={onConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmModal;
