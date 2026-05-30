import styled from 'styled-components'
import { useTheme } from '../../context/ThemeContext'

export function StatCard({ icon: Icon, label, value, color = "#3b82f6" }) {
  const { theme } = useTheme()

  return (
    <Container theme={theme}>
      <IconBox color={color}>
        <Icon />
      </IconBox>
      <Info theme={theme}>
        <span>{label}</span>
        <strong>{value}</strong>
      </Info>
    </Container>
  )
}

const Container = styled.div`
  background: ${({ theme }) => theme.bgSecondary};
  padding: 1.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`

const IconBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  background: ${({ color }) => `${color}20`};
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  
  span {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.textSecondary};
  }
  
  strong {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.text};
  }
`