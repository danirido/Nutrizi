import { useState } from 'react'
import { Button } from "./ui/button"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { 
  LayoutDashboard, 
  MessageCircle, 
  Apple, 
  Dumbbell, 
  TrendingUp, 
  Settings, 
  LogOut,
  Menu,
  X,
  Heart
} from "lucide-react"
import { User, authService } from '../lib/auth'
import Dashboard from './Dashboard'
import ChatInterface from './ChatInterface'
import NutritionPage from './NutritionPage'
import ExercisePage from './ExercisePage'
import ProgressPage from './ProgressPage'
import SettingsPage from './SettingPage'

interface AppLayoutProps {
  user: User;
  onLogout: () => void;
}

type ActiveView = 'dashboard' | 'chat' | 'nutrition' | 'exercise' | 'progress' | 'settings'

export default function AppLayout({ user, onLogout }: AppLayoutProps) {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    authService.logout()
    onLogout()
  }

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', name: 'Chat AI', icon: MessageCircle },
    { id: 'nutrition', name: 'Nutrisi', icon: Apple },
    { id: 'exercise', name: 'Olahraga', icon: Dumbbell },
    { id: 'progress', name: 'Progress', icon: TrendingUp },
    { id: 'settings', name: 'Pengaturan', icon: Settings },
  ]

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard user={user} />
      case 'chat':
        return <ChatInterface user={user} />
      case 'nutrition':
        return <NutritionPage user={user} />
      case 'exercise':
        return <ExercisePage user={user} />
      case 'progress':
        return <ProgressPage user={user} />
      case 'settings':
        return <SettingsPage user={user} />
      default:
        return <Dashboard user={user} />
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">Nutrizi</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-sm text-gray-500 truncate">
                  Goal: {user.profile.goal.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = activeView === item.id
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    isActive 
                      ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setActiveView(item.id as ActiveView)
                    setSidebarOpen(false)
                  }}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.name}
                </Button>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Keluar
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b px-4 py-2 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-md flex items-center justify-center">
              <Heart className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-gray-900">Nutrizi</span>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}