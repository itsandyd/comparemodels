'use client'

import { useState, useEffect } from 'react'
import ModelPanel from './model-panel'
import { Skeleton } from "@/components/ui/skeleton"

function LoadingModelPanel() {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="h-64 bg-gray-50 rounded-lg p-4">
          <div className="space-y-3">
            <Skeleton className="h-16 w-3/4 ml-4" />
            <Skeleton className="h-16 w-5/6 mr-4" />
          </div>
        </div>
      </div>
      <div className="bg-gray-50 p-4">
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  )
}

export default function ModelComparison() {
  const [leftMessages, setLeftMessages] = useState<{ role: string; content: string; model: string }[]>([])
  const [rightMessages, setRightMessages] = useState<{ role: string; content: string; model: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleSendMessage = (message: string, modelName: string, panelId: 'left' | 'right', role: string = 'user') => {
    const setMessages = panelId === 'left' ? setLeftMessages : setRightMessages
    
    setMessages(prevMessages => [...prevMessages, { role, content: message, model: modelName }])
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LoadingModelPanel />
        <LoadingModelPanel />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ModelPanel 
        messages={leftMessages}
        onSendMessage={(message, modelName, role) => handleSendMessage(message, modelName, 'left', role)}
        panelId="left"
      />
      <ModelPanel 
        messages={rightMessages}
        onSendMessage={(message, modelName, role) => handleSendMessage(message, modelName, 'right', role)}
        panelId="right"
      />
    </div>
  )
}

