import styled from 'styled-components'
import { FaSearch, FaTimes } from 'react-icons/fa'
import { useTheme } from '../../context/ThemeContext'

export function SearchBar({ value, onChange, placeholder = "Buscar..." }) {
  const { theme } = useTheme()

  return (
    <Container theme={theme}>
      <FaSearch />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <ClearButton onClick={() => onChange('')} theme={theme}>
          <FaTimes />
        </ClearButton>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: ${({ theme }) => theme.bgSecondary};
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  flex: 1;
  min-width: 250px;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: ${({ theme }) => theme.primary};
  }

  svg {
    color: ${({ theme }) => theme.textSecondary};
    font-size: 0.9rem;
  }

  input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    color: ${({ theme }) => theme.text};
    font-size: 0.9rem;

    &::placeholder {
      color: ${({ theme }) => theme.textSecondary};
    }
  }
`

const ClearButton = styled.button`
  background: none;
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text};
  }
`