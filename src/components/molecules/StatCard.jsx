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
  padding: 2rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  transition: transform 0.2s, box-shadow 0.2s;
  
  
  position: relative;
  overflow: hidden;


  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${({ theme }) => theme.primary};
  } 

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`

const IconBox = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 0.75rem;
  background: ${({ color }) => `${color}20`};
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  
  span {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.textSecondary};
  }
  
  strong {
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.text};
  }
`