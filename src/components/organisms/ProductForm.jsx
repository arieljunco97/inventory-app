import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FaTimes } from 'react-icons/fa'
import { useTheme } from '../../context/ThemeContext'
import { useCategories } from '../../hooks/useCategories'

const initialForm = {
  nombre: '',
  descripcion: '',
  categoria_id: '',
  codigo: '',
  stock: 0,
  stock_minimo: 5,
  precio: 0,
  costo: 0,
  unidad: 'unidad',
  ubicacion: ''
}

export function ProductForm({ product, onSubmit, onClose }) {
  const { theme } = useTheme()
  const { categories } = useCategories()
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    if (product) {
      setForm({
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        categoria_id: product.categoria_id || '',
        codigo: product.codigo || '',
        stock: product.stock || 0,
        stock_minimo: product.stock_minimo || 5,
        precio: product.precio || 0,
        costo: product.costo || 0,
        unidad: product.unidad || 'unidad',
        ubicacion: product.ubicacion || ''
      })
    } else {
      setForm(initialForm)
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const productData = {
      ...form,
      categoria_id: form.categoria_id || null,
      precio: parseFloat(form.precio),
      costo: parseFloat(form.costo),
      stock: parseInt(form.stock),
      stock_minimo: parseInt(form.stock_minimo)
    }
    onSubmit(productData)
  }

  return (
    <ModalOverlay onClick={onClose}>
      <Modal theme={theme} onClick={e => e.stopPropagation()}>
        <ModalHeader theme={theme}>
          <h2>{product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <CloseBtn onClick={onClose}><FaTimes /></CloseBtn>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGrid>
            <FormGroup theme={theme}>
              <label>Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup theme={theme}>
              <label>Codigo</label>
              <input
                type="text"
                name="codigo"
                value={form.codigo}
                onChange={handleChange}
                placeholder="SKU o codigo interno"
              />
            </FormGroup>

            <FormGroup theme={theme} full>
              <label>Descripcion</label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                rows={2}
              />
            </FormGroup>

            <FormGroup theme={theme}>
              <label>Categoria</label>
              <select
                name="categoria_id"
                value={form.categoria_id}
                onChange={handleChange}
              >
                <option value="">Sin categoria</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </FormGroup>

            <FormGroup theme={theme}>
              <label>Unidad</label>
              <select
                name="unidad"
                value={form.unidad}
                onChange={handleChange}
              >
                <option value="unidad">Unidad</option>
                <option value="kg">Kilogramo</option>
                <option value="m">Metro</option>
                <option value="m2">Metro cuadrado</option>
                <option value="litro">Litro</option>
                <option value="bolsa">Bolsa</option>
                <option value="caja">Caja</option>
                <option value="rollo">Rollo</option>
              </select>
            </FormGroup>

            <FormGroup theme={theme}>
              <label>Stock Actual</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
              />
            </FormGroup>

            <FormGroup theme={theme}>
              <label>Stock Minimo</label>
              <input
                type="number"
                name="stock_minimo"
                value={form.stock_minimo}
                onChange={handleChange}
                min="0"
              />
            </FormGroup>

            <FormGroup theme={theme}>
              <label>Costo</label>
              <input
                type="number"
                name="costo"
                step="0.01"
                value={form.costo}
                onChange={handleChange}
                min="0"
              />
            </FormGroup>

            <FormGroup theme={theme}>
              <label>Precio Venta</label>
              <input
                type="number"
                name="precio"
                step="0.01"
                value={form.precio}
                onChange={handleChange}
                min="0"
              />
            </FormGroup>

            <FormGroup theme={theme} full>
              <label>Ubicacion</label>
              <input
                type="text"
                name="ubicacion"
                value={form.ubicacion}
                onChange={handleChange}
                placeholder="Ej: Pasillo 3, Estante A"
              />
            </FormGroup>
          </FormGrid>

          <ModalFooter theme={theme}>
            <CancelBtn type="button" onClick={onClose} theme={theme}>
              Cancelar
            </CancelBtn>
            <SubmitBtn type="submit" theme={theme}>
              {product ? 'Guardar Cambios' : 'Crear Producto'}
            </SubmitBtn>
          </ModalFooter>
        </Form>
      </Modal>
    </ModalOverlay>
  )
}

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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  grid-column: ${({ full }) => full ? 'span 2' : 'auto'};

  @media (max-width: 500px) {
    grid-column: 1;
  }

  label {
    color: ${({ theme }) => theme.textSecondary};
    font-size: 0.875rem;
    font-weight: 500;
  }

  input, select, textarea {
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid ${({ theme }) => theme.border};
    outline: none;
    font-size: 0.9rem;
    transition: border-color 0.2s;

    &:focus {
      border-color: ${({ theme }) => theme.primary};
    }
  }
`

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`

const CancelBtn = styled.button`
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.border};
  transition: background 0.2s;

  &:hover { background: ${({ theme }) => theme.border}; }
`

const SubmitBtn = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background 0.2s;

  &:hover { background: ${({ theme }) => theme.primaryHover}; }
`