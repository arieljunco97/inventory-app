import { useState } from 'react'
import styled from 'styled-components'
import { useTheme } from '../context/ThemeContext'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { useMovements } from '../hooks/useMovements'
import { SearchBar } from '../components/molecules/SearchBar'
import { ProductTable } from '../components/organisms/ProductTable'
import { ProductForm } from '../components/organisms/ProductForm'
import { FaPlus, FaTimes } from 'react-icons/fa'

export function Products() {
  const { theme } = useTheme()
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts()
  const { categories } = useCategories()
  const { addMovement } = useMovements()
  
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  
  // Modal movimiento
  const [showMovementModal, setShowMovementModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [movementType, setMovementType] = useState('entrada')
  const [movementQty, setMovementQty] = useState(1)
  const [movementNotes, setMovementNotes] = useState('')

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) ||
                          p.codigo?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !categoryFilter || p.categoria_id === parseInt(categoryFilter)
    return matchesSearch && matchesCategory
  })

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Eliminar este producto?')) {
      await deleteProduct(id)
    }
  }

  const handleMovement = (product, type) => {
    setSelectedProduct(product)
    setMovementType(type)
    setMovementQty(1)
    setMovementNotes('')
    setShowMovementModal(true)
  }

  const handleFormSubmit = async (data) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, data)
    } else {
      await addProduct(data)
    }
    setShowForm(false)
    setEditingProduct(null)
  }

  const handleMovementSubmit = async (e) => {
    e.preventDefault()
    await addMovement(selectedProduct.id, movementType, parseInt(movementQty), movementNotes)
    setShowMovementModal(false)
  }

  if (loading) return <p style={{ color: theme.text }}>Cargando...</p>

  return (
    <Container>
      <Header theme={theme}>
        <div>
          <h1>Productos</h1>
          <p>Gestiona tu inventario de productos</p>
        </div>
        <Button onClick={() => { setEditingProduct(null); setShowForm(true) }} theme={theme}>
          <FaPlus /> Nuevo Producto
        </Button>
      </Header>

      <Filters>
        <SearchBar 
          value={search} 
          onChange={setSearch}
          placeholder="Buscar por nombre o codigo..."
        />
        <Select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          theme={theme}
        >
          <option value="">Todas las categorias</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </Select>
      </Filters>

      <ProductTable 
        products={filteredProducts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onMovement={handleMovement}
      />

      {showForm && (
        <ProductForm 
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onClose={() => { setShowForm(false); setEditingProduct(null) }}
        />
      )}

      {/* Modal Movimiento */}
      {showMovementModal && selectedProduct && (
        <ModalOverlay onClick={() => setShowMovementModal(false)}>
          <Modal theme={theme} onClick={e => e.stopPropagation()}>
            <ModalHeader theme={theme}>
              <h2>{movementType === 'entrada' ? 'Entrada' : 'Salida'} de Stock</h2>
              <CloseBtn onClick={() => setShowMovementModal(false)}><FaTimes /></CloseBtn>
            </ModalHeader>
            <Form onSubmit={handleMovementSubmit}>
              <Info theme={theme}>
                Producto: <strong>{selectedProduct.nombre}</strong>
                <br />
                Stock actual: <strong>{selectedProduct.stock} {selectedProduct.unidad}</strong>
              </Info>
              <FormGroup theme={theme}>
                <label>Cantidad</label>
                <input
                  type="number"
                  value={movementQty}
                  onChange={(e) => setMovementQty(e.target.value)}
                  min="1"
                  max={movementType === 'salida' ? selectedProduct.stock : undefined}
                  required
                />
              </FormGroup>
              <FormGroup theme={theme}>
                <label>Notas (opcional)</label>
                <textarea
                  value={movementNotes}
                  onChange={(e) => setMovementNotes(e.target.value)}
                  rows={2}
                  placeholder="Ej: Compra proveedor X"
                />
              </FormGroup>
              <ModalFooter theme={theme}>
                <CancelBtn type="button" onClick={() => setShowMovementModal(false)} theme={theme}>
                  Cancelar
                </CancelBtn>
                <ConfirmBtn type="submit" movementType={movementType}>
                  Confirmar {movementType === 'entrada' ? 'Entrada' : 'Salida'}
                </ConfirmBtn>
              </ModalFooter>
            </Form>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  
  h1 {
    color: ${({ theme }) => theme.text};
    font-size: 1.75rem;
    margin-bottom: 0.25rem;
  }
  p { color: ${({ theme }) => theme.textSecondary}; }
`

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background 0.2s;

  &:hover { background: ${({ theme }) => theme.primaryHover}; }
`

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`

const Select = styled.select`
  background: ${({ theme }) => theme.bgSecondary};
  color: ${({ theme }) => theme.text};
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  outline: none;
  min-width: 180px;
`

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`

const Modal = styled.div`
  background: ${({ theme }) => theme.bgSecondary};
  border-radius: 0.75rem;
  width: 100%;
  max-width: 400px;
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  h2 {
    color: ${({ theme }) => theme.text};
    font-size: 1.125rem;
  }
`

const CloseBtn = styled.button`
  background: none;
  color: #888;
  font-size: 1.25rem;
  display: flex;
  
  &:hover { color: #fff; }
`

const Form = styled.form`
  padding: 1.5rem;
`

const Info = styled.p`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.textSecondary};
  
  strong { color: ${({ theme }) => theme.text}; }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;

  label {
    color: ${({ theme }) => theme.textSecondary};
    font-size: 0.875rem;
  }

  input, textarea {
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid ${({ theme }) => theme.border};
    outline: none;

    &:focus { border-color: ${({ theme }) => theme.primary}; }
  }
`

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`

const CancelBtn = styled.button`
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};

  &:hover { background: ${({ theme }) => theme.border}; }
`

const ConfirmBtn = styled.button`
  background: ${({ movementType }) => movementType === 'entrada' ? '#10b981' : '#ef4444'};
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;

  &:hover {
    opacity: 0.9;
  }
`