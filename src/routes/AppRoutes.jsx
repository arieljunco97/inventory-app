import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ProtectedRoute } from './ProtectedRoute'
import { Layout } from '../components/layouts/Layout'
import { Login } from '../pages/Login'
import { Dashboard } from '../pages/Dashboard'
import { Products } from '../pages/Products'
import { Categories } from '../pages/Categories'
import { Movements } from '../pages/Movements'
import { Reports } from '../pages/Reports'

export function AppRoutes() {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      color: '#fff',
      background: '#0f0f1a'
    }}>Cargando...</div>
   }

  return (
    <Routes>
      <Route path="/login" element={
        user ? <Navigate to="/" /> : <Login />
      } />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/categorias" element={<Categories />} />
          <Route path="/movimientos" element={<Movements />} />
          <Route path="/reportes" element={<Reports />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}