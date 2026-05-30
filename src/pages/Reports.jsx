import styled from 'styled-components'
import { useTheme } from '../context/ThemeContext'

export function Reports() {
  const { theme } = useTheme()
  return (
    <Container>
      <h1 style={{ color: theme.text }}>Reportes</h1>
      <p style={{ color: theme.textSecondary }}>Estadísticas y reportes (próximamente)</p>
    </Container>
  )
}

const Container = styled.div``