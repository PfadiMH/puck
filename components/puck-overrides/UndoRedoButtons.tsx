import BackSvg from "@components/graphics/BackSvg";
import ForwardSvg from "@components/graphics/ForwardSvg";
import cn from "@lib/cn";
import { usePuck } from "@puckeditor/core";

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
        <BackSvg />
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
        <ForwardSvg />
      </button>
    </div>
  );
}

export default UndoRedoButtons;
