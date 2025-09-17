# Direct Media Downloader

A secure, responsive Next.js application for downloading direct video and image files with built-in safeguards, user authentication, and dark/light theme support.

## Features

- ✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ✅ **Dark/Light Theme** - Toggle between themes with system preference detection

- ✅ **Download direct video/image files** (.mp4, .webm, .jpg, .png, etc.)
- ✅ **API Key Authentication** - Secure API key required
- ✅ **File size limits** (200MB default)
- ✅ **Content type validation**
- ✅ **Blocked streaming platforms** (YouTube, Instagram, TikTok, etc.)
- ✅ **Request timeout protection**
- ✅ **Safe filename extraction**

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

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

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

## Legal Notice

This tool is for personal use only. Only download content you own or have permission to download. Respect copyright laws and terms of service.# video-downloader
