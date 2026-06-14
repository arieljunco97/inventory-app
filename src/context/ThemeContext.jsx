import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext()

export const themes = {
  light: {
    bg: '#f5f5f5',
    bgSecondary: '#dcfce7',
    text: '#1a1a2e',
    textSecondary: '#666666',
    primary: '#22c55e',
    primaryHover: '#16a34a',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    border: '#d1fae5',
    sidebar: '#052e16'
  },
  dark: {
    bg: '#0f0f1a',
    bgSecondary: '#14532d',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    primary: '#22c55e',
    primaryHover: '#16a34a',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    border: '#166534',
    sidebar: '#052e16'
  }
}

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState('light')
  const theme = themes[themeMode]

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)