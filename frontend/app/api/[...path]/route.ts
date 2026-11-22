import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ path: string[] }>;
};

async function forward(request: NextRequest, params: RouteParams["params"]) {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return NextResponse.json(
      { error: "Backend service is not configured" },
      { status: 503 },
    );
  }

  const { path } = await params;
  const incoming = new URL(request.url);
  const backendPath =
    path[0] === "v1"
      ? `/api/${path.join("/")}`
      : `/${path.join("/")}`;
  const target = new URL(backendPath, backendUrl);
  target.search = incoming.search;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  const body = ["GET", "HEAD"].includes(request.method)
    ? undefined
    : await request.arrayBuffer();

  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });

    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("connection");
    responseHeaders.delete("keep-alive");

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json(
      { error: "Backend service is unavailable" },
      { status: 502 },
    );
  }
}

export function GET(request: NextRequest, context: RouteParams) {
  return forward(request, context.params);
}

export function POST(request: NextRequest, context: RouteParams) {
  return forward(request, context.params);
}

export function PUT(request: NextRequest, context: RouteParams) {
  return forward(request, context.params);
}

export function DELETE(request: NextRequest, context: RouteParams) {
  return forward(request, context.params);
}
