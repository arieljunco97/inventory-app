import styled from 'styled-components'
import { FaEdit, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import { useTheme } from '../../context/ThemeContext'
import { Device } from '../../styles/breakpoints'

export function ProductTable({ 
  products, 
  onEdit, 
  onDelete, 
  onMovement 
}) {
  const { theme } = useTheme()

  if (products.length === 0) {
    return (
      <EmptyState theme={theme}>
        No se encontraron productos
      </EmptyState>
    )
  }

  return (
    <TableContainer>
      <Table theme={theme}>
        <thead>
          <tr>
            <th>Producto</th>
            <th className="hide-mobile">Categoria</th>
            <th className="hide-mobile">Codigo</th>
            <th>Stock</th>
            <th className="hide-tablet">Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>
                <ProductName>
                  <strong>{product.nombre}</strong>
                  <small>{product.descripcion}</small>
                </ProductName>
              </td>
              <td className="hide-mobile">
                {product.categoria?.nombre || '-'}
              </td>
              <td className="hide-mobile">
                {product.codigo || '-'}
              </td>
              <td>
                <StockBadge low={product.stock <= product.stock_minimo}>
                  {product.stock} {product.unidad}
                </StockBadge>
              </td>
              <td className="hide-tablet">
                ${product.precio?.toFixed(2)}
              </td>
              <td>

<Actions>
                  <IconBtn 
                    color="#10b981" 
                    onClick={() => onMovement(product, 'entrada')}
                    title="Entrada de stock"
                  >
                    <FaArrowUp />
                  </IconBtn>
                  <IconBtn 
                    color="#ef4444" 
                    onClick={() => onMovement(product, 'salida')}
                    title="Salida de stock"
                  >
                    <FaArrowDown />
                  </IconBtn>
                  <IconBtn 
                    color="#3b82f6" 
                    onClick={() => onEdit(product)}
                    title="Editar"
                  >
                    <FaEdit />
                  </IconBtn>
                  <IconBtn 
                    color="#ef4444" 
                    onClick={() => onDelete(product.id)}
                    title="Eliminar"
                  >
                    <FaTrash />
                  </IconBtn>
</Actions>              </td>
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
    padding: 1rem;
    text-align: left;
  }

  th {
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.textSecondary};
    font-weight: 600;
    font-size: 0.875rem;
    white-space: nowrap;
  }

  td {
    color: ${({ theme }) => theme.text};
    border-top: 1px solid ${({ theme }) => theme.border};
  }

  tr:hover td {
    background: ${({ theme }) => theme.bg};
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

const ProductName = styled.div`
  strong { 
    display: block;
    white-space: nowrap;
  }
  small { 
    color: #888; 
    font-size: 0.8rem;
    display: block;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const StockBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  background: ${({ low }) => low ? '#fef3c7' : '#d1fae5'};
  color: ${({ low }) => low ? '#92400e' : '#065f46'};
`

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

const IconBtn = styled.button`
  background: ${({ color }) => `${color}20`};
  color: ${({ color }) => color};
  width: 32px;
  height: 32px;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: ${({ color }) => color};
    color: white;
  }
`

const EmptyState = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  padding: 3rem;
  background: ${({ theme }) => theme.bgSecondary};
  border-radius: 0.75rem;
`