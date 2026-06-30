import { useState } from 'react'
import styled from 'styled-components'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { FaBoxes, FaEnvelope, FaLock} from 'react-icons/fa'

export function Login() {
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { signIn} = useAuth()
  const { theme } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message)
    }
    setLoading(false)
  }

  return (
    <Container theme={theme}>
      <Card theme={theme}>
        <Logo theme={theme}>
          <FaBoxes />
          <span>Inventrack</span>
        </Logo>
        
        <Title theme={theme}>Iniciar Sesión</Title>

        <Form onSubmit={handleSubmit}>
          

          <InputGroup theme={theme}>
            <FaEnvelope />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup theme={theme}>
            <FaLock />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>

          {error && <Error>{error}</Error>}

          <Button type="submit" disabled={loading} theme={theme}>
            {loading ? 'Cargando...' : 'Entrar'}
          </Button>
        </Form>
        <Hint theme={theme}>
          Para acceder al sistema necesitás que un administrador te cree una cuenta.
        </Hint>

      </Card>
    </Container>
  )
}

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.bg};
`

const Card = styled.div`
  background: ${({ theme }) => theme.bgSecondary};
  padding: 2.5rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: ${({ theme }) => theme.primary};
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`

const Title = styled.h1`
  color: ${({ theme }) => theme.text};
  text-align: center;
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: ${({ theme }) => theme.bg};
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};

  svg {
    color: ${({ theme }) => theme.textSecondary};
  }

  input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    color: ${({ theme }) => theme.text};
    font-size: 1rem;

    &::placeholder {
      color: ${({ theme }) => theme.textSecondary};
    }
  }
`

const Button = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  padding: 0.875rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.5rem;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.primaryHover};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

const Error = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
`

const Hint = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.8rem;
  line-height: 1.4;
`