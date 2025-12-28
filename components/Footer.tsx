import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl p-8 lg:p-12 mb-16 text-center">
          <h3 className="text-2xl lg:text-4xl font-bold text-white mb-4">
            Siap Memulai Perjalanan Sehat Anda?
          </h3>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Bergabung dengan ribuan pengguna yang sudah merasakan transformasi 
            hidup sehat bersama Nutrizi AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8">
              Download di App Store
            </Button>
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8">
              Download di Google Play  
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <span className="text-xl font-bold">Nutrizi</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Asisten kesehatan pribadi berbasis AI yang membantu Anda mencapai 
              gaya hidup sehat dengan mudah dan menyenangkan.
            </p>
            <div className="flex space-x-4">
              <Button size="sm" variant="ghost" className="p-2 text-gray-400 hover:text-white">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2 text-gray-400 hover:text-white">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2 text-gray-400 hover:text-white">
                <Mail className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Produk</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Fitur</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Harga</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrasi</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Dukungan</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Kontak Kami</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Stay Updated</h4>
            <p className="text-gray-400 text-sm">
              Dapatkan tips kesehatan terbaru dan update produk langsung ke email Anda.
            </p>
            <div className="flex space-x-2">
              <Input 
                placeholder="Email Anda" 
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Mail className="w-5 h-5 text-green-400" />
              <span className="text-gray-400">hello@nutrizi.ai</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Phone className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400">+62 21 123 4567</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <MapPin className="w-5 h-5 text-purple-400" />
              <span className="text-gray-400">Jakarta, Indonesia</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © 2024 Nutrizi. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}