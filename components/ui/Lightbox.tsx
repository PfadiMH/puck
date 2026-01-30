"use client";

import { Dialog as RDialog } from "radix-ui";
import { X } from "lucide-react";
import Image from "next/image";

interface LightboxProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Lightbox({ src, alt, isOpen, onClose }: LightboxProps) {
  return (
    <RDialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <RDialog.Portal>
        <RDialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <RDialog.Content className="fixed inset-4 z-50 flex items-center justify-center data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <RDialog.Close asChild>
            <button
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </RDialog.Close>
          
          <div className="relative w-full h-full max-w-[90vw] max-h-[90vh]">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>
          
          <RDialog.Title className="sr-only">{alt}</RDialog.Title>
          <RDialog.Description className="sr-only">
            Full size image view
          </RDialog.Description>
        </RDialog.Content>
      </RDialog.Portal>
    </RDialog.Root>
  );
}
