import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { 
  TrendingUp, 
  Target,
  Calendar,
  Award,
  Scale,
  Heart,
  Zap,
  Clock,
  Plus,
  Download,
  Share2,
  BarChart3,
  LineChart,
  Activity
} from "lucide-react"
import { User } from '../lib/auth'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface ProgressPageProps {
  user: User;
}

interface HealthMetrics {
  weight: number;
  bodyFat: number;
  muscleMass: number;
  bmi: number;
  restingHeartRate: number;
  bloodPressure: string;
}

interface WeightData {
  date: string;
  weight: number;
  bodyFat?: number;
}

interface CalorieData {
  date: string;
  consumed: number;
  burned: number;
  target: number;
}

interface WorkoutData {
  date: string;
  duration: number;
  calories: number;
  type: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  target?: number;
}

export default function ProgressPage({ user }: ProgressPageProps) {
  const [currentMetrics, setCurrentMetrics] = useState<HealthMetrics>({
    weight: 68.5,
    bodyFat: 18.2,
    muscleMass: 55.8,
    bmi: 23.1,
    restingHeartRate: 65,
    bloodPressure: '120/80'
  })

  const [weightData, setWeightData] = useState<WeightData[]>([
    { date: '2024-01-01', weight: 70.2, bodyFat: 19.5 },
    { date: '2024-01-08', weight: 69.8, bodyFat: 19.2 },
    { date: '2024-01-15', weight: 69.3, bodyFat: 18.8 },
    { date: '2024-01-22', weight: 68.9, bodyFat: 18.5 },
    { date: '2024-01-29', weight: 68.5, bodyFat: 18.2 }
  ])

  const [calorieData, setCalorieData] = useState<CalorieData[]>([
    { date: '2024-01-22', consumed: 2150, burned: 2380, target: 2200 },
    { date: '2024-01-23', consumed: 2050, burned: 2250, target: 2200 },
    { date: '2024-01-24', consumed: 2300, burned: 2450, target: 2200 },
    { date: '2024-01-25', consumed: 2100, burned: 2320, target: 2200 },
    { date: '2024-01-26', consumed: 2250, burned: 2400, target: 2200 },
    { date: '2024-01-27', consumed: 2000, burned: 2350, target: 2200 },
    { date: '2024-01-28', consumed: 2180, burned: 2390, target: 2200 }
  ])

  const [workoutData, setWorkoutData] = useState<WorkoutData[]>([
    { date: '2024-01-22', duration: 45, calories: 350, type: 'strength' },
    { date: '2024-01-23', duration: 30, calories: 400, type: 'cardio' },
    { date: '2024-01-25', duration: 35, calories: 200, type: 'yoga' },
    { date: '2024-01-27', duration: 50, calories: 450, type: 'strength' },
    { date: '2024-01-28', duration: 25, calories: 350, type: 'hiit' }
  ])

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Week',
      description: 'Menyelesaikan 1 minggu pertama',
      icon: '🎯',
      earned: true,
      earnedDate: '2024-01-08'
    },
    {
      id: '2',
      title: 'Calorie Master',
      description: 'Mencapai target kalori 7 hari berturut-turut',
      icon: '🔥',
      earned: true,
      earnedDate: '2024-01-15'
    },
    {
      id: '3',
      title: 'Workout Warrior',
      description: 'Menyelesaikan 10 workout',
      icon: '💪',
      earned: false,
      progress: 7,
      target: 10
    },
    {
      id: '4',
      title: 'Weight Loss Champion',
      description: 'Turun berat badan 2kg',
      icon: '⚖️',
      earned: false,
      progress: 1.7,
      target: 2
    },
    {
      id: '5',
      title: 'Consistency King',
      description: 'Login 30 hari berturut-turut',
      icon: '👑',
      earned: false,
      progress: 15,
      target: 30
    }
  ])

  const [selectedPeriod, setSelectedPeriod] = useState('7d')

  const calculateWeightChange = () => {
    if (weightData.length < 2) return 0
    const latest = weightData[weightData.length - 1].weight
    const previous = weightData[weightData.length - 2].weight
    return latest - previous
  }

  const calculateAverageCalorieDeficit = () => {
    const totalDeficit = calorieData.reduce((sum, day) => sum + (day.burned - day.consumed), 0)
    return Math.round(totalDeficit / calorieData.length)
  }

  const getWorkoutFrequency = () => {
    const daysWithWorkout = workoutData.length
    const totalDays = 7 // Last 7 days
    return Math.round((daysWithWorkout / totalDays) * 100)
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' }
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' }
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' }
    return { category: 'Obese', color: 'text-red-600' }
  }

  const macroData = [
    { name: 'Protein', value: 25, color: '#ef4444' },
    { name: 'Karbohidrat', value: 50, color: '#22c55e' },
    { name: 'Lemak', value: 25, color: '#eab308' }
  ]

  const getPeriodData = () => {
    switch (selectedPeriod) {
      case '7d':
        return calorieData.slice(-7)
      case '30d':
        return calorieData.slice(-30)
      case '90d':
        return calorieData.slice(-90)
      default:
        return calorieData
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progress</h1>
          <p className="text-gray-600">Pantau perkembangan kesehatan dan kebugaran Anda</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Bagikan
          </Button>
          <Button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Input Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="weight">Berat Badan</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrisi</TabsTrigger>
          <TabsTrigger value="fitness">Fitness</TabsTrigger>
          <TabsTrigger value="achievements">Pencapaian</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Berat Badan</CardTitle>
                <Scale className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentMetrics.weight} kg</div>
                <p className={`text-xs ${calculateWeightChange() < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {calculateWeightChange() > 0 ? '+' : ''}{calculateWeightChange().toFixed(1)}kg minggu ini
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">BMI</CardTitle>
                <Target className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentMetrics.bmi}</div>
                <p className={`text-xs ${getBMICategory(currentMetrics.bmi).color}`}>
                  {getBMICategory(currentMetrics.bmi).category}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kalori Defisit</CardTitle>
                <Zap className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{calculateAverageCalorieDeficit()}</div>
                <p className="text-xs text-muted-foreground">
                  rata-rata per hari
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Workout Frequency</CardTitle>
                <Activity className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getWorkoutFrequency()}%</div>
                <p className="text-xs text-muted-foreground">
                  dari target mingguan
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Health Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Metrik Kesehatan</CardTitle>
              <CardDescription>Data kesehatan terkini Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Body Fat</span>
                    <span className="text-sm">{currentMetrics.bodyFat}%</span>
                  </div>
                  <Progress value={currentMetrics.bodyFat} className="h-2" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Muscle Mass</span>
                    <span className="text-sm">{currentMetrics.muscleMass} kg</span>
                  </div>
                  <Progress value={(currentMetrics.muscleMass / currentMetrics.weight) * 100} className="h-2" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Resting HR</span>
                    <span className="text-sm">{currentMetrics.restingHeartRate} bpm</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600">Excellent</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tren Berat Badan</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsLineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#8884d8" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribusi Makronutrien</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-4 mt-4">
                  {macroData.map((item) => (
                    <div key={item.name} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Weight Tab */}
        <TabsContent value="weight" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Tracking Berat Badan</h2>
              <p className="text-gray-600">Pantau perubahan berat badan dari waktu ke waktu</p>
            </div>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Hari</SelectItem>
                <SelectItem value="30d">30 Hari</SelectItem>
                <SelectItem value="90d">90 Hari</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Weight Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Grafik Berat Badan</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RechartsLineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={3} />
                  <Line type="monotone" dataKey="bodyFat" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weight Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Berat Saat Ini</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentMetrics.weight} kg</div>
                <p className="text-sm text-gray-600">Terakhir update hari ini</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Perubahan Minggu Ini</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${calculateWeightChange() < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {calculateWeightChange() > 0 ? '+' : ''}{calculateWeightChange().toFixed(1)} kg
                </div>
                <p className="text-sm text-gray-600">
                  {calculateWeightChange() < 0 ? 'Turun' : 'Naik'} dari minggu lalu
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Target Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">65 kg</div>
                <p className="text-sm text-gray-600">Target dalam 3 bulan</p>
                <Progress value={75} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Nutrition Tab */}
        <TabsContent value="nutrition" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tren Kalori</CardTitle>
              <CardDescription>Perbandingan kalori masuk vs kalori keluar</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={getPeriodData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="consumed" fill="#ef4444" name="Dikonsumsi" />
                  <Bar dataKey="burned" fill="#22c55e" name="Dibakar" />
                  <Line type="monotone" dataKey="target" stroke="#8884d8" strokeWidth={2} name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rata-rata Harian</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Kalori Dikonsumsi</span>
                  <span className="font-medium">2,150 kal</span>
                </div>
                <div className="flex justify-between">
                  <span>Kalori Dibakar</span>
                  <span className="font-medium">2,350 kal</span>
                </div>
                <div className="flex justify-between">
                  <span>Defisit Harian</span>
                  <span className="font-medium text-green-600">-200 kal</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribusi Makronutrien</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Protein (25%)</span>
                      <span className="text-sm">135g</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Karbohidrat (50%)</span>
                      <span className="text-sm">270g</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Lemak (25%)</span>
                      <span className="text-sm">60g</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Fitness Tab */}
        <TabsContent value="fitness" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Workout</CardTitle>
              <CardDescription>Durasi dan kalori yang dibakar dari workout</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={workoutData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="duration" fill="#8884d8" name="Durasi (menit)" />
                  <Bar dataKey="calories" fill="#82ca9d" name="Kalori" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Workout</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workoutData.length}</div>
                <p className="text-sm text-gray-600">minggu ini</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Durasi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {workoutData.reduce((sum, w) => sum + w.duration, 0)} min
                </div>
                <p className="text-sm text-gray-600">waktu latihan</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Kalori Terbakar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {workoutData.reduce((sum, w) => sum + w.calories, 0)} kal
                </div>
                <p className="text-sm text-gray-600">dari exercise</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pencapaian</CardTitle>
              <CardDescription>Badge dan milestone yang telah Anda raih</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 border rounded-lg ${
                      achievement.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-medium">{achievement.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        
                        {achievement.earned ? (
                          <Badge className="bg-green-100 text-green-800">
                            <Award className="w-3 h-3 mr-1" />
                            Tercapai
                          </Badge>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.target}</span>
                            </div>
                            <Progress 
                              value={((achievement.progress || 0) / (achievement.target || 1)) * 100} 
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}