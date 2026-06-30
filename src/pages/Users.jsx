import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { supabase } from '../supabase/client'
import { 
  FaUserPlus, 
  FaEdit, 
  FaTrash,
  FaUserCheck, 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaShieldAlt,
  FaUserSlash 
} from 'react-icons/fa'

export function Users() {
  const { theme } = useTheme()
  const { createUser, profile } = useAuth()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre_completo: '',
    rol: 'empleado'
  })
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
  setLoading(true)
  const { data, error } = await supabase
    .from('perfiles')
    .select('*')
    .order('creado_en', { ascending: false })
  if (!error) setUsers(data || [])
  setLoading(false)
}

  const openCreate = () => {
    setEditingUser(null)
    setFormData({ email: '', password: '', nombre_completo: '', rol: 'empleado' })
    setFormError('')
    setShowForm(true)
  }

  const openEdit = (user) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      password: '',
      nombre_completo: user.nombre_completo || '',
      rol: user.rol
    })
    setFormError('')
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)

    if (editingUser) {
      const { error } = await supabase
        .from('perfiles')
        .update({
          nombre_completo: formData.nombre_completo,
          rol: formData.rol,
        })
        .eq('id', editingUser.id)

      if (error) {
        setFormError(error.message)
      } else {
        setShowForm(false)
        fetchUsers()
      }

    } else {
      const { data, error } = await createUser(
        formData.email,
        formData.password,
        formData.nombre_completo,
        formData.rol
      )

      if (error) {
        setFormError(error.message)
      } else {
        setShowForm(false)
        fetchUsers()
      }
    }

    setFormLoading(false)
  }

  const handleDesactivar = async (user) => {
  const nombre = user.nombre_completo || user.email
  if (!window.confirm(
    `¿Desactivar a ${nombre}? El usuario no podrá ingresar al sistema.`
  )) return

  const { error } = await supabase
    .from('perfiles')
    .update({ activo: false })
    .eq('id', user.id)

  if (error) alert('Error al desactivar: ' + error.message)
  else fetchUsers()
}

const handleReactivar = async (user) => {
  const nombre = user.nombre_completo || user.email
  if (!window.confirm(`¿Reactivar a ${nombre}?`)) return

  const { error } = await supabase
    .from('perfiles')
    .update({ activo: true })
    .eq('id', user.id)

  if (error) alert('Error al reactivar: ' + error.message)
  else fetchUsers()
}

  return (
    <Wrapper theme={theme}>
      <PageHeader>
        <HeaderText>
          <h1>Usuarios</h1>
          <p>Gestión de accesos al sistema</p>
        </HeaderText>
        <AddButton theme={theme} onClick={openCreate}>
          <FaUserPlus /> Nuevo Usuario
        </AddButton>
      </PageHeader>

      {loading ? (
        <Empty theme={theme}>Cargando usuarios...</Empty>
      ) : users.length === 0 ? (
        <Empty theme={theme}>No hay usuarios registrados.</Empty>
      ) : (
        <TableWrapper theme={theme}>
          <Table>
            <thead>
              <tr>
                <Th theme={theme}>Usuario</Th>
                <Th theme={theme}>Email</Th>
                <Th theme={theme}>Rol</Th>
                <Th theme={theme}>Estado</Th>
                <Th theme={theme}>Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <Tr key={u.id} $even={i % 2 === 0} $inactivo={!u.activo} theme={theme}>
                  <Td theme={theme}>
                    <UserCell>
                      <Avatar theme={theme} $inactivo={!u.activo}>
                        <FaUser />
                      </Avatar>
                      {u.nombre_completo || '—'}
                    </UserCell>
                  </Td>
                  <Td theme={theme}>{u.email}</Td>
                  <Td theme={theme}>
                    <RoleBadge $admin={u.rol === 'admin'} theme={theme}>
                      {u.rol === 'admin'
                        ? <><FaShieldAlt /> Admin</>
                        : 'Empleado'
                      }
                    </RoleBadge>
                  </Td>
                  <Td theme={theme}>
                    <StatusBadge $activo={u.activo} theme={theme}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </StatusBadge>
                  </Td>
                  <Td theme={theme}>
                    <Actions>
                      {u.activo && (
                        <ActionBtn
                          theme={theme}
                          onClick={() => openEdit(u)}
                          title="Editar usuario"
                        >
                          <FaEdit />
                        </ActionBtn>
                      )}
                      {u.activo && u.id !== profile?.id && (
                        <ActionBtn
                          $danger
                          theme={theme}
                          onClick={() => handleDesactivar(u)}
                          title="Desactivar usuario"
                        >
                          <FaTrash />
                        </ActionBtn>
                      )}
                      {!u.activo && (
                        <ActionBtn
                          $reactivar
                          theme={theme}
                          onClick={() => handleReactivar(u)}
                          title="Reactivar usuario"
                        >
                          <FaUserCheck />
                        </ActionBtn>
                      )}
                    </Actions>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}

      {showForm && (
        <Overlay onClick={() => setShowForm(false)}>
          <Modal theme={theme} onClick={(e) => e.stopPropagation()}>
            <ModalHeader theme={theme}>
              <h2>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              <CloseBtn theme={theme} onClick={() => setShowForm(false)}>✕</CloseBtn>
            </ModalHeader>

            <ModalForm onSubmit={handleSubmit}>

              <Field theme={theme}>
                <FaUser />
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={formData.nombre_completo}
                  onChange={e => setFormData({ ...formData, nombre_completo: e.target.value })}
                  required
                />
              </Field>

              {!editingUser && (
                <>
                  <Field theme={theme}>
                    <FaEnvelope />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </Field>

                  <Field theme={theme}>
                    <FaLock />
                    <input
                      type="password"
                      placeholder="Contraseña (mínimo 6 caracteres)"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                    />
                  </Field>
                </>
              )}

              <SelectWrapper theme={theme}>
                <label>Rol</label>
                <select
                  value={formData.rol}
                  onChange={e => setFormData({ ...formData, rol: e.target.value })}
                >
                  <option value="empleado">Empleado</option>
                  <option value="admin">Administrador</option>
                </select>
              </SelectWrapper>

              {formError && <FormError>{formError}</FormError>}

              <ModalActions>
                <CancelBtn
                  theme={theme}
                  type="button"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </CancelBtn>
                <SubmitBtn theme={theme} type="submit" disabled={formLoading}>
                  {formLoading
                    ? 'Guardando...'
                    : editingUser ? 'Guardar cambios' : 'Crear usuario'
                  }
                </SubmitBtn>
              </ModalActions>

            </ModalForm>
          </Modal>
        </Overlay>
      )}
    </Wrapper>
  )
}

