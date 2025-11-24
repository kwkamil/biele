// Get CSRF token from cookie for API requests
export function getCSRFToken(): string {
  const name = 'XSRF-TOKEN='
  const decodedCookie = decodeURIComponent(document.cookie)
  const cookies = decodedCookie.split(';')

  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.indexOf(name) === 0) {
      return decodeURIComponent(cookie.substring(name.length))
    }
  }

  // Fallback to meta tag
  const metaTag = document.querySelector('meta[name="csrf-token"]')
  return metaTag?.getAttribute('content') || ''
}

// Default headers for API requests with CSRF token
export function getAPIHeaders(additionalHeaders: Record<string, string> = {}): HeadersInit {
  return {
    'Accept': 'application/json',
    'X-XSRF-TOKEN': getCSRFToken(),
    ...additionalHeaders,
  }
}
