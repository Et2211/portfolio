import { SIGNATURE_HEADER_NAME, isValidSignature } from "@sanity/webhook";
import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.text();
  const signature = req.headers.get(SIGNATURE_HEADER_NAME);
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { message: "Missing REVALIDATE_SECRET" },
      { status: 500 },
    );
  }

  if (!signature || !(await isValidSignature(body, signature, secret))) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  let payload: { _type?: string; url?: string };
  try {
    payload = JSON.parse(body) as { _type?: string; url?: string };
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const { _type, url } = payload;

  // Handle page-specific revalidation
  if (_type === "page" && typeof url === "string" && url) {
    // eslint-disable-next-line no-console
    console.log(`[webhook] Revalidating page: ${url}`);
    revalidatePath(url, "page");
    // Also invalidate the data cache tag for this page
    revalidateTag(`page-${url}`, "page");
    // eslint-disable-next-line no-console
    console.log(`[webhook] Revalidated page: ${url}`);
    return NextResponse.json({ revalidated: true, path: url });
  }

  // Handle global content (navigation, footer) that touches all pages
  if (_type === "navigation" || _type === "footer") {
    // eslint-disable-next-line no-console
    console.log(`[webhook] Revalidating tag: sanity:global`);
    revalidateTag("sanity:global", "page");
    // eslint-disable-next-line no-console
    console.log(`[webhook] Revalidated tag: sanity:global`);
    return NextResponse.json({ revalidated: true, tag: "sanity:global" });
  }

  // Unknown type
  return NextResponse.json(
    { message: "Nothing to revalidate" },
    { status: 200 },
  );
}
