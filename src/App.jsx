import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ProductsProvider } from './context/ProductsContext'
import { MovementsProvider } from './context/MovementsContext'
import { GlobalStyles } from './styles/GlobalStyles'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProductsProvider>
          <MovementsProvider>
            <GlobalStyles />
            <AppRoutes />
          </MovementsProvider>
        </ProductsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App