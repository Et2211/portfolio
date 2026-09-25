import { SIGNATURE_HEADER_NAME, isValidSignature } from "@sanity/webhook";
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { GLOBAL_TAG, pageTag } from "@/lib/cacheTags";

/** The fields the Sanity webhook projection sends. */
interface WebhookPayload {
  _type?: string;
  url?: string;
}

const isWebhookPayload = (value: unknown): value is WebhookPayload =>
  typeof value === "object" &&
  value !== null &&
  (!("_type" in value) || typeof value._type === "string") &&
  (!("url" in value) || typeof value.url === "string");

const GLOBAL_TYPES = new Set(["navigation", "footer"]);

// Called by a Sanity webhook on publish. `{ expire: 0 }` expires the
// "use cache" entries immediately rather than serving stale-while-revalidate.
export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { message: "Missing REVALIDATE_SECRET" },
      { status: 500 },
    );
  }

  const body = await req.text();
  const signature = req.headers.get(SIGNATURE_HEADER_NAME);
  if (!signature || !(await isValidSignature(body, signature, secret))) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
  if (!isWebhookPayload(payload)) {
    return NextResponse.json(
      { message: "Unexpected payload" },
      { status: 400 },
    );
  }

  const { _type, url } = payload;
  let tag: string | null = null;
  if (_type === "page" && url) {
    tag = pageTag(url);
  } else if (_type && GLOBAL_TYPES.has(_type)) {
    tag = GLOBAL_TAG;
  }

  if (!tag) {
    return NextResponse.json({ message: "Nothing to revalidate" });
  }

  revalidateTag(tag, { expire: 0 });
  // eslint-disable-next-line no-console
  console.log(`[webhook] Revalidated ${tag}`);
  return NextResponse.json({ revalidated: true, tag });
}
