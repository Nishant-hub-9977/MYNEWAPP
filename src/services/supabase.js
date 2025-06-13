import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const auth = {
  signUp: (email, password) => supabase.auth.signUp({ email, password }),
  signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
  signOut: () => supabase.auth.signOut(),
  getUser: () => supabase.auth.getUser(),
  onAuthStateChange: (callback) => supabase.auth.onAuthStateChange(callback)
}

// Database helpers
export const db = {
  // User profiles
  createProfile: (userId, profileData) => 
    supabase.from('user_profiles').insert({ id: userId, ...profileData }),
  
  getProfile: (userId) => 
    supabase.from('user_profiles').select('*').eq('id', userId).single(),
  
  updateProfile: (userId, updates) => 
    supabase.from('user_profiles').update(updates).eq('id', userId),

  // Strategies
  createStraddleStrategy: (userId, strategyData) =>
    supabase.from('sensex_straddle_strategies').insert({ user_id: userId, ...strategyData }).select().single(),
  
  getStraddleStrategies: (userId) =>
    supabase.from('sensex_straddle_strategies').select('*').eq('user_id', userId),
  
  updateStraddleStrategy: (strategyId, updates) =>
    supabase.from('sensex_straddle_strategies').update(updates).eq('id', strategyId),

  // Executions
  createExecution: (executionData) =>
    supabase.from('strategy_executions').insert(executionData).select().single(),
  
  getExecutions: (userId) =>
    supabase.from('strategy_executions')
      .select(`
        *,
        sensex_straddle_strategies!inner(user_id)
      `)
      .eq('sensex_straddle_strategies.user_id', userId),
  
  updateExecution: (executionId, updates) =>
    supabase.from('strategy_executions').update(updates).eq('id', executionId),

  // Positions
  createPosition: (positionData) =>
    supabase.from('positions').insert(positionData).select().single(),
  
  getPositions: (executionId) =>
    supabase.from('positions').select('*').eq('execution_id', executionId),
  
  updatePosition: (positionId, updates) =>
    supabase.from('positions').update(updates).eq('id', positionId)
}