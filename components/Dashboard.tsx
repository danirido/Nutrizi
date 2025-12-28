import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { Badge } from "./ui/badge"
import { 
  Activity, 
  Apple, 
  Dumbbell, 
  Moon, 
  Droplets, 
  TrendingUp,
  Calendar,
  Target,
  Plus
} from "lucide-react"
import { User } from '../lib/auth'
import { HealthEntry, healthDataService } from '../lib/healthData'

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const [healthData, setHealthData] = useState<HealthEntry | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTodayData()
  }, [user.id])

  const loadTodayData = async () => {
    setLoading(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      const data = await healthDataService.getHealthEntry(user.id, today)
      setHealthData(data)
    } catch (error) {
      console.error('Failed to load health data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCalorieGoal = () => {
    // Simple BMR calculation based on user profile
    const { profile } = user
    const bmr = profile.gender === 'male' 
      ? 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age)
      : 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age)
    
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    }
    
    const tdee = bmr * activityMultipliers[profile.activityLevel]
    
    // Adjust based on goal
    switch (profile.goal) {
      case 'lose_weight':
        return Math.round(tdee - 300)
      case 'gain_weight':
        return Math.round(tdee + 300)
      case 'build_muscle':
        return Math.round(tdee + 200)
      default:
        return Math.round(tdee)
    }
  }

  const calorieGoal = getCalorieGoal()
  const currentCalories = healthData?.calories || 0
  const calorieProgress = Math.min((currentCalories / calorieGoal) * 100, 100)

  const statsCards = [
    {
      title: "Kalori Hari Ini",
      value: `${currentCalories}`,
      target: `/ ${calorieGoal}`,
      progress: calorieProgress,
      icon: <Apple className="w-5 h-5 text-green-500" />,
      color: "green"
    },
    {
      title: "Langkah Kaki",
      value: `${healthData?.steps || 0}`,
      target: "/ 10,000",
      progress: Math.min(((healthData?.steps || 0) / 10000) * 100, 100),
      icon: <Activity className="w-5 h-5 text-blue-500" />,
      color: "blue"
    },
    {
      title: "Air Minum",
      value: `${(healthData?.water || 0) / 1000}L`,
      target: "/ 2.5L",
      progress: Math.min(((healthData?.water || 0) / 2500) * 100, 100),
      icon: <Droplets className="w-5 h-5 text-cyan-500" />,
      color: "cyan"
    },
    {
      title: "Tidur",
      value: `${healthData?.sleep || 0}h`,
      target: "/ 8h",
      progress: Math.min(((healthData?.sleep || 0) / 8) * 100, 100),
      icon: <Moon className="w-5 h-5 text-purple-500" />,
      color: "purple"
    }
  ]

  const quickActions = [
    {
      label: "Tambah Makanan",
      icon: <Apple className="w-4 h-4" />,
      action: () => console.log("Add meal")
    },
    {
      label: "Catat Olahraga", 
      icon: <Dumbbell className="w-4 h-4" />,
      action: () => console.log("Add exercise")
    },
    {
      label: "Update Berat",
      icon: <TrendingUp className="w-4 h-4" />,
      action: () => console.log("Update weight")
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Selamat datang, {user.name}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Mari lihat progress kesehatan Anda hari ini
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {new Date().toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.value}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  {stat.target}
                </span>
              </div>
              <div className="mt-3">
                <Progress value={stat.progress} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round(stat.progress)}% dari target
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Today's Summary */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start"
                onClick={action.action}
              >
                {action.icon}
                <span className="ml-2">{action.label}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Today's Goal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Tujuan Hari Ini</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Kalori</span>
                <Badge variant={calorieProgress >= 80 ? "default" : "secondary"}>
                  {Math.round(calorieProgress)}%
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Aktivitas Fisik</span>
                <Badge variant={healthData?.exercises.length ? "default" : "secondary"}>
                  {healthData?.exercises.length || 0} selesai
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Hidrasi</span>
                <Badge variant={(healthData?.water || 0) >= 2000 ? "default" : "secondary"}>
                  {Math.round(((healthData?.water || 0) / 2500) * 100)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthData?.meals.slice(0, 2).map((meal, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{meal.name}</p>
                    <p className="text-xs text-gray-500">{meal.calories} kal</p>
                  </div>
                  <span className="text-xs text-gray-400">{meal.time}</span>
                </div>
              ))}
              
              {healthData?.exercises.slice(0, 2).map((exercise, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{exercise.name}</p>
                    <p className="text-xs text-gray-500">{exercise.duration} menit</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {exercise.calories} kal
                  </span>
                </div>
              ))}
              
              {(!healthData?.meals.length && !healthData?.exercises.length) && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Belum ada aktivitas hari ini
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}