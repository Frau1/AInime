import OpenAI from 'openai'
console.log(import.meta.env.VITE_OPENAI_API_KEY)

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

export const recommendationService = {
  async getRecommendations(prompt: string) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are an anime recommendation AI.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })

      return (
        completion.choices[0]?.message?.content ||
        'No recommendations found.'
      )

    } catch (err) {
      console.error(err)
      return 'Failed to generate recommendations.'
    }
  }
}