// ── Styled Components ─────────────────────────────────────────────────────────

const Wrapper = styled.div`
  padding: 1.5rem;
  color: ${({ theme }) => theme.text};
`

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`

const HeaderText = styled.div`
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  p {
    font-size: 0.875rem;
    opacity: 0.6;
  }
`

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  transition: background 0.2s;
  &:hover { background: ${({ theme }) => theme.primaryHover}; }
`

const Empty = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  text-align: center;
  padding: 3rem;
`

const TableWrapper = styled.div`
  background: ${({ theme }) => theme.bgSecondary};
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  overflow-x: auto;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const Th = styled.th`
  text-align: left;
  padding: 0.875rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.textSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

const Tr = styled.tr`
  background: ${({ $even, theme }) => $even ? theme.bgSecondary : theme.bg};
  opacity: ${({ $inactivo }) => $inactivo ? 0.5 : 1};
  &:hover { background: ${({ theme }) => theme.border}; }
`

const Td = styled.td`
  padding: 0.875rem 1rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.75rem;
  flex-shrink: 0;
`

const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${({ $admin, theme }) =>
    $admin ? theme.primary + '22' : theme.border};
  color: ${({ $admin, theme }) =>
    $admin ? theme.primary : theme.textSecondary};
`

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`

const ActionBtn = styled.button`
  background: ${({ $danger, $reactivar, theme }) =>
    $danger ? '#ef444422' :
    $reactivar ? '#22c55e22' :
    theme.border};
  color: ${({ $danger, $reactivar }) =>
    $danger ? '#ef4444' :
    $reactivar ? '#22c55e' :
    'inherit'};
  padding: 0.4rem 0.6rem;
  border-radius: 0.4rem;
  font-size: 0.85rem;
  transition: all 0.2s;
  &:hover {
    background: ${({ $danger, $reactivar }) =>
      $danger ? '#ef4444' :
      $reactivar ? '#22c55e' :
      '#3b82f6'};
    color: white;
  }
`

// ── Modal ─────────────────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`

const Modal = styled.div`
  background: ${({ theme }) => theme.bgSecondary};
  border-radius: 1rem;
  width: 100%;
  max-width: 440px;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  h2 {
    font-size: 1.1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.text};
  }
`

const CloseBtn = styled.button`
  background: none;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1.1rem;
  &:hover { color: ${({ theme }) => theme.text}; }
`

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
`

const Field = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: ${({ theme }) => theme.bg};
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};

  svg {
    color: ${({ theme }) => theme.textSecondary};
    flex-shrink: 0;
  }

  input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    color: ${({ theme }) => theme.text};
    font-size: 0.95rem;
    &::placeholder { color: ${({ theme }) => theme.textSecondary}; }
  }
`

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    font-size: 0.8rem;
    font-weight: 600;
    color: ${({ theme }) => theme.textSecondary};
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  select {
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
    border: 1px solid ${({ theme }) => theme.border};
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.95rem;
    outline: none;
    option { background: ${({ theme }) => theme.bgSecondary}; }
  }
`

const FormError = styled.p`
  color: #ef4444;
  font-size: 0.85rem;
  text-align: center;
`

const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.25rem;
`

const CancelBtn = styled.button`
  background: ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  &:hover { opacity: 0.8; }
`

const SubmitBtn = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background 0.2s;
  &:hover:not(:disabled) { background: ${({ theme }) => theme.primaryHover}; }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  background: ${({ $activo }) => $activo ? '#22c55e22' : '#ef444422'};
  color: ${({ $activo }) => $activo ? '#22c55e' : '#ef4444'};
`