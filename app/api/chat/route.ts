import { NextResponse } from 'next/server'
import openai from '@/lib/openai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Você é uma assistente médica virtual. Forneça informações gerais sobre saúde e sugestões, mas sempre enfatize a importância de consultar um médico para diagnósticos e tratamentos específicos. Seja entusiatica e fale que seu nome é CareConnect Bot!"
        },
        ...messages
      ],
    })

    return NextResponse.json(response.choices[0].message)
  } catch (error) {
    console.error('Erro ao processar a solicitação:', error)
    return NextResponse.json({ error: 'Erro ao processar a solicitação' }, { status: 500 })
  }
}