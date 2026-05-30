import styled from 'styled-components'
import { useTheme } from '../../context/ThemeContext'
import { Device } from '../../styles/breakpoints'

export function MovementHistory({ movements = [] }) {
  const { theme } = useTheme()

  if (movements.length === 0) {
    return (
      <EmptyState theme={theme}>
        No hay movimientos registrados
      </EmptyState>
    )
  }

  return (
    <TableContainer>
      <Table theme={theme}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Producto</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th className="hide-mobile">Anterior</th>
            <th className="hide-mobile">Nuevo</th>
            <th className="hide-tablet">Usuario</th>
            <th className="hide-tablet">Notas</th>
          </tr>
        </thead>
        <tbody>
          {movements.map(mov => (
            <tr key={mov.id}>
              <td>
                <DateCell>
                  <span>{new Date(mov.creado_en).toLocaleDateString()}</span>
                  <small>{new Date(mov.creado_en).toLocaleTimeString()}</small>
                </DateCell>
              </td>
              <td>{mov.producto?.nombre || '-'}</td>
              <td>
                <TypeBadge type={mov.tipo}>{mov.tipo}</TypeBadge>
              </td>
              <td>
                <QuantityBadge type={mov.tipo}>
                  {mov.tipo === 'entrada' ? '+' : mov.tipo === 'salida' ? '-' : ''}
                  {mov.cantidad}
                </QuantityBadge>
              </td>
              <td className="hide-mobile">{mov.stock_anterior}</td>
              <td className="hide-mobile">{mov.stock_nuevo}</td>
              <td className="hide-tablet">
                {mov.perfil?.nombre_completo || mov.perfil?.email || '-'}
              </td>
              <td className="hide-tablet">{mov.notas || '-'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  )
}

const TableContainer = styled.div`
  overflow-x: auto;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.bgSecondary};
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};

  th, td {
    padding: 0.875rem 1rem;
    text-align: left;
  }

  th {
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.textSecondary};
    font-size: 0.8rem;
    font-weight: 600;
    white-space: nowrap;
  }

  td {
    color: ${({ theme }) => theme.text};
    border-top: 1px solid ${({ theme }) => theme.border};
    font-size: 0.875rem;
  }

  .hide-mobile {
    @media (max-width: 768px) {
      display: none;
    }
  }

  .hide-tablet {
    @media (max-width: 992px) {
      display: none;
    }
  }
`

const DateCell = styled.div`
  display: flex;
  flex-direction: column;
  
  span { font-size: 0.875rem; }
  small { 
    color: #888; 
    font-size: 0.75rem;
  }
`

const TypeBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  background: ${({ type }) => 
    type === 'entrada' ? '#d1fae5' : 
    type === 'salida' ? '#fee2e2' : '#fef3c7'};
  color: ${({ type }) => 
    type === 'entrada' ? '#065f46' : 
    type === 'salida' ? '#991b1b' : '#92400e'};
`

const QuantityBadge = styled.span`
  font-weight: 600;
  color: ${({ type }) => 
    type === 'entrada' ? '#10b981' : 
    type === 'salida' ? '#ef4444' : '#f59e0b'};
`

const EmptyState = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  padding: 3rem;
  background: ${({ theme }) => theme.bgSecondary};
  border-radius: 0.75rem;
`