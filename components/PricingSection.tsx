import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Check, Star } from "lucide-react"

interface PricingSectionProps {
  onGetStarted: () => void;
}

export default function PricingSection({ onGetStarted }: PricingSectionProps) {
  const plans = [
    {
      name: "Gratis",
      price: "0",
      period: "selamanya",
      description: "Coba fitur dasar Nutrizi",
      features: [
        "Chat dasar dengan AI",
        "Rekomendasi nutrisi sederhana", 
        "Tracking kalori harian",
        "1 program olahraga",
        "Tips kesehatan umum"
      ],
      limitations: [
        "Maksimal 10 chat per hari",
        "Akses terbatas ke resep",
        "No integration wearable"
      ],
      cta: "Mulai Gratis",
      popular: false
    },
    {
      name: "Premium",
      price: "49.000",
      period: "per bulan",
      description: "Pengalaman Nutrizi yang lengkap",
      features: [
        "Chat unlimited dengan AI",
        "Rencana nutrisi personal lengkap",
        "Resep & daftar belanja otomatis",
        "Program olahraga unlimited",
        "Integrasi wearable (Apple Health, Google Fit)",
        "Tracking tidur & recovery",
        "Analisis progress mingguan",
        "Priority support"
      ],
      limitations: [],
      cta: "Upgrade ke Premium",
      popular: true
    },
    {
      name: "Pro",
      price: "149.000", 
      period: "per bulan",
      description: "Untuk yang serius dengan kesehatan",
      features: [
        "Semua fitur Premium",
        "Konsultasi video dengan nutritionist",
        "Program khusus (diabetes, PCOS, dll)",
        "AI coaching yang sangat advanced",
        "Meal prep planning",
        "Supplement recommendations",
        "Akses early features",
        "1-on-1 onboarding session"
      ],
      limitations: [],
      cta: "Pilih Pro",
      popular: false
    }
  ]

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
            Pilih Paket yang Tepat
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Mulai gratis dan upgrade sesuai kebutuhan. Semua paket dilengkapi 
            dengan jaminan uang kembali 14 hari.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${
              plan.popular 
                ? 'border-2 border-gradient-to-r from-green-400 to-blue-500 shadow-xl scale-105' 
                : 'border shadow-lg'
            }`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    Paling Populer
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    Rp{plan.price.toLocaleString()}
                  </span>
                  <span className="text-gray-500 ml-2">/{plan.period}</span>
                </div>
                <CardDescription className="mt-2 text-gray-600">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {plan.limitations.length > 0 && (
                  <div className="border-t pt-4">
                    <h5 className="font-medium text-gray-900 mb-2">Keterbatasan:</h5>
                    <div className="space-y-2">
                      {plan.limitations.map((limitation, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <div className="w-5 h-5 border-2 border-gray-300 rounded mt-0.5 flex-shrink-0"></div>
                          <span className="text-gray-500 text-sm">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button 
                  className={`w-full mt-8 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600' 
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                  size="lg"
                  onClick={onGetStarted}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12 space-y-4">
          <p className="text-gray-600">
            🔒 Semua paket dilindungi dengan enkripsi end-to-end
          </p>
          <p className="text-sm text-gray-500">
            Gratis 14 hari trial • Cancel kapan saja • Jaminan uang kembali
          </p>
        </div>
      </div>
    </section>
  )
}