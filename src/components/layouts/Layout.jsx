import { useState } from 'react'
import styled from 'styled-components'
import { Outlet } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { Sidebar, MenuButton } from './Sidebar'
import { Device } from '../../styles/breakpoints'

export function Layout() {
  const { theme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {  setSidebarOpen(!sidebarOpen)
  }

  return (
    <Container className={sidebarOpen ? 'active' : ''}>
      <Sidebar $isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <Main theme={theme} $isOpen={sidebarOpen}>
        <TopBar theme={theme}>
          <MenuButton onClick={toggleSidebar} theme={theme} />
        </TopBar>
        <Content>
          <Outlet />
        </Content>
      </Main>
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100vh;

  @media ${Device.tablet} {
    grid-template-columns: 65px 1fr;
    
    &.active {
      grid-template-columns: 220px 1fr;
    }
  }
`

const Main = styled.main`
  grid-column: 1;
  background: ${({ theme }) => theme.bg};
  min-height: 100vh;

  @media ${Device.tablet} {
    grid-column: 2;
  }
`

const TopBar = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  background: ${({ theme }) => theme.bgSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.border};

  @media ${Device.tablet} {
    padding: 1rem 2rem;
  }
`

const Content = styled.div`
  padding: 1.5rem;

  @media ${Device.tablet} {
    padding: 2rem;
  }
`