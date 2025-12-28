import { useState } from 'react'
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { 
  Target, 
  TrendingDown, 
  Scale, 
  TrendingUp, 
  Dumbbell, 
  Heart,
  Zap,
  Shield,
  Clock,
  Users
} from "lucide-react"
import { User, UserProfile } from '../lib/auth'

interface GoalSelectionProps {
  user: User;
  onGoalSelect: (goal: UserProfile['goal']) => void;
}

interface GoalOption {
  id: UserProfile['goal'];
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  benefits: string[];
  timeframe: string;
  difficulty: 'Mudah' | 'Sedang' | 'Menantang';
}

const goalOptions: GoalOption[] = [
  {
    id: 'lose_weight',
    title: 'Turunkan Berat Badan',
    description: 'Capai berat badan ideal dengan pendekatan yang sehat dan berkelanjutan',
    icon: <TrendingDown className="w-8 h-8" />,
    color: 'from-red-400 to-pink-500',
    benefits: ['Defisit kalori yang aman', 'Menu rendah kalori tinggi nutrisi', 'Cardio & strength training'],
    timeframe: '3-6 bulan',
    difficulty: 'Sedang'
  },
  {
    id: 'maintain_weight',
    title: 'Pertahankan Berat Badan',
    description: 'Jaga berat badan ideal sambil meningkatkan komposisi tubuh',
    icon: <Scale className="w-8 h-8" />,
    color: 'from-green-400 to-emerald-500',
    benefits: ['Kalori seimbang', 'Nutrisi optimal', 'Olahraga maintenance'],
    timeframe: 'Berkelanjutan',
    difficulty: 'Mudah'
  },
  {
    id: 'gain_weight',
    title: 'Naikkan Berat Badan',
    description: 'Tambah massa tubuh yang sehat dengan fokus pada otot',
    icon: <TrendingUp className="w-8 h-8" />,
    color: 'from-blue-400 to-cyan-500',
    benefits: ['Surplus kalori sehat', 'Protein tinggi', 'Strength training'],
    timeframe: '4-8 bulan',
    difficulty: 'Sedang'
  },
  {
    id: 'build_muscle',
    title: 'Bangun Massa Otot',
    description: 'Fokus pada pembentukan dan penguatan otot tubuh',
    icon: <Dumbbell className="w-8 h-8" />,
    color: 'from-purple-400 to-indigo-500',
    benefits: ['Program resistance training', 'Diet tinggi protein', 'Recovery optimal'],
    timeframe: '6-12 bulan',
    difficulty: 'Menantang'
  },
  {
    id: 'improve_health',
    title: 'Tingkatkan Kesehatan',
    description: 'Fokus pada kesehatan dan kebugaran secara menyeluruh',
    icon: <Heart className="w-8 h-8" />,
    color: 'from-orange-400 to-red-500',
    benefits: ['Nutrisi seimbang', 'Aktivitas fisik rutin', 'Pola tidur sehat'],
    timeframe: 'Berkelanjutan',
    difficulty: 'Mudah'
  }
]

export default function GoalSelection({ user, onGoalSelect }: GoalSelectionProps) {
  const [selectedGoal, setSelectedGoal] = useState<UserProfile['goal'] | null>(null)
  const [hoveredGoal, setHoveredGoal] = useState<UserProfile['goal'] | null>(null)

  const handleGoalSelect = (goal: UserProfile['goal']) => {
    setSelectedGoal(goal)
  }

  const handleContinue = () => {
    if (selectedGoal) {
      onGoalSelect(selectedGoal)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Mudah': return 'bg-green-100 text-green-800'
      case 'Sedang': return 'bg-yellow-100 text-yellow-800'
      case 'Menantang': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center mb-6">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Halo, {user.name}! 👋
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Apa tujuan kesehatan utama yang ingin Anda capai?
          </p>
          <p className="text-gray-500">
            Pilih satu goal untuk mendapatkan rekomendasi yang paling sesuai dengan kebutuhan Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {goalOptions.map((goal) => (
            <Card 
              key={goal.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                selectedGoal === goal.id 
                  ? 'ring-2 ring-blue-500 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleGoalSelect(goal.id)}
              onMouseEnter={() => setHoveredGoal(goal.id)}
              onMouseLeave={() => setHoveredGoal(null)}
            >
              <CardHeader className="pb-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${goal.color} rounded-xl flex items-center justify-center text-white mb-4 mx-auto transition-transform duration-300 ${
                  hoveredGoal === goal.id ? 'scale-110' : ''
                }`}>
                  {goal.icon}
                </div>
                <CardTitle className="text-xl text-center">{goal.title}</CardTitle>
                <CardDescription className="text-center text-sm">
                  {goal.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{goal.timeframe}</span>
                    </div>
                    <Badge className={getDifficultyColor(goal.difficulty)}>
                      {goal.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">Yang akan Anda dapatkan:</span>
                    </div>
                    {goal.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedGoal && (
          <div className="text-center">
            <div className="bg-white rounded-lg border p-6 mb-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900">Goal Terpilih</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Anda memilih: <span className="font-semibold text-blue-600">
                  {goalOptions.find(g => g.id === selectedGoal)?.title}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Selanjutnya, kami akan mengumpulkan informasi dasar Anda untuk memberikan 
                rekomendasi yang personal dan akurat sesuai dengan goal ini.
              </p>
            </div>
            
            <Button 
              onClick={handleContinue}
              size="lg" 
              className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-8 py-3"
            >
              <Users className="w-5 h-5 mr-2" />
              Lanjut ke Profil Saya
            </Button>
          </div>
        )}

        {!selectedGoal && (
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              💡 Tip: Pilih goal yang paling sesuai dengan kondisi dan keinginan Anda saat ini
            </p>
          </div>
        )}
      </div>
    </div>
  )
}