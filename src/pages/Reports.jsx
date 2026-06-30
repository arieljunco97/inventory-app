import { useMemo } from 'react'
import styled from 'styled-components'
import { useTheme } from '../context/ThemeContext'
import { useProducts } from '../context/ProductsContext'
import { useMovements } from '../context/MovementsContext'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts'
import { FaChartBar, FaBoxes, FaExchangeAlt, FaExclamationTriangle } from 'react-icons/fa'

const PIE_COLORS = ['#22c55e', '#16a34a', '#4ade80', '#86efac', '#bbf7d0', '#f59e0b', '#ef4444']

export function Reports() {
  const { theme } = useTheme()
  const { products } = useProducts()
  const { movements } = useMovements()

  const stockByCategory = useMemo(() => {
    const map = {}
    products.forEach(p => {
      const cat = p.categoria?.nombre || 'Sin categoría'
      map[cat] = (map[cat] || 0) + p.stock
    })
    return Object.entries(map).map(([name, stock]) => ({ name, stock }))
  }, [products])

  const productsByCategory = useMemo(() => {
    const map = {}
    products.forEach(p => {
      const cat = p.categoria?.nombre || 'Sin categoría'
      map[cat] = (map[cat] || 0) + 1
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [products])

  const movementsByDay = useMemo(() => {
    const map = {}
    const today = new Date()
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
      map[key] = { fecha: key, entradas: 0, salidas: 0 }
    }
    movements.forEach(m => {
      const fecha = new Date(m.creado_en).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
      if (map[fecha]) {
        if (m.tipo === 'entrada') map[fecha].entradas++
        else if (m.tipo === 'salida') map[fecha].salidas++
      }
    })
    return Object.values(map)
  }, [movements])

  const kpis = useMemo(() => {
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0)
    const lowStock = products.filter(p => p.stock <= p.stock_minimo).length
    const entradas = movements.filter(m => m.tipo === 'entrada').length
    const salidas = movements.filter(m => m.tipo === 'salida').length
    return { totalStock, lowStock, entradas, salidas }
  }, [products, movements])

  return (
    <Container>
      <PageHeader theme={theme}>
        <FaChartBar style={{ color: theme.primary, fontSize: '1.75rem' }} />
        <div>
          <h1>Reportes</h1>
          <p>Estadísticas y análisis del inventario</p>
        </div>
      </PageHeader>

      <KpiGrid>
        <KpiCard theme={theme}>
          <KpiIcon color="#22c55e"><FaBoxes /></KpiIcon>
          <KpiData>
            <KpiValue theme={theme}>{kpis.totalStock}</KpiValue>
            <KpiLabel theme={theme}>Unidades en Stock</KpiLabel>
          </KpiData>
        </KpiCard>
        <KpiCard theme={theme}>
          <KpiIcon color="#f59e0b"><FaExclamationTriangle /></KpiIcon>
          <KpiData>
            <KpiValue theme={theme}>{kpis.lowStock}</KpiValue>
            <KpiLabel theme={theme}>Productos Stock Bajo</KpiLabel>
          </KpiData>
        </KpiCard>
        <KpiCard theme={theme}>
          <KpiIcon color="#16a34a"><FaExchangeAlt /></KpiIcon>
          <KpiData>
            <KpiValue theme={theme}>{kpis.entradas}</KpiValue>
            <KpiLabel theme={theme}>Entradas Totales</KpiLabel>
          </KpiData>
        </KpiCard>
        <KpiCard theme={theme}>
          <KpiIcon color="#ef4444"><FaExchangeAlt /></KpiIcon>
          <KpiData>
            <KpiValue theme={theme}>{kpis.salidas}</KpiValue>
            <KpiLabel theme={theme}>Salidas Totales</KpiLabel>
          </KpiData>
        </KpiCard>
      </KpiGrid>

      <ChartsGrid>
        <ChartCard theme={theme}>
          <ChartTitle theme={theme}>Stock por Categoría</ChartTitle>
          {stockByCategory.length === 0 ? (
            <EmptyMsg theme={theme}>Sin datos aún</EmptyMsg>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stockByCategory} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                <XAxis dataKey="name" tick={{ fill: theme.textSecondary, fontSize: 12 }} angle={-25} textAnchor="end" interval={0} />
                <YAxis tick={{ fill: theme.textSecondary, fontSize: 12 }} />
                <Tooltip contentStyle={{ background: theme.bgSecondary, border: `1px solid ${theme.border}`, color: theme.text }} />
                <Bar dataKey="stock" fill={theme.primary} radius={[4, 4, 0, 0]} name="Stock" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard theme={theme}>
          <ChartTitle theme={theme}>Productos por Categoría</ChartTitle>
          {productsByCategory.length === 0 ? (
            <EmptyMsg theme={theme}>Sin datos aún</EmptyMsg>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={productsByCategory} cx="50%" cy="45%" outerRadius={90} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {productsByCategory.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: theme.bgSecondary, border: `1px solid ${theme.border}`, color: theme.text }} />
                <Legend wrapperStyle={{ color: theme.textSecondary, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </ChartsGrid>

      <ChartCard theme={theme}>
        <ChartTitle theme={theme}>Movimientos — Últimos 14 días</ChartTitle>
        {movements.length === 0 ? (
          <EmptyMsg theme={theme}>Sin movimientos registrados</EmptyMsg>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={movementsByDay} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
              <XAxis dataKey="fecha" tick={{ fill: theme.textSecondary, fontSize: 11 }} />
              <YAxis tick={{ fill: theme.textSecondary, fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: theme.bgSecondary, border: `1px solid ${theme.border}`, color: theme.text }} />
              <Legend wrapperStyle={{ color: theme.textSecondary, fontSize: 12 }} />
              <Line type="monotone" dataKey="entradas" stroke="#22c55e" strokeWidth={2} dot={false} name="Entradas" />
              <Line type="monotone" dataKey="salidas" stroke="#ef4444" strokeWidth={2} dot={false} name="Salidas" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {kpis.lowStock > 0 && (
        <ChartCard theme={theme}>
          <ChartTitle theme={theme}>⚠️ Productos con Stock Bajo</ChartTitle>
          <Table>
            <thead>
              <Tr theme={theme} header>
                <Th theme={theme}>Producto</Th>
                <Th theme={theme}>Categoría</Th>
                <Th theme={theme}>Stock actual</Th>
                <Th theme={theme}>Stock mínimo</Th>
              </Tr>
            </thead>
            <tbody>
              {products.filter(p => p.stock <= p.stock_minimo).map(p => (
                <Tr key={p.id} theme={theme}>
                  <Td theme={theme}>{p.nombre}</Td>
                  <Td theme={theme}>{p.categoria?.nombre || '—'}</Td>
                  <Td theme={theme}><Badge danger>{p.stock}</Badge></Td>
                  <Td theme={theme}>{p.stock_minimo}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </ChartCard>
      )}
    </Container>
  )
}

const Container = styled.div`display: flex; flex-direction: column; gap: 1.75rem;`

const PageHeader = styled.div`
  display: flex; align-items: center; gap: 1rem;
  h1 { color: ${({ theme }) => theme.text}; font-size: 1.75rem; margin-bottom: 0.2rem; }
  p  { color: ${({ theme }) => theme.textSecondary}; }
`
const KpiGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;`
const KpiCard = styled.div`
  background: ${({ theme }) => theme.bgSecondary}; border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.75rem; padding: 1.25rem 1.5rem; display: flex; align-items: center; gap: 1rem;
`
const KpiIcon = styled.div`
  width: 48px; height: 48px; border-radius: 0.5rem;
  background: ${({ color }) => color}22; color: ${({ color }) => color};
  display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0;
`
const KpiData = styled.div`display: flex; flex-direction: column;`
const KpiValue = styled.span`font-size: 1.75rem; font-weight: 700; color: ${({ theme }) => theme.text}; line-height: 1;`
const KpiLabel = styled.span`font-size: 0.8rem; color: ${({ theme }) => theme.textSecondary}; margin-top: 0.25rem;`
const ChartsGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;`
const ChartCard = styled.div`
  background: ${({ theme }) => theme.bgSecondary}; border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.75rem; padding: 1.5rem;
`
const ChartTitle = styled.h2`color: ${({ theme }) => theme.text}; font-size: 1rem; font-weight: 600; margin-bottom: 1.25rem;`
const EmptyMsg = styled.p`color: ${({ theme }) => theme.textSecondary}; text-align: center; padding: 3rem 0;`
const Table = styled.table`width: 100%; border-collapse: collapse;`
const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ header, theme }) => header ? theme.bg : 'transparent'};
`
const Th = styled.th`color: ${({ theme }) => theme.textSecondary}; font-size: 0.8rem; text-align: left; padding: 0.6rem 0.75rem; font-weight: 600; text-transform: uppercase;`
const Td = styled.td`color: ${({ theme }) => theme.text}; padding: 0.75rem; font-size: 0.9rem;`
const Badge = styled.span`
  background: ${({ danger }) => danger ? '#fee2e2' : '#d1fae5'};
  color: ${({ danger }) => danger ? '#991b1b' : '#065f46'};
  padding: 0.2rem 0.6rem; border-radius: 1rem; font-size: 0.8rem; font-weight: 600;
`