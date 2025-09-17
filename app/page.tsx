'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [downloadMode, setDownloadMode] = useState<'direct' | 'extract'>('direct');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim() || !apiKey.trim()) {
      setStatus('error');
      setMessage('Please provide both URL and API key');
      return;
    }

    setStatus('loading');
    setMessage(downloadMode === 'extract' ? 'Extracting and downloading...' : 'Downloading...');

    try {
      const endpoint = downloadMode === 'extract' ? '/api/extract' : '/api/download';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Download failed');
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'download';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create blob and download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);

      setStatus('success');
      setMessage(`Successfully downloaded: ${filename}`);
      
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Download failed');
    }
  };

  return (
    <main className="container">
      <div className="alert alert-warning">
        <h3>⚠️ Important Legal Notice:</h3>
        <ul>
          <li><strong>Personal use only</strong> - Only download content you own or have permission to use</li>
          <li><strong>Respect copyright</strong> - Don't download copyrighted content without permission</li>
          <li><strong>Follow platform terms</strong> - Respect YouTube, Instagram, and other platform policies</li>
          <li><strong>Educational/backup purposes</strong> - Use responsibly for legitimate purposes</li>
        </ul>
      </div>

      <div className="card">
        <h3>Download Mode</h3>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <input
              type="radio"
              value="direct"
              checked={downloadMode === 'direct'}
              onChange={(e) => setDownloadMode(e.target.value as 'direct')}
              style={{ marginRight: '0.5rem' }}
            />
            <strong>Direct File Download</strong> - For direct .mp4, .jpg, etc. links
          </label>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="radio"
              value="extract"
              checked={downloadMode === 'extract'}
              onChange={(e) => setDownloadMode(e.target.value as 'extract')}
              style={{ marginRight: '0.5rem' }}
            />
            <strong>Video Extraction</strong> - For YouTube, Instagram, TikTok, etc. (requires yt-dlp)
          </label>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="url" className="label">
              File URL:
            </label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={downloadMode === 'extract' 
                ? "https://www.youtube.com/watch?v=... or https://www.instagram.com/reel/..."
                : "https://example.com/video.mp4"}
              className="input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="apiKey" className="label">
              API Key:
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="button"
          >
            {status === 'loading' ? 'Downloading...' : 'Download'}
          </button>
        </form>

        {message && (
          <div
            className={`alert ${
              status === 'success' ? 'alert-success' : 
              status === 'error' ? 'alert-error' : 
              'alert-info'
            }`}
          >
            {message}
          </div>
        )}
      </div>

      <div className="info-section">
        <h3>Supported File Types:</h3>
        <p><strong>Videos:</strong> .mp4, .webm, .avi, .mov, .mkv</p>
        <p><strong>Images:</strong> .jpg, .jpeg, .png, .gif, .webp, .svg</p>
        
        <h3>Example Working URLs:</h3>
        <ul>
          <li><code>https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4</code></li>
          <li><code>https://cdn.example.com/video.webm</code></li>
          <li><code>https://files.example.com/image.jpg</code></li>
        </ul>
        
        <h3>Why Social Media URLs Don't Work:</h3>
        <p>YouTube, Instagram, etc. don't provide direct file URLs. They serve videos through their players with complex authentication. You need to extract the actual video file URLs first.</p>
        
        <h3>Security Features:</h3>
        <ul>
          <li>API key authentication required</li>
          <li>File size limit (200MB default)</li>
          <li>Content type validation</li>
          <li>Request timeout protection</li>
        </ul>
      </div>
    </main>
  );
}