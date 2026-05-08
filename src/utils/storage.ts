const STORAGE_PREFIX = '@Funssest8'

const memoryStorage = new Map<string, string>()

const canUseLocalStorage = (): boolean =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

export const storageKey = (key: string): string => `${STORAGE_PREFIX}:${key}`

export function getStorageItem(
  key: string,
  legacyKeys: string[] = [],
): string | null {
  const keys = [storageKey(key), ...legacyKeys]

  for (const currentKey of keys) {
    try {
      if (canUseLocalStorage()) {
        const value = window.localStorage.getItem(currentKey)

        if (value !== null) {
          return value
        }
      }
    } catch {
      const fallbackValue = memoryStorage.get(currentKey)

      if (fallbackValue !== undefined) {
        return fallbackValue
      }
    }
  }

  return null
}

export function setStorageItem(key: string, value: string): void {
  const normalizedKey = storageKey(key)

  try {
    if (canUseLocalStorage()) {
      window.localStorage.setItem(normalizedKey, value)
      memoryStorage.delete(normalizedKey)
      return
    }
  } catch {
    // fallback below
  }

  memoryStorage.set(normalizedKey, value)
}

export function removeStorageItem(
  key: string,
  legacyKeys: string[] = [],
): void {
  const keys = [storageKey(key), ...legacyKeys]

  keys.forEach(currentKey => {
    try {
      if (canUseLocalStorage()) {
        window.localStorage.removeItem(currentKey)
      }
    } catch {
      // fallback below
    }

    memoryStorage.delete(currentKey)
  })
}

export function removeStorageItems(keys: string[]): void {
  keys.forEach(key => removeStorageItem(key))
}

export function readStorageJson<T>(
  key: string,
  fallback: T,
  legacyKeys: string[] = [],
): T {
  const storedValue = getStorageItem(key, legacyKeys)

  if (!storedValue) {
    return fallback
  }

  try {
    return JSON.parse(storedValue) as T
  } catch {
    return fallback
  }
}

export function writeStorageJson<T>(key: string, value: T): void {
  setStorageItem(key, JSON.stringify(value))
}
