import { dbService } from "@lib/db/db";
import { NextRequest, NextResponse } from "next/server";
import type { ActivityResponse } from "../route";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await dbService.getCalendarEvent(id);

    if (!event) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    const activity: ActivityResponse = {
      id: event._id,
      title: event.title,
      pagePath: null,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location?.name || "",
      locationUrl: event.location?.mapsLink || null,
      endLocation: event.endLocation?.name || null,
      packingList: event.mitnehmen.map((item) => ({
        name: item.name,
        icon: item.icon || null,
      })),
      remarks: event.bemerkung || null,
      group: event.groups[0] || null,
    };

    return NextResponse.json(activity, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}
