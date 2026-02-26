import { dbService } from "@lib/db/db";
import { hitobitoClient } from "@lib/hitobito/client";
import { fetchOrganigramm } from "@lib/hitobito/fetch-organigramm";
import type { OrganigrammResponse } from "@lib/hitobito/types";
import { NextRequest, NextResponse } from "next/server";

/** Cache TTL: 1 week in milliseconds */
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const groupIdParam = searchParams.get("groupId");

  if (!groupIdParam) {
    return NextResponse.json(
      { error: "Missing required query parameter: groupId" },
      { status: 400 }
    );
  }

  const groupId = Number(groupIdParam);
  if (Number.isNaN(groupId) || groupId <= 0) {
    return NextResponse.json(
      { error: "groupId must be a positive integer" },
      { status: 400 }
    );
  }

  // Check cache first
  const cached = await dbService.getOrganigrammCache(groupId);
  const now = Date.now();
  const isFresh =
    cached && now - new Date(cached.fetchedAt).getTime() < CACHE_TTL_MS;

  if (isFresh && cached) {
    const response: OrganigrammResponse = {
      data: cached.data,
      stale: false,
      fetchedAt: cached.fetchedAt.toISOString(),
    };
    return NextResponse.json(response, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  }

  // Need fresh data — check if Hitobito is configured
  if (!hitobitoClient) {
    // No Hitobito configured — serve stale cache if available
    if (cached) {
      const response: OrganigrammResponse = {
        data: cached.data,
        stale: true,
        fetchedAt: cached.fetchedAt.toISOString(),
      };
      return NextResponse.json(response);
    }
    return NextResponse.json(
      { error: "Hitobito API is not configured (HITOBITO_BASE_URL / HITOBITO_API_TOKEN missing)" },
      { status: 503 }
    );
  }

  // Fetch fresh data from Hitobito
  try {
    const data = await fetchOrganigramm(hitobitoClient, groupId);
    const fetchedAt = new Date();

    // Save to cache
    await dbService.saveOrganigrammCache({
      rootGroupId: groupId,
      fetchedAt,
      data,
    });

    const response: OrganigrammResponse = {
      data,
      stale: false,
      fetchedAt: fetchedAt.toISOString(),
    };
    return NextResponse.json(response, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (error) {
    console.error("Failed to fetch Organigramm from Hitobito:", error);

    // If we have stale cache, serve it rather than failing
    if (cached) {
      const response: OrganigrammResponse = {
        data: cached.data,
        stale: true,
        fetchedAt: cached.fetchedAt.toISOString(),
      };
      return NextResponse.json(response);
    }

    return NextResponse.json(
      { error: "Failed to fetch data from Hitobito and no cached data available" },
      { status: 502 }
    );
  }
}
