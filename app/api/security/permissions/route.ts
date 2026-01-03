import { dbService } from "@lib/db/service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { env } from "@lib/env";

export async function GET(request: NextRequest) {
  const secretKey = env.AUTH_SECRET;
  const requestSecretKey = request.headers.get("x-secret-key");

  if (!secretKey || requestSecretKey !== secretKey) {
    return NextResponse.json(
      { error: "Unauthorized access." },
      { status: 401 }
    );
  }

  // Validate and parse roles
  const rolesParam = request.nextUrl.searchParams.get("roles");
  let roles: string[] = [];

  if (rolesParam) {
    try {
      const parsed = JSON.parse(rolesParam);
      const result = z.array(z.string()).safeParse(parsed);

      if (!result.success) {
        return NextResponse.json(
          { error: "Invalid roles parameter: must be an array of strings." },
          { status: 400 }
        );
      }
      roles = result.data;
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in roles parameter." },
        { status: 400 }
      );
    }
  }

  const config = await dbService.getSecurityConfig();

  const permissionSet = new Set<string>(
    config?.roles
      ?.filter((r) => roles.includes(r.name))
      .flatMap((r) => r.permissions || []) || []
  );

  if (roles.some((r) => r.toLowerCase() === "admin")) {
    permissionSet.add("global-admin");
  }

  const permissions = Array.from(permissionSet);

  return NextResponse.json({ permissions }, { status: 200 });
}
