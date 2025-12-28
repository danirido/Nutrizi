import { useState, useEffect } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { ScrollArea } from "./ui/scroll-area"
import { Bot, User as UserIcon, Send, Loader2, Lightbulb, Plus } from "lucide-react"
import { User } from '../lib/auth'
import { ChatMessage, aiChatService } from '../lib/aiChat'

interface ChatInterfaceProps {
  user: User;
}

export default function ChatInterface({ user }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    let mounted = true
    
    const loadHistory = async () => {
      if (!mounted) return
      
      setIsLoading(true)
      try {
        const history = await aiChatService.getChatHistory(user.id)
        
        if (!mounted) return
        
        // Check if there's a specific initial recommendation to show
        const initialRecommendation = localStorage.getItem('nutrizi_initial_recommendation')
        
        if (history.length === 0) {
          let greetingMessage = `Halo ${user.name}! Saya Nutrizi, asisten kesehatan personal Anda. `
          let recommendations: string[] = []

          if (initialRecommendation) {
            // Generate specific initial message based on selected recommendation
            switch (initialRecommendation) {
              case 'nutrition_overview':
                greetingMessage += `Mari kita bahas kebutuhan nutrisi harian Anda yang sudah saya hitung berdasarkan profil Anda.`
                break
              case 'meal_planning':
                greetingMessage += `Mari saya buatkan rencana menu dan resep sehat dengan takaran yang tepat untuk Anda.`
                break
              case 'exercise_plan':
                greetingMessage += `Mari kita buat program olahraga yang sesuai dengan level aktivitas dan tujuan Anda.`
                break
              case 'sleep_wellness':
                greetingMessage += `Mari kita bahas pola tidur dan recovery yang optimal untuk kesehatan Anda.`
                break
              case 'macro_breakdown':
                greetingMessage += `Mari saya jelaskan detail makronutrien dan sumber makanan terbaik untuk Anda.`
                break
              case 'daily_schedule':
                greetingMessage += `Mari kita buat jadwal harian terintegrasi untuk makan, olahraga, dan istirahat.`
                break
              default:
                greetingMessage += `Saya siap membantu Anda mencapai tujuan kesehatan dengan memberikan saran nutrisi, program olahraga, dan tips gaya hidup sehat yang personal.`
            }
            
            // Clear the initial recommendation after use
            localStorage.removeItem('nutrizi_initial_recommendation')
          } else {
            greetingMessage += `Saya siap membantu Anda mencapai tujuan kesehatan dengan memberikan saran nutrisi, program olahraga, dan tips gaya hidup sehat yang personal. Ada yang bisa saya bantu hari ini? 😊`
            recommendations = [
              "Mulai dengan menceritakan tujuan kesehatan Anda",
              "Tanya tentang rencana makan hari ini",
              "Minta saran program olahraga yang cocok"
            ]
          }

          const greeting: ChatMessage = {
            id: '0',
            userId: user.id,
            message: greetingMessage,
            sender: 'ai',
            timestamp: new Date().toISOString(),
            metadata: {
              recommendations
            }
          }

          if (!mounted) return
          
          // If there's an initial recommendation, automatically generate the detailed response
          if (initialRecommendation) {
            setMessages([greeting])
            // Generate detailed response asynchronously to avoid blocking
            setTimeout(async () => {
              if (!mounted) return
              try {
                const detailedResponse = await aiChatService.generateInitialRecommendation(user, initialRecommendation)
                if (mounted && detailedResponse) {
                  setMessages(prev => [...prev, detailedResponse])
                  // Save the detailed response to chat history
                  const currentHistory = await aiChatService.getChatHistory(user.id)
                  const updatedHistory = [...currentHistory, greeting, detailedResponse]
                  if (typeof window !== 'undefined') {
                    localStorage.setItem(`nutrizi_chat_${user.id}`, JSON.stringify(updatedHistory))
                  }
                }
              } catch (error) {
                console.error('Failed to generate initial recommendation:', error)
                // Show error message to user
                if (mounted) {
                  const errorMessage = {
                    id: Date.now().toString(),
                    userId: user.id,
                    message: "Maaf, terjadi kesalahan saat memuat rekomendasi. Silakan coba refresh halaman atau mulai chat manual.",
                    sender: 'ai' as const,
                    timestamp: new Date().toISOString(),
                    metadata: {
                      recommendations: ["Refresh halaman dan coba lagi", "Atau mulai dengan mengetik pertanyaan Anda"]
                    }
                  }
                  setMessages(prev => [...prev, errorMessage])
                }
              }
            }, 150)
          } else {
            setMessages([greeting])
          }
        } else {
          setMessages(history)
        }
      } catch (error) {
        console.error('Failed to load chat history:', error)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }
    
    loadHistory()
    
    return () => {
      mounted = false
    }
  }, [user.id, user.name])

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    const scrollToBottom = () => {
      const scrollArea = document.querySelector('[data-slot="scroll-area-viewport"]')
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight
      }
    }
    
    // Delay scroll to ensure content is rendered
    const timer = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timer)
  }, [messages, isTyping])



  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isTyping) return

    const message = inputMessage.trim()
    setInputMessage('')
    setIsTyping(true)

    try {
      const updatedHistory = await aiChatService.sendMessage(user.id, message)
      setMessages(updatedHistory)
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickAction = (action: any) => {
    // Handle quick actions from AI responses
    console.log('Quick action:', action)
    // This would trigger the respective functionality
    if (action.type === 'add_meal') {
      // Open meal adding interface
    } else if (action.type === 'add_exercise') {
      // Open exercise adding interface
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const quickSuggestions = [
    "Buatkan rencana makan sehat untuk hari ini",
    "Saya ingin program olahraga 30 menit",
    "Bagaimana cara meningkatkan kualitas tidur?",
    "Tips untuk minum air yang cukup",
    "Saya merasa kurang motivasi untuk olahraga"
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3>Nutrizi AI</h3>
              <p className="text-sm text-gray-500 font-normal">
                Asisten kesehatan personal Anda
              </p>
            </div>
            <div className="ml-auto">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                      msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={
                          msg.sender === 'user' 
                            ? 'bg-gray-300' 
                            : 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
                        }>
                          {msg.sender === 'user' ? 
                            <UserIcon className="w-4 h-4" /> : 
                            <Bot className="w-4 h-4" />
                          }
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`rounded-2xl px-4 py-2 ${
                        msg.sender === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-line">
                          {msg.message}
                        </p>
                        
                        {/* AI Recommendations */}
                        {msg.sender === 'ai' && msg.metadata?.recommendations && (
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center space-x-1 text-xs text-gray-600">
                              <Lightbulb className="w-3 h-3" />
                              <span>Tips:</span>
                            </div>
                            {msg.metadata.recommendations.map((rec, idx) => (
                              <div key={idx} className="text-xs text-gray-600 bg-white/50 px-2 py-1 rounded">
                                • {rec}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Quick Actions */}
                        {msg.sender === 'ai' && msg.metadata?.actions && (
                          <div className="mt-3 space-y-2">
                            {msg.metadata.actions.map((action, idx) => (
                              <Button
                                key={idx}
                                size="sm"
                                variant="outline"
                                className="text-xs bg-white border-gray-300 hover:bg-gray-50"
                                onClick={() => handleQuickAction(action)}
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                        
                        <span className={`text-xs mt-1 block ${
                          msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-2xl px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Quick Suggestions */}
          {messages.length <= 1 && (
            <div className="p-4 border-t">
              <p className="text-sm text-gray-600 mb-3">Saran topik yang bisa Anda tanyakan:</p>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-50 text-xs"
                    onClick={() => setInputMessage(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Message Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ketik pesan Anda..."
                disabled={isTyping}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
              >
                {isTyping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}