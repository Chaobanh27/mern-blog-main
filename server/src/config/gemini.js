import { GoogleGenAI } from '@google/genai'
import { env } from '~/config/environment'

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })

async function main(prompt) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  })
  return response.text
}

export default main