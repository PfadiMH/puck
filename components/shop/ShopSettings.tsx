"use client";

import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import type { ShopSettings } from "@lib/shop/types";
import { Mail } from "lucide-react";
import { useState } from "react";

type ShopSettingsFormProps = {
  settings: ShopSettings;
  onSave: (settings: ShopSettings) => void;
  isSaving: boolean;
};

export function ShopSettingsForm({
  settings,
  onSave,
  isSaving,
}: ShopSettingsFormProps) {
  const [email, setEmail] = useState(settings.fulfillmentEmail);

  return (
    <div className="max-w-lg">
      <div className="rounded-lg border border-contrast-ground/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-contrast-ground/60" />
          <h2 className="text-lg font-semibold">Bestellungs-E-Mail</h2>
        </div>
        <p className="text-sm text-contrast-ground/60 mb-4">
          Bestellungen werden an diese E-Mail-Adresse gesendet, damit sie
          erfüllt werden können.
        </p>
        <div className="flex gap-3">
          <Input
            type="email"
            placeholder="bestellungen@pfadimh.ch"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button
            color="primary"
            size="medium"
            onClick={() => onSave({ fulfillmentEmail: email })}
            disabled={isSaving || email === settings.fulfillmentEmail}
          >
            {isSaving ? "Speichern..." : "Speichern"}
          </Button>
        </div>
      </div>
    </div>
  );
}
