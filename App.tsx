import { useState, useEffect } from 'react'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import ChatPreview from './components/ChatPreview'
import PricingSection from './components/PricingSection'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import AppLayout from './components/AppLayout'
import GoalSelection from './components/GoalSelection'
import Onboarding from './components/Onboarding'
import InitialRecommendations from './components/InitialRecommendations'
import GoalRecommendations from './components/GoalRecommendations'
import { Toaster } from "sonner"
import { User, UserProfile, authService } from './lib/auth'

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [showGoalSelection, setShowGoalSelection] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<UserProfile['goal'] | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showInitialRecommendations, setShowInitialRecommendations] = useState(false)
  const [hasStoredGoal, setHasStoredGoal] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    // Check if user is already logged in
    try {
      const currentUser = authService.getCurrentUser()
      setUser(currentUser)
      
      // Check for stored goal if user exists
      if (currentUser) {
        try {
          const storedGoal = localStorage.getItem(`nutrizi_selected_goal_${currentUser.id}`)
          setHasStoredGoal(!!storedGoal)
          if (storedGoal && !selectedGoal) {
            setSelectedGoal(storedGoal as UserProfile['goal'])
          }
        } catch (error) {
          console.error('Error checking stored goal:', error)
        }
      }
    } catch (error) {
      console.error('Error loading user:', error)
    } finally {
      setIsLoading(false)
    }
  }, [mounted, selectedGoal])

  const needsOnboarding = (user: User): boolean => {
    return !user.profile.age || !user.profile.height || !user.profile.weight
  }

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser)
    setShowAuth(false)
    
    const userNeedsOnboarding = needsOnboarding(authenticatedUser)
    
    try {
      // Check if user has selected a goal before
      const hasSelectedGoal = localStorage.getItem(`nutrizi_selected_goal_${authenticatedUser.id}`)
      
      if (userNeedsOnboarding && !hasSelectedGoal) {
        setShowGoalSelection(true)
      } else if (userNeedsOnboarding) {
        setShowOnboarding(true)
      } else {
        // Check if user hasn't seen initial recommendations yet
        const hasSeenRecommendations = localStorage.getItem(`nutrizi_seen_recommendations_${authenticatedUser.id}`)
        if (!hasSeenRecommendations) {
          setShowInitialRecommendations(true)
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error)
      // Fallback: show onboarding if needed
      if (userNeedsOnboarding) {
        setShowGoalSelection(true)
      }
    }
  }

  const handleLogout = () => {
    setUser(null)
    setShowGoalSelection(false)
    setSelectedGoal(null)
    setHasStoredGoal(false)
    setShowOnboarding(false)
    setShowInitialRecommendations(false)
  }

  const handleGetStarted = () => {
    setShowAuth(true)
  }

  const handleDemo = () => {
    // Create a demo user with unique ID
    const demoUser: User = {
      id: `demo-user-${Date.now()}`,
      email: 'demo@nutrizi.com',
      name: 'Demo User',
      profile: {
        age: undefined,
        gender: 'other',
        height: undefined,
        weight: undefined,
        targetWeight: undefined,
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
    }
    
    // Save demo user to localStorage so authService can find it
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('nutrizi_user', JSON.stringify(demoUser))
        // Verify it was saved
        const saved = localStorage.getItem('nutrizi_user')
        if (!saved) {
          throw new Error('Failed to save demo user')
        }
      }
    } catch (error) {
      console.error('Error saving demo user to localStorage:', error)
      alert('Gagal memulai demo. Silakan coba lagi atau gunakan registrasi.')
      return
    }
    
    setUser(demoUser)
    
    // Apply same logic as regular auth
    const userNeedsOnboarding = needsOnboarding(demoUser)
    
    try {
      const hasSelectedGoal = localStorage.getItem(`nutrizi_selected_goal_${demoUser.id}`)
      setHasStoredGoal(!!hasSelectedGoal)
      
      if (userNeedsOnboarding && !hasSelectedGoal) {
        setShowGoalSelection(true)
      } else if (userNeedsOnboarding) {
        setShowOnboarding(true)
      } else {
        const hasSeenRecommendations = localStorage.getItem(`nutrizi_seen_recommendations_${demoUser.id}`)
        if (!hasSeenRecommendations) {
          setShowInitialRecommendations(true)
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage in demo:', error)
      // Fallback: always show goal selection for demo
      setShowGoalSelection(true)
      setHasStoredGoal(false)
    }
  }

  const handleGoalSelect = (goal: UserProfile['goal']) => {
    setSelectedGoal(goal)
    setHasStoredGoal(true)
    setShowGoalSelection(false)
    setShowOnboarding(true)
    
    // Save selected goal to localStorage
    if (user) {
      try {
        localStorage.setItem(`nutrizi_selected_goal_${user.id}`, goal)
      } catch (error) {
        console.error('Error saving goal to localStorage:', error)
        // Continue anyway - goal is stored in state
      }
    }
  }

  const handleOnboardingComplete = (updatedUser: User) => {
    try {
      setUser(updatedUser)
      setShowOnboarding(false)
      setShowInitialRecommendations(true)
    } catch (error) {
      console.error('Error completing onboarding:', error)
    }
  }

  const handleSelectRecommendation = (recommendationType: string) => {
    setShowInitialRecommendations(false)
    // Mark recommendations as seen
    if (user) {
      try {
        localStorage.setItem(`nutrizi_seen_recommendations_${user.id}`, 'true')
        localStorage.setItem(`nutrizi_initial_recommendation`, recommendationType)
      } catch (error) {
        console.error('Error saving recommendation state:', error)
      }
    }
  }

  const handleStartFreeChat = () => {
    setShowInitialRecommendations(false)
    // Mark recommendations as seen
    if (user) {
      try {
        localStorage.setItem(`nutrizi_seen_recommendations_${user.id}`, 'true')
      } catch (error) {
        console.error('Error saving recommendation state:', error)
      }
    }
  }

  const handleStartChat = () => {
    setShowInitialRecommendations(false)
    // Mark recommendations as seen
    if (user) {
      try {
        localStorage.setItem(`nutrizi_seen_recommendations_${user.id}`, 'true')
      } catch (error) {
        console.error('Error saving recommendation state:', error)
      }
    }
  }

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold">N</span>
          </div>
          <p className="text-gray-600">Loading Nutrizi...</p>
        </div>
      </div>
    )
  }

  // Show goal selection if user needs it
  if (user && showGoalSelection) {
    return (
      <>
        <GoalSelection user={user} onGoalSelect={handleGoalSelect} />
        <Toaster />
      </>
    )
  }

  // Show onboarding if user needs it
  if (user && showOnboarding) {
    return (
      <>
        <Onboarding user={user} selectedGoal={selectedGoal} onComplete={handleOnboardingComplete} />
        <Toaster />
      </>
    )
  }

  // Show initial recommendations if user hasn't seen them
  if (user && showInitialRecommendations) {
    // If user has selected a goal, show detailed goal recommendations
    if (selectedGoal || hasStoredGoal) {
      return (
        <>
          <GoalRecommendations user={user} onStartChat={handleStartChat} />
          <Toaster />
        </>
      )
    }
    
    // Otherwise show the original recommendation selection
    return (
      <>
        <InitialRecommendations 
          user={user}
          onSelectRecommendation={handleSelectRecommendation}
          onStartFreeChat={handleStartFreeChat}
        />
        <Toaster />
      </>
    )
  }

  // Show app interface if user is logged in
  if (user) {
    return (
      <>
        <AppLayout user={user} onLogout={handleLogout} />
        <Toaster />
      </>
    )
  }

  // Show landing page if user is not logged in
  return (
    <>
      <div className="min-h-screen bg-white">
        <Header onGetStarted={handleGetStarted} onDemo={handleDemo} />
        <HeroSection onGetStarted={handleGetStarted} onDemo={handleDemo} />
        <FeaturesSection />
        <ChatPreview />
        <PricingSection onGetStarted={handleGetStarted} />
        <Footer />
        
        {showAuth && (
          <AuthModal onAuthSuccess={handleAuthSuccess} />
        )}
      </div>
      <Toaster />
    </>
  )
}