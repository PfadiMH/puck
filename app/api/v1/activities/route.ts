import { dbService } from "@lib/db/db";
import { NextResponse } from "next/server";

export interface ActivityResponse {
  id: string;
  title: string;
  pagePath: string | null;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  locationUrl: string | null;
  endLocation: string | null;
  packingList: { name: string; icon: string | null }[];
  remarks: string | null;
  group: string | null;
}

export async function GET() {
  try {
    const events = await dbService.getAllUpcomingEvents();

    const activities: ActivityResponse[] = events.map((event) => ({
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
    }));

    return NextResponse.json(activities, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
