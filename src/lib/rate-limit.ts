import { NextRequest, NextResponse } from "next/server";

/**
 * Fixed-window in-memory rate limiter. Appropriate for a single-container
 * deployment (Dokploy) — does NOT work correctly across multiple instances,
 * since each instance keeps its own counters. Swap for a shared store
 * (Upstash Redis, etc.) if this ever runs on more than one instance.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: NextRequest): string {
  // Cloudflare sets cf-connecting-ip; fall back to the first x-forwarded-for hop.
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/**
 * Returns a 429 response if the caller has exceeded `max` requests within
 * `windowSeconds` for the given `routeKey`, otherwise null (proceed).
 */
export function checkRateLimit(
  request: NextRequest,
  routeKey: string,
  { max, windowSeconds }: { max: number; windowSeconds: number }
): NextResponse | null {
  const key = `${routeKey}:${clientIp(request)}`;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return null;
  }

  if (bucket.count >= max) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  bucket.count += 1;
  return null;
}
