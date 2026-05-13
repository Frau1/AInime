const BASE_URL = 'https://api.jikan.moe/v4'

export const animeService = {

  getTopAnime: async () => {

    const res = await fetch(
      `${BASE_URL}/top/anime`
    )

    const data = await res.json()

    return data.data
  },

  searchAnime: async (
    query: string
  ) => {

    const res = await fetch(
      `${BASE_URL}/anime?q=${query}`
    )

    const data = await res.json()

    return data.data
  },

  getAnimeById: async (
    id: number
  ) => {

    const res = await fetch(
      `${BASE_URL}/anime/${id}`
    )

    const data = await res.json()

    return data.data
  },

  getGenres: async () => {

    const res = await fetch(
      `${BASE_URL}/genres/anime`
    )

    const data = await res.json()

    return data.data
  }

}