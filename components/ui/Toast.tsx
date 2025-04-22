"use client";
import cn from "@lib/cn";
import { Toaster as SonnerToaster } from "sonner";
export { toast } from "sonner";

function Toaster() {
  const buttonStyles = "text-sm px-2 py-1 rounded-md cursor-pointer";
  return (
    <SonnerToaster
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: cn(
            "p-4 rounded-md bg-elevated text-contrast-ground shadow-sm border border-primary flex gap-1 items-start select-none",
            "[&>div]:flex [&>div]:flex-col [&>div]:gap-1 [&>button]:shrink-0"
          ),
          description: "text-sm text-contrast-ground/80",
          actionButton: cn(
            buttonStyles,
            "bg-primary text-contrast-primary hover:bg-primary/80"
          ),
          cancelButton: cn(
            buttonStyles,
            "bg-secondary text-contrast-secondary hover:bg-secondary/80"
          ),
        },
      }}
    />
  );
}

export default Toaster;
