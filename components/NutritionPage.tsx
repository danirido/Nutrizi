import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { 
  Apple, 
  Calculator, 
  ChefHat, 
  Clock, 
  Plus, 
  Target,
  Utensils,
  Zap,
  BookOpen,
  Calendar,
  Search,
  Filter
} from "lucide-react"
import { User } from '../lib/auth'
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface NutritionPageProps {
  user: User;
}

interface NutritionData {
  dailyCalories: number;
  consumedCalories: number;
  protein: { target: number; consumed: number };
  carbs: { target: number; consumed: number };
  fat: { target: number; consumed: number };
  water: { target: number; consumed: number };
}

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface Recipe {
  id: string;
  name: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: string[];
  instructions: string[];
  category: string;
}

export default function NutritionPage({ user }: NutritionPageProps) {
  const [nutritionData, setNutritionData] = useState<NutritionData>({
    dailyCalories: 2200,
    consumedCalories: 1650,
    protein: { target: 165, consumed: 120 },
    carbs: { target: 275, consumed: 180 },
    fat: { target: 73, consumed: 55 },
    water: { target: 2500, consumed: 1800 }
  })

  const [todayMeals, setTodayMeals] = useState<Meal[]>([
    {
      id: '1',
      name: 'Oatmeal dengan Buah',
      calories: 350,
      protein: 12,
      carbs: 65,
      fat: 8,
      time: '07:30',
      type: 'breakfast'
    },
    {
      id: '2',
      name: 'Ayam Panggang + Nasi Merah',
      calories: 520,
      protein: 45,
      carbs: 48,
      fat: 18,
      time: '12:30',
      type: 'lunch'
    },
    {
      id: '3',
      name: 'Salmon Teriyaki + Sayuran',
      calories: 480,
      protein: 38,
      carbs: 32,
      fat: 22,
      time: '19:00',
      type: 'dinner'
    },
    {
      id: '4',
      name: 'Greek Yogurt + Almond',
      calories: 200,
      protein: 15,
      carbs: 12,
      fat: 8,
      time: '15:30',
      type: 'snack'
    }
  ])

  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: '1',
      name: 'Salmon Teriyaki Bowl',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
      calories: 480,
      protein: 38,
      carbs: 32,
      fat: 22,
      prepTime: 25,
      difficulty: 'medium',
      category: 'protein',
      ingredients: [
        '200g salmon fillet',
        '150g nasi merah',
        '100g brokoli',
        '50g edamame',
        '2 sdm saus teriyaki',
        '1 sdt minyak wijen'
      ],
      instructions: [
        'Marinasi salmon dengan saus teriyaki selama 15 menit',
        'Kukus brokoli dan edamame hingga tender',
        'Panggang salmon di teflon dengan sedikit minyak',
        'Sajikan dengan nasi merah dan sayuran'
      ]
    },
    {
      id: '2',
      name: 'Protein Smoothie Bowl',
      image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=300&h=200&fit=crop',
      calories: 320,
      protein: 25,
      carbs: 28,
      fat: 12,
      prepTime: 10,
      difficulty: 'easy',
      category: 'breakfast',
      ingredients: [
        '1 scoop whey protein vanilla',
        '150ml susu almond',
        '80g frozen berry',
        '1 sdm chia seed',
        '1 sdm almond slice'
      ],
      instructions: [
        'Blend protein powder, susu almond, dan frozen berry',
        'Tuang ke dalam bowl',
        'Taburi dengan chia seed dan almond slice',
        'Sajikan segera'
      ]
    },
    {
      id: '3',
      name: 'Quinoa Power Salad',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
      calories: 420,
      protein: 18,
      carbs: 45,
      fat: 20,
      prepTime: 20,
      difficulty: 'easy',
      category: 'salad',
      ingredients: [
        '100g quinoa',
        '150g mixed greens',
        '100g grilled chicken',
        '50g avocado',
        '30g feta cheese',
        '2 sdm olive oil dressing'
      ],
      instructions: [
        'Masak quinoa hingga fluffy',
        'Campurkan dengan mixed greens',
        'Tambahkan grilled chicken dan avocado',
        'Taburi feta cheese dan dressing'
      ]
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return '🌅'
      case 'lunch': return '☀️'
      case 'dinner': return '🌙'
      case 'snack': return '🍎'
      default: return '🍽️'
    }
  }

  const getMealTypeName = (type: string) => {
    switch (type) {
      case 'breakfast': return 'Sarapan'
      case 'lunch': return 'Makan Siang'
      case 'dinner': return 'Makan Malam'
      case 'snack': return 'Snack'
      default: return 'Makanan'
    }
  }

  const calculatePercentage = (consumed: number, target: number) => {
    return Math.min((consumed / target) * 100, 100)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nutrisi</h1>
          <p className="text-gray-600">Kelola asupan nutrisi harian Anda</p>
        </div>
        <Button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Makanan
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="meals">Makanan Hari Ini</TabsTrigger>
          <TabsTrigger value="recipes">Resep</TabsTrigger>
          <TabsTrigger value="meal-plan">Meal Plan</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Daily Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kalori</CardTitle>
                <Zap className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{nutritionData.consumedCalories}</div>
                <p className="text-xs text-muted-foreground">
                  dari {nutritionData.dailyCalories} target
                </p>
                <Progress 
                  value={calculatePercentage(nutritionData.consumedCalories, nutritionData.dailyCalories)} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Protein</CardTitle>
                <Target className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{nutritionData.protein.consumed}g</div>
                <p className="text-xs text-muted-foreground">
                  dari {nutritionData.protein.target}g target
                </p>
                <Progress 
                  value={calculatePercentage(nutritionData.protein.consumed, nutritionData.protein.target)} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Karbohidrat</CardTitle>
                <Apple className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{nutritionData.carbs.consumed}g</div>
                <p className="text-xs text-muted-foreground">
                  dari {nutritionData.carbs.target}g target
                </p>
                <Progress 
                  value={calculatePercentage(nutritionData.carbs.consumed, nutritionData.carbs.target)} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lemak</CardTitle>
                <Calculator className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{nutritionData.fat.consumed}g</div>
                <p className="text-xs text-muted-foreground">
                  dari {nutritionData.fat.target}g target
                </p>
                <Progress 
                  value={calculatePercentage(nutritionData.fat.consumed, nutritionData.fat.target)} 
                  className="mt-2"
                />
              </CardContent>
            </Card>
          </div>

          {/* Macronutrient Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Breakdown Makronutrien</CardTitle>
              <CardDescription>Distribusi kalori dari setiap makronutrien</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Protein ({nutritionData.protein.consumed}g)</span>
                  </div>
                  <span>{nutritionData.protein.consumed * 4} kal</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Karbohidrat ({nutritionData.carbs.consumed}g)</span>
                  </div>
                  <span>{nutritionData.carbs.consumed * 4} kal</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Lemak ({nutritionData.fat.consumed}g)</span>
                  </div>
                  <span>{nutritionData.fat.consumed * 9} kal</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Water Intake */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>💧</span>
                <span>Konsumsi Air</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span>{nutritionData.water.consumed}ml</span>
                <span>Target: {nutritionData.water.target}ml</span>
              </div>
              <Progress 
                value={calculatePercentage(nutritionData.water.consumed, nutritionData.water.target)} 
                className="mb-4"
              />
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">+250ml</Button>
                <Button size="sm" variant="outline">+500ml</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Meals Tab */}
        <TabsContent value="meals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Makanan Hari Ini</CardTitle>
              <CardDescription>Daftar makanan yang sudah dikonsumsi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayMeals.map((meal) => (
                  <div key={meal.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{getMealTypeIcon(meal.type)}</div>
                      <div>
                        <h3 className="font-medium">{meal.name}</h3>
                        <p className="text-sm text-gray-500">
                          {getMealTypeName(meal.type)} • {meal.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{meal.calories} kal</div>
                      <div className="text-sm text-gray-500">
                        P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recipes Tab */}
        <TabsContent value="recipes" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari resep..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="breakfast">Sarapan</SelectItem>
                <SelectItem value="lunch">Makan Siang</SelectItem>
                <SelectItem value="dinner">Makan Malam</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
                <SelectItem value="protein">High Protein</SelectItem>
                <SelectItem value="salad">Salad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Recipe Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  <img 
                    src={recipe.image} 
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-lg">{recipe.name}</h3>
                    <Badge variant={recipe.difficulty === 'easy' ? 'default' : recipe.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                      {recipe.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.prepTime} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="w-4 h-4" />
                      <span>{recipe.calories} kal</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    P: {recipe.protein}g • C: {recipe.carbs}g • F: {recipe.fat}g
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full" size="sm">
                      <ChefHat className="w-4 h-4 mr-2" />
                      Lihat Resep
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Meal Plan Tab */}
        <TabsContent value="meal-plan" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Meal Plan Mingguan</span>
              </CardTitle>
              <CardDescription>Rencana makan untuk 7 hari ke depan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, index) => (
                  <div key={day} className="border rounded-lg p-4 space-y-3">
                    <h3 className="font-medium text-center">{day}</h3>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <div className="text-xs text-gray-500">Sarapan</div>
                        <div>Oatmeal + Buah</div>
                      </div>
                      <div className="text-sm">
                        <div className="text-xs text-gray-500">Siang</div>
                        <div>Ayam + Nasi</div>
                      </div>
                      <div className="text-sm">
                        <div className="text-xs text-gray-500">Malam</div>
                        <div>Salmon + Sayur</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      <Plus className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
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