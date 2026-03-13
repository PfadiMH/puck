import { dbService } from "@lib/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get("deviceId");

    if (deviceId) {
      const rsvps = await dbService.getDeviceRsvps(id, deviceId);
      return NextResponse.json(rsvps);
    }

    const count = await dbService.getRsvpCount(id);
    return NextResponse.json(count);
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    return NextResponse.json(
      { error: "Failed to fetch RSVPs" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { deviceId, profileId, firstName, lastName, pfadiName, status } = body;

    if (!deviceId || !profileId || !firstName || !lastName || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (status !== "attending" && status !== "declined") {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const rsvp = await dbService.upsertRsvp({
      eventId: id,
      deviceId,
      profileId,
      firstName,
      lastName,
      pfadiName,
      status,
    });

    return NextResponse.json(rsvp, { status: 201 });
  } catch (error) {
    console.error("Error saving RSVP:", error);
    return NextResponse.json(
      { error: "Failed to save RSVP" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get("deviceId");
    const profileId = searchParams.get("profileId");

    if (!deviceId || !profileId) {
      return NextResponse.json(
        { error: "Missing deviceId or profileId" },
        { status: 400 }
      );
    }

    await dbService.deleteRsvp(id, deviceId, profileId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting RSVP:", error);
    return NextResponse.json(
      { error: "Failed to delete RSVP" },
      { status: 500 }
    );
  }
}
