import { env } from "@lib/env";
import { createChallenge } from "altcha-lib";
import { NextResponse } from "next/server";

export async function GET() {
  const hmacKey = env.ALTCHA_HMAC_KEY;

  if (!hmacKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("ALTCHA_HMAC_KEY must be set in production");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }
    console.warn("ALTCHA_HMAC_KEY not set, using default key for development");
  }

  const challenge = await createChallenge({
    hmacKey: hmacKey || "altcha-default-key-change-in-production",
    maxNumber: 50000,
    expires: new Date(Date.now() + 5 * 60 * 1000),
  });

  return NextResponse.json(challenge);
}
