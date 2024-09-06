'use client'

import { useState, useEffect, useRef } from 'react'
import { Mic, Send } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Assistente() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    const newMessage: Message = { role: 'user', content: input }
    setMessages(prevMessages => [...prevMessages, newMessage])
    setInput('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, newMessage] }),
      })

      if (!response.ok) {
        throw new Error('Falha na comunicação com o assistente')
      }

      const data = await response.json()
      setMessages(prevMessages => [...prevMessages, data])
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const speakMessage = (content: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(content)
      utterance.lang = 'pt-BR'
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      speechSynthesis.speak(utterance)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-theme(space.20))] p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Assistente Virtual Médico</h1>
      <div className="flex-1 bg-white rounded-lg shadow-lg p-4 mb-4 overflow-y-auto max-h-[calc(100vh-theme(space.64))]">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            Faça uma pergunta para começar a conversa.
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-3 rounded-lg ${message.role === 'user' ? 'bg-[#FF6666] text-white' : 'bg-gray-100 text-gray-800'}`}>
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
              </div>
              {message.role === 'assistant' && (
                <button
                  onClick={() => speakMessage(message.content)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  disabled={isSpeaking}
                >
                  <Mic size={16} />
                </button>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex bg-white rounded-full shadow-md mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 p-3 rounded-l-full focus:outline-none text-gray-800 bg-white border border-gray-300"
          placeholder="Digite sua dúvida médica..."
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          className={`px-4 py-2 rounded-r-full focus:outline-none flex items-center justify-center ${
            isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#FF6666] hover:bg-[#FF4444] text-white'
          }`}
          disabled={isLoading}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}