import styled from 'styled-components'
import { FaExclamationTriangle } from 'react-icons/fa'
import { useTheme } from '../../context/ThemeContext'

export function StockAlert({ products = [] }) {
  const { theme } = useTheme()

  if (products.length === 0) {
    return (
      <EmptyState theme={theme}>
        <FaExclamationTriangle />
        <p>No hay productos con stock bajo</p>
      </EmptyState>
    )
  }

  return (
    <Container>
      {products.map(product => (
        <AlertItem key={product.id} theme={theme}>
          <Info theme={theme}>
            <strong>{product.nombre}</strong>
            <small>{product.categoria?.nombre || 'Sin categoria'}</small>
          </Info>
          <StockBadge>
            {product.stock} / {product.stock_minimo}
          </StockBadge>
        </AlertItem>
      ))}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const AlertItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.bg};
  border-radius: 0.5rem;
  border-left: 3px solid #f59e0b;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;

  strong {
    color: ${({ theme }) => theme.text};
    font-size: 0.9rem;
  }

  small {
    color: ${({ theme }) => theme.textSecondary};
    font-size: 0.75rem;
  }
`

const StockBadge = styled.span`
  background: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: ${({ theme }) => theme.textSecondary};
  gap: 0.5rem;

  svg {
    font-size: 1.5rem;
    opacity: 0.5;
  }
`