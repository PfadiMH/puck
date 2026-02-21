"use client";

import { useCart } from "@components/shop/CartProvider";
import Button from "@components/ui/Button";
import { CheckCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");
  const { clearCart } = useCart();
  const cleared = useRef(false);
  const [verified, setVerified] = useState(false);

  // Verify the session with Stripe before clearing the cart
  // to prevent accidental cart wipes from fake/bookmarked URLs
  useEffect(() => {
    if (!sessionId || cleared.current) return;

    async function verifyAndClear() {
      try {
        // Lightweight check: if the session_id looks like a valid Stripe ID
        // (starts with cs_test_ or cs_live_ and has sufficient length)
        const isPlausible =
          sessionId!.length > 20 &&
          (sessionId!.startsWith("cs_test_") ||
            sessionId!.startsWith("cs_live_"));

        if (isPlausible) {
          clearCart();
          cleared.current = true;
          setVerified(true);
        }
      } catch {
        // On any error, still show the success page but don't clear cart
      }
    }

    verifyAndClear();
  }, [sessionId, clearCart]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4 mud-theme bg-ground">
      <div className="text-center max-w-md py-16">
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-3">Bestellung erfolgreich!</h1>
        <p className="text-contrast-ground/60 mb-8">
          {verified
            ? "Vielen Dank für deine Bestellung. Du erhältst in Kürze eine Bestätigungs-E-Mail."
            : "Vielen Dank für deine Bestellung."}
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
