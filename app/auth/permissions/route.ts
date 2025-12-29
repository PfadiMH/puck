import { getPermissionsByRoles } from "@lib/db/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secretKey = process.env.AUTH_SECRET;
  const requestSecretKey = request.headers.get("x-secret-key");

  if (!secretKey || requestSecretKey !== secretKey) {
    return NextResponse.json(
      { error: "Unauthorized access." },
      { status: 401 }
    );
  }

  const roles = await request.json();


  const permissions = await getPermissionsByRoles(roles);
  return NextResponse.json({ permissions }, { status: 200 });
}
