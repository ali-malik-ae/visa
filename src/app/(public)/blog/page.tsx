import { BRAND } from "@/lib/constants";
import { Calendar, Clock, Tag, User } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { FadeIn } from "@/components/ui/FadeIn";
import { getBlogPosts, getPageSeo, type SanityBlogPost } from "@/lib/sanity/client";
import { urlForImage } from "@/lib/sanity/image";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("blog").catch(() => null);
  return {
    title: seo?.title || "Blog — UAE Visa Tips & Travel Guides",
    description: seo?.description || `Travel tips, UAE visa guides, and immigration insights from Visati's team of Dubai-based visa consultants.`,
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPage() {
  let posts: SanityBlogPost[] = [];
  try {
    posts = await getBlogPosts();
  } catch {
    // Sanity not configured — show empty state
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-navy relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full border border-white/5" />
          <div className="absolute top-8 -right-16 w-72 h-72 rounded-full border border-white/5" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-24 text-center">
          <FadeIn>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Blog
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/60 max-w-2xl mx-auto">
              Travel tips, visa guides, and immigration insights from our Dubai-based team.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Posts grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {posts.length === 0 ? (
          <FadeIn>
            <div className="text-center py-16">
              <Tag className="h-12 w-12 text-ink/10 mx-auto mb-4" />
              <p className="text-ink/40 text-lg">No blog posts yet. Check back soon!</p>
            </div>
          </FadeIn>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {posts.map((post, i) => (
              <FadeIn key={post._id} delay={i * 100}>
                <Link href={`/blog/${post.slug?.current ?? post._id}`} className="block h-full">
                  <article className="group bg-white border border-ink/10 rounded-2xl overflow-hidden hover:border-gold/30 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                    {/* Image */}
                    <div className="h-48 bg-gradient-to-br from-navy/5 to-gold/5 relative">
                      {post.mainImage?.asset?.url ? (
                        <img
                          src={urlForImage(post.mainImage).width(600).height(300).url()}
                          alt={post.mainImage.alt ?? post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Tag className="h-10 w-10 text-ink/10" />
                        </div>
                      )}
                      {post.categories?.[0]?.category?.name && (
                        <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gold">
                          {post.categories[0].category.name}
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-xs text-ink/40 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(post.publishedAt)}
                        </span>
                        {post.author?.name && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {post.author.name}
                          </span>
                        )}
                      </div>

                      <h2 className="font-heading text-lg font-semibold text-ink mb-2 group-hover:text-gold transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-sm text-ink/55 leading-relaxed flex-1 line-clamp-3">
                        {post.summary}
                      </p>

                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold group-hover:gap-2 transition-all">
                        Read more →
                      </span>
                    </div>
                  </article>
                </Link>
              </FadeIn>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
