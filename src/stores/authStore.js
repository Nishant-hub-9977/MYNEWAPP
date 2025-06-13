import { create } from 'zustand'
import { auth, db } from '../services/supabase'

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ isLoading: loading }),

  // Auth methods
  signIn: async (email, password) => {
    try {
      set({ isLoading: true })
      const { data, error } = await auth.signIn(email, password)
      
      if (error) throw error
      
      // Fetch user profile
      if (data.user) {
        const { data: profile } = await db.getProfile(data.user.id)
        set({ user: data.user, profile, isAuthenticated: true })
      }
      
      return { success: true }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: error.message }
    } finally {
      set({ isLoading: false })
    }
  },

  signUp: async (email, password, additionalData = {}) => {
    try {
      set({ isLoading: true })
      const { data, error } = await auth.signUp(email, password)
      
      if (error) throw error
      
      // Create user profile
      if (data.user) {
        await db.createProfile(data.user.id, {
          first_name: additionalData.firstName || '',
          last_name: additionalData.lastName || '',
          subscription_tier: 'free'
        })
      }
      
      return { success: true }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error: error.message }
    } finally {
      set({ isLoading: false })
    }
  },

  signOut: async () => {
    try {
      await auth.signOut()
      set({ user: null, profile: null, isAuthenticated: false })
      return { success: true }
    } catch (error) {
      console.error('Sign out error:', error)
      return { success: false, error: error.message }
    }
  },

  // Initialize auth state
  initialize: async () => {
    try {
      const { data: { user } } = await auth.getUser()
      
      if (user) {
        const { data: profile } = await db.getProfile(user.id)
        set({ user, profile, isAuthenticated: true })
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
    } finally {
      set({ isLoading: false })
    }
  }
}))