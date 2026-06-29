import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// AuthContext handles login state for the entire app.
// It exposes: user (Supabase auth record), staff (our custom staff table row),
// loading (true while the session is being checked), signIn, and signOut.
//
// There are TWO user concepts here — do not confuse them:
//   • "user"  → Supabase Auth user (email + password, managed in Supabase dashboard)
//   • "staff" → a row in the "staff" table in our database, linked to the user by user_id
//
// A staff member needs BOTH: a Supabase auth account AND a matching row in the staff table.
// The admin panel (AdminUsers page) creates both at the same time.
// If someone can log in but sees nothing, their staff row is probably missing.
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null)
  const [staff, setStaff]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // On first load, check if there's already an active session (e.g. page refresh)
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      if (data.session?.user) fetchStaff(data.session.user.id)
      else setLoading(false)
    })

    // Listen for login/logout events and keep state in sync
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchStaff(session.user.id)
      else { setStaff(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchStaff = async (userId) => {
    const { data } = await supabase
      .from('staff')
      .select('*, stations(id,name,slug)')
      .eq('user_id', userId)
      .single()
    setStaff(data)
    setLoading(false)
  }

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ user, staff, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
