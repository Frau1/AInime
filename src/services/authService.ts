import { supabase } from '../lib/supabase'

export const authService = {

  signUp: async (
    email: string,
    password: string,
    username: string
  ) => {

    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    })
  },

  signIn: async (
    email: string,
    password: string
  ) => {

    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
  },

  signOut: async () => {

    return await supabase.auth.signOut()
  }

}