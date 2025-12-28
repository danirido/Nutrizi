import { useState } from 'react'
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { ArrowRight, Apple, Dumbbell, Moon, Calculator, ChefHat, Clock } from "lucide-react"
import { User } from '../lib/auth'

interface InitialRecommendationsProps {
  user: User;
  onSelectRecommendation: (type: string) => void;
  onStartFreeChat: () => void;
}

export default function InitialRecommendations({ user, onSelectRecommendation, onStartFreeChat }: InitialRecommendationsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Calculate basic nutritional needs
  const calculateBMR = () => {
    const { age, gender, height, weight } = user.profile
    let bmr = 0
    
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    }
    
    // Activity level multiplier
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    }
    
    return Math.round(bmr * multipliers[user.profile.activityLevel])
  }

  const calculateProtein = () => {
    const { weight, activityLevel, goal } = user.profile
    let proteinPerKg = 0.8 // base requirement
    
    if (activityLevel === 'active' || activityLevel === 'very_active') {
      proteinPerKg = 1.2
    }
    if (goal === 'build_muscle') {
      proteinPerKg = 1.6
    }
    if (goal === 'lose_weight') {
      proteinPerKg = 1.2
    }
    
    return Math.round(weight * proteinPerKg)
  }

  const dailyCalories = calculateBMR()
  const dailyProtein = calculateProtein()

  const recommendations = [
    {
      id: 'nutrition_overview',
      title: 'Kebutuhan Nutrisi Harian',
      description: `Berdasarkan profil Anda, kebutuhan kalori harian sekitar ${dailyCalories} kkal dan protein ${dailyProtein}g`,
      icon: Calculator,
      color: 'from-green-400 to-green-600',
      details: [
        `${dailyCalories} kalori per hari`,
        `${dailyProtein}g protein`,
        `${Math.round(dailyCalories * 0.45 / 4)}g karbohidrat`,
        `${Math.round(dailyCalories * 0.25 / 9)}g lemak sehat`
      ]
    },
    {
      id: 'meal_planning',
      title: 'Resep & Menu Harian',
      description: 'Dapatkan resep sehat dengan takaran gramasi yang tepat sesuai kebutuhan Anda',
      icon: ChefHat,
      color: 'from-orange-400 to-orange-600',
      details: [
        'Resep dengan gramasi detail',
        'Menu sarapan, makan siang & malam',
        'Snack sehat di antara waktu makan',
        'Alternatif bahan lokal Indonesia'
      ]
    },
    {
      id: 'exercise_plan',
      title: 'Program Olahraga Personal',
      description: `Rencana olahraga yang disesuaikan dengan level aktivitas ${user.profile.activityLevel} dan tujuan Anda`,
      icon: Dumbbell,
      color: 'from-blue-400 to-blue-600',
      details: [
        'Program latihan mingguan',
        'Panduan durasi & intensitas',
        'Latihan yang bisa dilakukan di rumah',
        'Progress tracking'
      ]
    },
    {
      id: 'sleep_wellness',
      title: 'Pola Tidur & Recovery',
      description: 'Rekomendasi jam tidur optimal dan tips recovery untuk mendukung kesehatan Anda',
      icon: Moon,
      color: 'from-purple-400 to-purple-600',
      details: [
        '7-9 jam tidur berkualitas',
        'Jadwal tidur yang konsisten',
        'Tips relaksasi sebelum tidur',
        'Recovery setelah olahraga'
      ]
    },
    {
      id: 'macro_breakdown',
      title: 'Detail Makronutrien',
      description: 'Pembagian detail karbohidrat, protein, dan lemak dengan sumber makanan terbaik',
      icon: Apple,
      color: 'from-red-400 to-red-600',
      details: [
        'Sumber protein terbaik',
        'Karbohidrat kompleks vs sederhana',
        'Lemak sehat yang dibutuhkan',
        'Timing konsumsi optimal'
      ]
    },
    {
      id: 'daily_schedule',
      title: 'Jadwal Harian Terintegrasi',
      description: 'Jadwal makan, olahraga, dan istirahat yang disesuaikan dengan rutinitas Anda',
      icon: Clock,
      color: 'from-teal-400 to-teal-600',
      details: [
        'Jadwal makan optimal',
        'Waktu terbaik untuk olahraga',
        'Integrasi dengan aktivitas harian',
        'Fleksibilitas untuk perubahan'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Halo, {user.name}! 👋
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Selamat datang di Nutrizi. Mari mulai perjalanan sehat Anda!
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Badge variant="secondary">Umur: {user.profile.age} tahun</Badge>
            <Badge variant="secondary">BMI: {(user.profile.weight / Math.pow(user.profile.height/100, 2)).toFixed(1)}</Badge>
            <Badge variant="secondary">Tujuan: {user.profile.goal.replace('_', ' ')}</Badge>
            <Badge variant="secondary">Aktivitas: {user.profile.activityLevel}</Badge>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Pilih rekomendasi yang ingin Anda dapatkan terlebih dahulu:
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => {
              const Icon = rec.icon
              return (
                <Card 
                  key={rec.id}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                    selectedCategory === rec.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedCategory(rec.id)}
                >
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${rec.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{rec.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {rec.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-1">
                      {rec.details.map((detail, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => selectedCategory && onSelectRecommendation(selectedCategory)}
            disabled={!selectedCategory}
            className="flex items-center justify-center"
          >
            Mulai dengan Rekomendasi Ini
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={onStartFreeChat}
            className="flex items-center justify-center"
          >
            Atau Chat Bebas dengan AI
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            💡 Tip: Anda bisa meminta rekomendasi lainnya kapan saja dalam percakapan
          </p>
        </div>
      </div>
    </div>
  )
}