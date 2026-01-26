import cn from "@lib/cn";
import { usePuck } from "@measured/puck";
import { Undo2, Redo2 } from "lucide-react";

function UndoRedoButtons() {
  const {
    history: { back, forward, hasPast, hasFuture },
  } = usePuck();

  return (
    <div className="flex gap-2">
      <button
        className={cn(
          "w-6 h-6 cursor-pointer opacity-50",
          hasPast && "opacity-100"
        )}
        onClick={back}
        disabled={!hasPast}
        aria-label="Back"
        title="Back"
      >
        <Undo2 size={21} />
      </button>
      <button
        className={cn(
          "w-6 h-6 cursor-pointer opacity-50",
          hasFuture && "opacity-100"
        )}
        onClick={forward}
        disabled={!hasFuture}
        aria-label="Forward"
        title="Forward"
      >
        <Redo2 size={21} />
      </button>
    </div>
  );
}

export default UndoRedoButtons;
