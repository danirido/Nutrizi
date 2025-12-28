import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Bot, User } from "lucide-react"

export default function ChatPreview() {
  const chatMessages = [
    {
      type: "bot",
      message: "Halo! Saya Nutrizi, asisten kesehatan personal Anda. Bagaimana kabar Anda hari ini? 😊",
      time: "10:00"
    },
    {
      type: "user", 
      message: "Hai! Saya merasa agak lelah akhir-akhir ini dan ingin memulai gaya hidup yang lebih sehat.",
      time: "10:02"
    },
    {
      type: "bot",
      message: "Saya mengerti! Mari kita mulai dengan langkah kecil. Berdasarkan profil Anda, saya rekomendasikan:\n\n🥗 Sarapan: Oatmeal dengan buah berry\n🏃‍♀️ Olahraga: Jalan kaki 20 menit\n💤 Tidur: 10.30 PM untuk tidur 7-8 jam\n\nApakah ini terdengar realistis untuk Anda?",
      time: "10:03"
    },
    {
      type: "user",
      message: "Iya, terdengar bagus! Bisakah berikan resep oatmeal yang enak?",
      time: "10:05"
    },
    {
      type: "bot",
      message: "Tentu! Ini resep oatmeal berry yang lezat:\n\n🥣 **Overnight Oats Berry Delight**\n• 1/2 cangkir oats\n• 1/2 cangkir susu almond\n• 1 sdt madu\n• 1/4 cangkir blueberry\n• 1 sdt chia seeds\n\nCampur semua bahan, diamkan semalam di kulkas. Siap disantap pagi! 🌟\n\nSaya sudah menambahkan bahan-bahan ini ke daftar belanja Anda.",
      time: "10:06"
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                <Bot className="w-4 h-4" />
                <span>AI Assistant</span>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Berbicara dengan Nutrizi
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"> Seperti Teman</span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Tidak seperti aplikasi kesehatan lainnya, Nutrizi menggunakan percakapan natural 
                untuk memberikan panduan yang personal dan mudah dipahami. AI kami mengerti konteks 
                dan memberikan saran yang praktis untuk kehidupan sehari-hari.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Proaktif & Personal</h4>
                  <p className="text-gray-600">AI yang tidak hanya menjawab, tapi aktif memberikan saran berdasarkan data Anda</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Bahasa yang Ramah</h4>
                  <p className="text-gray-600">Komunikasi yang natural seperti berbicara dengan teman yang peduli</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Saran yang Actionable</h4>
                  <p className="text-gray-600">Tidak hanya teori, tapi langkah konkret yang bisa langsung diterapkan</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <Card className="bg-white shadow-2xl border-0 max-w-md mx-auto">
              <CardHeader className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <span>Nutrizi</span>
                  <div className="ml-auto w-3 h-3 bg-green-300 rounded-full"></div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 max-h-96 overflow-y-auto">
                <div className="space-y-4 p-4">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex items-start space-x-2 max-w-xs ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className={msg.type === 'user' ? 'bg-gray-300' : 'bg-gradient-to-r from-green-400 to-blue-500 text-white'}>
                            {msg.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`rounded-2xl px-4 py-2 ${
                          msg.type === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-line">{msg.message}</p>
                          <span className={`text-xs mt-1 block ${
                            msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Typing indicator */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-500">Nutrizi sedang mengetik...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}