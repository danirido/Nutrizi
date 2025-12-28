import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Apple, Dumbbell, Moon, MessageCircle, Smartphone, TrendingUp } from "lucide-react"

export default function FeaturesSection() {
  const mainFeatures = [
    {
      icon: <Apple className="w-8 h-8 text-green-500" />,
      title: "Nutrisi Personal",
      description: "Rencana makan harian dengan resep mudah dan daftar belanja otomatis",
      image: "https://images.unsplash.com/photo-1619502735729-13b7525f13e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZCUyMHBsYW5uaW5nfGVufDF8fHx8MTc1ODg3OTQ1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      icon: <Dumbbell className="w-8 h-8 text-blue-500" />,
      title: "Program Olahraga",
      description: "Workout plan yang disesuaikan dengan level dan tujuan fitness Anda",
      image: "https://images.unsplash.com/photo-1581122583802-9e2afdc5ab7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwbnV0cml0aW9uJTIwd29ya291dHxlbnwxfHx8fDE3NTg4Nzk0NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      icon: <Moon className="w-8 h-8 text-purple-500" />,
      title: "Optimasi Tidur",
      description: "Tracking dan rekomendasi untuk pola tidur yang lebih berkualitas",
      image: "https://images.unsplash.com/photo-1706894854720-f5b6338443f8?q=80&w=2734&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  ]

  const additionalFeatures = [
    {
      icon: <MessageCircle className="w-6 h-6 text-green-500" />,
      title: "Chat AI yang Ramah",
      description: "Berbicara dengan AI seperti teman yang selalu mendukung perjalanan sehat Anda"
    },
    {
      icon: <Smartphone className="w-6 h-6 text-blue-500" />,
      title: "Integrasi Wearable",
      description: "Sinkronisasi otomatis dengan Apple Health, Google Fit, dan smartwatch"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
      title: "Progress Tracking",
      description: "Pantau kemajuan dengan visualisasi data yang mudah dipahami"
    }
  ]

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
            Tiga Pilar Gaya Hidup Sehat
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pendekatan holistik yang mengintegrasikan nutrisi, olahraga, dan istirahat 
            dalam satu panduan harian yang mudah diikuti
          </p>
        </div>

        {/* Main Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video rounded-b-lg overflow-hidden">
                  <ImageWithFallback
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Fitur Unggulan Lainnya
            </h3>
            <p className="text-gray-600 max-w-xl mx-auto">
              Teknologi AI terdepan yang membuat perjalanan sehat Anda lebih mudah dan menyenangkan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
                  {feature.icon}
                </div>
                <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}