import { useState } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Checkbox } from "./ui/checkbox"
import { Loader2, Heart, ArrowRight, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { User, UserProfile, authService } from '../lib/auth'

interface OnboardingProps {
  user: User;
  selectedGoal?: UserProfile['goal'] | null;
  onComplete: (user: User) => void;
}

export default function Onboarding({ user, selectedGoal, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    age: undefined,
    gender: 'other',
    height: undefined,
    weight: undefined,
    targetWeight: undefined,
    activityLevel: 'moderate',
    goal: selectedGoal || 'improve_health',
    medicalConditions: [],
    allergies: [],
    dietaryPreferences: []
  })

  const totalSteps = 4

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      // Validate required fields
      if (!formData.age || !formData.height || !formData.weight) {
        toast.error('Mohon lengkapi data dasar (umur, tinggi, berat badan)')
        setIsLoading(false)
        return
      }

      // Ensure user is available for update
      const currentUser = authService.getCurrentUser();
      
      // If no current user but we have a user prop, save it first
      if (!currentUser && user) {
        try {
          localStorage.setItem('nutrizi_user', JSON.stringify(user));
        } catch (error) {
          console.error('Error saving user to localStorage:', error);
          toast.error('Gagal menyimpan data sesi. Silakan coba lagi.')
          setIsLoading(false)
          return
        }
      }

      const updatedUser = await authService.updateProfile(formData, user)
      if (updatedUser) {
        toast.success('Profil berhasil disimpan!')
        onComplete(updatedUser)
      } else {
        toast.error('Gagal menyimpan profil. Silakan coba lagi.')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Terjadi kesalahan saat menyimpan profil. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (updates: Partial<UserProfile>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.age && 
               formData.age > 0 && 
               formData.gender && 
               formData.height && 
               formData.height > 0 && 
               formData.weight && 
               formData.weight > 0
      case 2:
        return formData.activityLevel && formData.goal
      case 3:
        return true // Optional step
      case 4:
        return true // Optional step
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Informasi Dasar</h2>
              <p className="text-gray-600 mt-2">Ceritakan tentang diri Anda untuk rekomendasi yang personal</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Umur</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  min="13"
                  max="100"
                  value={formData.age || ''}
                  onChange={(e) => updateFormData({ age: parseInt(e.target.value) || undefined })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Jenis Kelamin</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => updateFormData({ gender: value as 'male' | 'female' | 'other' })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Laki-laki</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Perempuan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Lainnya</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Tinggi Badan (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  min="100"
                  max="250"
                  value={formData.height || ''}
                  onChange={(e) => updateFormData({ height: parseInt(e.target.value) || undefined })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Berat Badan (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  min="30"
                  max="300"
                  value={formData.weight || ''}
                  onChange={(e) => updateFormData({ weight: parseInt(e.target.value) || undefined })}
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Tujuan & Aktivitas</h2>
              <p className="text-gray-600 mt-2">Bagaimana gaya hidup dan tujuan kesehatan Anda?</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Seberapa Sering Anda Olahraga?</Label>
                <RadioGroup
                  value={formData.activityLevel}
                  onValueChange={(value) => updateFormData({ activityLevel: value as UserProfile['activityLevel'] })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sedentary" id="sedentary" />
                    <Label htmlFor="sedentary" className="flex-1">
                      <div className="font-medium">Tidak aktif</div>
                      <div className="text-sm text-gray-500">Jarang atau tidak pernah olahraga</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="flex-1">
                      <div className="font-medium">Ringan</div>
                      <div className="text-sm text-gray-500">Olahraga ringan 1-3 hari/minggu</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate" className="flex-1">
                      <div className="font-medium">Sedang</div>
                      <div className="text-sm text-gray-500">Olahraga sedang 3-5 hari/minggu</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="active" id="active" />
                    <Label htmlFor="active" className="flex-1">
                      <div className="font-medium">Aktif</div>
                      <div className="text-sm text-gray-500">Olahraga berat 6-7 hari/minggu</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very_active" id="very_active" />
                    <Label htmlFor="very_active" className="flex-1">
                      <div className="font-medium">Sangat aktif</div>
                      <div className="text-sm text-gray-500">Olahraga sangat berat, fisik berat/2x sehari</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Tujuan Kesehatan Utama</Label>
                <RadioGroup
                  value={formData.goal}
                  onValueChange={(value) => updateFormData({ goal: value as UserProfile['goal'] })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lose_weight" id="lose_weight" />
                    <Label htmlFor="lose_weight">Menurunkan berat badan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="maintain_weight" id="maintain_weight" />
                    <Label htmlFor="maintain_weight">Mempertahankan berat badan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gain_weight" id="gain_weight" />
                    <Label htmlFor="gain_weight">Menambah berat badan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="build_muscle" id="build_muscle" />
                    <Label htmlFor="build_muscle">Membangun massa otot</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="improve_health" id="improve_health" />
                    <Label htmlFor="improve_health">Meningkatkan kesehatan secara umum</Label>
                  </div>
                </RadioGroup>
              </div>

              {(formData.goal === 'lose_weight' || formData.goal === 'gain_weight') && (
                <div className="space-y-2">
                  <Label htmlFor="target_weight">Target Berat Badan (kg)</Label>
                  <Input
                    id="target_weight"
                    type="number"
                    placeholder="65"
                    min="30"
                    max="300"
                    value={formData.targetWeight || ''}
                    onChange={(e) => updateFormData({ targetWeight: parseInt(e.target.value) || undefined })}
                  />
                </div>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Preferensi Diet</h2>
              <p className="text-gray-600 mt-2">Pilih preferensi diet Anda (opsional)</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Preferensi Diet</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'vegetarian', label: 'Vegetarian' },
                    { value: 'vegan', label: 'Vegan' },
                    { value: 'keto', label: 'Keto' },
                    { value: 'paleo', label: 'Paleo' },
                    { value: 'mediterranean', label: 'Mediterranean' },
                    { value: 'low_carb', label: 'Low Carb' },
                    { value: 'halal', label: 'Halal' },
                    { value: 'no_pork', label: 'Tanpa Babi' }
                  ].map((diet) => (
                    <div key={diet.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={diet.value}
                        checked={formData.dietaryPreferences?.includes(diet.value) || false}
                        onCheckedChange={(checked) => {
                          const current = formData.dietaryPreferences || []
                          if (checked) {
                            updateFormData({ dietaryPreferences: [...current, diet.value] })
                          } else {
                            updateFormData({ dietaryPreferences: current.filter(p => p !== diet.value) })
                          }
                        }}
                      />
                      <Label htmlFor={diet.value}>{diet.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Informasi Kesehatan</h2>
              <p className="text-gray-600 mt-2">Bantu kami memberikan rekomendasi yang aman (opsional)</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Alergi Makanan</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'nuts', label: 'Kacang-kacangan' },
                    { value: 'shellfish', label: 'Kerang/Udang' },
                    { value: 'eggs', label: 'Telur' },
                    { value: 'dairy', label: 'Susu/Dairy' },
                    { value: 'gluten', label: 'Gluten' },
                    { value: 'soy', label: 'Kedelai' },
                    { value: 'fish', label: 'Ikan' },
                    { value: 'sesame', label: 'Wijen' }
                  ].map((allergy) => (
                    <div key={allergy.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={allergy.value}
                        checked={formData.allergies?.includes(allergy.value) || false}
                        onCheckedChange={(checked) => {
                          const current = formData.allergies || []
                          if (checked) {
                            updateFormData({ allergies: [...current, allergy.value] })
                          } else {
                            updateFormData({ allergies: current.filter(a => a !== allergy.value) })
                          }
                        }}
                      />
                      <Label htmlFor={allergy.value}>{allergy.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Kondisi Kesehatan</Label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { value: 'diabetes', label: 'Diabetes' },
                    { value: 'hypertension', label: 'Hipertensi' },
                    { value: 'heart_disease', label: 'Penyakit Jantung' },
                    { value: 'thyroid', label: 'Gangguan Tiroid' },
                    { value: 'kidney_disease', label: 'Penyakit Ginjal' },
                    { value: 'liver_disease', label: 'Penyakit Hati' }
                  ].map((condition) => (
                    <div key={condition.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition.value}
                        checked={formData.medicalConditions?.includes(condition.value) || false}
                        onCheckedChange={(checked) => {
                          const current = formData.medicalConditions || []
                          if (checked) {
                            updateFormData({ medicalConditions: [...current, condition.value] })
                          } else {
                            updateFormData({ medicalConditions: current.filter(c => c !== condition.value) })
                          }
                        }}
                      />
                      <Label htmlFor={condition.value}>{condition.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Selamat Datang, {user.name}!</CardTitle>
          <CardDescription>
            Langkah {step} dari {totalSteps} - Mari personalisasi pengalaman kesehatan Anda
          </CardDescription>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </CardHeader>
        
        <CardContent>
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
              className="flex items-center"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {step === totalSteps ? 'Selesai' : 'Lanjut'}
              {step < totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}