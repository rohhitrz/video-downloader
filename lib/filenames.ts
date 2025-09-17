export function extractSafeFilename(url: string, contentType?: string): string {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    
    // Extract filename from URL path
    const segments = pathname.split('/');
    let filename = segments[segments.length - 1];
    
    // If no filename or just extension, generate one
    if (!filename || filename.startsWith('.')) {
      const ext = getExtensionFromContentType(contentType) || 'bin';
      filename = `download.${ext}`;
    }
    
    // Sanitize filename - remove dangerous characters
    filename = filename.replace(/[<>:"/\\|?*]/g, '_');
    
    // Ensure it has an extension
    if (!filename.includes('.')) {
      const ext = getExtensionFromContentType(contentType) || 'bin';
      filename += `.${ext}`;
    }
    
    return filename;
  } catch {
    const ext = getExtensionFromContentType(contentType) || 'bin';
    return `download.${ext}`;
  }
}

function getExtensionFromContentType(contentType?: string): string | null {
  if (!contentType) return null;
  
  const ct = contentType.toLowerCase();
  
  // Video types
  if (ct.includes('mp4')) return 'mp4';
  if (ct.includes('webm')) return 'webm';
  if (ct.includes('avi')) return 'avi';
  if (ct.includes('mov')) return 'mov';
  if (ct.includes('mkv')) return 'mkv';
  
  // Image types
  if (ct.includes('jpeg') || ct.includes('jpg')) return 'jpg';
  if (ct.includes('png')) return 'png';
  if (ct.includes('gif')) return 'gif';
  if (ct.includes('webp')) return 'webp';
  if (ct.includes('svg')) return 'svg';
  
  return null;
}