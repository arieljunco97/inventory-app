import { createGlobalStyle } from 'styled-components'
import { useTheme } from '../context/ThemeContext'

const Styles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background-color: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
    transition: all 0.3s ease;
  }

  button {
    cursor: pointer;
    border: none;
    font-family: inherit;
  }

  input, select, textarea {
    font-family: inherit;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`

export function GlobalStyles() {
  const { theme } = useTheme()
  return <Styles theme={theme} />
}