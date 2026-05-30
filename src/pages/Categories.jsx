import { useState } from 'react'
import styled from 'styled-components'
import { useTheme } from '../context/ThemeContext'
import { useCategories } from '../hooks/useCategories'
import { useAuth } from '../context/AuthContext'
import { CategoryForm } from '../components/organisms/CategoryForm'
import { FaPlus,  FaEdit,  FaTrash, FaTools, FaBolt, FaHardHat, FaFaucet, FaPaintRoller, FaCog, FaBox, FaWrench, FaHammer} from 'react-icons/fa'

const iconMap = {
  FaTools: FaTools,
  FaBolt: FaBolt,
  FaHardHat: FaHardHat,
  FaFaucet: FaFaucet,
  FaPaintRoller: FaPaintRoller,
  FaCog: FaCog,
  FaBox: FaBox,
  FaWrench: FaWrench,
  FaHammer: FaHammer,
}

export function Categories() {
  const { theme } = useTheme()
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories()
  const { isAdmin } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  const handleSubmit = async (data) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data)
    } else {
      await addCategory(data)
    }
    setShowForm(false)
    setEditingCategory(null)
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Eliminar esta categoria? Los productos quedaran sin categoria.')) {
      await deleteCategory(id)
    }
  }

  if (!isAdmin) {
    return (
      <Container>
        <Message theme={theme}>
          Solo los administradores pueden gestionar categorias.
        </Message>
      </Container>
    )
  }

  if (loading) return <p style={{ color: theme.text }}>Cargando...</p>

  return (
    <Container>
      <Header theme={theme}>
        <div>
          <h1>Categorias</h1>
          <p>Organiza tus productos por categorias</p>
        </div>
        <Button onClick={() => { setEditingCategory(null); setShowForm(true) }} theme={theme}>
          <FaPlus /> Nueva Categoria
        </Button>
      </Header>

      <Grid>
        {categories.map(cat => {
          const IconComponent = iconMap[cat.icono] || FaBox
          return (
            <Card key={cat.id} theme={theme}>
              <IconBox theme={theme}>
                <IconComponent />
              </IconBox>
              <Info>
                <h3>{cat.nombre}</h3>
                <p>{cat.descripcion || 'Sin descripcion'}</p>
              </Info>

<Actions>
                <IconBtn color="#3b82f6" onClick={() => handleEdit(cat)}>
                  <FaEdit />
                </IconBtn>
                <IconBtn color="#ef4444" onClick={() => handleDelete(cat.id)}>
                  <FaTrash />
                </IconBtn>
</Actions>            </Card>
          )
        })}
      </Grid>

      {categories.length === 0 && (
        <EmptyState theme={theme}>
          No hay categorias creadas
        </EmptyState>
      )}

      {showForm && (
        <CategoryForm 
          category={editingCategory}
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditingCategory(null) }}
        />
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

  &:hover { background: ${({ theme }) => theme.primaryHover}; }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
`

const Card = styled.div`
  background: ${({ theme }) => theme.bgSecondary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`

const IconBox = styled.div`
  width: 48px;
  height: 48px;
  background: ${({ theme }) => `${theme.primary}20`};
  color: ${({ theme }) => theme.primary};
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
`

const Info = styled.div`
  flex: 1;
  min-width: 0;
  
  h3 {
    color: #fff;
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }
  
  p {
    color: #888;
    font-size: 0.8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
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

  &:hover {
    background: ${({ color }) => color};
    color: white;
  }
`

const EmptyState = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  padding: 3rem;
`

const Message = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  text-align: center;
  padding: 3rem;
  background: ${({ theme }) => theme.bgSecondary};
  border-radius: 0.75rem;
`