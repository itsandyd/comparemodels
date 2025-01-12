'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from 'axios'

const AI_MODELS = {
  anthropic: [
    { value: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet", description: "Latest Claude model with enhanced capabilities", context: "200K tokens", inputPrice: "$0.015/1K", outputPrice: "$0.075/1K" },
    { value: "anthropic/claude-3-5-haiku", label: "Claude 3.5 Haiku", context: "200K tokens", inputPrice: "$0.003/1K", outputPrice: "$0.015/1K" },
    { value: "anthropic/claude-3-haiku", label: "Claude 3 Haiku", context: "200K tokens", inputPrice: "$0.003/1K", outputPrice: "$0.015/1K" }
  ],
  google: [
    { value: "google/gemini-pro-1.5", label: "Gemini Pro 1.5", description: "Advanced model for complex tasks", context: "32K tokens", inputPrice: "$0.001/1K", outputPrice: "$0.002/1K" },
    { value: "google/gemini-flash-1.5", label: "Gemini Flash 1.5", description: "Fast, efficient model for quick responses", context: "32K tokens", inputPrice: "$0.0005/1K", outputPrice: "$0.001/1K" },
    { value: "google/gemini-flash-1.5-8b", label: "Gemini Flash 1.5 8B", description: "Lightweight model optimized for speed", context: "32K tokens", inputPrice: "$0.0003/1K", outputPrice: "$0.0006/1K" }
  ],
  meta: [
    { value: "meta-llama/llama-3.2-1b-instruct", label: "LLaMA 3.2 1B", description: "Efficient small model for basic tasks", context: "4K tokens", inputPrice: "Free", outputPrice: "Free" },
    { value: "meta-llama/llama-3.2-3b-instruct", label: "LLaMA 3.2 3B", description: "Balanced model for general use", context: "4K tokens", inputPrice: "Free", outputPrice: "Free" },
    { value: "meta-llama/llama-3.1-8b-instruct", label: "LLaMA 3.1 8B", description: "Powerful open-source model", context: "4K tokens", inputPrice: "Free", outputPrice: "Free" },
    { value: "meta-llama/llama-3.1-70b-instruct", label: "LLaMA 3.1 70B", description: "Large-scale model for complex tasks", context: "4K tokens", inputPrice: "Free", outputPrice: "Free" }
  ],
  openai: [
    { value: "openai/gpt-4o", label: "GPT-4", description: "Most capable GPT model", context: "128K tokens", inputPrice: "$0.01/1K", outputPrice: "$0.03/1K" },
    { value: "openai/gpt-4o-mini", label: "GPT-4 Mini", description: "Efficient version of GPT-4", context: "128K tokens", inputPrice: "$0.005/1K", outputPrice: "$0.015/1K" }
  ]
}

type ModelValue = typeof AI_MODELS[keyof typeof AI_MODELS][number]['value']

interface ModelPanelProps {
  messages: { role: string; content: string; model: string }[]
  onSendMessage: (message: string, modelName: string, role?: string) => void
  panelId: 'left' | 'right'
}

export default function ModelPanel({ messages, onSendMessage, panelId }: ModelPanelProps) {
  const [input, setInput] = useState('')
  const [selectedProvider, setSelectedProvider] = useState(panelId === 'left' ? 'openai' : 'meta')
  const [selectedModel, setSelectedModel] = useState<ModelValue>(
    panelId === 'left' ? AI_MODELS.openai[0].value : AI_MODELS.meta[0].value
  )
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider)
    const defaultModel = AI_MODELS[provider as keyof typeof AI_MODELS][0].value
    setSelectedModel(defaultModel)
  }

  const currentModelInfo = AI_MODELS[selectedProvider as keyof typeof AI_MODELS]
    .find(m => m.value === selectedModel) ?? AI_MODELS.openai[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    try {
      setIsLoading(true)
      // Add user message first
      onSendMessage(userMessage, selectedModel, 'user')
      
      const { data } = await axios.post('/api/llm', {
        model: selectedModel,
        prompt: userMessage
      })

      if (data.output) {
        // Add AI response
        onSendMessage(data.output, selectedModel, 'assistant')
      }
      
      setInput('')
    } catch (error) {
      console.error('Error:', error)
      // Add error message as AI response
      onSendMessage("Error: Failed to get response from the model", selectedModel, 'assistant')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Select value={selectedProvider} onValueChange={handleProviderChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="meta">Meta</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={selectedModel} 
              onValueChange={(value) => {
                setSelectedModel(value)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS[selectedProvider as keyof typeof AI_MODELS].map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <CardTitle className="text-xl font-bold">{currentModelInfo.label}</CardTitle>
          <p className="text-sm opacity-90">{currentModelInfo.description}</p>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="space-y-1">
            <p className="font-medium">Context Window</p>
            <p className="text-gray-500">{currentModelInfo.context}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium">Pricing</p>
            <p className="text-gray-500">Input: {currentModelInfo.inputPrice}</p>
            <p className="text-gray-500">Output: {currentModelInfo.outputPrice}</p>
          </div>
        </div>

        <div className="h-64 overflow-y-auto space-y-3 bg-gray-50 rounded-lg p-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-50 text-blue-900 ml-4' 
                  : 'bg-purple-50 text-purple-900 mr-4'
              }`}
            >
              <p className="font-medium mb-1">
                {message.role === 'user' ? 'You' : 'AI'}
              </p>
              <p className="text-sm whitespace-pre-wrap">
                {message.role === 'user' 
                  ? message.content
                  : `[${message.model}] ${message.content}`
                }
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-4">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

