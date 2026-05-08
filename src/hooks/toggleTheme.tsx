import React, { createContext, useCallback, useContext } from 'react'

import { DefaultTheme, ThemeProvider } from 'styled-components'

import usePersistedState from './usePersistedState'

import light from '../styles/themes/light'
import dark from '../styles/themes/dark'

interface ToggleTheme {
  title: string
  description?: string
  background?: string
}

interface ToggleThemeContextData {
  theme: DefaultTheme

  toggleTheme(): void
}

const ToggleThemeContext = createContext<ToggleThemeContextData>(
  {} as ToggleThemeContextData,
)

const ToggleThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = usePersistedState<DefaultTheme>('theme', light)

  const toggleTheme = useCallback(() => {
    const newTheme = theme.title === 'light' ? dark : light
    setTheme(newTheme)
  }, [theme.title, setTheme])

  return (
    <ToggleThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ToggleThemeContext.Provider>
  )
}

function useToggleTheme(): ToggleThemeContextData {
  const context = useContext(ToggleThemeContext)
  if (!context) {
    throw new Error('useToggleTheme must be used within an ToggleThemeProvider')
  }
  return context
}

export { ToggleThemeProvider, useToggleTheme }
