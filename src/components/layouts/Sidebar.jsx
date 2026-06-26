import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { Device } from '../../styles/breakpoints'
import { 
  FaHome, 
  FaBox,
  FaBoxes, 
  FaTags, 
  FaExchangeAlt, 
  FaChartBar,
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes
} from 'react-icons/fa'

export function Sidebar({ $isOpen, toggleSidebar }) {
  const { theme, themeMode, toggleTheme } = useTheme()
  const { profile, signOut, isAdmin } = useAuth()

  const menuItems = [
    { path: '/', icon: FaHome, label: 'Panel de Control' },
    { path: '/productos', icon: FaBox, label: 'Productos' },
    { path: '/categorias', icon: FaTags, label: 'Categorias', adminOnly: true },
    { path: '/movimientos', icon: FaExchangeAlt, label: 'Movimientos' },
    { path: '/reportes', icon: FaChartBar, label: 'Reportes' },
  ]

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      toggleSidebar()
    }
  }

  return (
    <>
      <Overlay $isOpen={$isOpen} onClick={toggleSidebar} />
      
      <Container theme={theme} $isOpen={$isOpen}>
        <Header>
          <Logo theme={theme}>
            <FaBoxes />
            <LogoText isOpen={isOpen}>Inventrack</LogoText>
          </Logo>
          <CloseButton onClick={toggleSidebar} theme={theme}>
            <FaTimes />
          </CloseButton>
        </Header>

        <Nav>
          {menuItems.map(item => {
            if (item.adminOnly && !isAdmin) return null
            return (
              <NavItem 
                key={item.path} 
                to={item.path} 
                theme={theme}
                $isOpen={$isOpen}
                onClick={handleNavClick}
              >
                <item.icon />
                <NavText $isOpen={$isOpen}>{item.label}</NavText>
              </NavItem>
            )
          })}
        </Nav>

        <Footer theme={theme}>
          <UserInfo theme={theme} $isOpen={$isOpen}>
            <span>{profile?.nombre_completo || profile?.email}</span>
            <small>{profile?.rol}</small>
          </UserInfo>

          <FooterButtons>
            <IconButton onClick={toggleTheme} theme={theme} title="Cambiar tema">
              {themeMode === 'dark' ? <FaSun /> : <FaMoon />}
            </IconButton>
            <IconButton onClick={signOut} theme={theme} title="Cerrar sesion">
              <FaSignOutAlt />
            </IconButton>
          </FooterButtons>
        </Footer>
      </Container>
    </>
  )
}

export function MenuButton({ onClick, theme }) {
  return (
    <HamburgerButton onClick={onClick} theme={theme}>
      <FaBars />
    </HamburgerButton>
  )
}

const Overlay = styled.div`
  display: ${({ $isOpen }) => $isOpen ? 'block' : 'none'};
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;

  @media ${Device.tablet} {
    display: none;
  }
`

const Container = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  background: ${({ theme }) => theme.sidebar};
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  z-index: 999;
  transition: all 0.3s ease;

  width: 260px;
  transform: ${({ $isOpen }) => $isOpen ? 'translateX(0)' : 'translateX(-100%)'};

  @media ${Device.tablet} {
    transform: translateX(0);
    width: ${({ $isOpen }) => $isOpen ? '220px' : '65px'};
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${({ theme }) => theme.primary};
  font-size: 1.5rem;
  font-weight: 700;
  overflow: hidden;
  
  svg { 
    font-size: 1.75rem;
    flex-shrink: 0;
  }
`

const LogoText = styled.span`
  white-space: nowrap;
  opacity: ${({ $isOpen }) => $isOpen ? 1 : 0};
  transition: opacity 0.2s;

  @media ${Device.tablet} {
    opacity: ${({ $isOpen }) => $isOpen ? 1 : 0};
  }
`

const CloseButton = styled.button`
  display: flex;
  background: none;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1.25rem;

  @media ${Device.tablet} {
    display: none;
  }

  &:hover {
    color: ${({ theme }) => theme.text};
  }
`

const HamburgerButton = styled.button`
  display: flex;
  background: ${({ theme }) => theme.bgSecondary};
  color: ${({ theme }) => theme.text};
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 1.25rem;
  border: 1px solid ${({ theme }) => theme.border};

  @media ${Device.tablet} {
    display: flex;
  }

  &:hover {
    background: ${({ theme }) => theme.border};
  }
`

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  color: ${({ theme }) => theme.textSecondary};
  transition: all 0.2s;
  overflow: hidden;

  &:hover {
    background: ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text};
  }

  &.active {
    background: ${({ theme }) => theme.primary};
    color: white;
  }

  svg { 
    font-size: 1.25rem;
    flex-shrink: 0;
  }
`

const NavText = styled.span`
  white-space: nowrap;
  opacity: 1;

  @media ${Device.tablet} {
    opacity: ${({ $isOpen }) => $isOpen ? 1 : 0};
    width: ${({ $isOpen }) => $isOpen ? 'auto' : '0'};
  }
`

const Footer = styled.div`
  border-top: 1px solid ${({ theme }) => theme.border};
  padding-top: 1rem;
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  overflow: hidden;
  
  span { 
    color: ${({ theme }) => theme.text};
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  small { 
    color: ${({ theme }) => theme.textSecondary};
    text-transform: capitalize;
  }

  @media ${Device.tablet} {
    display: ${({ $isOpen }) => $isOpen ? 'flex' : 'none'};
  }
`

const FooterButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`

const IconButton = styled.button`
  background: ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  padding: 0.625rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
  }
`