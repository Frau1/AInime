import { supabase } from '../lib/supabase'

export const watchlistService = {

  addAnime: async (
    userId: string,
    anime: any
  ) => {

    return await supabase
      .from('watchlists')
      .insert({
        user_id: userId,
        anime_id: anime.id,
        anime_title: anime.title,
        anime_image: anime.image,
        status: 'plan_to_watch'
      })
  },

  getWatchlist: async () => {

    return await supabase
      .from('watchlists')
      .select('*')
      .order('created_at', {
        ascending: false
      })
  },

  deleteAnime: async (
    id: number
  ) => {

    return await supabase
      .from('watchlists')
      .delete()
      .eq('id', id)
  }

}