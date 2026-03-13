import { dbService } from "@lib/db/db";
import { NextRequest, NextResponse } from "next/server";
import type { NewsItemResponse } from "../route";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const path = Buffer.from(id, "base64url").toString("utf-8");
    const page = await dbService.getPage(path);

    if (!page) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    const title = page.root?.props?.title || path.split("/").pop() || "News";

    let imageUrl: string | null = null;
    const contentParts: string[] = [];

    for (const item of page.content || []) {
      if (!imageUrl && item.type === "Hero" && item.props?.backgroundImage) {
        imageUrl = item.props.backgroundImage as string;
      }
      if (!imageUrl && item.type === "Image" && item.props?.src) {
        imageUrl = item.props.src as string;
      }
      if (item.type === "RichText" && item.props?.content) {
        contentParts.push(stripHtml(item.props.content as string));
      }
    }

    const content = contentParts.join("\n\n") || null;
    const excerpt = content ? content.slice(0, 200) + (content.length > 200 ? "..." : "") : null;

    const newsItem: NewsItemResponse = {
      id,
      title,
      imageUrl,
      excerpt,
      content,
      pagePath: path,
    };

    return NextResponse.json(newsItem, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Error fetching news item:", error);
    return NextResponse.json(
      { error: "Failed to fetch news item" },
      { status: 500 }
    );
  }
}
