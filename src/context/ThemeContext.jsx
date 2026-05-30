import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext()

export const themes = {
  light: {
    bg: '#f5f5f5',
    bgSecondary: '#ffffff',
    text: '#1a1a2e',
    textSecondary: '#666666',
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    border: '#e5e7eb',
    sidebar: '#1a1a2e'
  },
  dark: {
    bg: '#0f0f1a',
    bgSecondary: '#1a1a2e',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    border: '#2d2d44',
    sidebar: '#0f0f1a'
  }
}

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState('dark')
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