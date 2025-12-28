// Mock authentication system
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  profile: UserProfile;
  subscription: Subscription;
  createdAt: string;
}

export interface Subscription {
  plan: 'free' | 'premium' | 'pro';
  isActive: boolean;
  expiresAt: string | null;
}

export interface UserProfile {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number; // in cm
  weight?: number; // in kg
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal?: 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'build_muscle' | 'improve_health';
  targetWeight?: number;
  medicalConditions?: string[];
  allergies?: string[];
  dietaryPreferences?: string[];
}

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@nutrizi.ai',
    name: 'Demo User',
    profile: {
      age: 28,
      gender: 'female',
      height: 165,
      weight: 65,
      activityLevel: 'moderate',
      goal: 'lose_weight',
      targetWeight: 60,
      medicalConditions: [],
      allergies: ['shellfish'],
      dietaryPreferences: ['vegetarian']
    },
    subscription: {
      plan: 'free',
      isActive: true,
      expiresAt: null
    },
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const authService = {
  login: async (email: string, password: string): Promise<User | null> => {
    // Mock login - in real app, this would call Supabase
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'demo123') {
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('nutrizi_user', JSON.stringify(user));
        }
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      return user;
    }
    return null;
  },

  register: async (email: string, password: string, name: string): Promise<User | null> => {
    // Mock registration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      profile: {
        age: 25,
        gender: 'other',
        height: 170,
        weight: 70,
        activityLevel: 'moderate',
        goal: 'improve_health',
        medicalConditions: [],
        allergies: [],
        dietaryPreferences: []
      },
      subscription: {
        plan: 'free',
        isActive: true,
        expiresAt: null
      },
      createdAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('nutrizi_user', JSON.stringify(newUser));
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    return newUser;
  },

  logout: () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('nutrizi_user');
      }
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  getCurrentUser: (): User | null => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('nutrizi_user');
        return stored ? JSON.parse(stored) : null;
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
    return null;
  },

  updateProfile: async (profile: Partial<UserProfile>, user?: User): Promise<User | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Use provided user or get from localStorage
    let currentUser = user || authService.getCurrentUser();
    
    if (!currentUser) {
      console.error('No current user found for profile update');
      
      // If we have a user parameter, save it to localStorage first
      if (user) {
        console.log('Saving provided user to localStorage...');
        try {
          localStorage.setItem('nutrizi_user', JSON.stringify(user));
          currentUser = user;
        } catch (error) {
          console.error('Error saving user to localStorage:', error);
          throw new Error('Failed to save user data');
        }
      } else {
        throw new Error('No current user found');
      }
    }

    // Clean up the profile data - remove undefined values
    const cleanProfile = Object.fromEntries(
      Object.entries(profile).filter(([_, value]) => value !== undefined)
    );

    const updatedUser = {
      ...currentUser,
      profile: { ...currentUser.profile, ...cleanProfile }
    };

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('nutrizi_user', JSON.stringify(updatedUser));
        
        // Update the mockUsers array for consistency
        const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
        if (userIndex >= 0) {
          mockUsers[userIndex] = updatedUser;
        }
      }
      return updatedUser;
    } catch (error) {
      console.error('Error updating localStorage:', error);
      throw new Error('Failed to save profile updates');
    }
  }
};