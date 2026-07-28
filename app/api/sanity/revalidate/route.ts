import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Minimal webhook endpoint for Sanity to trigger Next revalidation.
// Recommend securing this endpoint with a secret (e.g. header or URL token).
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    // Always revalidate the sitemap and blog index.
    try {
      await revalidatePath("/sitemap.xml");
    } catch (e) {
      // ignore individual revalidate failures
      console.error("Failed to revalidate sitemap:", e);
    }

    try {
      await revalidatePath("/blog");
    } catch (e) {
      console.error("Failed to revalidate blog index:", e);
    }

    // If the payload contains a slug, revalidate the post page too.
    const slug = body?.slug || body?.document?.slug?.current || body?.result?.slug?.current;
    if (slug) {
      try {
        await revalidatePath(`/blog/${slug}`);
      } catch (e) {
        console.error("Failed to revalidate post page:", e);
      }
    }

    return NextResponse.json({ revalidated: true });
  } catch (err) {
    console.error("/api/sanity/revalidate error:", err);
    return NextResponse.json({ revalidated: false, error: String(err) }, { status: 500 });
  }
}
