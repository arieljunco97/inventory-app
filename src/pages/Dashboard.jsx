import { useMemo } from 'react'
import styled from 'styled-components'
import { useTheme } from '../context/ThemeContext'
import { useProducts } from '../context/ProductsContext'
import { useMovements } from '../context/MovementsContext'
import { StatCard } from '../components/molecules/StatCard'
import { StockAlert } from '../components/molecules/StockAlert'
import { 
  FaBoxes,
  FaBoxOpen, 
  FaExclamationTriangle, 
  FaArrowUp, 
  FaArrowDown,
  FaTags
} from 'react-icons/fa'

export function Dashboard() {
  const { theme } = useTheme()
  const { products, getLowStockProducts } = useProducts()
  const { movements } = useMovements()

  const stats = useMemo(() => {
    const lowStock = getLowStockProducts()
    const todayMovements = movements.filter(m => {
      const today = new Date().toDateString()
      return new Date(m.creado_en).toDateString() === today
    })
    const entries = todayMovements.filter(m => m.tipo === 'entrada').length
    const exits = todayMovements.filter(m => m.tipo === 'salida').length

    return {
      totalProducts: products.length,
      lowStockCount: lowStock.length,
      todayEntries: entries,
      todayExits: exits
    }
  }, [products, movements, getLowStockProducts])

  const lowStockProducts = getLowStockProducts().slice(0, 5)
  const recentMovements = movements.slice(0, 5)

  return (
    <Container>
      <Header theme={theme}>
        <h1>Panel de Control</h1>
        <p>Monitoreo y gestión del inventario en tiempo real</p>
      </Header>

      <StatsGrid>
        <StatCard 
          icon={FaBoxOpen} 
          label="Total Productos" 
          value={stats.totalProducts}
          color="#10b981"
        />
        <StatCard 
          icon={FaExclamationTriangle} 
          label="Stock Bajo" 
          value={stats.lowStockCount}
          color="#f59e0b"
        />
        <StatCard 
          icon={FaArrowUp} 
          label="Entradas Hoy" 
          value={stats.todayEntries}
          color="#16a34a"
        />
        <StatCard 
          icon={FaArrowDown} 
          label="Salidas Hoy" 
          value={stats.todayExits}
          color="#dc2626"
        />
      </StatsGrid>

      <Grid>
        <Section theme={theme}>
          <SectionHeader theme={theme}>
            <FaExclamationTriangle />
            <h2>Productos con Stock Bajo</h2>
          </SectionHeader>
          <StockAlert products={lowStockProducts} />
        </Section>

        <Section theme={theme}>
          <SectionHeader theme={theme}>
            <FaTags />
            <h2>Movimientos Recientes</h2>
          </SectionHeader>
          {recentMovements.length > 0 ? (
            <List>
              {recentMovements.map(mov => (
                <ListItem key={mov.id} theme={theme}>
                  <div>
                    <strong>{mov.producto?.nombre}</strong>
                    <small>{new Date(mov.creado_en).toLocaleDateString()}</small>
                  </div>
                  <MovementBadge $type={mov.tipo}>
                    {mov.tipo === 'entrada' ? '+' : '-'}{mov.cantidad}
                  </MovementBadge>
                </ListItem>
              ))}
            </List>
          ) : (
            <EmptyText theme={theme}>No hay movimientos recientes</EmptyText>
          )}
        </Section>
      </Grid>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const Header = styled.div`
  h1 {
    color: ${({ theme }) => theme.text};
    font-size: 1.75rem;
    margin-bottom: 0.25rem;
  }
  p { color: ${({ theme }) => theme.textSecondary}; }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
`

const Section = styled.div`
  background: ${({ theme }) => theme.bgSecondary};
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.border};
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  color: ${({ theme }) => theme.text};

  svg { color: ${({ theme }) => theme.primary}; }
  h2 { font-size: 1rem; }
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: ${({ theme }) => theme.bg};
  border-radius: 0.5rem;

  strong {
    color: ${({ theme }) => theme.text};
    display: block;
  }
  small {
    color: ${({ theme }) => theme.textSecondary};
    font-size: 0.75rem;
  }
`

const MovementBadge = styled.span`
  background: ${({ $type }) => $type === 'entrada' ? '#d1fae5' : '#fee2e2'};
  color: ${({ $type }) => $type === 'entrada' ? '#065f46' : '#991b1b'};
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
`

const EmptyText = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  text-align: center;
  padding: 2rem;
`