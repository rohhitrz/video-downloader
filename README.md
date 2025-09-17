# Direct Media Downloader

A secure, responsive Next.js application for downloading direct video and image files with built-in safeguards, user authentication, and dark/light theme support.

## Features

- ✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ✅ **Dark/Light Theme** - Toggle between themes with system preference detection
- ✅ **Dual Download Modes**:
  - **Direct File Download** - For direct .mp4, .jpg, etc. links
  - **Video Extraction** - For YouTube, Instagram, TikTok, etc. (requires yt-dlp)
- ✅ **API Key Authentication** - Secure API key required
- ✅ **File size limits** (200MB default)
- ✅ **Content type validation**
- ✅ **Request timeout protection**
- ✅ **Safe filename extraction**
- ✅ **Legal safeguards** - Built-in warnings and responsible use guidelines

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Copy environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```

3. **Edit `.env.local` with your API key:**
   ```env
   # App Configuration
   API_KEY=your-secure-api-key-here
   ```

4. **For video extraction (optional):**
   Install yt-dlp for social media video extraction:
   ```bash
   # Using pip (recommended)
   pip install yt-dlp
   
   # Or using homebrew on macOS
   brew install yt-dlp
   
   # Or using pipx
   pipx install yt-dlp
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## Environment Variables

### Required
- `API_KEY` - Required API key for download authentication

### Optional
- `MAX_BYTES` - Maximum file size in bytes (default: 200MB)
- `FETCH_TIMEOUT_MS` - Request timeout in milliseconds (default: 30s)
- `ALLOWED_HOSTNAMES` - Comma-separated list of allowed hosts (empty = allow all except denylist)
- `DENYLIST_HOSTNAMES` - Comma-separated list of blocked hosts

## Security

This tool includes multiple security layers:

- **API key authentication** - API key required for downloads
- **File type validation** - Only video/image files allowed
- **Size limits** - Prevent abuse with configurable limits
- **Platform denylist** - Blocks streaming services automatically
- **Timeout protection** - Prevents hanging requests
- **Host validation** - Allowlist/denylist support

## Responsive Design

The app is fully responsive and works great on:
- 📱 **Mobile phones** (320px+)
- 📱 **Tablets** (768px+)
- 💻 **Desktop** (1024px+)

## Theme Support

- 🌙 **Dark theme** - Easy on the eyes
- ☀️ **Light theme** - Clean and bright
- 🔄 **Auto-detection** - Respects system preferences
- 💾 **Persistent** - Remembers your choice

## Usage

### Direct File Downloads
Use the "Direct File Download" mode for:
- Direct video files: `https://example.com/video.mp4`
- Direct image files: `https://example.com/image.jpg`
- Any direct media file URL

### Video Extraction (yt-dlp)
Use the "Video Extraction" mode for:
- YouTube videos: `https://www.youtube.com/watch?v=...`
- Instagram posts/reels: `https://www.instagram.com/p/...`
- TikTok videos: `https://www.tiktok.com/@user/video/...`
- Twitter videos: `https://twitter.com/user/status/...`
- And many other platforms supported by yt-dlp

**Note:** Video extraction requires yt-dlp to be installed on your system.

## Supported Platforms (Video Extraction)

yt-dlp supports 1000+ sites including:
- YouTube, YouTube Music
- Instagram (posts, reels, stories)
- TikTok
- Twitter/X
- Facebook
- Vimeo
- Twitch
- And many more...

## Legal Notice

⚠️ **Important:** This tool is for personal, educational, and backup purposes only.

- Only download content you own or have explicit permission to download
- Respect copyright laws and intellectual property rights
- Follow the terms of service of the platforms you're downloading from
- Use responsibly and ethically
- Consider supporting content creators through official channels

The developers are not responsible for any misuse of this tool.
