import { SIGNATURE_HEADER_NAME, isValidSignature } from "@sanity/webhook";
import { revalidatePath } from "next/cache";
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

  if (_type !== "page" || typeof url !== "string" || !url) {
    return NextResponse.json(
      { message: "Nothing to revalidate" },
      { status: 200 },
    );
  }

  revalidatePath(url, "page");

  return NextResponse.json({ revalidated: true, path: url });
}
