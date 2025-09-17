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
        <h3>⚠️ Important Disclaimers:</h3>
        <ul>
          <li>Direct videos/images only (.mp4, .webm, .jpg, .png, etc.)</li>
          <li>Private/personal use only. Do not download content you don't own.</li>
          <li>Not for YouTube, Instagram, TikTok, or other streaming platforms.</li>
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
        <div className="alert alert-warning">
          <h3>⚠️ Important Disclaimers:</h3>
          <ul>
            <li>Direct videos/images only (.mp4, .webm, .jpg, .png, etc.)</li>
            <li>Private/personal use only. Do not download content you don't own.</li>
            <li>Not for YouTube, Instagram, TikTok, or other streaming platforms.</li>
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
        
        <h3>Security Features:</h3>
        <ul>
          <li>API key authentication required</li>
          <li>File size limit (200MB default)</li>
          <li>Content type validation</li>
          <li>Blocked streaming platforms</li>
          <li>Request timeout protection</li>
        </ul>
      </div>
    </main>
  );
}