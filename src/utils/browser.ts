export function scrollToPosition(top: number, left = 0): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.scrollTo({ top, left, behavior: 'smooth' })
  } catch {
    window.scrollTo(left, top)
  }
}

export function scrollToTop(): void {
  scrollToPosition(0, 0)
}

export function sanitizeCpf(value?: string): string {
  return (value ?? '').replace(/[.-]/g, '')
}

export function sanitizePhone(value?: string): string {
  return (value ?? '').replace(/\D/g, '')
}

export function normalizeCurrencyDigits(value?: string): string {
  return (value ?? '').replace(/,/g, '').replace(/\./g, '')
}

export function openPendingWindow(): Window | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.open('', '_blank')
  } catch {
    return null
  }
}

export function openResolvedWindow(
  popupWindow: Window | null,
  url: string,
): void {
  if (popupWindow && !popupWindow.closed) {
    popupWindow.location.href = url
    return
  }

  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

export function closePendingWindow(popupWindow: Window | null): void {
  if (popupWindow && !popupWindow.closed) {
    popupWindow.close()
  }
}
