import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { CACHE_CONFIG, REVALIDATION_SECRET } from "@/utils/const";

/* Publish webhook from ContioReach. Fired when a post is published, scheduled,
   deleted, or a published post is edited. Body: { secret, post }; the same
   secret is also accepted as the X-API-Key header. */
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const secret = body?.secret || request.headers.get("x-api-key");

    if (secret !== REVALIDATION_SECRET) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // "max" = stale-while-revalidate: pages using these tags refresh on their
    // next visit instead of blocking that request.
    for (const tag of Object.values(CACHE_CONFIG.TAGS)) {
      revalidateTag(tag, "max");
    }

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");
    revalidatePath("/blog/category/[slug]", "page");
    revalidatePath("/sitemap.xml");

    console.log("Blog cache revalidated", {
      slug: body?.post?.slug ?? null,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "All blog cache revalidated successfully",
      revalidated: {
        tags: Object.values(CACHE_CONFIG.TAGS),
        paths: ["/", "/blog", "/blog/*", "/blog/category/*", "/sitemap.xml"],
      },
    });
  } catch (error) {
    console.error("Full revalidation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to revalidate blog cache", details: error.message },
      { status: 500 },
    );
  }
}
