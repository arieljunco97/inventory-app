import styled from 'styled-components'
import { useTheme } from '../context/ThemeContext'
import { useMovements } from '../hooks/useMovements'
import { MovementHistory } from '../components/organisms/MovementHistory'

export function Movements() {
  const { theme } = useTheme()
  const { movements, loading } = useMovements()

  if (loading) return <p style={{ color: theme.text }}>Cargando...</p>

  return (
    <Container>
      <Header theme={theme}>
        <h1>Historial de Movimientos</h1>
        <p>Registro de entradas y salidas de stock</p>
      </Header>
      
      <MovementHistory movements={movements} />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const Header = styled.div`
  h1 {
    color: ${({ theme }) => theme.text};
    font-size: 1.75rem;
    margin-bottom: 0.25rem;
  }
  p { color: ${({ theme }) => theme.textSecondary}; }
`