import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { hasConsent } from './consent/manager'
import { useHasConsent } from './consent/useConsent'

type Theme = 'dark' | 'light'

const THEME_STORAGE_KEY = 'tycho-theme'

type ThemeContextValue = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/**
 * Only read a persisted theme when the functional category is granted — a value
 * left over from before a withdrawal must not silently come back.
 */
function getInitialTheme(): Theme {
  if (!hasConsent('functional')) return 'dark'
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // Storage unavailable — fall through to the default.
  }
  return 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const canPersist = useHasConsent('functional')

  // Applying the theme is unconditional: the toggle keeps working for this
  // visit whatever the consent state. Only *remembering* it needs consent.
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.add('light')
    } else {
      root.classList.remove('light')
    }
  }, [theme])

  // Persist while functional consent stands; purge the key the moment it is
  // withdrawn, so nothing of ours is left behind in localStorage.
  useEffect(() => {
    try {
      if (canPersist) {
        localStorage.setItem(THEME_STORAGE_KEY, theme)
      } else {
        localStorage.removeItem(THEME_STORAGE_KEY)
      }
    } catch {
      // Storage unavailable — the theme still applies for this page view.
    }
  }, [theme, canPersist])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
