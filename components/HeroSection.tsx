import { Button } from "./ui/button"
import { ImageWithFallback } from './figma/ImageWithFallback'
import { CheckCircle, Heart, Zap } from "lucide-react"

interface HeroSectionProps {
  onGetStarted: () => void;
  onDemo?: () => void;
}

export default function HeroSection({ onGetStarted, onDemo }: HeroSectionProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 via-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                <Heart className="w-4 h-4" />
                <span className="text-sm">AI-Powered Health Assistant</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Teman Sehat Personal
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"> Berbasis AI</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Dapatkan panduan harian yang personal untuk nutrisi, olahraga, dan pola istirahat. 
                Seperti memiliki nutritionist dan personal trainer dalam satu aplikasi.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Rekomendasi personal berdasarkan data Anda</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Chat dengan AI yang ramah dan suportif</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Integrasi dengan wearable dan aplikasi kesehatan</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-8 py-3"
                onClick={onGetStarted}
              >
                <Zap className="w-5 h-5 mr-2" />
                Mulai Gratis Sekarang
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-gray-300 px-8 py-3"
                onClick={onDemo || onGetStarted}
              >
                Lihat Demo
              </Button>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span>✨ Gratis 14 hari</span>
              <span>🔒 Data aman & privat</span>
              <span>📱 Tersedia di iOS & Android</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative z-1">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1711698520626-bae97bc6c204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbGlmZXN0eWxlJTIwbW9iaWxlJTIwYXBwfGVufDF8fHx8MTc1ODg3OTQ1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Nutrizi App Interface"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
            
            {/* Floating cards */}
            <div className="absolute -top-4 -left-4 bg-white p-4 rounded-xl shadow-lg border">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium">1,247 kalori hari ini</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg border">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-sm font-medium">8 jam tidur optimal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}