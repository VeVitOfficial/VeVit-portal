export function getCookie(name: string): string | null {
  try {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() ?? null
    }
  } catch {
    // ignore
  }
  return null
}

export function deleteCookie(name: string, domain = '.vevit.fun') {
  document.cookie = `${name}=; path=/; domain=${domain}; max-age=0`
  document.cookie = `${name}=; path=/; max-age=0`
}