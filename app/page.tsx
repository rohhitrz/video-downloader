'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim() || !apiKey.trim()) {
      setStatus('error');
      setMessage('Please provide both URL and API key');
      return;
    }

    setStatus('loading');
    setMessage('Downloading...');

    try {
      const response = await fetch('/api/download', {
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
          <li><strong>Direct file URLs only</strong> - This works with direct links to video/image files</li>
          <li><strong>Not a social media downloader</strong> - For YouTube/Instagram, you need direct video URLs</li>
        </ul>
      </div>

      <div className="alert alert-info">
        <h3>💡 How to find direct video URLs:</h3>
        <ul>
          <li><strong>Right-click on videos</strong> and select "Copy video address" (if available)</li>
          <li><strong>Look for .mp4, .webm, .mov files</strong> in browser developer tools</li>
          <li><strong>Use browser extensions</strong> that can extract direct video URLs</li>
          <li><strong>Check CDN links</strong> - many sites serve videos from CDNs with direct URLs</li>
        </ul>
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
              placeholder="https://example.com/video.mp4"
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