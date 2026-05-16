import { NextResponse } from "next/server";

const UPSTREAM = "https://openngo.my/api/v1";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const search = new URL(req.url).search;
  const target = `${UPSTREAM}/${path.join("/")}${search}`;

  try {
    const upstream = await fetch(target, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10000),
    });
    const body = await upstream.text();
    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") ?? "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: { code: "upstream_unreachable", message: String(err) } },
      { status: 502 }
    );
  }
}
