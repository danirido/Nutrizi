// AI Chat system with mock responses
import { User } from './auth'

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  sender: 'user' | 'ai';
  timestamp: string;
  metadata?: {
    recommendations?: string[];
    actions?: ChatAction[];
  };
}

export interface ChatAction {
  type: 'add_meal' | 'add_exercise' | 'set_reminder' | 'update_goal';
  data: any;
  label: string;
}

// Mock AI responses based on keywords
const aiResponses = {
  greeting: [
    "Halo! Saya Nutrizi, asisten kesehatan personal Anda. Bagaimana kabar Anda hari ini? 😊",
    "Selamat datang kembali! Saya siap membantu perjalanan sehat Anda hari ini. Ada yang bisa saya bantu? 🌟"
  ],
  
  nutrition: [
    "Berdasarkan profil Anda, saya rekomendasikan untuk fokus pada makanan tinggi protein dan serat. Mau saya buatkan rencana makan hari ini?",
    "Nutrisi yang seimbang sangat penting! Mari kita buat menu yang sesuai dengan tujuan Anda. Apakah ada preferensi khusus?"
  ],
  
  exercise: [
    "Untuk mencapai tujuan Anda, saya sarankan kombinasi kardio dan strength training. Mau saya buatkan program workout 30 menit?",
    "Olahraga teratur adalah kunci kesuksesan! Berdasarkan level aktivitas Anda, ini program yang cocok untuk hari ini."
  ],
  
  weight: [
    "Saya lihat progres berat badan Anda bagus! Konsistensi adalah kunci. Mau saya analisis pola makan minggu ini?",
    "Perubahan berat badan yang sehat adalah 0.5-1kg per minggu. Mari kita lihat apakah target Anda realistis."
  ],
  
  sleep: [
    "Tidur yang berkualitas sangat penting untuk recovery dan metabolisme. Saya sarankan tidur 7-9 jam setiap malam.",
    "Pola tidur Anda mempengaruhi hormon lapar dan kenyang. Mari optimalisasi jadwal tidur Anda!"
  ],
  
  motivation: [
    "Ingat, setiap langkah kecil menuju gaya hidup sehat adalah kemajuan! Anda sudah melakukan hal yang luar biasa 💪",
    "Perjalanan kesehatan adalah marathon, bukan sprint. Tetap konsisten dan rayakan setiap pencapaian kecil! 🎉"
  ],
  
  default: [
    "Terima kasih sudah berbagi! Berdasarkan informasi yang Anda berikan, saya akan memberikan rekomendasi yang personal untuk Anda.",
    "Saya memahami situasi Anda. Mari kita cari solusi terbaik bersama-sama. Apa yang paling ingin Anda fokuskan saat ini?"
  ]
};

const generateMockResponse = (userMessage: string): ChatMessage => {
  const message = userMessage.toLowerCase();
  let responseCategory = 'default';
  let actions: ChatAction[] = [];
  
  // Simple keyword matching
  if (message.includes('halo') || message.includes('hai') || message.includes('hello')) {
    responseCategory = 'greeting';
  } else if (message.includes('makan') || message.includes('nutrisi') || message.includes('diet')) {
    responseCategory = 'nutrition';
    actions.push({
      type: 'add_meal',
      data: { mealType: 'breakfast' },
      label: 'Tambah Sarapan Sehat'
    });
  } else if (message.includes('olahraga') || message.includes('workout') || message.includes('exercise')) {
    responseCategory = 'exercise';
    actions.push({
      type: 'add_exercise',
      data: { type: 'cardio', duration: 30 },
      label: 'Mulai Workout 30 Menit'
    });
  } else if (message.includes('berat') || message.includes('kg') || message.includes('weight')) {
    responseCategory = 'weight';
  } else if (message.includes('tidur') || message.includes('sleep') || message.includes('istirahat')) {
    responseCategory = 'sleep';
    actions.push({
      type: 'set_reminder',
      data: { type: 'sleep', time: '22:00' },
      label: 'Set Pengingat Tidur'
    });
  } else if (message.includes('motivasi') || message.includes('semangat') || message.includes('susah')) {
    responseCategory = 'motivation';
  }
  
  const responses = aiResponses[responseCategory as keyof typeof aiResponses];
  const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
  
  return {
    id: Date.now().toString(),
    userId: '1',
    message: selectedResponse,
    sender: 'ai',
    timestamp: new Date().toISOString(),
    metadata: {
      actions: actions.length > 0 ? actions : undefined,
      recommendations: generateRecommendations(responseCategory)
    }
  };
};

