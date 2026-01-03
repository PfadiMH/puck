import cn from "@lib/cn";
import { Dialog as RDialog } from "radix-ui";
import { PropsWithChildren } from "react";

export function Dialog({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <RDialog.Portal>
      <RDialog.Overlay className="fixed inset-0 bg-black/50" />
      <RDialog.Content className={cn("fixed top-1/2 left-1/2 -translate-1/2 w-[90vw] max-w-[500px] rounded-xl p-4 bg-elevated text-contrast-ground overflow-hidden", className)}>
        {children}
      </RDialog.Content>
    </RDialog.Portal>
  );
}

export const DialogRoot = RDialog.Root;

export function DialogTrigger({ children }: PropsWithChildren) {
  return <RDialog.Trigger asChild>{children}</RDialog.Trigger>;
}

export function DialogTitle({ children }: PropsWithChildren) {
  return (
    <RDialog.Title className="font-rockingsoda text-3xl mb-2">
      {children}
    </RDialog.Title>
  );
}

export function DialogDescription({ children }: PropsWithChildren) {
  return (
    <RDialog.Description className="text-lg">{children}</RDialog.Description>
  );
}

export function DialogActions({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-wrap justify-end gap-4 mt-4">{children}</div>
  );
}

export function DialogClose({ children }: PropsWithChildren) {
  return <RDialog.Close asChild>{children}</RDialog.Close>;
}
