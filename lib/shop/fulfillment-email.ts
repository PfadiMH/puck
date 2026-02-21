import { env } from "@lib/env";
import { formatPrice } from "./utils";

interface OrderItem {
  name: string;
  options: Record<string, string>;
  quantity: number;
  price: number; // in Rappen
}

interface OrderDetails {
  items: OrderItem[];
  total: number; // in Rappen
  customerEmail: string;
  shippingAddress?: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  stripeSessionId: string;
}

function escapeHtml(text: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (c) => entities[c]);
}

// --- Shared helpers for DRY email building ---

function buildItemRowsHtml(items: OrderItem[]): string {
  return items
    .map((item) => {
      const opts = Object.values(item.options).join(", ");
      return `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 10px;">${escapeHtml(item.name)}${opts ? `<br><small style="color:#888;">${escapeHtml(opts)}</small>` : ""}</td>
          <td style="padding: 10px; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; text-align: right;">${formatPrice(item.price * item.quantity)}</td>
        </tr>`;
    })
    .join("");
}

function buildItemRowsText(items: OrderItem[]): string[] {
  return items.map((item) => {
    const opts = Object.values(item.options).join(", ");
    return `  ${item.quantity}x ${item.name}${opts ? ` (${opts})` : ""} — ${formatPrice(item.price * item.quantity)}`;
  });
}

function buildItemTableHtml(items: OrderItem[], total: number): string {
  return `
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <thead>
          <tr style="background: #f4a019; color: white;">
            <th style="padding: 10px; text-align: left;">Artikel</th>
            <th style="padding: 10px; text-align: center;">Menge</th>
            <th style="padding: 10px; text-align: right;">Preis</th>
          </tr>
        </thead>
        <tbody>
          ${buildItemRowsHtml(items)}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 12px; text-align: right; font-weight: bold;">Total:</td>
            <td style="padding: 12px; text-align: right; font-weight: bold; font-size: 16px;">${formatPrice(total)}</td>
          </tr>
        </tfoot>
      </table>`;
}

function buildFulfillmentEmail(order: OrderDetails): {
  html: string;
  text: string;
} {
  const textLines: string[] = [
    "Neue Bestellung eingegangen",
    "=".repeat(30),
    "",
    `Kunde: ${order.customerEmail}`,
  ];

  if (order.shippingAddress) {
    const a = order.shippingAddress;
    textLines.push(
      "",
      "Lieferadresse:",
      a.name,
      a.line1,
      ...(a.line2 ? [a.line2] : []),
      `${a.postalCode} ${a.city}`,
      a.country
    );
  }

  textLines.push("", "Artikel:", "", ...buildItemRowsText(order.items));
  textLines.push("", `Total: ${formatPrice(order.total)}`, "");
  textLines.push(`Stripe Session: ${order.stripeSessionId}`);

  const addressHtml = order.shippingAddress
    ? `
      <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <strong>Lieferadresse:</strong><br>
        ${escapeHtml(order.shippingAddress.name)}<br>
        ${escapeHtml(order.shippingAddress.line1)}<br>
        ${order.shippingAddress.line2 ? `${escapeHtml(order.shippingAddress.line2)}<br>` : ""}
        ${escapeHtml(order.shippingAddress.postalCode)} ${escapeHtml(order.shippingAddress.city)}<br>
        ${escapeHtml(order.shippingAddress.country)}
      </div>`
    : "";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1a0606; border-bottom: 2px solid #f4a019; padding-bottom: 10px;">
        Neue Bestellung
      </h1>
      <p style="color: #666;">Kunde: <strong>${escapeHtml(order.customerEmail)}</strong></p>
      ${addressHtml}
      ${buildItemTableHtml(order.items, order.total)}
      <p style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
        Stripe Session: ${escapeHtml(order.stripeSessionId)}
      </p>
    </div>`;

  return { html, text: textLines.join("\n") };
}

function buildConfirmationEmail(order: OrderDetails): {
  html: string;
  text: string;
} {
  const textLines: string[] = [
    "Bestellbestätigung",
    "=".repeat(30),
    "",
    "Vielen Dank für deine Bestellung!",
    "",
    "Artikel:",
    "",
    ...buildItemRowsText(order.items),
  ];

  textLines.push("", `Total: ${formatPrice(order.total)}`);

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1a0606; border-bottom: 2px solid #f4a019; padding-bottom: 10px;">
        Bestellbestätigung
      </h1>
      <p>Vielen Dank für deine Bestellung!</p>
      ${buildItemTableHtml(order.items, order.total)}
      <p style="margin-top: 25px; color: #888; font-size: 13px;">
        Bei Fragen melde dich gerne bei uns.
      </p>
    </div>`;

  return { html, text: textLines.join("\n") };
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
    console.error("SMTP not configured — cannot send order email");
    return false;
  }

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort || "587"),
      secure: smtpPort === "465",
      auth:
        smtpUser && smtpPass
          ? { user: smtpUser, pass: smtpPass }
          : undefined,
      // Timeouts to prevent hanging in webhook context
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 30_000,
    });

    await transporter.sendMail({ from: smtpFrom, to, subject, html, text });
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

export async function sendFulfillmentEmail(
  fulfillmentAddress: string,
  order: OrderDetails
): Promise<boolean> {
  const { html, text } = buildFulfillmentEmail(order);
  return sendEmail(
    fulfillmentAddress,
    `Neue Bestellung — ${formatPrice(order.total)}`,
    html,
    text
  );
}

export async function sendConfirmationEmail(
  order: OrderDetails
): Promise<boolean> {
  const { html, text } = buildConfirmationEmail(order);
  return sendEmail(
    order.customerEmail,
    "Bestellbestätigung — Pfadi MH",
    html,
    text
  );
}
