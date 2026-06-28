import { BRAND } from "@/lib/constants";
import { Calendar, Clock, Tag, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { FadeIn } from "@/components/ui/FadeIn";
import { getBlogPost, getBlogPosts, sanityClient, type SanityBlogPost } from "@/lib/sanity/client";
import { urlForImage } from "@/lib/sanity/image";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextBlock } from "@portabletext/react";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.seo?.title || `${post.title} — ${BRAND.name} Blog`,
    description: post.seo?.description || post.summary,
    openGraph: {
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.summary,
      type: "article",
      publishedTime: post.publishedAt,
      authors: post.author?.name ? [post.author.name] : [],
      images: post.mainImage?.asset?.url ? [post.mainImage.asset.url] : [],
    },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-navy relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full border border-white/5" />
          <div className="absolute top-8 -right-16 w-72 h-72 rounded-full border border-white/5" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-20">
          <FadeIn>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              All posts
            </Link>

            {post.categories?.[0]?.category?.name && (
              <span className="inline-block px-3 py-1 bg-gold/20 text-gold rounded-full text-xs font-medium mb-4">
                {post.categories[0].category.name}
              </span>
            )}

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              {post.title}
            </h1>

            <p className="text-lg text-white/60 max-w-3xl mb-6">
              {post.summary}
            </p>

            <div className="flex items-center gap-4 text-sm text-white/40">
              {post.author?.name && (
                <span className="flex items-center gap-1.5">
                  {post.author.image?.asset?.url ? (
                    <img
                      src={post.author.image.asset.url}
                      alt={post.author.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  {post.author.name}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(post.publishedAt)}
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Featured image */}
      {post.mainImage?.asset?.url && (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-8">
          <FadeIn>
            <img
              src={urlForImage(post.mainImage).width(1200).height(600).url()}
              alt={post.mainImage.alt ?? post.title}
              className="w-full rounded-2xl shadow-xl object-cover max-h-[500px]"
            />
          </FadeIn>
        </div>
      )}

      {/* Content */}
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <FadeIn>
          <div className="prose prose-lg prose-ink max-w-none
            prose-headings:font-heading prose-headings:text-ink
            prose-p:text-ink/70 prose-p:leading-relaxed
            prose-a:text-gold prose-a:no-underline hover:prose-a:underline
            prose-strong:text-ink
            prose-img:rounded-xl
          ">
            {post.content && (
              <PortableText value={post.content as PortableTextBlock[]} />
            )}
          </div>
        </FadeIn>

        {/* Back to blog */}
        <div className="mt-12 pt-8 border-t border-ink/10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:text-gold/80 transition-colors"
          >
            ← Back to all posts
          </Link>
        </div>
      </article>
    </div>
  );
}
