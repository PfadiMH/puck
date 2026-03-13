import { dbService } from "@lib/db/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get("deviceId");

    if (deviceId) {
      const rsvps = await dbService.getDeviceRsvps(eventId, deviceId);
      return NextResponse.json(rsvps);
    }

    const count = await dbService.getRsvpCount(eventId);
    return NextResponse.json(count);
  } catch (error) {
    console.error("Failed to fetch RSVPs:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Anmeldungen" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const body = await request.json();

    const { deviceId, profileId, firstName, lastName, pfadiName, comment, status } = body;

    if (!deviceId || !profileId || !firstName || !lastName || !status) {
      return NextResponse.json(
        { error: "Pflichtfelder fehlen: deviceId, profileId, firstName, lastName, status" },
        { status: 400 }
      );
    }

    if (status !== "attending" && status !== "declined") {
      return NextResponse.json(
        { error: "Status muss 'attending' oder 'declined' sein" },
        { status: 400 }
      );
    }

    const rsvp = await dbService.upsertRsvp({
      eventId,
      deviceId,
      profileId,
      firstName,
      lastName,
      pfadiName: pfadiName || undefined,
      comment: comment || undefined,
      status,
    });

    return NextResponse.json(rsvp, { status: 200 });
  } catch (error) {
    console.error("Failed to save RSVP:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern der Anmeldung" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get("deviceId");
    const profileId = searchParams.get("profileId");

    if (!deviceId || !profileId) {
      return NextResponse.json(
        { error: "Parameter 'deviceId' und 'profileId' sind erforderlich" },
        { status: 400 }
      );
    }

    await dbService.deleteRsvp(eventId, deviceId, profileId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete RSVP:", error);
    return NextResponse.json(
      { error: "Fehler beim Loschen der Anmeldung" },
      { status: 500 }
    );
  }
}
