import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

    const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (!error && data) {
        setProfile(data)
      } else {
        setProfile(null)
      }
    } catch {
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        if (event === 'INITIAL_SESSION') return

        if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])



  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const createUser = async (email, password, nombreCompleto, rol = 'empleado') => {
    const { data: { session } } = await supabase.auth.getSession()

    const { data, error } = await supabase.functions.invoke('create-user', {
      body: { email, password, nombre_completo: nombreCompleto, rol },
      headers: {
        Authorization: `Bearer ${session?.access_token}`
      }
    })

    if (error) return { data: null, error }
    if (data?.error) return { data: null, error: { message: data.error } }

    return { data: data.data, error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const isAdmin = profile?.rol === 'admin'

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signIn,
      createUser,
      signOut,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)