import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center text-ink">
      <h1 className="font-display text-3xl font-semibold">Post not found</h1>
      <p className="mt-3 text-dark-grayish-blue">
        This article may have been removed or the link is incorrect.
      </p>
      <Link
        href="/blog"
        className="mt-8 text-sm font-medium text-accent-blue underline underline-offset-4"
      >
        Back to blog
      </Link>
    </div>
  );
}
