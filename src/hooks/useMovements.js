import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import { useAuth } from '../context/AuthContext'

export function useMovements() {
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchMovements = async () => {
    const { data, error } = await supabase
      .from('movimientos')
      .select(`
        *,
        producto:productos(id, nombre, codigo),
        perfil:perfiles(nombre_completo, email)
      `)
      .order('creado_en', { ascending: false })
      .limit(100)

    if (!error) setMovements(data)
    setLoading(false)
  }

  const addMovement = async (productoId, tipo, cantidad, notas = '') => {
    // Obtener stock actual
    const { data: producto } = await supabase
      .from('productos')
      .select('stock')
      .eq('id', productoId)
      .single()

    const stockAnterior = producto?.stock || 0
    let stockNuevo = stockAnterior

    if (tipo === 'entrada') {
      stockNuevo = stockAnterior + cantidad
    } else if (tipo === 'salida') {
      stockNuevo = stockAnterior - cantidad
    } else {
      stockNuevo = cantidad // ajuste directo
    }

    // Crear movimiento
    const { data: movimiento, error: movError } = await supabase
      .from('movimientos')
      .insert([{
        producto_id: productoId,
        usuario_id: user.id,
        tipo,
        cantidad,
        stock_anterior: stockAnterior,
        stock_nuevo: stockNuevo,
        notas
      }])
      .select(`
        *,
        producto:productos(id, nombre, codigo),
        perfil:perfiles(nombre_completo, email)
      `)
      .single()

    if (movError) return { error: movError }

    // Actualizar stock del producto
    const { error: updateError } = await supabase
      .from('productos')
      .update({ stock: stockNuevo })
      .eq('id', productoId)

    if (!updateError) {
      setMovements(prev => [movimiento, ...prev])
    }

    return { data: movimiento, error: updateError }
  }

  useEffect(() => {
    fetchMovements()
  }, [])

  return {
    movements,
    loading,
    fetchMovements,
    addMovement
  }
}