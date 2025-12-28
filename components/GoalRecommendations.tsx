import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { 
  Target, 
  TrendingDown, 
  Scale, 
  TrendingUp, 
  Dumbbell, 
  Heart,
  Apple,
  Clock,
  Zap,
  Droplets,
  Moon,
  Activity,
  Calculator,
  BookOpen
} from "lucide-react"
import { User, UserProfile } from '../lib/auth'

interface GoalRecommendationsProps {
  user: User;
  onStartChat: () => void;
}

interface DetailedRecommendation {
  goal: UserProfile['goal'];
  title: string;
  icon: React.ReactNode;
  color: string;
  dailyCalories: number;
  protein: number;
  carbs: number;
  fats: number;
  waterIntake: number;
  sleepHours: string;
  exerciseFrequency: string;
  exerciseType: string[];
  mealExample: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
  };
  tips: string[];
  timeline: string;
}

export default function GoalRecommendations({ user, onStartChat }: GoalRecommendationsProps) {
  const profile = user.profile
  
  // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
  const calculateBMR = () => {
    if (!profile.age || !profile.height || !profile.weight) return 1800
    
    let bmr: number
    if (profile.gender === 'male') {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5
    } else {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161
    }
    
    // Apply activity factor
    const activityFactors = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    }
    
    const activityLevel = profile.activityLevel || 'moderate'
    return Math.round(bmr * activityFactors[activityLevel as keyof typeof activityFactors])
  }

  const baseCalories = useMemo(() => calculateBMR(), [profile.age, profile.height, profile.weight, profile.gender, profile.activityLevel])
  
  const getGoalRecommendation = useMemo((): DetailedRecommendation => {
    const weight = profile.weight || 70 // Default weight if not available
    const baseProtein = Math.round(weight * 1.6) // 1.6g per kg
    const baseWater = Math.round(weight * 35) // 35ml per kg
    
    switch (profile.goal || 'improve_health') {
      case 'lose_weight':
        return {
          goal: 'lose_weight',
          title: 'Program Penurunan Berat Badan',
          icon: <TrendingDown className="w-8 h-8" />,
          color: 'from-red-400 to-pink-500',
          dailyCalories: baseCalories - 500, // Deficit 500 kalori
          protein: Math.round(baseProtein * 1.2), // Protein lebih tinggi
          carbs: Math.round((baseCalories - 500) * 0.4 / 4), // 40% dari kalori
          fats: Math.round((baseCalories - 500) * 0.25 / 9), // 25% dari kalori
          waterIntake: baseWater + 500, // Tambahan untuk metabolisme
          sleepHours: '7-8 jam',
          exerciseFrequency: '4-5x seminggu',
          exerciseType: ['Cardio (30-45 menit)', 'Strength training (2-3x)', 'HIIT (1-2x)'],
          mealExample: {
            breakfast: 'Oatmeal dengan protein powder dan buah berry (350 kal)',
            lunch: 'Salad ayam panggang dengan quinoa (450 kal)',
            dinner: 'Ikan bakar dengan sayuran kukus (400 kal)',
            snack: 'Greek yogurt dengan kacang almond (200 kal)'
          },
          tips: [
            'Fokus pada defisit kalori yang konsisten tapi tidak ekstrem',
            'Tingkatkan asupan protein untuk mempertahankan massa otot',
            'Minum air sebelum makan untuk membantu kenyang',
            'Tidur cukup untuk mengatur hormon lapar (leptin & ghrelin)'
          ],
          timeline: '0.5-1 kg per minggu'
        }

      case 'gain_weight':
        return {
          goal: 'gain_weight',
          title: 'Program Penambahan Berat Badan',
          icon: <TrendingUp className="w-8 h-8" />,
          color: 'from-blue-400 to-cyan-500',
          dailyCalories: baseCalories + 500, // Surplus 500 kalori
          protein: Math.round(baseProtein * 1.4),
          carbs: Math.round((baseCalories + 500) * 0.45 / 4), // 45% dari kalori
          fats: Math.round((baseCalories + 500) * 0.25 / 9), // 25% dari kalori
          waterIntake: baseWater + 300,
          sleepHours: '8-9 jam',
          exerciseFrequency: '3-4x seminggu',
          exerciseType: ['Strength training (3-4x)', 'Cardio ringan (1-2x)', 'Compound movements'],
          mealExample: {
            breakfast: 'Smoothie protein dengan pisang, oats, dan selai kacang (500 kal)',
            lunch: 'Nasi ayam teriyaki dengan alpukat (600 kal)',
            dinner: 'Pasta dengan daging sapi dan keju (550 kal)',
            snack: 'Trail mix dan protein shake (400 kal)'
          },
          tips: [
            'Makan lebih sering dengan porsi sedang (5-6x sehari)',
            'Pilih makanan padat nutrisi dan kalori',
            'Fokus pada latihan beban untuk menambah massa otot',
            'Istirahat cukup untuk recovery dan pertumbuhan otot'
          ],
          timeline: '0.5-0.75 kg per minggu'
        }

      case 'build_muscle':
        return {
          goal: 'build_muscle',
          title: 'Program Pembentukan Massa Otot',
          icon: <Dumbbell className="w-8 h-8" />,
          color: 'from-purple-400 to-indigo-500',
          dailyCalories: baseCalories + 300, // Surplus moderat
          protein: Math.round(baseProtein * 1.8), // Protein tinggi
          carbs: Math.round((baseCalories + 300) * 0.4 / 4),
          fats: Math.round((baseCalories + 300) * 0.25 / 9),
          waterIntake: baseWater + 400,
          sleepHours: '8-9 jam',
          exerciseFrequency: '4-6x seminggu',
          exerciseType: ['Progressive strength training (4-5x)', 'Compound exercises', 'Isolation movements'],
          mealExample: {
            breakfast: 'Scrambled eggs dengan roti gandum dan alpukat (450 kal)',
            lunch: 'Chicken breast dengan nasi merah dan brokoli (500 kal)',
            dinner: 'Salmon panggang dengan ubi dan asparagus (480 kal)',
            snack: 'Casein protein dengan buah pisang (300 kal)'
          },
          tips: [
            'Progressive overload dalam latihan adalah kunci',
            'Konsumsi protein setiap 3-4 jam',
            'Timing nutrisi: protein dalam 2 jam post-workout',
            'Recovery yang cukup antara sesi latihan kelompok otot yang sama'
          ],
          timeline: '0.25-0.5 kg otot per bulan'
        }

      case 'maintain_weight':
        return {
          goal: 'maintain_weight',
          title: 'Program Maintenance & Rekomposisi Tubuh',
          icon: <Scale className="w-8 h-8" />,
          color: 'from-green-400 to-emerald-500',
          dailyCalories: baseCalories, // Kalori maintenance
          protein: baseProtein,
          carbs: Math.round(baseCalories * 0.45 / 4),
          fats: Math.round(baseCalories * 0.25 / 9),
          waterIntake: baseWater,
          sleepHours: '7-8 jam',
          exerciseFrequency: '3-4x seminggu',
          exerciseType: ['Strength training (2-3x)', 'Cardio (1-2x)', 'Flexibility & mobility'],
          mealExample: {
            breakfast: 'Greek yogurt dengan granola dan buah (400 kal)',
            lunch: 'Bowl Buddha dengan protein, quinoa, dan sayuran (480 kal)',
            dinner: 'Ikan dengan nasi dan sayur tumis (450 kal)',
            snack: 'Buah dengan kacang-kacangan (250 kal)'
          },
          tips: [
            'Fokus pada konsistensi daripada perfeksi',
            'Monitor komposisi tubuh, bukan hanya berat',
            'Variasi dalam program latihan untuk mencegah plateau',
            'Maintain rutinitas yang sustainable jangka panjang'
          ],
          timeline: 'Berkelanjutan'
        }

      default:
        return {
          goal: 'improve_health',
          title: 'Program Peningkatan Kesehatan Menyeluruh',
          icon: <Heart className="w-8 h-8" />,
          color: 'from-orange-400 to-red-500',
          dailyCalories: baseCalories,
          protein: baseProtein,
          carbs: Math.round(baseCalories * 0.45 / 4),
          fats: Math.round(baseCalories * 0.3 / 9),
          waterIntake: baseWater,
          sleepHours: '7-8 jam',
          exerciseFrequency: '3-5x seminggu',
          exerciseType: ['Cardio (2-3x)', 'Strength training (2x)', 'Yoga/stretching (1x)'],
          mealExample: {
            breakfast: 'Smoothie hijau dengan protein dan chia seeds (380 kal)',
            lunch: 'Salad Mediterranean dengan chicken (420 kal)',
            dinner: 'Sup ayam dengan sayuran dan roti gandum (400 kal)',
            snack: 'Hummus dengan sayuran potong (180 kal)'
          },
          tips: [
            'Fokus pada whole foods dan minimally processed foods',
            'Incorporate 5 porsi buah dan sayur per hari',
            'Regular movement sepanjang hari, tidak hanya saat olahraga',
            'Manage stress dengan teknik relaksasi dan mindfulness'
          ],
          timeline: 'Peningkatan berkelanjutan'
        }
    }
  }, [profile.goal, baseCalories, profile.weight])

  const recommendation = getGoalRecommendation

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className={`mx-auto w-16 h-16 bg-gradient-to-r ${recommendation.color} rounded-xl flex items-center justify-center mb-6`}>
            {recommendation.icon}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Rekomendasi Personal untuk {user.name}
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {recommendation.title}
          </p>
          <Badge className="text-sm px-4 py-2">
            Target: {recommendation.timeline}
          </Badge>
        </div>

        {/* Nutrition Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="w-5 h-5 text-green-500" />
              Target Nutrisi Harian
            </CardTitle>
            <CardDescription>
              Berdasarkan profil Anda: {profile.gender || 'N/A'}, {profile.age || 'N/A'} tahun, {profile.height || 'N/A'}cm, {profile.weight || 'N/A'}kg
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Calculator className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{recommendation.dailyCalories}</div>
                <div className="text-sm text-gray-600">Kalori</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <Zap className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">{recommendation.protein}g</div>
                <div className="text-sm text-gray-600">Protein</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Target className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">{recommendation.carbs}g</div>
                <div className="text-sm text-gray-600">Karbohidrat</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Droplets className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{recommendation.fats}g</div>
                <div className="text-sm text-gray-600">Lemak</div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-cyan-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Droplets className="w-5 h-5 text-cyan-500" />
                <span className="font-medium">Target Air Minum</span>
              </div>
              <div className="text-center text-2xl font-bold text-cyan-600">
                {recommendation.waterIntake}ml per hari
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise & Sleep */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-500" />
                Program Olahraga
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-medium mb-2">Frekuensi: {recommendation.exerciseFrequency}</div>
                <div className="space-y-2">
                  {recommendation.exerciseType.map((type, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      {type}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-indigo-500" />
                Pola Istirahat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {recommendation.sleepHours}
                </div>
                <div className="text-gray-600">per malam</div>
                <div className="text-sm text-gray-500 mt-2">
                  Tidur berkualitas penting untuk recovery dan metabolism
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meal Examples */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-500" />
              Contoh Menu Harian
            </CardTitle>
            <CardDescription>
              Referensi menu yang sesuai dengan target kalori dan makronutrien Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="font-medium text-yellow-800 mb-1">Sarapan</div>
                  <div className="text-sm text-gray-600">{recommendation.mealExample.breakfast}</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-800 mb-1">Makan Siang</div>
                  <div className="text-sm text-gray-600">{recommendation.mealExample.lunch}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-800 mb-1">Makan Malam</div>
                  <div className="text-sm text-gray-600">{recommendation.mealExample.dinner}</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-medium text-purple-800 mb-1">Snack</div>
                  <div className="text-sm text-gray-600">{recommendation.mealExample.snack}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Tips Sukses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {recommendation.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div className="text-sm text-gray-700">{tip}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button 
            onClick={onStartChat}
            size="lg"
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-8 py-4"
          >
            <Heart className="w-5 h-5 mr-2" />
            Mulai Chat dengan AI Health Buddy
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Tanya apa saja tentang nutrisi, olahraga, atau kesehatan. AI Buddy siap membantu! 🤖
          </p>
        </div>
      </div>
    </div>
  )
}