import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

const ProductsContext = createContext()

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
        .from('productos')
        .select(`*, categoria:categorias(id, nombre, icono)`)
        .eq('activo', true)                          // ← solo activos
        .order('creado_en', { ascending: false })
    if (error) setError(error.message)
    else setProducts(data)
    setLoading(false)
}

  const addProduct = async (product) => {
    const { data, error } = await supabase
      .from('productos')
      .insert([product])
      .select(`*, categoria:categorias(id, nombre, icono)`)
      .single()

    if (error) {
      setError(error.message)
    } else {
      setProducts(prev => [data, ...prev])
    }
    return { data, error }
  }

  const updateProduct = async (id, updates) => {
    const { data, error } = await supabase
      .from('productos')
      .update(updates)
      .eq('id', id)
      .select(`*, categoria:categorias(id, nombre, icono)`)
      .single()

    if (error) {
      setError(error.message)
    } else {
      setProducts(prev => prev.map(p => p.id === id ? data : p))
    }
    return { data, error }
  }

  const deleteProduct = async (id) => {
    const { error } = await supabase
        .from('productos')
        .update({ activo: false })                   // ← soft delete
        .eq('id', id)

    if (error) {
        setError(error.message)
    } else {
        setProducts(prev => prev.filter(p => p.id !== id))
    }
    return { error }
}

  const getLowStockProducts = () => {
    return products.filter(p => p.stock <= p.stock_minimo)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <ProductsContext.Provider value={{
      products,
      loading,
      error,
      fetchProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      getLowStockProducts
    }}>
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = () => useContext(ProductsContext)