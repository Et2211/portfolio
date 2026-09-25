import { SIGNATURE_HEADER_NAME, isValidSignature } from "@sanity/webhook";
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { tagsToRevalidate } from "@/lib/cacheTags";
import { isWebhookPayload } from "@/lib/webhook";

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

  const tags = tagsToRevalidate(payload._type);
  if (!tags.length) {
    return NextResponse.json({ message: "Nothing to revalidate" });
  }

  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }
  // eslint-disable-next-line no-console
  console.log(`[webhook] Revalidated ${tags.join(", ")}`);
  return NextResponse.json({ revalidated: true, tags });
}
