import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FaTimes } from 'react-icons/fa'
import { useTheme } from '../../context/ThemeContext'

const iconOptions = [
  { value: 'FaTools', label: 'Herramientas' },
  { value: 'FaBolt', label: 'Electricidad' },
  { value: 'FaHardHat', label: 'Albanileria' },
  { value: 'FaFaucet', label: 'Plomeria' },
  { value: 'FaPaintRoller', label: 'Pinturas' },
  { value: 'FaCog', label: 'Ferreteria' },
  { value: 'FaBox', label: 'General' },
  { value: 'FaWrench', label: 'Llave' },
  { value: 'FaHammer', label: 'Martillo' },
]

export function CategoryForm({ category, onSubmit, onClose }) {
  const { theme } = useTheme()
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    icono: 'FaBox'
  })

  useEffect(() => {
    if (category) {
      setForm({
        nombre: category.nombre || '',
        descripcion: category.descripcion || '',
        icono: category.icono || 'FaBox'
      })
    }
  }, [category])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <ModalOverlay onClick={onClose}>
      <Modal theme={theme} onClick={e => e.stopPropagation()}>
        <ModalHeader theme={theme}>
          <h2>{category ? 'Editar Categoria' : 'Nueva Categoria'}</h2>
          <CloseBtn onClick={onClose}><FaTimes /></CloseBtn>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup theme={theme}>
            <label>Nombre *</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej: Herramientas Electricas"
              required
            />
          </FormGroup>

          <FormGroup theme={theme}>
            <label>Descripcion</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Descripcion de la categoria"
              rows={3}
            />
          </FormGroup>

          <FormGroup theme={theme}>
            <label>Icono</label>
            <select
              value={form.icono}
              onChange={(e) => setForm({ ...form, icono: e.target.value })}
            >
              {iconOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FormGroup>

          <ModalFooter theme={theme}>
            <CancelBtn type="button" onClick={onClose} theme={theme}>
              Cancelar
            </CancelBtn>
            <SubmitBtn type="submit" theme={theme}>
              {category ? 'Guardar' : 'Crear'}
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

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

    &:focus {
      border-color: ${({ theme }) => theme.primary};
    }
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
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.border};

  &:hover { background: ${({ theme }) => theme.border}; }
`

const SubmitBtn = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;

  &:hover { background: ${({ theme }) => theme.primaryHover}; }
`