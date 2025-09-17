export function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isDeniedHost(host: string): boolean {
  const denylist = process.env.DENYLIST_HOSTNAMES?.split(',') || [];
  
  return denylist.some(pattern => {
    if (pattern.startsWith('*.')) {
      const domain = pattern.slice(2);
      return host === domain || host.endsWith('.' + domain);
    }
    return host === pattern;
  });
}

export function isAllowedHost(host: string): boolean {
  const allowlist = process.env.ALLOWED_HOSTNAMES?.split(',').filter(h => h.trim()) || [];
  
  // If no allowlist specified, allow all except denied hosts
  if (allowlist.length === 0) {
    return !isDeniedHost(host);
  }
  
  // Check if host is in allowlist
  const isInAllowlist = allowlist.some(pattern => {
    if (pattern.startsWith('*.')) {
      const domain = pattern.slice(2);
      return host === domain || host.endsWith('.' + domain);
    }
    return host === pattern;
  });
  
  return isInAllowlist && !isDeniedHost(host);
}

export function isValidContentType(contentType: string): boolean {
  if (!contentType) return false;
  const ct = contentType.toLowerCase();
  return ct.startsWith('video/') || ct.startsWith('image/');
}