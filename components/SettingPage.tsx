import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Separator } from "./ui/separator"
import { Badge } from "./ui/badge"
import { 
  User as UserIcon, 
  Target,
  Bell,
  Shield,
  CreditCard,
  Download,
  Trash2,
  Save,
  Crown,
  Check,
  AlertTriangle,
  Mail,
  Smartphone,
  Calendar,
  Activity,
  Moon,
  Sun,
  Globe,
  Plus
} from "lucide-react"
import { User } from '../lib/auth'
import { Avatar, AvatarFallback } from "./ui/avatar"

interface SettingsPageProps {
  user: User;
}

interface NotificationSettings {
  dailyReminders: boolean;
  workoutReminders: boolean;
  mealReminders: boolean;
  progressUpdates: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  shareProgress: boolean;
  shareWorkouts: boolean;
  dataCollection: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  current: boolean;
  popular?: boolean;
}

export default function SettingsPage({ user }: SettingsPageProps) {
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    height: user.profile.height,
    weight: user.profile.weight,
    activityLevel: user.profile.activityLevel,
    goal: user.profile.goal
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    dailyReminders: true,
    workoutReminders: true,
    mealReminders: true,
    progressUpdates: true,
    emailNotifications: false,
    pushNotifications: true
  })

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'private',
    shareProgress: false,
    shareWorkouts: false,
    dataCollection: true
  })

  const [subscriptionPlans] = useState<SubscriptionPlan[]>([
    {
      id: 'free',
      name: 'Free',
      price: 'Rp 0',
      current: true,
      features: [
        'Chat AI dasar',
        'Tracking makanan sederhana',
        'Program workout dasar',
        '5 resep per hari'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 'Rp 49.000',
      current: false,
      popular: true,
      features: [
        'Chat AI tak terbatas',
        'Analisis nutrisi lengkap',
        'Program workout kustom',
        'Resep unlimited',
        'Progress tracking detail',
        'Meal planning otomatis'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 'Rp 149.000',
      current: false,
      features: [
        'Semua fitur Premium',
        'Personal trainer AI',
        'Konsultasi ahli gizi',
        'Meal prep planning',
        'Integrasi wearable device',
        'Export data lengkap'
      ]
    }
  ])

  const [currentTheme, setCurrentTheme] = useState('light')
  const [currentLanguage, setCurrentLanguage] = useState('id')

  const handleSaveProfile = () => {
    // Save profile logic here
    console.log('Saving profile:', profileData)
  }

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
  }

  const handlePrivacyChange = (key: keyof PrivacySettings, value: any) => {
    setPrivacy(prev => ({ ...prev, [key]: value }))
  }

  const handleUpgrade = (planId: string) => {
    console.log('Upgrading to:', planId)
  }

  const handleExportData = () => {
    console.log('Exporting data...')
  }

  const handleDeleteAccount = () => {
    console.log('Deleting account...')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan</h1>
          <p className="text-gray-600">Kelola profil dan preferensi akun Anda</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="health">Target Kesehatan</TabsTrigger>
          <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
          <TabsTrigger value="privacy">Privasi</TabsTrigger>
          <TabsTrigger value="subscription">Berlangganan</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserIcon className="w-5 h-5" />
                <span>Informasi Profil</span>
              </CardTitle>
              <CardDescription>Update informasi personal Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-xl">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    Ubah Foto
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">JPG, PNG max 2MB</p>
                </div>
              </div>

              <Separator />

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+62 812 3456 7890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Tanggal Lahir</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Jenis Kelamin</Label>
                  <Select 
                    value={profileData.gender} 
                    onValueChange={(value) => setProfileData(prev => ({ ...prev, gender: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Laki-laki</SelectItem>
                      <SelectItem value="female">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Tinggi Badan (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={profileData.height}
                    onChange={(e) => setProfileData(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <Button onClick={handleSaveProfile} className="w-full md:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Simpan Perubahan
              </Button>
            </CardContent>
          </Card>

          {/* App Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preferensi Aplikasi</CardTitle>
              <CardDescription>Sesuaikan tampilan dan bahasa aplikasi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tema</Label>
                  <p className="text-sm text-gray-500">Pilih tema terang atau gelap</p>
                </div>
                <Select value={currentTheme} onValueChange={setCurrentTheme}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center space-x-2">
                        <Sun className="w-4 h-4" />
                        <span>Terang</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center space-x-2">
                        <Moon className="w-4 h-4" />
                        <span>Gelap</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Bahasa</Label>
                  <p className="text-sm text-gray-500">Pilih bahasa aplikasi</p>
                </div>
                <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4" />
                        <span>Bahasa Indonesia</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="en">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4" />
                        <span>English</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Goals Tab */}
        <TabsContent value="health" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Target Kesehatan</span>
              </CardTitle>
              <CardDescription>Atur target dan preferensi kesehatan Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentWeight">Berat Badan Saat Ini (kg)</Label>
                  <Input
                    id="currentWeight"
                    type="number"
                    value={profileData.weight}
                    onChange={(e) => setProfileData(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goalWeight">Target Berat Badan (kg)</Label>
                  <Input
                    id="goalWeight"
                    type="number"
                    placeholder="65"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activityLevel">Level Aktivitas</Label>
                  <Select 
                    value={profileData.activityLevel} 
                    onValueChange={(value) => setProfileData(prev => ({ ...prev, activityLevel: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (tidak aktif)</SelectItem>
                      <SelectItem value="light">Light (1-3 hari/minggu)</SelectItem>
                      <SelectItem value="moderate">Moderate (3-5 hari/minggu)</SelectItem>
                      <SelectItem value="active">Active (6-7 hari/minggu)</SelectItem>
                      <SelectItem value="very_active">Very Active (2x sehari)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal">Tujuan Utama</Label>
                  <Select 
                    value={profileData.goal} 
                    onValueChange={(value) => setProfileData(prev => ({ ...prev, goal: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lose_weight">Menurunkan Berat Badan</SelectItem>
                      <SelectItem value="gain_weight">Menaikkan Berat Badan</SelectItem>
                      <SelectItem value="maintain_weight">Menjaga Berat Badan</SelectItem>
                      <SelectItem value="build_muscle">Membangun Otot</SelectItem>
                      <SelectItem value="improve_fitness">Meningkatkan Kebugaran</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSaveProfile} className="w-full md:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Simpan Target
              </Button>
            </CardContent>
          </Card>

          {/* Daily Targets */}
          <Card>
            <CardHeader>
              <CardTitle>Target Harian</CardTitle>
              <CardDescription>Sesuaikan target harian Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calorieTarget">Target Kalori</Label>
                  <Input
                    id="calorieTarget"
                    type="number"
                    placeholder="2200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proteinTarget">Target Protein (g)</Label>
                  <Input
                    id="proteinTarget"
                    type="number"
                    placeholder="165"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waterTarget">Target Air (ml)</Label>
                  <Input
                    id="waterTarget"
                    type="number"
                    placeholder="2500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workoutTarget">Target Workout (menit)</Label>
                  <Input
                    id="workoutTarget"
                    type="number"
                    placeholder="45"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Pengaturan Notifikasi</span>
              </CardTitle>
              <CardDescription>Kelola kapan dan bagaimana Anda ingin menerima notifikasi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Reminder Settings */}
              <div className="space-y-4">
                <h3 className="font-medium">Pengingat Harian</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Pengingat Harian</Label>
                    <p className="text-sm text-gray-500">Motivasi dan tips harian</p>
                  </div>
                  <Switch 
                    checked={notifications.dailyReminders}
                    onCheckedChange={(checked) => handleNotificationChange('dailyReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Pengingat Workout</Label>
                    <p className="text-sm text-gray-500">Notifikasi waktu olahraga</p>
                  </div>
                  <Switch 
                    checked={notifications.workoutReminders}
                    onCheckedChange={(checked) => handleNotificationChange('workoutReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Pengingat Makan</Label>
                    <p className="text-sm text-gray-500">Notifikasi waktu makan</p>
                  </div>
                  <Switch 
                    checked={notifications.mealReminders}
                    onCheckedChange={(checked) => handleNotificationChange('mealReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Update Progress</Label>
                    <p className="text-sm text-gray-500">Laporan mingguan progress</p>
                  </div>
                  <Switch 
                    checked={notifications.progressUpdates}
                    onCheckedChange={(checked) => handleNotificationChange('progressUpdates', checked)}
                  />
                </div>
              </div>

              <Separator />

              {/* Delivery Methods */}
              <div className="space-y-4">
                <h3 className="font-medium">Metode Pengiriman</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm text-gray-500">Terima notifikasi via email</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex items-center space-x-2">
                    <Smartphone className="w-4 h-4" />
                    <div>
                      <Label>Push Notification</Label>
                      <p className="text-sm text-gray-500">Notifikasi langsung di device</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Jadwal Notifikasi</CardTitle>
              <CardDescription>Atur waktu pengingat harian</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pengingat Sarapan</Label>
                  <Input type="time" defaultValue="07:00" />
                </div>
                <div className="space-y-2">
                  <Label>Pengingat Makan Siang</Label>
                  <Input type="time" defaultValue="12:00" />
                </div>
                <div className="space-y-2">
                  <Label>Pengingat Makan Malam</Label>
                  <Input type="time" defaultValue="19:00" />
                </div>
                <div className="space-y-2">
                  <Label>Pengingat Workout</Label>
                  <Input type="time" defaultValue="17:00" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Privasi & Keamanan</span>
              </CardTitle>
              <CardDescription>Kontrol siapa yang dapat melihat informasi Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Visibilitas Profil</Label>
                    <p className="text-sm text-gray-500">Siapa yang dapat melihat profil Anda</p>
                  </div>
                  <Select 
                    value={privacy.profileVisibility} 
                    onValueChange={(value: 'public' | 'friends' | 'private') => handlePrivacyChange('profileVisibility', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Publik</SelectItem>
                      <SelectItem value="friends">Teman</SelectItem>
                      <SelectItem value="private">Privat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Bagikan Progress</Label>
                    <p className="text-sm text-gray-500">Izinkan berbagi progress dengan teman</p>
                  </div>
                  <Switch 
                    checked={privacy.shareProgress}
                    onCheckedChange={(checked) => handlePrivacyChange('shareProgress', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Bagikan Workout</Label>
                    <p className="text-sm text-gray-500">Izinkan berbagi aktivitas workout</p>
                  </div>
                  <Switch 
                    checked={privacy.shareWorkouts}
                    onCheckedChange={(checked) => handlePrivacyChange('shareWorkouts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Pengumpulan Data</Label>
                    <p className="text-sm text-gray-500">Izinkan pengumpulan data untuk meningkatkan layanan</p>
                  </div>
                  <Switch 
                    checked={privacy.dataCollection}
                    onCheckedChange={(checked) => handlePrivacyChange('dataCollection', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Data</CardTitle>
              <CardDescription>Kelola data personal Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Export Data</h3>
                  <p className="text-sm text-gray-500">Download semua data Anda</p>
                </div>
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-red-600">Hapus Akun</h3>
                  <p className="text-sm text-gray-500">Hapus akun dan semua data secara permanen</p>
                </div>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus Akun
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Berlangganan</span>
              </CardTitle>
              <CardDescription>Kelola paket berlangganan Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative border rounded-lg p-6 ${
                      plan.current ? 'border-green-200 bg-green-50' : 'border-gray-200'
                    } ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
                        Populer
                      </Badge>
                    )}
                    
                    {plan.current && (
                      <Badge className="absolute -top-2 right-4 bg-green-500">
                        <Check className="w-3 h-3 mr-1" />
                        Aktif
                      </Badge>
                    )}

                    <div className="text-center mb-4">
                      {plan.name === 'Pro' && <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />}
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <div className="text-2xl font-bold text-blue-600 mt-2">
                        {plan.price}
                        {plan.price !== 'Rp 0' && <span className="text-sm text-gray-500">/bulan</span>}
                      </div>
                    </div>

                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full"
                      variant={plan.current ? 'secondary' : 'default'}
                      disabled={plan.current}
                      onClick={() => handleUpgrade(plan.id)}
                    >
                      {plan.current ? 'Paket Saat Ini' : 'Upgrade'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Pembayaran</CardTitle>
              <CardDescription>History transaksi berlangganan Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Free Plan</h3>
                    <p className="text-sm text-gray-500">Aktif sejak 1 Januari 2024</p>
                  </div>
                  <Badge variant="outline">Gratis</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Metode Pembayaran</CardTitle>
              <CardDescription>Kelola metode pembayaran Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Belum ada metode pembayaran</p>
                <Button variant="outline" className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Metode Pembayaran
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}