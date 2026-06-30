import { useState } from 'react'
import styled from 'styled-components'
import { useTheme } from '../context/ThemeContext'
import { useProducts } from '../context/ProductsContext'
import { useCategories } from '../hooks/useCategories'
import { useMovements } from '../context/MovementsContext'
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
  const [movementMotivo, setMovementMotivo] = useState('Venta')
  const [selectedIds, setSelectedIds] = useState([])
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [bulkQuantities, setBulkQuantities] = useState({})
  const [bulkMotivo, setBulkMotivo] = useState('Venta')
  const [bulkNotes, setBulkNotes] = useState('')
  const [bulkSubmitting, setBulkSubmitting] = useState(false)


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
  setMovementMotivo(type === 'entrada' ? 'Compra a proveedor' : 'Venta')
  setMovementNotes('')
  setShowMovementModal(true)
  }

  const handleToggleSelect = (id) => {
  setSelectedIds(prev => 
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  )
  }

  const handleClearSelection = () => {
    setSelectedIds([])
  }

  const handleOpenBulkModal = () => {
    // Precarga cantidad 1 para cada producto seleccionado
    const initialQuantities = {}
    selectedIds.forEach(id => { initialQuantities[id] = 1 })
    setBulkQuantities(initialQuantities)
    setBulkMotivo('Venta')
    setBulkNotes('')
    setShowBulkModal(true)
  }

  const handleBulkQuantityChange = (id, value) => {
    setBulkQuantities(prev => ({ ...prev, [id]: value }))
  }

  const selectedProductsForBulk = products.filter(p => selectedIds.includes(p.id))

  const handleBulkSubmit = async (e) => {
    e.preventDefault()
    setBulkSubmitting(true)

    for (const product of selectedProductsForBulk) {
      const qty = parseInt(bulkQuantities[product.id]) || 1
      const result = await addMovement(product.id, 'salida', qty, bulkMotivo, bulkNotes)
      if (result?.error) {
        alert(`Error al registrar movimiento de "${product.nombre}": ${result.error.message}`)
        setBulkSubmitting(false)
        return
      }
    }

    setBulkSubmitting(false)
    setShowBulkModal(false)
    setSelectedIds([])
  }


  const handleFormSubmit = async (data) => {
    let result
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, data)
    } else {
      result = await addProduct(data)
    }

    if (result.error) {
      alert('Error al guardar: ' + result.error.message)
      return  // NO cerrar el modal si falló
    }

    setShowForm(false)
    setEditingProduct(null)
}

  const handleMovementSubmit = async (e) => {
    e.preventDefault()
    const result = await addMovement(selectedProduct.id, movementType, parseInt(movementQty), movementMotivo, movementNotes)
    if (result?.error) {
      alert('Error al registrar movimiento: ' + result.error.message)
      return
    }
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

      {selectedIds.length > 0 && (
        <SelectionBar theme={theme}>
          <span>{selectedIds.length} producto{selectedIds.length > 1 ? 's' : ''} seleccionado{selectedIds.length > 1 ? 's' : ''}</span>
          <SelectionActions>
            <BulkButton onClick={handleOpenBulkModal} theme={theme}>
              Registrar salida en lote
            </BulkButton>
            <CancelSelectionBtn onClick={handleClearSelection} theme={theme}>
              Cancelar
            </CancelSelectionBtn>
          </SelectionActions>
        </SelectionBar>
      )}

      <ProductTable 
        products={filteredProducts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onMovement={handleMovement}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
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
              <CloseBtn onClick={() => setShowMovementModal(false)} theme={theme}><FaTimes /></CloseBtn>
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
                <label>Motivo</label>
                <select
                  value={movementMotivo}
                  onChange={(e) => setMovementMotivo(e.target.value)}
                >
                  <option value="Venta">Venta</option>
                  <option value="Compra a proveedor">Compra a proveedor</option>
                  <option value="Vencimiento">Vencimiento</option>
                  <option value="Rotura">Rotura</option>
                  <option value="Conteo fisico">Conteo físico</option>
                  <option value="Otro">Otro</option>
                </select>
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
                <ConfirmBtn type="submit" $movementType={movementType}>
                  Confirmar {movementType === 'entrada' ? 'Entrada' : 'Salida'}
                </ConfirmBtn>
              </ModalFooter>
            </Form>
          </Modal>
        </ModalOverlay>
      )}

      {showBulkModal && (
        <ModalOverlay onClick={() => setShowBulkModal(false)}>
          <BulkModal theme={theme} onClick={e => e.stopPropagation()}>
            <ModalHeader theme={theme}>
              <h2>Registrar salida — {selectedProductsForBulk.length} productos</h2>
              <CloseBtn onClick={() => setShowBulkModal(false)} theme={theme}><FaTimes /></CloseBtn>
            </ModalHeader>
            <Form onSubmit={handleBulkSubmit}>
              <BulkProductList>
                {selectedProductsForBulk.map(product => (
                  <BulkProductRow key={product.id} theme={theme}>
                    <BulkProductName theme={theme}>
                      {product.nombre}
                      <small>Stock actual: {product.stock} {product.unidad}</small>
                    </BulkProductName>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={bulkQuantities[product.id] || 1}
                      onChange={(e) => handleBulkQuantityChange(product.id, e.target.value)}
                      required
                    />
                  </BulkProductRow>
                ))}
              </BulkProductList>

              <FormGroup theme={theme}>
                <label>Motivo</label>
                <select
                  value={bulkMotivo}
                  onChange={(e) => setBulkMotivo(e.target.value)}
                >
                  <option value="Venta">Venta</option>
                  <option value="Compra a proveedor">Compra a proveedor</option>
                  <option value="Vencimiento">Vencimiento</option>
                  <option value="Rotura">Rotura</option>
                  <option value="Conteo fisico">Conteo físico</option>
                  <option value="Otro">Otro</option>
                </select>
              </FormGroup>

              <FormGroup theme={theme}>
                <label>Notas (opcional, se aplica a todos)</label>
                <textarea
                  value={bulkNotes}
                  onChange={(e) => setBulkNotes(e.target.value)}
                  rows={2}
                  placeholder="Ej: Lote de mayo, deposito 2"
                />
              </FormGroup>

              <ModalFooter theme={theme}>
                <CancelBtn type="button" onClick={() => setShowBulkModal(false)} theme={theme}>
                  Cancelar
                </CancelBtn>
                <SubmitBulkBtn type="submit" disabled={bulkSubmitting}>
                  {bulkSubmitting ? 'Guardando...' : 'Confirmar salida en lote'}
                </SubmitBulkBtn>
              </ModalFooter>
            </Form>
          </BulkModal>
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
  font-size: 0.9rem;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }

  option {
    background: ${({ theme }) => theme.bgSecondary};
    color: ${({ theme }) => theme.text};
  }
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
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1.25rem;
  display: flex;
  
  &:hover { color: ${({ theme }) => theme.text}; }
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
  background: ${({ $movementType }) => $movementType === 'entrada' ? '#10b981' : '#ef4444'};
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;

  &:hover {
    opacity: 0.9;
  }
`

const SelectionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  background: ${({ theme }) => theme.bgSecondary};
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 0.5rem;
  padding: 0.875rem 1.25rem;

  span {
    color: ${({ theme }) => theme.text};
    font-weight: 500;
    font-size: 0.9rem;
  }
`

const SelectionActions = styled.div`
  display: flex;
  gap: 0.75rem;
`

const BulkButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;

  &:hover { background: ${({ theme }) => theme.primaryHover}; }
`

const CancelSelectionBtn = styled.button`
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  font-size: 0.875rem;

  &:hover { background: ${({ theme }) => theme.border}; }
`

const BulkModal = styled.div`
  background: ${({ theme }) => theme.bgSecondary};
  border-radius: 0.75rem;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
`

const BulkProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  max-height: 240px;
  overflow-y: auto;
`

const BulkProductRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.625rem 0.75rem;
  background: ${({ theme }) => theme.bg};
  border-radius: 0.5rem;

  input {
    width: 80px;
    background: ${({ theme }) => theme.bgSecondary};
    color: ${({ theme }) => theme.text};
    padding: 0.5rem;
    border-radius: 0.375rem;
    border: 1px solid ${({ theme }) => theme.border};
    outline: none;
    text-align: center;
  }
`

const BulkProductName = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;

  small {
    color: ${({ theme }) => theme.textSecondary};
    font-size: 0.75rem;
  }
`

const SubmitBulkBtn = styled.button`
  background: #ef4444;
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;

  &:hover:not(:disabled) { opacity: 0.9; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`