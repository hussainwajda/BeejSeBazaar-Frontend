"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Mic, MicOff } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  actions?: { label: string; href: string }[]
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "How can I help you?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [showNudge, setShowNudge] = useState(true)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<any>(null)
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setShowNudge(false), 8000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (isOpen) setShowNudge(false)
  }, [isOpen])

  useEffect(() => {
    const SpeechRecognition = (typeof window !== 'undefined') && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
    if (SpeechRecognition) {
      const rec = new (SpeechRecognition as any)()
      rec.lang = 'en-IN'
      rec.interimResults = false
      rec.maxAlternatives = 1
      rec.continuous = false
      rec.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript || ''
        if (transcript) {
          setInputValue(transcript)
          setTimeout(() => handleSendMessage(transcript), 100)
        }
      }
      rec.onend = () => setListening(false)
      rec.onerror = () => setListening(false)
      recognitionRef.current = rec
    }
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom on new messages
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const buildBotResponse = (raw: string): Message => {
    const text = raw.toLowerCase()
    const mk = (t: string, actions?: Message['actions']): Message => ({ id: (Date.now() + Math.random()).toString(), text: t, isUser: false, timestamp: new Date(), actions })

    if ((text.includes('soil') && (text.includes('health') || text.includes('test') || text.includes('check'))) || text.includes('analyze soil')) {
      return mk('To check your soil health, go to Soil Health. You can enter values manually or upload a lab report for instant advisory.', [
        { label: 'Open Soil Health', href: '/dashboard/soil-health' },
      ])
    }
    if (text.includes('pest') || text.includes('disease')) {
      return mk('To detect pests or diseases, open Pest & Disease Detection and upload a clear photo of the affected crop.', [
        { label: 'Open Pest Detection', href: '/dashboard/pest-disease-detection' },
      ])
    }
    if (text.includes('weather')) {
      return mk('Open Weather Alerts to view current conditions and forecasts.', [{ label: 'Open Weather Alerts', href: '/dashboard/weather-alerts' }])
    }
    if (text.includes('price') || text.includes('market')) {
      return mk('Open Market Prices to see latest mandi rates and trends.', [{ label: 'Open Market Prices', href: '/dashboard/market-prices' }])
    }
    if (text.includes('scheme')) {
      return mk('Here are popular schemes you may be eligible for.', [{ label: 'Eligible Schemes', href: '/dashboard/eligible-schemes' }])
    }
    return mk('I can help with soil health, pest detection, weather alerts, market prices, and schemes. What would you like to do?', [
      { label: 'Soil Health', href: '/dashboard/soil-health' },
      { label: 'Pest Detection', href: '/dashboard/pest-disease-detection' },
    ])
  }

  const handleSendMessage = (override?: string) => {
    const content = (override ?? inputValue).trim()
    if (!content) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: content,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    setTimeout(() => {
      const botMessage = buildBotResponse(content)
      setMessages((prev) => [...prev, botMessage])
    }, 300)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const toggleVoice = () => {
    const rec = recognitionRef.current
    if (!rec) {
      alert('Voice input is not supported in this browser.')
      return
    }
    try {
      if (!listening) {
        setListening(true)
        rec.start()
      } else {
        rec.stop()
        setListening(false)
      }
    } catch {
      setListening(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Window */}
      {isOpen && (
        <Card className="mb-4 w-80 h-96 flex min-h-0 flex-col shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Chat Assistant</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 min-h-0 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={cn("flex", message.isUser ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                      message.isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={toggleVoice} size="sm" variant={listening ? 'destructive' : 'outline'} className="px-3" aria-label="Voice input">
                {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button onClick={() => handleSendMessage()} size="sm" className="px-3" aria-label="Send">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Presence Nudge Tooltip */}
      {!isOpen && showNudge && (
        <div className="absolute -top-3 right-16 bg-primary text-primary-foreground text-xs px-3 py-2 rounded-lg shadow-md animate-bounce">
          Need help? Chat with me!
          <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rotate-45" />
        </div>
      )}

      {/* Toggle Button */}
      <Button onClick={() => setIsOpen(!isOpen)} size="lg" className="rounded-full h-14 w-14 shadow-lg relative">
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 inline-flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-primary" />
          </span>
        )}
      </Button>
    </div>
  )
}
