import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (expectedSecret) {
      const providedSecret =
        request.headers.get("x-sanity-revalidate-secret") ??
        new URL(request.url).searchParams.get("secret");

      if (providedSecret !== expectedSecret) {
        return NextResponse.json(
          { revalidated: false, error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    const revalidationTasks = [
      revalidatePath("/sitemap.xml"),
      revalidatePath("/blog"),
      revalidateTag("sanity:blog"),
    ];

    const slug =
      body?.slug ||
      body?.document?.slug?.current ||
      body?.result?.slug?.current;

    if (slug) {
      revalidationTasks.push(revalidatePath(`/blog/${slug}`));
    }

    await Promise.allSettled(revalidationTasks);

    return NextResponse.json({ revalidated: true });
  } catch (err) {
    console.error("/api/sanity/revalidate error:", err);
    return NextResponse.json(
      { revalidated: false, error: String(err) },
      { status: 500 }
    );
  }
}
