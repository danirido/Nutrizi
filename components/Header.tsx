import { Button } from "./ui/button"

interface HeaderProps {
  onGetStarted: () => void;
  onDemo?: () => void;
}

export default function Header({ onGetStarted, onDemo }: HeaderProps) {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">N</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Nutrizi</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
            Fitur
          </a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
            Harga
          </a>
          <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
            Tentang
          </a>
        </nav>
        
        <div className="flex items-center space-x-4">
          {onDemo && (
            <Button variant="outline" className="hidden sm:inline-flex" onClick={onDemo}>
              Demo
            </Button>
          )}
          <Button variant="ghost" className="hidden sm:inline-flex" onClick={onGetStarted}>
            Masuk
          </Button>
          <Button 
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
            onClick={onGetStarted}
          >
            Coba Gratis
          </Button>
        </div>
      </div>
    </header>
  )
}