import { dbService } from "@lib/db/db";
import { NextResponse } from "next/server";

export interface NewsItemResponse {
  id: string;
  title: string;
  imageUrl: string | null;
  excerpt: string | null;
  content: string | null;
  pagePath: string;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export async function GET() {
  try {
    const allPaths = await dbService.getAllPaths();
    const newsPaths = allPaths.filter((path) => path.startsWith("/news/"));

    const newsItems: NewsItemResponse[] = [];

    for (const path of newsPaths) {
      const page = await dbService.getPage(path);
      if (!page) continue;

      const title = page.root?.props?.title || path.split("/").pop() || "News";
      
      let imageUrl: string | null = null;
      let excerpt: string | null = null;

      for (const item of page.content || []) {
        if (!imageUrl && item.type === "Hero" && item.props?.backgroundImage) {
          imageUrl = item.props.backgroundImage as string;
        }
        if (!imageUrl && item.type === "Image" && item.props?.src) {
          imageUrl = item.props.src as string;
        }
        if (!excerpt && item.type === "RichText" && item.props?.content) {
          const text = stripHtml(item.props.content as string);
          excerpt = text.slice(0, 200) + (text.length > 200 ? "..." : "");
        }
        if (imageUrl && excerpt) break;
      }

      newsItems.push({
        id: Buffer.from(path).toString("base64url"),
        title,
        imageUrl,
        excerpt,
        content: null,
        pagePath: path,
      });
    }

    return NextResponse.json(newsItems, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
