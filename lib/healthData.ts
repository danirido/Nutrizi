// Health data types and mock service
export interface HealthEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  water: number; // in ml
  steps: number;
  sleep: number; // in hours
  weight?: number;
  exercises: Exercise[];
  meals: Meal[];
}

export interface Exercise {
  id: string;
  name: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'sports';
  duration: number; // in minutes
  calories: number;
  sets?: number;
  reps?: number;
  weight?: number; // in kg
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  time: string; // HH:MM
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  instructions: string[];
  tags: string[];
}

// Mock data
const mockHealthEntries: HealthEntry[] = [
  {
    id: '1',
    userId: '1',
    date: '2024-01-20',
    calories: 1850,
    protein: 120,
    carbs: 180,
    fats: 65,
    water: 2200,
    steps: 8500,
    sleep: 7.5,
    weight: 64.5,
    exercises: [
      {
        id: '1',
        name: 'Morning Jog',
        type: 'cardio',
        duration: 30,
        calories: 300
      },
      {
        id: '2',
        name: 'Push-ups',
        type: 'strength',
        duration: 10,
        calories: 50,
        sets: 3,
        reps: 15
      }
    ],
    meals: [
      {
        id: '1',
        name: 'Oatmeal with Berries',
        type: 'breakfast',
        calories: 320,
        protein: 12,
        carbs: 55,
        fats: 8,
        ingredients: ['oats', 'blueberries', 'almond milk', 'honey'],
        time: '07:30'
      },
      {
        id: '2',
        name: 'Grilled Chicken Salad',
        type: 'lunch',
        calories: 450,
        protein: 35,
        carbs: 25,
        fats: 22,
        ingredients: ['chicken breast', 'mixed greens', 'cherry tomatoes', 'cucumber', 'olive oil'],
        time: '12:30'
      }
    ]
  }
];

const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Overnight Oats Berry Delight',
    description: 'Healthy breakfast yang mudah disiapkan malam sebelumnya',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    calories: 320,
    protein: 12,
    carbs: 55,
    fats: 8,
    ingredients: [
      '1/2 cangkir rolled oats',
      '1/2 cangkir susu almond',
      '1 sdt madu',
      '1/4 cangkir blueberry',
      '1 sdt chia seeds',
      '1/4 sdt vanilla extract'
    ],
    instructions: [
      'Campurkan oats, susu almond, madu, dan vanilla dalam jar',
      'Aduk rata dan tambahkan chia seeds',
      'Tutup jar dan simpan di kulkas semalaman',
      'Pagi hari, tambahkan blueberry di atas',
      'Siap disantap!'
    ],
    tags: ['breakfast', 'healthy', 'vegetarian', 'prep-ahead']
  },
  {
    id: '2',
    name: 'Protein Power Bowl',
    description: 'Bowl bergizi tinggi protein untuk recovery post-workout',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    prepTime: 15,
    cookTime: 20,
    servings: 1,
    calories: 520,
    protein: 42,
    carbs: 35,
    fats: 22,
    ingredients: [
      '150g chicken breast',
      '1/2 cangkir quinoa',
      '1 cangkir broccoli',
      '1/2 avocado',
      '2 sdt olive oil',
      'Garam dan merica secukupnya'
    ],
    instructions: [
      'Masak quinoa sesuai petunjuk kemasan',
      'Panggang chicken breast dengan sedikit olive oil',
      'Steam broccoli hingga tender',
      'Potong avocado',
      'Susun semua dalam bowl dan siap disajikan'
    ],
    tags: ['lunch', 'high-protein', 'post-workout', 'balanced']
  }
];

export const healthDataService = {
  getHealthEntry: async (userId: string, date: string): Promise<HealthEntry | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockHealthEntries.find(entry => entry.userId === userId && entry.date === date) || null;
  },

  getHealthHistory: async (userId: string, days: number = 7): Promise<HealthEntry[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockHealthEntries.filter(entry => entry.userId === userId).slice(0, days);
  },

  updateHealthEntry: async (entry: Partial<HealthEntry>): Promise<HealthEntry> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const existingIndex = mockHealthEntries.findIndex(e => e.id === entry.id);
    
    if (existingIndex >= 0) {
      mockHealthEntries[existingIndex] = { ...mockHealthEntries[existingIndex], ...entry };
      return mockHealthEntries[existingIndex];
    }
    
    const newEntry: HealthEntry = {
      id: Date.now().toString(),
      userId: entry.userId || '1',
      date: entry.date || new Date().toISOString().split('T')[0],
      calories: entry.calories || 0,
      protein: entry.protein || 0,
      carbs: entry.carbs || 0,
      fats: entry.fats || 0,
      water: entry.water || 0,
      steps: entry.steps || 0,
      sleep: entry.sleep || 0,
      exercises: entry.exercises || [],
      meals: entry.meals || [],
      ...entry
    };
    
    mockHealthEntries.push(newEntry);
    return newEntry;
  },

  getRecipes: async (tags?: string[]): Promise<Recipe[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (!tags || tags.length === 0) return mockRecipes;
    
    return mockRecipes.filter(recipe => 
      tags.some(tag => recipe.tags.includes(tag))
    );
  },

  getRecipe: async (id: string): Promise<Recipe | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockRecipes.find(recipe => recipe.id === id) || null;
  }
};