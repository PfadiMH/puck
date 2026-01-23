"use client";

/// <reference types="altcha" />
import Button from "@components/ui/Button";
import cn from "@lib/cn";
import { useSectionTheme } from "@lib/contexts/section-theme-context";
import { FormEvent, useEffect, useRef, useState } from "react";

export type FormFieldType = "shortText" | "longText" | "number" | "radio" | "checkbox";

export interface FormField {
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  width: "half" | "full";
  minLength?: number;
  maxLength?: number;
  options?: string;
}

export interface FormClientProps {
  recipientEmail: string;
  recipientToken: string;
  formTitle: string;
  submitButtonText: string;
  successMessage: string;
  fields: FormField[];
  editMode?: boolean;
}

export function FormClient({
  recipientEmail,
  recipientToken,
  formTitle,
  submitButtonText,
  successMessage,
  fields,
  editMode,
}: FormClientProps) {
  const theme = useSectionTheme();
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [altchaPayload, setAltchaPayload] = useState<string | null>(null);
  const [altchaReady, setAltchaReady] = useState(false);
  const altchaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    import("altcha").then(() => setAltchaReady(true));
  }, []);

  useEffect(() => {
    const widget = altchaRef.current;
    if (!widget || !altchaReady) return;

    const handleStateChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ state: string; payload?: string }>;
      if (customEvent.detail?.state === "verified" && customEvent.detail?.payload) {
        setAltchaPayload(customEvent.detail.payload);
      }
    };

    widget.addEventListener("statechange", handleStateChange);
    return () => widget.removeEventListener("statechange", handleStateChange);
  }, [altchaReady]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!altchaPayload) {
      setErrorMessage("Bitte Captcha bestätigen.");
      return;
    }
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail,
          recipientToken,
          formTitle,
          fields,
          formData,
          altchaPayload,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Fehler");
      setStatus("success");
      setFormData({});
      setAltchaPayload(null);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Fehler");
    }
  };

  if (editMode && (!fields || fields.length === 0)) {
    return (
      <div className="p-8 border-2 border-dashed border-contrast-ground/50 rounded-lg text-center">
        <h3 className="font-rockingsoda text-2xl mb-2">{formTitle || "Formular"}</h3>
        <p className="opacity-70">Füge Felder hinzu.</p>
      </div>
    );
  }

  const inputCls =
    "w-full px-4 py-3 rounded-lg border-2 border-primary bg-elevated text-contrast-ground placeholder:text-contrast-ground/50 focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="p-6 md:p-8">
      {formTitle && <h2 className="font-rockingsoda text-3xl md:text-4xl mb-6">{formTitle}</h2>}

      {status === "success" ? (
        <div className="p-6 rounded-lg text-center bg-elevated">
          <p className="text-xl font-semibold">{successMessage || "Vielen Dank!"}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-2">
            {fields?.map((field, i) => {
              const name = `field_${i}`;
              const val = formData[name] || "";
              const wrap = cn(field.width === "half" ? "w-full md:w-1/2" : "w-full", "px-2 mb-4");
              const label = (
                <label className="block text-sm font-semibold mb-2">
                  {field.label}
                  {field.required && <span className="text-brand-red ml-1">*</span>}
                </label>
              );

              if (field.type === "shortText") {
                return (
                  <div key={i} className={wrap}>
                    {label}
                    <input
                      type="text"
                      className={inputCls}
                      placeholder={field.placeholder}
                      required={field.required}
                      minLength={field.minLength}
                      maxLength={field.maxLength}
                      value={val as string}
                      onChange={(e) => setFormData((p) => ({ ...p, [name]: e.target.value }))}
                      disabled={editMode}
                    />
                  </div>
                );
              }

              if (field.type === "longText") {
                return (
                  <div key={i} className={wrap}>
                    {label}
                    <textarea
                      className={cn(inputCls, "min-h-[120px] resize-y")}
                      placeholder={field.placeholder}
                      required={field.required}
                      minLength={field.minLength}
                      maxLength={field.maxLength}
                      value={val as string}
                      onChange={(e) => setFormData((p) => ({ ...p, [name]: e.target.value }))}
                      disabled={editMode}
                    />
                  </div>
                );
              }

              if (field.type === "number") {
                return (
                  <div key={i} className={wrap}>
                    {label}
                    <input
                      type="number"
                      className={inputCls}
                      placeholder={field.placeholder}
                      required={field.required}
                      min={field.minLength}
                      max={field.maxLength}
                      value={val as string}
                      onChange={(e) => setFormData((p) => ({ ...p, [name]: e.target.value }))}
                      disabled={editMode}
                    />
                  </div>
                );
              }

              if (field.type === "radio") {
                const opts = field.options?.split(",").map((o) => o.trim()).filter(Boolean) || [];
                return (
                  <div key={i} className={wrap}>
                    {label}
                    {opts.length === 0 ? (
                      <p className="text-sm opacity-50 italic">Keine Optionen definiert</p>
                    ) : (
                      <div className="space-y-2">
                        {opts.map((opt, j) => (
                          <label
                            key={j}
                            className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-elevated"
                          >
                            <input
                              type="radio"
                              name={name}
                              value={opt}
                              checked={val === opt}
                              onChange={(e) => setFormData((p) => ({ ...p, [name]: e.target.value }))}
                              required={field.required}
                              disabled={editMode}
                              className="w-5 h-5 accent-primary"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (field.type === "checkbox") {
                const opts = field.options?.split(",").map((o) => o.trim()).filter(Boolean) || [];
                const selected = (formData[name] as string[]) || [];
                return (
                  <div key={i} className={wrap}>
                    {label}
                    {opts.length === 0 ? (
                      <p className="text-sm opacity-50 italic">Keine Optionen definiert</p>
                    ) : (
                      <div className="space-y-2">
                        {opts.map((opt, j) => (
                          <label
                            key={j}
                            className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-elevated"
                          >
                            <input
                              type="checkbox"
                              value={opt}
                              checked={selected.includes(opt)}
                              onChange={() => {
                                setFormData((p) => {
                                  const cur = (p[name] as string[]) || [];
                                  return {
                                    ...p,
                                    [name]: cur.includes(opt) ? cur.filter((v) => v !== opt) : [...cur, opt],
                                  };
                                });
                              }}
                              disabled={editMode}
                              className="w-5 h-5 rounded accent-primary"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div key={i} className={wrap}>
                  {label}
                  <input
                    type="text"
                    className={inputCls}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={val as string}
                    onChange={(e) => setFormData((p) => ({ ...p, [name]: e.target.value }))}
                    disabled={editMode}
                  />
                </div>
              );
            })}
          </div>

          {!editMode && altchaReady && (
            <div
              className="mb-6 flex justify-center"
              style={
                {
                  "--altcha-color-text": theme === "sun" ? "#1a0606" : "#fefaeb",
                  "--altcha-color-border": theme === "sun" ? "#1a0606" : "#fefaeb",
                  "--altcha-color-border-focus": "#f4a019",
                } as React.CSSProperties
              }
            >
              <altcha-widget ref={altchaRef} challengeurl="/api/forms/challenge" hidefooter />
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-brand-red/10 text-brand-red text-center">{errorMessage}</div>
          )}

          <div className="flex justify-center">
            <Button type="submit" size="large" color="primary" disabled={status === "submitting" || editMode}>
              {status === "submitting" ? "Wird gesendet..." : submitButtonText || "Absenden"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
