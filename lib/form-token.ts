import { createHmac, timingSafeEqual } from "crypto";

const DEFAULT_KEY = "form-token-default-key-change-in-production";

function getHmacKey(): string {
  return process.env.ALTCHA_HMAC_KEY || DEFAULT_KEY;
}

export function createRecipientToken(email: string): string {
  const hmac = createHmac("sha256", getHmacKey());
  hmac.update(email.toLowerCase().trim());
  return hmac.digest("hex");
}

export function verifyRecipientToken(email: string, token: string): boolean {
  const expectedToken = createRecipientToken(email);
  const expectedBuf = Buffer.from(expectedToken);
  const tokenBuf = Buffer.from(token);
  if (expectedBuf.length !== tokenBuf.length) {
    return false;
  }
  return timingSafeEqual(expectedBuf, tokenBuf);
}
