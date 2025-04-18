import { PropsWithChildren, useId } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
};

function Modal({
  isOpen,
  onClose,
  title,
  children,
}: PropsWithChildren<ModalProps>) {
  const titleId = useId();

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 w-screen h-screen"
      onClick={() => onClose()}
    >
      <dialog
        open
        onClick={(e) => e.stopPropagation()}
        className="m-auto bg-elevated text-contrast-ground rounded-lg p-4"
        aria-modal={true}
        aria-labelledby={title ? titleId : undefined}
      >
        {title && (
          <h3 className="mb-2" id={titleId}>
            {title}
          </h3>
        )}
        {children}
      </dialog>
    </div>,
    document.body
  );
}

export default Modal;
