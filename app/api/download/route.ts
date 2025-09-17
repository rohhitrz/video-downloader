import { NextRequest, NextResponse } from "next/server";
import {
  isValidHttpUrl,
  isAllowedHost,
  isValidContentType,
} from "@/lib/validators";
import { extractSafeFilename } from "@/lib/filenames";

const MAX_BYTES = parseInt(process.env.MAX_BYTES || "209715200"); // 200MB
const FETCH_TIMEOUT_MS = parseInt(process.env.FETCH_TIMEOUT_MS || "30000"); // 30s

export async function POST(request: NextRequest) {
  try {
    // Check API key
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid API key" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { url } = body;

    // Validate URL
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    if (!isValidHttpUrl(url)) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Check host allowlist/denylist
    const parsedUrl = new URL(url);
    if (!isAllowedHost(parsedUrl.hostname)) {
      return NextResponse.json({ error: "Host not allowed" }, { status: 400 });
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    // Fetch the resource
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; DirectMediaDownloader/1.0)",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch resource: ${response.status}` },
        { status: 400 }
      );
    }

    // Check content type
    const contentType = response.headers.get("content-type") || "";
    if (!isValidContentType(contentType)) {
      return NextResponse.json({ error: "Not video/image" }, { status: 400 });
    }

    // Check content length if available
    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > MAX_BYTES) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    // Generate safe filename
    const filename = extractSafeFilename(url, contentType);

    // Get the response body
    if (!response.body) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }

    // Create a new response with the file content
    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);

    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    // Stream the response with size checking
    const reader = response.body.getReader();
    let totalBytes = 0;
    const chunks: Uint8Array[] = [];

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        totalBytes += value.length;

        // Enforce max bytes even if content-length wasn't provided
        if (totalBytes > MAX_BYTES) {
          return NextResponse.json(
            { error: "File too large" },
            { status: 400 }
          );
        }

        chunks.push(value);
      }

      // Combine all chunks
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const combined = new Uint8Array(totalLength);
      let offset = 0;

      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }

      return new NextResponse(combined, { headers });
    } catch (streamError) {
      console.error("Streaming error:", streamError);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    if (error.name === "AbortError") {
      return NextResponse.json(
        { error: "Timeout fetching resource" },
        { status: 408 }
      );
    }

    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}