import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { 
  Dumbbell, 
  Target,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Calendar,
  TrendingUp,
  Award,
  Flame,
  Activity,
  Plus,
  Search,
  Filter,
  CheckCircle2
} from "lucide-react"
import { User } from '../lib/auth'
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface ExercisePageProps {
  user: User;
}

interface WorkoutStats {
  todayWorkouts: number;
  weeklyGoal: number;
  caloriesBurned: number;
  totalMinutes: number;
  streak: number;
}

interface Exercise {
  id: string;
  name: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  calories: number;
  equipment: string[];
  instructions: string[];
  image: string;
  muscles: string[];
}

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
  image: string;
  totalCalories: number;
}

interface WorkoutHistory {
  id: string;
  planName: string;
  date: string;
  duration: number;
  caloriesBurned: number;
  completed: boolean;
}

export default function ExercisePage({ user }: ExercisePageProps) {
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats>({
    todayWorkouts: 1,
    weeklyGoal: 5,
    caloriesBurned: 320,
    totalMinutes: 45,
    streak: 7
  })

  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([
    {
      id: '1',
      name: 'Full Body Strength',
      description: 'Latihan kekuatan untuk seluruh tubuh',
      duration: 45,
      difficulty: 'intermediate',
      totalCalories: 350,
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&h=200&fit=crop',
      exercises: [
        {
          id: '1',
          name: 'Push-ups',
          category: 'strength',
          difficulty: 'beginner',
          duration: 10,
          calories: 50,
          equipment: ['body weight'],
          muscles: ['chest', 'shoulders', 'triceps'],
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=150&fit=crop',
          instructions: [
            'Posisi plank dengan tangan selebar bahu',
            'Turunkan tubuh hingga dada hampir menyentuh lantai',
            'Dorong tubuh kembali ke posisi awal',
            'Ulangi gerakan dengan kontrol'
          ]
        },
        {
          id: '2',
          name: 'Squats',
          category: 'strength',
          difficulty: 'beginner',
          duration: 12,
          calories: 60,
          equipment: ['body weight'],
          muscles: ['quadriceps', 'glutes', 'hamstrings'],
          image: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=200&h=150&fit=crop',
          instructions: [
            'Berdiri dengan kaki selebar bahu',
            'Turunkan tubuh seperti duduk di kursi',
            'Pastikan lutut tidak melewati ujung kaki',
            'Kembali ke posisi berdiri'
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'HIIT Cardio',
      description: 'High-intensity interval training untuk membakar kalori',
      duration: 30,
      difficulty: 'advanced',
      totalCalories: 400,
      image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=300&h=200&fit=crop',
      exercises: [
        {
          id: '3',
          name: 'Burpees',
          category: 'cardio',
          difficulty: 'advanced',
          duration: 8,
          calories: 100,
          equipment: ['body weight'],
          muscles: ['full body'],
          image: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=200&h=150&fit=crop',
          instructions: [
            'Mulai dari posisi berdiri',
            'Jongkok dan letakkan tangan di lantai',
            'Lompat kaki ke belakang ke posisi plank',
            'Lakukan push-up, lompat kaki ke depan, lalu lompat ke atas'
          ]
        }
      ]
    },
    {
      id: '3',
      name: 'Yoga Flow',
      description: 'Gerakan yoga untuk fleksibilitas dan relaksasi',
      duration: 35,
      difficulty: 'beginner',
      totalCalories: 150,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop',
      exercises: []
    }
  ])

  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>([
    {
      id: '1',
      planName: 'Full Body Strength',
      date: '2024-01-15',
      duration: 45,
      caloriesBurned: 350,
      completed: true
    },
    {
      id: '2',
      planName: 'HIIT Cardio',
      date: '2024-01-14',
      duration: 30,
      caloriesBurned: 400,
      completed: true
    },
    {
      id: '3',
      planName: 'Yoga Flow',
      date: '2024-01-13',
      duration: 35,
      caloriesBurned: 150,
      completed: true
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutPlan | null>(null)
  const [isWorkoutActive, setIsWorkoutActive] = useState(false)
  const [workoutTimer, setWorkoutTimer] = useState(0)

  const filteredWorkoutPlans = workoutPlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty = selectedDifficulty === 'all' || plan.difficulty === selectedDifficulty
    return matchesSearch && matchesDifficulty
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Pemula'
      case 'intermediate': return 'Menengah'
      case 'advanced': return 'Mahir'
      default: return difficulty
    }
  }

  const startWorkout = (plan: WorkoutPlan) => {
    setCurrentWorkout(plan)
    setIsWorkoutActive(true)
    setWorkoutTimer(0)
  }

  const stopWorkout = () => {
    setIsWorkoutActive(false)
    setCurrentWorkout(null)
    setWorkoutTimer(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isWorkoutActive])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Olahraga</h1>
          <p className="text-gray-600">Tingkatkan kebugaran dan kesehatan Anda</p>
        </div>
        <Button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Workout Baru
        </Button>
      </div>

      {/* Active Workout Banner */}
      {currentWorkout && (
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-orange-900">{currentWorkout.name}</h3>
                  <p className="text-orange-700">Durasi: {formatTime(workoutTimer)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={isWorkoutActive ? "secondary" : "default"}
                  size="sm"
                  onClick={() => setIsWorkoutActive(!isWorkoutActive)}
                >
                  {isWorkoutActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={stopWorkout}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workouts">Program Latihan</TabsTrigger>
          <TabsTrigger value="exercises">Library Exercise</TabsTrigger>
          <TabsTrigger value="history">Riwayat</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Workout Hari Ini</CardTitle>
                <Dumbbell className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workoutStats.todayWorkouts}</div>
                <p className="text-xs text-muted-foreground">
                  Target: {workoutStats.weeklyGoal} kali/minggu
                </p>
                <Progress 
                  value={(workoutStats.todayWorkouts / workoutStats.weeklyGoal) * 100} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kalori Terbakar</CardTitle>
                <Flame className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workoutStats.caloriesBurned}</div>
                <p className="text-xs text-muted-foreground">
                  hari ini
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Waktu</CardTitle>
                <Timer className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workoutStats.totalMinutes}</div>
                <p className="text-xs text-muted-foreground">
                  menit hari ini
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Streak</CardTitle>
                <Award className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workoutStats.streak}</div>
                <p className="text-xs text-muted-foreground">
                  hari berturut-turut
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Goal Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Target Mingguan</CardTitle>
              <CardDescription>Progress workout minggu ini</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span>1 dari {workoutStats.weeklyGoal} workout</span>
                <span>{Math.round((1 / workoutStats.weeklyGoal) * 100)}%</span>
              </div>
              <Progress value={(1 / workoutStats.weeklyGoal) * 100} className="mb-4" />
              <p className="text-sm text-gray-600">
                Bagus! Anda sudah menyelesaikan 1 workout hari ini. Lanjutkan untuk mencapai target mingguan!
              </p>
            </CardContent>
          </Card>

          {/* Quick Start Workouts */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
              <CardDescription>Mulai workout favorit Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {workoutPlans.slice(0, 3).map((plan) => (
                  <div key={plan.id} className="border rounded-lg p-4 space-y-3">
                    <img 
                      src={plan.image} 
                      alt={plan.name}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="font-medium">{plan.name}</h3>
                      <p className="text-sm text-gray-600">{plan.duration} min • {plan.totalCalories} kal</p>
                    </div>
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={() => startWorkout(plan)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Mulai
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workouts Tab */}
        <TabsContent value="workouts" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari program workout..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Tingkat Kesulitan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Level</SelectItem>
                <SelectItem value="beginner">Pemula</SelectItem>
                <SelectItem value="intermediate">Menengah</SelectItem>
                <SelectItem value="advanced">Mahir</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Workout Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkoutPlans.map((plan) => (
              <Card key={plan.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  <img 
                    src={plan.image} 
                    alt={plan.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-lg">{plan.name}</h3>
                    <Badge className={getDifficultyColor(plan.difficulty)}>
                      {getDifficultyText(plan.difficulty)}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{plan.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Timer className="w-4 h-4" />
                      <span>{plan.duration} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Flame className="w-4 h-4" />
                      <span>{plan.totalCalories} kal</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={() => startWorkout(plan)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Mulai Workout
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      Lihat Detail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Exercises Tab */}
        <TabsContent value="exercises" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Library Exercise</CardTitle>
              <CardDescription>Koleksi gerakan olahraga dengan panduan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workoutPlans[0].exercises.map((exercise) => (
                  <div key={exercise.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img 
                      src={exercise.image} 
                      alt={exercise.name}
                      className="w-20 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{exercise.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{exercise.muscles.join(', ')}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>{exercise.duration} min</span>
                        <span>{exercise.calories} kal</span>
                        <Badge className={getDifficultyColor(exercise.difficulty)}>
                          {getDifficultyText(exercise.difficulty)}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Lihat Panduan
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Workout</CardTitle>
              <CardDescription>Aktivitas olahraga Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workoutHistory.map((workout) => (
                  <div key={workout.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{workout.planName}</h3>
                        <p className="text-sm text-gray-500">{workout.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{workout.caloriesBurned} kal</div>
                      <div className="text-sm text-gray-500">{workout.duration} menit</div>
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