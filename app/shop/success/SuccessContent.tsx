"use client";

import { useCart } from "@components/shop/CartProvider";
import Button from "@components/ui/Button";
import { CheckCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");
  const { clearCart } = useCart();
  const cleared = useRef(false);

  // Clear the cart on successful payment
  useEffect(() => {
    if (sessionId && !cleared.current) {
      clearCart();
      cleared.current = true;
    }
  }, [sessionId, clearCart]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4 mud-theme bg-ground">
      <div className="text-center max-w-md py-16">
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-3">Bestellung erfolgreich!</h1>
        <p className="text-contrast-ground/60 mb-8">
          Vielen Dank für deine Bestellung. Du erhältst in Kürze eine
          Bestätigungs-E-Mail.
        </p>
        <Button
          color="primary"
          size="large"
          onClick={() => router.push("/")}
        >
          Zurück zur Startseite
        </Button>
      </div>
    </main>
  );
}
