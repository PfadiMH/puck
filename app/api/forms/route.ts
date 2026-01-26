import { FormField } from "@components/puck/Form";
import { env } from "@lib/env";
import { verifyRecipientToken } from "@lib/form-token";
import { verifySolution } from "altcha-lib";
import { NextRequest, NextResponse } from "next/server";

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

function isAllowedRecipient(email: string): boolean {
  const normalizedEmail = email.toLowerCase().trim();

  const allowedEmails = env.FORM_ALLOWED_RECIPIENT_EMAILS;
  if (allowedEmails) {
    const emails = allowedEmails.split(",").map((e) => e.trim().toLowerCase());
    return emails.includes(normalizedEmail);
  }

  const allowedDomains = env.FORM_ALLOWED_RECIPIENT_DOMAINS;
  if (allowedDomains) {
    const domains = allowedDomains.split(",").map((d) => d.trim().toLowerCase());
    const emailDomain = normalizedEmail.split("@")[1];
    return emailDomain ? domains.includes(emailDomain) : false;
  }

  if (process.env.NODE_ENV === "production") {
    console.error("FORM_ALLOWED_RECIPIENT_EMAILS or FORM_ALLOWED_RECIPIENT_DOMAINS must be set in production");
    return false;
  }

  return true;
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
  recipientEmail: string;
  recipientToken: string;
  formTitle: string;
  fields: FormField[];
  formData: Record<string, string | string[]>;
  altchaPayload?: string;
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

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte warten." },
        { status: 429 }
      );
    }

    const body: FormSubmission = await request.json();
    const { recipientEmail, recipientToken, formTitle, fields, formData, altchaPayload } = body;

    if (!recipientEmail || !recipientToken || !formTitle || !fields || !formData) {
      return NextResponse.json(
        { error: "Fehlende Pflichtfelder" },
        { status: 400 }
      );
    }

    if (!verifyRecipientToken(recipientEmail, recipientToken)) {
      return NextResponse.json(
        { error: "Ungültiger Empfänger-Token" },
        { status: 403 }
      );
    }

    if (!isValidEmail(recipientEmail)) {
      return NextResponse.json(
        { error: "Ungültige E-Mail-Adresse" },
        { status: 400 }
      );
    }

    if (!isAllowedRecipient(recipientEmail)) {
      return NextResponse.json(
        { error: "E-Mail-Empfänger nicht erlaubt" },
        { status: 403 }
      );
    }

    const isAltchaValid = await verifyAltcha(altchaPayload);
    if (!isAltchaValid) {
      return NextResponse.json(
        { error: "Captcha-Verifizierung fehlgeschlagen" },
        { status: 400 }
      );
    }

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const fieldName = `field_${i}`;
      const value = formData[fieldName];

      if (field.required) {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return NextResponse.json(
            { error: `Feld "${field.label}" ist erforderlich` },
            { status: 400 }
          );
        }
      }

      if (typeof value === "string" && value) {
        if (field.type === "number") {
          const num = Number(value);
          if (isNaN(num)) {
            return NextResponse.json(
              { error: `Feld "${field.label}" muss eine gültige Zahl sein` },
              { status: 400 }
            );
          }
          if (field.minLength !== undefined && num < field.minLength) {
            return NextResponse.json(
              { error: `Feld "${field.label}" muss mindestens ${field.minLength} sein` },
              { status: 400 }
            );
          }
          if (field.maxLength !== undefined && num > field.maxLength) {
            return NextResponse.json(
              { error: `Feld "${field.label}" darf maximal ${field.maxLength} sein` },
              { status: 400 }
            );
          }
        } else {
          if (field.minLength && value.length < field.minLength) {
            return NextResponse.json(
              { error: `Feld "${field.label}" muss mindestens ${field.minLength} Zeichen haben` },
              { status: 400 }
            );
          }
          if (field.maxLength && value.length > field.maxLength) {
            return NextResponse.json(
              { error: `Feld "${field.label}" darf maximal ${field.maxLength} Zeichen haben` },
              { status: 400 }
            );
          }
        }
      }
    }

    const { html, text } = formatEmailContent(formTitle, fields, formData);
    const subject = `Neue Einsendung: ${formTitle}`;

    const emailSent = await sendEmail(recipientEmail, subject, html, text);
    if (!emailSent) {
      return NextResponse.json(
        { error: "E-Mail konnte nicht gesendet werden" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}
