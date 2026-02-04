"use server";

import type { FormField, FormProps } from "@components/puck/Form";
import type { PageData } from "@lib/config/page.config";
import { dbService } from "@lib/db/db";
import { env } from "@lib/env";
import { verifySolution } from "altcha-lib";
import { headers } from "next/headers";

const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_CLEANUP_INTERVAL = 5 * 60 * 1000;
const rateLimitMap = new Map<string, number[]>();

let lastCleanup = Date.now();

function cleanupRateLimitMap() {
  const now = Date.now();
  if (now - lastCleanup < RATE_LIMIT_CLEANUP_INTERVAL) return;

  lastCleanup = now;
  for (const [ip, timestamps] of rateLimitMap.entries()) {
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
    if (recent.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, recent);
    }
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isRateLimited(ip: string): boolean {
  cleanupRateLimitMap();

  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);

  if (recent.length >= RATE_LIMIT_MAX) {
    return true;
  }

  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

interface FormSubmission {
  pagePath: string;
  componentId: string;
  formData: Record<string, string | string[]>;
  altchaPayload?: string;
}

function findFormProps(pageData: PageData, componentId: string): FormProps | null {
  for (const component of pageData.content) {
    if (component.props.id === componentId && component.type === "Form") {
      return component.props as unknown as FormProps;
    }
  }
  if (pageData.zones) {
    for (const zoneContent of Object.values(pageData.zones)) {
      for (const component of zoneContent) {
        if (component.props.id === componentId && component.type === "Form") {
          return component.props as unknown as FormProps;
        }
      }
    }
  }
  return null;
}

function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char]);
}

async function verifyAltcha(payload: string | undefined): Promise<boolean> {
  if (!payload) {
    return false;
  }

  const hmacKey = env.ALTCHA_HMAC_KEY;

  if (!hmacKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("ALTCHA_HMAC_KEY must be set in production");
      return false;
    }
    console.warn("ALTCHA_HMAC_KEY not set, using default key for development");
  }

  try {
    const isValid = await verifySolution(payload, hmacKey || "altcha-default-key-change-in-production");
    return isValid;
  } catch (error) {
    console.error("ALTCHA verification failed:", error);
    return false;
  }
}

function formatEmailContent(
  formTitle: string,
  fields: FormField[],
  formData: Record<string, string | string[]>
): { html: string; text: string } {
  const lines: string[] = [];
  const htmlLines: string[] = [];

  htmlLines.push(`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1a0606; border-bottom: 2px solid #f4a019; padding-bottom: 10px;">
        ${escapeHtml(formTitle)}
      </h1>
      <p style="color: #666;">Neue Formular-Einsendung erhalten:</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
  `);

  lines.push(`${formTitle}\n${"=".repeat(formTitle.length)}\n`);
  lines.push("Neue Formular Einsendung erhalten:\n");

  fields.forEach((field, index) => {
    const fieldName = `field_${index}`;
    const value = formData[fieldName];
    const displayValue = Array.isArray(value) ? value.join(", ") : value || "-";

    lines.push(`${field.label}: ${displayValue}`);

    htmlLines.push(`
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; font-weight: bold; color: #333; width: 40%; vertical-align: top;">
          ${escapeHtml(field.label)}
        </td>
        <td style="padding: 12px; color: #666;">
          ${escapeHtml(displayValue).replace(/\n/g, "<br>")}
        </td>
      </tr>
    `);
  });

  htmlLines.push(`
      </table>
      <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
        Diese E-Mail wurde von der Pfadi MH generiert.
      </p>
    </div>
  `);

  return {
    html: htmlLines.join(""),
    text: lines.join("\n"),
  };
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<boolean> {
  const smtpHost = env.SMTP_HOST;
  const smtpPort = env.SMTP_PORT;
  const smtpUser = env.SMTP_USER;
  const smtpPass = env.SMTP_PASS;
  const smtpFrom = env.SMTP_FROM;

  if (!smtpHost || !smtpFrom) {
    console.error("SMTP configuration incomplete");
    return false;
  }

  try {
    const nodemailer = await import("nodemailer");

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort || "587"),
      secure: smtpPort === "465",
      auth: smtpUser && smtpPass ? {
        user: smtpUser,
        pass: smtpPass,
      } : undefined,
    });

    await transporter.sendMail({
      from: smtpFrom,
      to,
      subject,
      text,
      html,
    });

    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

export async function submitForm(
  submission: FormSubmission
): Promise<{ success: boolean; error?: string }> {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "unknown";

    if (isRateLimited(ip)) {
      return { success: false, error: "Zu viele Anfragen. Bitte warten." };
    }

    const { pagePath, componentId, formData, altchaPayload } = submission;

    if (!pagePath || !componentId || !formData) {
      return { success: false, error: "Fehlende Pflichtfelder" };
    }

    const pageData = await dbService.getPage(pagePath);
    if (!pageData) {
      return { success: false, error: "Seite nicht gefunden" };
    }

    const formProps = findFormProps(pageData, componentId);
    if (!formProps) {
      return { success: false, error: "Formular nicht gefunden" };
    }

    const { formTitle, fields, recipientEmail } = formProps;

    const recipientEmails = recipientEmail
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e && isValidEmail(e));

    if (recipientEmails.length === 0) {
      return { success: false, error: "Keine gültigen Empfänger konfiguriert" };
    }

    const isAltchaValid = await verifyAltcha(altchaPayload);
    if (!isAltchaValid) {
      return { success: false, error: "Captcha-Verifizierung fehlgeschlagen" };
    }

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const fieldName = `field_${i}`;
      const value = formData[fieldName];

      if (field.required) {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return { success: false, error: `Feld "${field.label}" ist erforderlich` };
        }
      }

      if (typeof value === "string" && value) {
        if (field.type === "number") {
          const num = Number(value);
          if (isNaN(num)) {
            return { success: false, error: `Feld "${field.label}" muss eine gültige Zahl sein` };
          }
          if (field.minLength !== undefined && num < field.minLength) {
            return { success: false, error: `Feld "${field.label}" muss mindestens ${field.minLength} sein` };
          }
          if (field.maxLength !== undefined && num > field.maxLength) {
            return { success: false, error: `Feld "${field.label}" darf maximal ${field.maxLength} sein` };
          }
        } else {
          if (field.minLength && value.length < field.minLength) {
            return { success: false, error: `Feld "${field.label}" muss mindestens ${field.minLength} Zeichen haben` };
          }
          if (field.maxLength && value.length > field.maxLength) {
            return { success: false, error: `Feld "${field.label}" darf maximal ${field.maxLength} Zeichen haben` };
          }
        }
      }
    }

    const { html, text } = formatEmailContent(formTitle, fields, formData);
    const subject = `Neue Einsendung: ${formTitle}`;

    const emailResults = await Promise.all(
      recipientEmails.map((email) => sendEmail(email, subject, html, text))
    );

    if (emailResults.every((r) => !r)) {
      return { success: false, error: "E-Mail konnte nicht gesendet werden" };
    }

    return { success: true };
  } catch (error) {
    console.error("Form submission error:", error);
    return { success: false, error: "Ein Fehler ist aufgetreten" };
  }
}
