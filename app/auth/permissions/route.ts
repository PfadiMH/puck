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

  let roles;
  try {
    roles = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  if (!Array.isArray(roles)) {
    return NextResponse.json(
      { error: 'Invalid input. "roles" must be an array.' },
      { status: 400 }
    );
  }

  try {
    const permissions = await getPermissionsByRoles(roles);
    return NextResponse.json({ permissions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching permissions." },
      { status: 500 }
    );
  }
}