const generateRecommendations = (category: string): string[] => {
  const recommendations = {
    nutrition: [
      "Minum air putih 2-3 liter per hari",
      "Konsumsi protein 1.2g per kg berat badan",
      "Makan sayuran minimal 5 porsi sehari"
    ],
    exercise: [
      "Lakukan pemanasan 5-10 menit sebelum workout",
      "Target minimal 150 menit aktivitas sedang per minggu",
      "Istirahat 1-2 hari seminggu untuk recovery"
    ],
    sleep: [
      "Hindari kafein 6 jam sebelum tidur",
      "Buat lingkungan tidur yang gelap dan sejuk",
      "Konsisten dengan jadwal tidur dan bangun"
    ],
    default: [
      "Tetap konsisten dengan rutinitas harian",
      "Catat progress untuk motivasi",
      "Rayakan pencapaian kecil"
    ]
  };
  
  return recommendations[category as keyof typeof recommendations] || recommendations.default;
};

export const aiChatService = {
  getChatHistory: async (userId: string): Promise<ChatMessage[]> => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(`nutrizi_chat_${userId}`);
        return stored ? JSON.parse(stored) : [];
      }
    } catch (error) {
      console.error('Error reading chat history:', error);
    }
    return [];
  },

  sendMessage: async (userId: string, message: string): Promise<ChatMessage[]> => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      userId,
      message,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    // Get existing chat history
    const history = await aiChatService.getChatHistory(userId);
    history.push(userMessage);

    // Simulate AI thinking time (reduced to prevent timeout)
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    // Generate AI response
    const aiResponse = generateMockResponse(message);
    history.push(aiResponse);

    // Save to localStorage
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`nutrizi_chat_${userId}`, JSON.stringify(history));
      }
    } catch (error) {
      console.error('Error saving chat history:', error);
    }

    return history;
  },

  generateInitialRecommendation: async (user: User, recommendationType: string): Promise<ChatMessage> => {
    // Calculate user's nutritional needs
    const calculateBMR = () => {
      const { age, gender, height, weight } = user.profile
      let bmr = 0
      
      if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
      } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
      }
      
      const multipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9
      }
      
      return Math.round(bmr * multipliers[user.profile.activityLevel])
    }

    const calculateProtein = () => {
      const { weight, activityLevel, goal } = user.profile
      let proteinPerKg = 0.8
      
      if (activityLevel === 'active' || activityLevel === 'very_active') {
        proteinPerKg = 1.2
      }
      if (goal === 'build_muscle') {
        proteinPerKg = 1.6
      }
      if (goal === 'lose_weight') {
        proteinPerKg = 1.2
      }
      
      return Math.round(weight * proteinPerKg)
    }

    const dailyCalories = calculateBMR()
    const dailyProtein = calculateProtein()
    const dailyCarbs = Math.round(dailyCalories * 0.45 / 4)
    const dailyFats = Math.round(dailyCalories * 0.25 / 9)

    let message = ''
    let recommendations: string[] = []

    switch (recommendationType) {
      case 'nutrition_overview':
        message = `📊 **Kebutuhan Nutrisi Harian Anda**

Berdasarkan profil Anda (${user.profile.age} tahun, ${user.profile.height}cm, ${user.profile.weight}kg, aktivitas ${user.profile.activityLevel}), berikut kebutuhan nutrisi harian:

🔥 **Kalori Total**: ${dailyCalories} kkal/hari
🥩 **Protein**: ${dailyProtein}g (${Math.round(dailyProtein * 4)} kkal)
🍞 **Karbohidrat**: ${dailyCarbs}g (${Math.round(dailyCarbs * 4)} kkal)  
🥑 **Lemak Sehat**: ${dailyFats}g (${Math.round(dailyFats * 9)} kkal)

**Pembagian per waktu makan:**
• Sarapan: 25% (${Math.round(dailyCalories * 0.25)} kkal)
• Makan Siang: 35% (${Math.round(dailyCalories * 0.35)} kkal)
• Makan Malam: 25% (${Math.round(dailyCalories * 0.25)} kkal)
• Snack: 15% (${Math.round(dailyCalories * 0.15)} kkal)

Mau saya buatkan menu hari ini berdasarkan kebutuhan ini?`
        
        recommendations = [
          "Prioritaskan protein di setiap waktu makan",
          "Minum air putih minimal 2.5 liter per hari",
          "Konsumsi sayuran 5 porsi sehari (400-500g)",
          "Pilih karbohidrat kompleks seperti nasi merah, oats"
        ]
        break

      case 'meal_planning':
        message = `👨‍🍳 **Menu & Resep Sehat Hari Ini**

Mari saya buatkan menu lengkap dengan takaran gramasi yang tepat:

🌅 **SARAPAN (${Math.round(dailyCalories * 0.25)} kkal)**
**Oatmeal Protein Bowl**
• Oats: 40g (150 kkal, 30g karbo)
• Susu rendah lemak: 200ml (100 kkal, 8g protein)
• Pisang: 1 buah sedang/100g (90 kkal, 22g karbo)
• Kacang almond: 15g (90 kkal, 3g protein, 8g lemak)
• Madu: 1 sdt/7g (25 kkal)

**Cara membuat:**
1. Masak oats dengan susu hingga creamy (5 menit)
2. Potong pisang, tambahkan ke oats
3. Taburi almond cincang dan madu

🍽️ **MAKAN SIANG (${Math.round(dailyCalories * 0.35)} kkal)**
**Nasi Ayam Sayur**
• Nasi putih: 100g (130 kkal, 28g karbo)
• Dada ayam tanpa kulit: 120g (200 kkal, 37g protein)
• Brokoli: 100g (25 kkal, 3g protein)
• Wortel: 50g (20 kkal)
• Minyak zaitun: 1 sdt (40 kkal, 4g lemak)

Mau lanjut dengan menu makan malam dan snack?`

        recommendations = [
          "Siapkan bahan untuk 2-3 hari sekaligus",
          "Gunakan timbangan makanan untuk akurasi",
          "Variasikan protein: ayam, ikan, tahu, tempe",
          "Masak dengan cara kukus, panggang, atau tumis"
        ]
        break

      case 'exercise_plan':
        const activityLevel = user.profile.activityLevel
        let exercisePlan = ''
        
        if (activityLevel === 'sedentary' || activityLevel === 'light') {
          exercisePlan = `**Program Pemula (3-4x seminggu)**

🏃‍♀️ **Senin - Kardio Ringan (30 menit)**
• Jalan cepat: 15 menit
• Naik turun tangga: 5 menit
• Stretching: 10 menit

💪 **Rabu - Strength Training (25 menit)**
• Push-up (atau knee push-up): 3 set x 8-12 reps
• Squat: 3 set x 12-15 reps  
• Plank: 3 set x 20-30 detik
• Lunges: 3 set x 8 per kaki

🧘‍♀️ **Jumat - Yoga/Flexibility (30 menit)**
• Sun salutation: 5 reps
• Warrior poses: 1 menit each
• Child's pose: 2 menit
• Savasana: 5 menit`
        } else {
          exercisePlan = `**Program Intermediate (4-5x seminggu)**

🏃‍♀️ **Senin - HIIT Cardio (35 menit)**
• Warm-up: 5 menit
• Burpees: 30 detik on, 30 detik rest x 8
• Mountain climbers: 30 detik on, 30 detik rest x 8
• Cool down: 5 menit

💪 **Selasa - Upper Body (40 menit)**
• Push-ups: 4 set x 12-15 reps
• Pull-ups/assisted: 4 set x 6-10 reps
• Dips: 3 set x 10-12 reps
• Shoulder press: 3 set x 12 reps

🦵 **Kamis - Lower Body (40 menit)**
• Squats: 4 set x 15-20 reps
• Deadlifts: 4 set x 10-12 reps
• Lunges: 3 set x 12 per kaki
• Calf raises: 3 set x 15 reps`
        }

        message = `🏋️‍♀️ **Program Olahraga Personal Anda**

Berdasarkan level aktivitas "${activityLevel}" dan tujuan "${user.profile.goal}", ini program yang cocok:

${exercisePlan}

**Tips Penting:**
• Mulai dengan beban/intensitas yang nyaman
• Istirahat 48 jam antar latihan otot yang sama
• Dengarkan tubuh Anda, jangan dipaksakan
• Progress bertahap lebih baik dari terlalu berat

Mau saya buatkan jadwal mingguan yang lebih detail?`

        recommendations = [
          "Lakukan pemanasan 5-10 menit sebelum latihan",
          "Minum air sebelum, saat, dan setelah olahraga",
          "Catat progress di diary atau app",
          "Tidur cukup untuk recovery optimal"
        ]
        break

      case 'sleep_wellness':
        message = `😴 **Optimalisasi Pola Tidur & Recovery**

**Kebutuhan Tidur Anda:** 7-9 jam per malam (ideal: 8 jam)

🌙 **Jadwal Tidur Optimal:**
• Tidur: 22:00 - 06:00 WIB
• Bangun konsisten setiap hari (termasuk weekend)
• Power nap maksimal 20 menit (13:00-15:00)

**Rutina Sebelum Tidur (1 jam sebelum):**
🔵 21:00 - Redupkan lampu, matikan gadget
🛁 21:15 - Mandi air hangat (turunkan suhu tubuh)
📖 21:30 - Baca buku atau meditasi 10 menit
🧘‍♀️21:45 - Breathing exercise (4-7-8 technique)

**Recovery Setelah Olahraga:**
• Stretching 10 menit setelah workout
• Protein dalam 30 menit post-workout (20-25g)
• Minum air extra 500ml
• Tidur 8+ jam untuk muscle recovery

**Sleep Environment:**
• Suhu kamar 18-22°C
• Kamar gelap total (blackout curtains)
• Kasur dan bantal nyaman
• No-gadget zone di kamar tidur

Mau saya buatkan sleep tracker untuk monitor kualitas tidur?`

        recommendations = [
          "Hindari kafein setelah jam 14:00",
          "Olahraga minimal 3 jam sebelum tidur",
          "Konsisten 7 hari seminggu, termasuk weekend",
          "Gunakan sleep hygiene checklist"
        ]
        break

      case 'macro_breakdown':
        message = `🍎 **Detail Makronutrien & Sumber Terbaik**

**PROTEIN (${dailyProtein}g/hari = ${Math.round(dailyProtein/3)}g per makan)**

🥩 **Sumber Hewani (per 100g):**
• Dada ayam tanpa kulit: 31g protein, 165 kkal
• Ikan salmon: 25g protein, 208 kkal
• Telur (2 butir besar): 12g protein, 140 kkal
• Greek yogurt: 10g protein, 60 kkal

🌱 **Sumber Nabati (per 100g):**
• Tempe: 19g protein, 190 kkal
• Tahu: 8g protein, 70 kkal
• Kacang almond: 21g protein, 575 kkal
• Edamame: 11g protein, 120 kkal

**KARBOHIDRAT (${dailyCarbs}g/hari)**

✅ **Karbohidrat Kompleks (prioritas):**
• Nasi merah: 45g karbo per 100g masak
• Oats: 55g karbo per 100g kering
• Ubi jalar: 27g karbo per 100g
• Quinoa: 39g karbo per 100g masak

⚠️ **Karbohidrat Sederhana (limit):**
• Gula pasir: max 25g/hari (6 sdt)
• Buah-buahan: 2-3 porsi/hari
• Madu: sebagai pemanis alami

**LEMAK SEHAT (${dailyFats}g/hari)**

🥑 **Lemak Tak Jenuh (utama):**
• Alpukat: 15g lemak per 100g
• Minyak zaitun: 14g per 1 sdm
• Kacang-kacangan: 15-20g per 30g
• Ikan berlemak: 10-15g per 100g

Mau saya buatkan meal prep dengan komposisi makro yang tepat?`

        recommendations = [
          "Protein di setiap waktu makan untuk kenyang lebih lama",
          "Timing karbo: pagi dan pre/post workout",
          "Lemak sehat bantu absorpsi vitamin A,D,E,K",
          "Fiber 25-35g/hari dari sayur dan buah"
        ]
        break

      case 'daily_schedule':
        message = `⏰ **Jadwal Harian Terintegrasi**

**🌅 PAGI (06:00 - 09:00)**
06:00 - Bangun, minum air 500ml
06:15 - Light stretching/yoga (10 menit)
06:30 - Sarapan + suplemen (jika ada)
07:00 - Siap-siap aktivitas harian

**🌞 SIANG (12:00 - 14:00)**
12:00 - Makan siang (fokus protein + sayur)
12:45 - Jalan santai 15 menit
13:00 - Power nap 15-20 menit (opsional)

**🌆 SORE (17:00 - 19:00)**
17:00 - **WAKTU OLAHRAGA UTAMA**
${user.profile.activityLevel === 'sedentary' ? 
  '• Jalan cepat 30 menit atau workout ringan' : 
  '• Strength training atau HIIT (45-60 menit)'}
18:00 - Post-workout protein + air
18:30 - Mandi dan recovery

**🌙 MALAM (19:00 - 22:00)**
19:00 - Makan malam (porsi sedang)
20:00 - Family time/hobi/relax
21:00 - Matikan gadget, prep tidur
21:30 - Baca buku/meditasi
22:00 - **TIDUR**

**💧 HIDRASI SEPANJANG HARI**
• Bangun: 500ml
• Sebelum makan: 250ml (3x)
• Saat olahraga: 250ml setiap 15 menit
• Sebelum tidur: 200ml
• **Total: 2.5+ liter**

**📱 REMINDER HARIAN**
• 08:00 - "Sudah sarapan protein?"
• 12:00 - "Waktunya makan siang sehat!"
• 17:00 - "Yuk olahraga! 💪"
• 21:00 - "1 jam lagi tidur, prep sekarang"

Mau saya sesuaikan dengan jadwal kerja/aktivitas spesifik Anda?`

        recommendations = [
          "Konsistensi lebih penting dari perfection",
          "Prep makan H-1 untuk efisiensi waktu",
          "Set alarm untuk remind minum air",
          "Adjust jadwal sesuai lifestyle tanpa stress"
        ]
        break

      default:
        message = "Terima kasih! Saya siap membantu dengan rekomendasi kesehatan yang personal untuk Anda."
        recommendations = ["Ceritakan lebih detail tentang tujuan kesehatan Anda"]
    }

    // Simulate AI thinking time (shorter to prevent timeout)
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    return {
      id: Date.now().toString(),
      userId: user.id,
      message,
      sender: 'ai',
      timestamp: new Date().toISOString(),
      metadata: {
        recommendations
      }
    };
  },

  clearChatHistory: async (userId: string): Promise<void> => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`nutrizi_chat_${userId}`);
      }
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  }
};