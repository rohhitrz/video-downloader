import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

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

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Check if yt-dlp is available and get its path
    let ytDlpPath;
    try {
      const { stdout } = await execAsync("which yt-dlp");
      ytDlpPath = stdout.trim();
    } catch {
      return NextResponse.json(
        { 
          error: "yt-dlp not installed. Please install it first: pip install yt-dlp" 
        },
        { status: 503 }
      );
    }

    // Get video info first (without downloading)
    const infoCommand = `"${ytDlpPath}" --dump-json --no-download "${url}"`;
    
    let videoInfo;
    try {
      const { stdout, stderr } = await execAsync(infoCommand, { 
        timeout: FETCH_TIMEOUT_MS 
      });
      
      console.log('yt-dlp stdout:', stdout);
      console.log('yt-dlp stderr:', stderr);
      
      // Clean the stdout and find the JSON part
      const lines = stdout.trim().split('\n');
      let jsonLine = '';
      
      // Find the line that looks like JSON (starts with {)
      for (const line of lines) {
        if (line.trim().startsWith('{')) {
          jsonLine = line.trim();
          break;
        }
      }
      
      if (!jsonLine) {
        throw new Error('No JSON output found from yt-dlp');
      }
      
      videoInfo = JSON.parse(jsonLine);
    } catch (error: any) {
      console.error('yt-dlp error details:', error);
      return NextResponse.json(
        { 
          error: `Failed to extract video info: ${error.message}. This might not be a supported video URL.` 
        },
        { status: 400 }
      );
    }

    // Check file size if available
    if (videoInfo.filesize && videoInfo.filesize > MAX_BYTES) {
      return NextResponse.json(
        { 
          error: `File too large: ${Math.round(videoInfo.filesize / 1024 / 1024)}MB. Max allowed: ${Math.round(MAX_BYTES / 1024 / 1024)}MB` 
        },
        { status: 400 }
      );
    }

    // Download the video to a temporary location
    const timestamp = Date.now();
    const tempFile = `/tmp/download_${timestamp}.%(ext)s`;
    
    const downloadCommand = `"${ytDlpPath}" -f "best[filesize<${MAX_BYTES}]" --no-playlist -o "${tempFile}" "${url}"`;
    
    try {
      await execAsync(downloadCommand, { 
        timeout: FETCH_TIMEOUT_MS 
      });
      
      // Find the actual downloaded file
      const { stdout: lsOutput } = await execAsync(`ls /tmp/download_${timestamp}.*`);
      const actualFile = lsOutput.trim().split('\n')[0];
      
      if (!actualFile) {
        return NextResponse.json(
          { error: "Download completed but file not found" },
          { status: 500 }
        );
      }

      // Read the file and return it
      const fs = require('fs');
      const fileBuffer = fs.readFileSync(actualFile);
      
      // Clean up temp file
      fs.unlinkSync(actualFile);
      
      // Determine content type based on file extension
      const ext = actualFile.split('.').pop()?.toLowerCase();
      let contentType = 'application/octet-stream';
      
      if (ext === 'mp4') contentType = 'video/mp4';
      else if (ext === 'webm') contentType = 'video/webm';
      else if (ext === 'mkv') contentType = 'video/x-matroska';
      else if (ext === 'avi') contentType = 'video/x-msvideo';
      else if (ext === 'mov') contentType = 'video/quicktime';
      
      // Generate filename
      const title = videoInfo.title || 'download';
      const safeTitle = title.replace(/[<>:"/\\|?*]/g, '_').substring(0, 100);
      const filename = `${safeTitle}.${ext}`;

      const headers = new Headers();
      headers.set('Content-Type', contentType);
      headers.set('Content-Disposition', `attachment; filename="${filename}"`);
      headers.set('Content-Length', fileBuffer.length.toString());

      return new NextResponse(fileBuffer, { headers });
      
    } catch (error: any) {
      return NextResponse.json(
        { 
          error: `Download failed: ${error.message}` 
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Extract error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}