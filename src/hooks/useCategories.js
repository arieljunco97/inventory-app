import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('activo', true)                          // ← solo activas
      .order('nombre')
    if (!error) setCategories(data)
    setLoading(false)
}

  const addCategory = async (category) => {
    const { data, error } = await supabase
      .from('categorias')
      .insert([category])
      .select()
      .single()

    if (!error) {
      setCategories(prev => [...prev, data])
    }
    return { data, error }
  }

  const updateCategory = async (id, updates) => {
    const { data, error } = await supabase
      .from('categorias')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (!error) {
      setCategories(prev => prev.map(c => c.id === id ? data : c))
    }
    return { data, error }
  }

  const deleteCategory = async (id) => {
    const { error } = await supabase
      .from('categorias')
      .update({ activo: false })                   // ← soft delete
      .eq('id', id)

    if (error) return { error }
    setCategories(prev => prev.filter(c => c.id !== id))
    return { error: null }
}

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory
  }
}