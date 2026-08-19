import type { Trip } from '../types/itinerary';
import type { Companion, Expense } from '../types/budget';

export const SAMPLE_COMPANIONS: Record<string, Companion[]> = {
  'trip-tokyo-kyoto': [
    { id: 'comp-yan', name: 'Yan (You)', avatarColor: '#3b82f6', email: 'yan@example.com', isCurrentUser: true },
    { id: 'comp-alex', name: 'Alex Rivera', avatarColor: '#10b981', email: 'alex@example.com' },
    { id: 'comp-jordan', name: 'Jordan Hayes', avatarColor: '#f59e0b', email: 'jordan@example.com' },
    { id: 'comp-taylor', name: 'Taylor Chen', avatarColor: '#ec4899', email: 'taylor@example.com' }
  ],
  'trip-amalfi-rome': [
    { id: 'comp-yan', name: 'Yan (You)', avatarColor: '#3b82f6', email: 'yan@example.com', isCurrentUser: true },
    { id: 'comp-elena', name: 'Elena Rossi', avatarColor: '#8b5cf6', email: 'elena@example.com' },
    { id: 'comp-marcus', name: 'Marcus Vance', avatarColor: '#06b6d4', email: 'marcus@example.com' }
  ],
  'trip-swiss-alps': [
    { id: 'comp-yan', name: 'Yan (You)', avatarColor: '#3b82f6', email: 'yan@example.com', isCurrentUser: true },
    { id: 'comp-sophia', name: 'Sophia Mueller', avatarColor: '#ef4444', email: 'sophia@example.com' }
  ],
  'trip-nyc': [
    { id: 'comp-yan', name: 'Yan (You)', avatarColor: '#3b82f6', email: 'yan@example.com', isCurrentUser: true },
    { id: 'comp-alex', name: 'Alex Rivera', avatarColor: '#10b981', email: 'alex@example.com' }
  ],
  'trip-iceland': [
    { id: 'comp-yan', name: 'Yan (You)', avatarColor: '#3b82f6', email: 'yan@example.com', isCurrentUser: true },
    { id: 'comp-alex', name: 'Alex Rivera', avatarColor: '#10b981', email: 'alex@example.com' },
    { id: 'comp-jordan', name: 'Jordan Hayes', avatarColor: '#f59e0b', email: 'jordan@example.com' }
  ]
};

export const SAMPLE_TRIPS: Trip[] = [
  {
    id: 'trip-tokyo-kyoto',
    title: '7-Day Japan Highlights: Tokyo & Kyoto',
    destination: 'Tokyo & Kyoto',
    country: 'Japan',
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-10-10',
    endDate: '2026-10-16',
    primaryCurrency: 'USD',
    totalBudget: 4200,
    tags: ['Culture', 'Gastronomy', 'Bullet Train', 'Temples'],
    days: [
      {
        id: 'day-1',
        dayNumber: 1,
        date: '2026-10-10',
        title: 'Historic Asakusa & Futuristic Skytree',
        description: 'Explore ancient temple grounds, traditional craft shops, and Tokyo skyline.',
        hotelOrBase: { name: 'The Gate Hotel Asakusa Kaminarimon', coords: { lat: 35.7118, lng: 139.7946 } },
        themeColor: '#3b82f6'
      },
      {
        id: 'day-2',
        dayNumber: 2,
        date: '2026-10-11',
        title: 'Shibuya Crossing & Meiji Forest Shrine',
        description: 'Neon nightlife, youth fashion culture, and tranquil Shinto woods.',
        hotelOrBase: { name: 'Cerulean Tower Tokyu Hotel Shibuya', coords: { lat: 35.6558, lng: 139.7018 } },
        themeColor: '#10b981'
      },
      {
        id: 'day-3',
        dayNumber: 3,
        date: '2026-10-12',
        title: 'Tsukiji Outer Market & Digital Art Immersion',
        description: 'Fresh sashimi breakfast and world-famous teamLab Planets light museum.',
        hotelOrBase: { name: 'Cerulean Tower Tokyu Hotel Shibuya', coords: { lat: 35.6558, lng: 139.7018 } },
        themeColor: '#8b5cf6'
      },
      {
        id: 'day-4',
        dayNumber: 4,
        date: '2026-10-13',
        title: 'Shinkansen Bullet Train to Kyoto & Gion Evening',
        description: '300 km/h bullet train ride, wooden Machiya tea houses, and geisha sightings.',
        hotelOrBase: { name: 'Kyoto Granbell Hotel Gion', coords: { lat: 35.0022, lng: 135.7735 } },
        themeColor: '#f59e0b'
      },
      {
        id: 'day-5',
        dayNumber: 5,
        date: '2026-10-14',
        title: 'Fushimi Inari 10,000 Torii Gates & Kiyomizu-dera',
        description: 'Early morning vermilion shrine hike and sunset wooden cliff temple panorama.',
        hotelOrBase: { name: 'Kyoto Granbell Hotel Gion', coords: { lat: 35.0022, lng: 135.7735 } },
        themeColor: '#ec4899'
      },
      {
        id: 'day-6',
        dayNumber: 6,
        date: '2026-10-15',
        title: 'Arashiyama Bamboo Forest & Golden Pavilion',
        description: 'Whispering bamboo groves, riverboat punt, and golden Zen reflections.',
        hotelOrBase: { name: 'Kyoto Granbell Hotel Gion', coords: { lat: 35.0022, lng: 135.7735 } },
        themeColor: '#06b6d4'
      },
      {
        id: 'day-7',
        dayNumber: 7,
        date: '2026-10-16',
        title: 'Nishiki Market Feast & Souvenir Departure',
        description: 'Culinary street walk, matcha tea tastings, and Kansai airport express.',
        hotelOrBase: { name: 'Kyoto Granbell Hotel Gion', coords: { lat: 35.0022, lng: 135.7735 } },
        themeColor: '#6366f1'
      }
    ],
    activities: [
      // Day 1
      {
        id: 'act-1-1',
        dayId: 'day-1',
        title: 'Senso-ji Temple & Nakamise Dori',
        description: 'Explore the 7th-century incense-filled temple hall and sample fresh melon pan and fried manju.',
        location: { name: 'Senso-ji Temple', city: 'Tokyo', country: 'Japan', coords: { lat: 35.7148, lng: 139.7967 } },
        category: 'culture',
        startTime: '09:30',
        durationMinutes: 120,
        cost: 0,
        currency: 'USD',
        booked: true,
        confirmationCode: 'FREE-ENTRY',
        notes: 'Arrive early before tour buses arrive. Get fortunes (omikuji).',
        order: 1
      },
      {
        id: 'act-1-2',
        dayId: 'day-1',
        title: 'Asakusa Imahan Sukiyaki Lunch',
        description: 'Authentic A5 Kuroge Wagyu sukiyaki hotpot in historic tatami private room.',
        location: { name: 'Asakusa Imahan', city: 'Tokyo', country: 'Japan', coords: { lat: 35.7135, lng: 139.7925 } },
        category: 'dining',
        startTime: '12:00',
        durationMinutes: 75,
        cost: 140,
        currency: 'USD',
        booked: true,
        confirmationCode: 'RES-IMAHAN-88',
        notes: 'Table reserved under Yan. Includes premium marbled beef set.',
        order: 2
      },
      {
        id: 'act-1-3',
        dayId: 'day-1',
        title: 'Tokyo Skytree Observation Deck (350m & 450m)',
        description: 'Fast elevator ride to Tembo Galleria with 360-degree views extending to Mount Fuji.',
        location: { name: 'Tokyo Skytree', city: 'Tokyo', country: 'Japan', coords: { lat: 35.7100, lng: 139.8107 } },
        category: 'sightseeing',
        startTime: '14:30',
        durationMinutes: 100,
        cost: 65,
        currency: 'USD',
        booked: true,
        confirmationCode: 'SKYTREE-QR-990',
        notes: 'Sunset slot at 15:45 for golden hour lighting over Tokyo Bay.',
        order: 3
      },
      {
        id: 'act-1-4',
        dayId: 'day-1',
        title: 'Akihabara Retro Gaming & Anime Arcades',
        description: 'Browse Super Potato retro games, Mandarake multi-floor manga, and claw machines.',
        location: { name: 'Akihabara Electric Town', city: 'Tokyo', country: 'Japan', coords: { lat: 35.6983, lng: 139.7731 } },
        category: 'entertainment',
        startTime: '17:00',
        durationMinutes: 120,
        cost: 40,
        currency: 'USD',
        booked: false,
        notes: 'Bring 100-yen coins for gachapon machines.',
        order: 4
      },

      // Day 2
      {
        id: 'act-2-1',
        dayId: 'day-2',
        title: 'Meiji Jingu Shrine Morning Walk',
        description: 'Stroll through towering cypress trees and giant cedar Torii gates in sacred shrine forest.',
        location: { name: 'Meiji Jingu Shrine', city: 'Tokyo', country: 'Japan', coords: { lat: 35.6764, lng: 139.6993 } },
        category: 'culture',
        startTime: '09:00',
        durationMinutes: 90,
        cost: 0,
        currency: 'USD',
        booked: true,
        notes: 'Observe traditional Shinto morning rituals and sake barrel wall.',
        order: 1
      },
      {
        id: 'act-2-2',
        dayId: 'day-2',
        title: 'Takeshita Street & Harajuku Vintage Boutiques',
        description: 'Colourful crepe stands, cat cafes, and designer streetwear backstreets.',
        location: { name: 'Takeshita Street', city: 'Tokyo', country: 'Japan', coords: { lat: 35.6702, lng: 139.7027 } },
        category: 'shopping',
        startTime: '11:00',
        durationMinutes: 90,
        cost: 50,
        currency: 'USD',
        booked: false,
        notes: 'Try Santa Monica Crepes and Marion Crepes.',
        order: 2
      },
      {
        id: 'act-2-3',
        dayId: 'day-2',
        title: 'Shibuya Crossing & Shibuya Sky Rooftop 360',
        description: 'World-famous open-air rooftop observation deck looking down on 2,500 people crossing at once.',
        location: { name: 'Shibuya Scramble Crossing', city: 'Tokyo', country: 'Japan', coords: { lat: 35.6595, lng: 139.7004 } },
        category: 'sightseeing',
        startTime: '15:30',
        durationMinutes: 120,
        cost: 60,
        currency: 'USD',
        booked: true,
        confirmationCode: 'SHIBUYA-SKY-402',
        notes: 'Must not bring loose hats or tripods on open roof deck.',
        order: 3
      },
      {
        id: 'act-2-4',
        dayId: 'day-2',
        title: 'Shinjuku Omoide Yokocho (Memory Lane) Yakitori',
        description: 'Atmospheric lantern-lit alleyway dining on charcoal-grilled skewers and ice-cold Sapporo beer.',
        location: { name: 'Shinjuku Omoide Yokocho', city: 'Tokyo', country: 'Japan', coords: { lat: 35.6928, lng: 139.6995 } },
        category: 'dining',
        startTime: '18:30',
        durationMinutes: 90,
        cost: 85,
        currency: 'USD',
        booked: false,
        notes: 'Cash only in most izakayas.',
        order: 4
      },

      // Day 3
      {
        id: 'act-3-1',
        dayId: 'day-3',
        title: 'Tsukiji Outer Fish Market Breakfast',
        description: 'Tasting bluefin tuna nigiri, sea urchin, tamagoyaki skewers, and grilled king crab legs.',
        location: { name: 'Tsukiji Outer Market', city: 'Tokyo', country: 'Japan', coords: { lat: 35.6655, lng: 139.7707 } },
        category: 'dining',
        startTime: '08:30',
        durationMinutes: 120,
        cost: 95,
        currency: 'USD',
        booked: false,
        notes: 'Come on an empty stomach!',
        order: 1
      },
      {
        id: 'act-3-2',
        dayId: 'day-3',
        title: 'teamLab Planets Immersive Digital Experience',
        description: 'Wade barefoot through knee-deep water projected with swimming koi fish, and infinite mirror crystal universe.',
        location: { name: 'teamLab Planets', city: 'Tokyo', country: 'Japan', coords: { lat: 35.6491, lng: 139.7898 } },
        category: 'entertainment',
        startTime: '11:30',
        durationMinutes: 120,
        cost: 110,
        currency: 'USD',
        booked: true,
        confirmationCode: 'TLP-TKT-771',
        notes: 'Short pants recommended as you walk in water up to mid-calf.',
        order: 2
      },
      {
        id: 'act-3-3',
        dayId: 'day-3',
        title: 'Ginza Six Art Atrium & Boutique Rooftop Garden',
        description: 'Luxury shopping center featuring Yayoi Kusama installations and panoramic rooftop oasis.',
        location: { name: 'Giza Ginza Shopping District', city: 'Tokyo', country: 'Japan', coords: { lat: 35.6719, lng: 139.7650 } },
        category: 'shopping',
        startTime: '15:00',
        durationMinutes: 100,
        cost: 30,
        currency: 'USD',
        booked: false,
        order: 3
      },

      // Day 4
      {
        id: 'act-4-1',
        dayId: 'day-4',
        title: 'Tokaido Shinkansen Bullet Train to Kyoto',
        description: 'High-speed Nozomi train across Japan countryside with views of Mount Fuji from right window.',
        location: { name: 'Tokyo Station Shinkansen Track', city: 'Tokyo', country: 'Japan', coords: { lat: 35.6812, lng: 139.7671 } },
        category: 'transit',
        startTime: '09:00',
        durationMinutes: 135,
        cost: 260,
        currency: 'USD',
        booked: true,
        confirmationCode: 'JR-NOZOMI-CAR5',
        notes: 'Grab ekiben bento boxes at Tokyo Station Grandsta.',
        order: 1
      },
      {
        id: 'act-4-2',
        dayId: 'day-4',
        title: 'Gion District Geisha & Machiya Heritage Walk',
        description: 'Walk cobblestone Shirakawa canal streets lined with weeping willows and preserved ochaya teahouses.',
        location: { name: 'Gion Geisha District', city: 'Kyoto', country: 'Japan', coords: { lat: 35.0037, lng: 135.7770 } },
        category: 'culture',
        startTime: '15:30',
        durationMinutes: 120,
        cost: 0,
        currency: 'USD',
        booked: true,
        notes: 'Respect local signage regarding photography in private alleys.',
        order: 2
      },
      {
        id: 'act-4-3',
        dayId: 'day-4',
        title: 'Kyoto Kaiseki Multi-Course Dinner at Gion Karyo',
        description: '10-course seasonal kaiseki feast featuring local Kyoto vegetables, sashimi, and dashi broth.',
        location: { name: 'Gion Karyo', city: 'Kyoto', country: 'Japan', coords: { lat: 35.0029, lng: 135.7758 } },
        category: 'dining',
        startTime: '18:30',
        durationMinutes: 120,
        cost: 280,
        currency: 'USD',
        booked: true,
        confirmationCode: 'KARYO-KYOTO-19',
        notes: 'Dress code: Smart casual.',
        order: 3
      },

      // Day 5
      {
        id: 'act-5-1',
        dayId: 'day-5',
        title: 'Fushimi Inari Taisha 10,000 Torii Hike',
        description: 'Sunrise trek up Mount Inari through mountain tunnels of glowing vermilion gates.',
        location: { name: 'Fushimi Inari-taisha', city: 'Kyoto', country: 'Japan', coords: { lat: 34.9671, lng: 135.7727 } },
        category: 'culture',
        startTime: '07:30',
        durationMinutes: 150,
        cost: 0,
        currency: 'USD',
        booked: true,
        notes: 'Trek to Yotsutsuji intersection for Kyoto city overlook.',
        order: 1
      },
      {
        id: 'act-5-2',
        dayId: 'day-5',
        title: 'Kiyomizu-dera Temple Wooden Terrace & Otowa Waterfall',
        description: 'UNESCO World Heritage hillside temple built without a single nail overlooking maple forest.',
        location: { name: 'Kiyomizu-dera Temple', city: 'Kyoto', country: 'Japan', coords: { lat: 34.9949, lng: 135.7850 } },
        category: 'culture',
        startTime: '13:00',
        durationMinutes: 120,
        cost: 30,
        currency: 'USD',
        booked: true,
        confirmationCode: 'KIYOMIZU-PASS',
        notes: 'Drink from Otowa waterfall three streams for health, longevity, or success.',
        order: 2
      },

      // Day 6
      {
        id: 'act-6-1',
        dayId: 'day-6',
        title: 'Arashiyama Bamboo Forest & Tenryu-ji Zen Garden',
        description: 'Walk through towering bamboo grove and 14th-century temple landscape garden with Sogenchi pond.',
        location: { name: 'Arashiyama Bamboo Grove', city: 'Kyoto', country: 'Japan', coords: { lat: 35.0169, lng: 135.6713 } },
        category: 'nature',
        startTime: '08:30',
        durationMinutes: 120,
        cost: 25,
        currency: 'USD',
        booked: true,
        notes: 'Early morning light streams through bamboo culms beautifully.',
        order: 1
      },
      {
        id: 'act-6-2',
        dayId: 'day-6',
        title: 'Kinkaku-ji (The Golden Pavilion)',
        description: 'View the gleaming gold-leaf Zen pavilion mirrored in Mirror Pond (Kyoko-chi).',
        location: { name: 'Kinkaku-ji (Golden Pavilion)', city: 'Kyoto', country: 'Japan', coords: { lat: 35.0394, lng: 135.7292 } },
        category: 'culture',
        startTime: '13:30',
        durationMinutes: 90,
        cost: 35,
        currency: 'USD',
        booked: true,
        confirmationCode: 'KINKAKU-TKT-55',
        notes: 'One-way walking route around temple grounds.',
        order: 2
      },

      // Day 7
      {
        id: 'act-7-1',
        dayId: 'day-7',
        title: 'Nishiki Market Food Crawl & Matcha Souvenirs',
        description: 'Taste grilled octopus skewers, dashi tamago, soy milk doughnuts, and Uji ceremonial matcha.',
        location: { name: 'Nishiki Market', city: 'Kyoto', country: 'Japan', coords: { lat: 35.0050, lng: 135.7649 } },
        category: 'dining',
        startTime: '10:00',
        durationMinutes: 120,
        cost: 60,
        currency: 'USD',
        booked: false,
        notes: 'Pick up Japanese ceramic knives and Yatsuhashi cinnamon sweets.',
        order: 1
      },

      // Unscheduled / Bucket list
      {
        id: 'act-bucket-1',
        dayId: 'bucket',
        title: 'Ghibli Museum Mitaka Animation Tour',
        description: 'Magical Miyazaki animation wonderland featuring original hand-drawn cel art and Catbus room.',
        location: { name: 'Ghibli Museum', city: 'Mitaka', country: 'Japan', coords: { lat: 35.6963, lng: 139.5704 } },
        category: 'entertainment',
        startTime: '14:00',
        durationMinutes: 120,
        cost: 45,
        currency: 'USD',
        booked: false,
        notes: 'Tickets must be bought on 10th of preceding month at 10 AM JST.',
        order: 1
      },
      {
        id: 'act-bucket-2',
        dayId: 'bucket',
        title: 'Hakone Onsen Hot Springs Day Trip',
        description: 'Relax in open-air cedar mineral onsens overlooking Mount Fuji and Lake Ashi pirate ship cruise.',
        location: { name: 'Hakone Onsen', city: 'Hakone', country: 'Japan', coords: { lat: 35.2323, lng: 139.1069 } },
        category: 'relaxation',
        startTime: '10:00',
        durationMinutes: 240,
        cost: 150,
        currency: 'USD',
        booked: false,
        notes: 'Hakone Freepass covers Odakyu romancecar train, ropeway, and pirate cruise.',
        order: 2
      }
    ]
  },

  // Trip 2: Amalfi Coast & Rome
  {
    id: 'trip-amalfi-rome',
    title: '5-Day Italian Riviera & Eternal City: Amalfi & Rome',
    destination: 'Rome & Amalfi Coast',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-09-12',
    endDate: '2026-09-16',
    primaryCurrency: 'EUR',
    totalBudget: 3400,
    tags: ['Coastal', 'Ancient History', 'Wine', 'Mediterranean'],
    days: [
      {
        id: 'day-1',
        dayNumber: 1,
        date: '2026-09-12',
        title: 'Imperial Rome: Colosseum & Roman Forum',
        description: 'Gladiator arena, ancient temples, and sunset spritz in Trastevere.',
        hotelOrBase: { name: 'Hotel Forum Roma', coords: { lat: 41.8931, lng: 12.4877 } },
        themeColor: '#ef4444'
      },
      {
        id: 'day-2',
        dayNumber: 2,
        date: '2026-09-13',
        title: 'Vatican Splendors, Trevi Fountain & Pantheon',
        description: 'Michelangelo frescoes, Baroque fountains, and artisanal gelato.',
        hotelOrBase: { name: 'Hotel Forum Roma', coords: { lat: 41.8931, lng: 12.4877 } },
        themeColor: '#f59e0b'
      },
      {
        id: 'day-3',
        dayNumber: 3,
        date: '2026-09-14',
        title: 'Frecciarossa Train South to Positano Coast',
        description: 'Scenic high-speed train south to Naples and cliffside coastal drive.',
        hotelOrBase: { name: 'Hotel Poseidon Positano', coords: { lat: 40.6295, lng: 14.4856 } },
        themeColor: '#3b82f6'
      },
      {
        id: 'day-4',
        dayNumber: 4,
        date: '2026-09-15',
        title: 'Path of the Gods Hike & Amalfi Sunset Boat',
        description: 'Breathtaking cliff trail over the Tyrrhenian Sea and limoncello tasting.',
        hotelOrBase: { name: 'Hotel Poseidon Positano', coords: { lat: 40.6295, lng: 14.4856 } },
        themeColor: '#10b981'
      },
      {
        id: 'day-5',
        dayNumber: 5,
        date: '2026-09-16',
        title: 'Ravello Cliff Gardens & Departure',
        description: 'Villa Cimbrone infinity terrace and coastal transfer.',
        hotelOrBase: { name: 'Hotel Poseidon Positano', coords: { lat: 40.6295, lng: 14.4856 } },
        themeColor: '#8b5cf6'
      }
    ],
    activities: [
      {
        id: 'act-ar-1-1',
        dayId: 'day-1',
        title: 'Colosseum & Roman Forum Guided Tour',
        location: { name: 'Colosseum & Roman Forum', city: 'Rome', country: 'Italy', coords: { lat: 41.8902, lng: 12.4922 } },
        category: 'culture',
        startTime: '09:30',
        durationMinutes: 150,
        cost: 75,
        currency: 'EUR',
        booked: true,
        confirmationCode: 'COL-VIP-332',
        order: 1
      },
      {
        id: 'act-ar-1-2',
        dayId: 'day-1',
        title: 'Authentic Cacio e Pepe Lunch at Roscioli',
        location: { name: 'Roscioli Salumeria con Cucina', city: 'Rome', country: 'Italy', coords: { lat: 41.8938, lng: 12.4735 } },
        category: 'dining',
        startTime: '13:00',
        durationMinutes: 90,
        cost: 90,
        currency: 'EUR',
        booked: true,
        order: 2
      },
      {
        id: 'act-ar-2-1',
        dayId: 'day-2',
        title: 'Vatican Museums & Sistine Chapel',
        location: { name: 'Vatican Museums & Sistine Chapel', city: 'Rome', country: 'Italy', coords: { lat: 41.9065, lng: 12.4536 } },
        category: 'culture',
        startTime: '08:30',
        durationMinutes: 180,
        cost: 80,
        currency: 'EUR',
        booked: true,
        order: 1
      },
      {
        id: 'act-ar-2-2',
        dayId: 'day-2',
        title: 'Pantheon & Piazza Navona Walk',
        location: { name: 'Pantheon', city: 'Rome', country: 'Italy', coords: { lat: 41.8986, lng: 12.4769 } },
        category: 'sightseeing',
        startTime: '14:30',
        durationMinutes: 90,
        cost: 15,
        currency: 'EUR',
        booked: true,
        order: 2
      },
      {
        id: 'act-ar-2-3',
        dayId: 'day-2',
        title: 'Trevi Fountain Evening Coin Toss & Gelato',
        location: { name: 'Trevi Fountain', city: 'Rome', country: 'Italy', coords: { lat: 41.9009, lng: 12.4833 } },
        category: 'sightseeing',
        startTime: '17:30',
        durationMinutes: 60,
        cost: 10,
        currency: 'EUR',
        booked: false,
        order: 3
      },
      {
        id: 'act-ar-3-1',
        dayId: 'day-3',
        title: 'Frecciarossa Train Rome to Salerno / Amalfi',
        location: { name: 'Roma Termini Station', city: 'Rome', country: 'Italy', coords: { lat: 41.9014, lng: 12.5015 } },
        category: 'transit',
        startTime: '09:00',
        durationMinutes: 120,
        cost: 120,
        currency: 'EUR',
        booked: true,
        order: 1
      },
      {
        id: 'act-ar-3-2',
        dayId: 'day-3',
        title: 'Positano Pastel Cliff Village Exploration',
        location: { name: 'Positano Cliffside Village', city: 'Positano', country: 'Italy', coords: { lat: 40.6281, lng: 14.4850 } },
        category: 'sightseeing',
        startTime: '14:30',
        durationMinutes: 120,
        cost: 0,
        currency: 'EUR',
        booked: false,
        order: 2
      },
      {
        id: 'act-ar-4-1',
        dayId: 'day-4',
        title: 'Amalfi Coast Sunset Private Catamaran Cruise',
        location: { name: 'Amalfi Marina', city: 'Amalfi', country: 'Italy', coords: { lat: 40.6342, lng: 14.6027 } },
        category: 'entertainment',
        startTime: '16:00',
        durationMinutes: 180,
        cost: 320,
        currency: 'EUR',
        booked: true,
        confirmationCode: 'BOAT-AMALFI-99',
        order: 1
      },
      {
        id: 'act-ar-5-1',
        dayId: 'day-5',
        title: 'Ravello Villa Cimbrone Terrace of Infinity',
        location: { name: 'Ravello Villa Cimbrone', city: 'Ravello', country: 'Italy', coords: { lat: 40.6482, lng: 14.6111 } },
        category: 'nature',
        startTime: '10:00',
        durationMinutes: 120,
        cost: 25,
        currency: 'EUR',
        booked: true,
        order: 1
      }
    ]
  },

  // Trip 3: Swiss Alps
  {
    id: 'trip-swiss-alps',
    title: '4-Day Swiss Alpine Wonderland: Interlaken & Jungfrau',
    destination: 'Interlaken & Swiss Alps',
    country: 'Switzerland',
    coverImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-07-05',
    endDate: '2026-07-08',
    primaryCurrency: 'CHF',
    totalBudget: 2800,
    tags: ['Alps', 'Hiking', 'Glaciers', 'Panoramic Trains'],
    days: [
      {
        id: 'day-1',
        dayNumber: 1,
        date: '2026-07-05',
        title: 'Arrive Interlaken & Harder Kulm Sunset',
        description: 'Two-lake overlook and traditional cheese fondue.',
        hotelOrBase: { name: 'Victoria-Jungfrau Grand Hotel', coords: { lat: 46.6863, lng: 7.8590 } },
        themeColor: '#ef4444'
      },
      {
        id: 'day-2',
        dayNumber: 2,
        date: '2026-07-06',
        title: 'Jungfraujoch — Top of Europe (3,454m)',
        description: 'Cogwheel train to highest railway station in Europe and Ice Palace.',
        hotelOrBase: { name: 'Victoria-Jungfrau Grand Hotel', coords: { lat: 46.6863, lng: 7.8590 } },
        themeColor: '#3b82f6'
      },
      {
        id: 'day-3',
        dayNumber: 3,
        date: '2026-07-07',
        title: 'Lauterbrunnen 72 Waterfalls & Grindelwald Cliff Walk',
        description: 'Staubbach waterfall valley and First Cliff Walk bridge.',
        hotelOrBase: { name: 'Victoria-Jungfrau Grand Hotel', coords: { lat: 46.6863, lng: 7.8590 } },
        themeColor: '#10b981'
      },
      {
        id: 'day-4',
        dayNumber: 4,
        date: '2026-07-08',
        title: 'Lake Brienz Steamboat Cruise & Departure',
        description: 'Turquoise glacial waters and Giessbach grand hotel falls.',
        hotelOrBase: { name: 'Victoria-Jungfrau Grand Hotel', coords: { lat: 46.6863, lng: 7.8590 } },
        themeColor: '#8b5cf6'
      }
    ],
    activities: [
      {
        id: 'act-sw-1-1',
        dayId: 'day-1',
        title: 'Harder Kulm Funicular & Panoramic Bridge',
        location: { name: 'Harder Kulm Panorama Viewpoint', city: 'Interlaken', country: 'Switzerland', coords: { lat: 46.6978, lng: 7.8631 } },
        category: 'sightseeing',
        startTime: '16:00',
        durationMinutes: 120,
        cost: 44,
        currency: 'CHF',
        booked: true,
        order: 1
      },
      {
        id: 'act-sw-2-1',
        dayId: 'day-2',
        title: 'Jungfraujoch Top of Europe Cogwheel Expedition',
        location: { name: 'Jungfraujoch — Top of Europe', city: 'Jungfrau', country: 'Switzerland', coords: { lat: 46.5475, lng: 7.9822 } },
        category: 'nature',
        startTime: '08:30',
        durationMinutes: 240,
        cost: 210,
        currency: 'CHF',
        booked: true,
        confirmationCode: 'JUNGFRAU-PASS-10',
        order: 1
      },
      {
        id: 'act-sw-3-1',
        dayId: 'day-3',
        title: 'Lauterbrunnen Valley Waterfall Trail',
        location: { name: 'Lauterbrunnen Valley of 72 Waterfalls', city: 'Lauterbrunnen', country: 'Switzerland', coords: { lat: 46.5935, lng: 7.9090 } },
        category: 'nature',
        startTime: '09:00',
        durationMinutes: 150,
        cost: 0,
        currency: 'CHF',
        booked: true,
        order: 1
      },
      {
        id: 'act-sw-3-2',
        dayId: 'day-3',
        title: 'Grindelwald First Cliff Walk by Tissot',
        location: { name: 'Grindelwald First Cliff Walk', city: 'Grindelwald', country: 'Switzerland', coords: { lat: 46.6575, lng: 8.0558 } },
        category: 'nature',
        startTime: '14:00',
        durationMinutes: 120,
        cost: 68,
        currency: 'CHF',
        booked: true,
        order: 2
      },
      {
        id: 'act-sw-4-1',
        dayId: 'day-4',
        title: 'Lake Brienz Historic Paddle Steamer Cruise',
        location: { name: 'Lake Brienz Steamboat Cruise', city: 'Brienz', country: 'Switzerland', coords: { lat: 46.7208, lng: 7.9719 } },
        category: 'relaxation',
        startTime: '10:00',
        durationMinutes: 120,
        cost: 52,
        currency: 'CHF',
        booked: true,
        order: 1
      }
    ]
  },

  // Trip 4: NYC
  {
    id: 'trip-nyc',
    title: '3-Day New York City Highlights',
    destination: 'New York City',
    country: 'USA',
    coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-11-20',
    endDate: '2026-11-22',
    primaryCurrency: 'USD',
    totalBudget: 2100,
    tags: ['Architecture', 'Broadway', 'Museums', 'Skyline'],
    days: [
      {
        id: 'day-1',
        dayNumber: 1,
        date: '2026-11-20',
        title: 'Manhattan Midtown & Broadway Night',
        description: 'Empire State, High Line stroll, and evening theater.',
        hotelOrBase: { name: 'The Standard High Line', coords: { lat: 40.7410, lng: -74.0078 } },
        themeColor: '#3b82f6'
      },
      {
        id: 'day-2',
        dayNumber: 2,
        date: '2026-11-21',
        title: 'Central Park & Metropolitan Museum of Art',
        description: 'World-class art collections, boat pond, and Upper East Side.',
        hotelOrBase: { name: 'The Standard High Line', coords: { lat: 40.7410, lng: -74.0078 } },
        themeColor: '#10b981'
      },
      {
        id: 'day-3',
        dayNumber: 3,
        date: '2026-11-22',
        title: 'Statue of Liberty & Brooklyn Bridge Walk',
        description: 'Harbor ferry, Wall Street, and sunset DUMBO skyline.',
        hotelOrBase: { name: 'The Standard High Line', coords: { lat: 40.7410, lng: -74.0078 } },
        themeColor: '#f59e0b'
      }
    ],
    activities: [
      {
        id: 'act-nyc-1-1',
        dayId: 'day-1',
        title: 'High Line Park & Hudson Yards Vessel',
        location: { name: 'The High Line & Hudson Yards', city: 'New York', country: 'USA', coords: { lat: 40.7539, lng: -74.0022 } },
        category: 'sightseeing',
        startTime: '10:00',
        durationMinutes: 120,
        cost: 0,
        currency: 'USD',
        booked: true,
        order: 1
      },
      {
        id: 'act-nyc-1-2',
        dayId: 'day-1',
        title: 'Empire State Building 86th Floor Observatory',
        location: { name: 'Empire State Building', city: 'New York', country: 'USA', coords: { lat: 40.7484, lng: -73.9857 } },
        category: 'sightseeing',
        startTime: '14:30',
        durationMinutes: 90,
        cost: 54,
        currency: 'USD',
        booked: true,
        confirmationCode: 'ESB-VIP-881',
        order: 2
      },
      {
        id: 'act-nyc-1-3',
        dayId: 'day-1',
        title: 'Broadway Musical: Hamilton',
        location: { name: 'Broadway Theater District', city: 'New York', country: 'USA', coords: { lat: 40.7590, lng: -73.9845 } },
        category: 'entertainment',
        startTime: '19:30',
        durationMinutes: 160,
        cost: 210,
        currency: 'USD',
        booked: true,
        confirmationCode: 'BWAY-HAM-SEAT-E12',
        order: 3
      },
      {
        id: 'act-nyc-2-1',
        dayId: 'day-2',
        title: 'Central Park Walk & Bethesda Terrace',
        location: { name: 'Central Park & Bethesda Terrace', city: 'New York', country: 'USA', coords: { lat: 40.7829, lng: -73.9654 } },
        category: 'nature',
        startTime: '09:30',
        durationMinutes: 120,
        cost: 0,
        currency: 'USD',
        booked: false,
        order: 1
      },
      {
        id: 'act-nyc-2-2',
        dayId: 'day-2',
        title: 'The Metropolitan Museum of Art (The Met)',
        location: { name: 'Metropolitan Museum of Art (The Met)', city: 'New York', country: 'USA', coords: { lat: 40.7794, lng: -73.9632 } },
        category: 'culture',
        startTime: '12:30',
        durationMinutes: 180,
        cost: 30,
        currency: 'USD',
        booked: true,
        confirmationCode: 'MET-TKT-441',
        order: 2
      },
      {
        id: 'act-nyc-3-1',
        dayId: 'day-3',
        title: 'Statue of Liberty & Ellis Island Ferry',
        location: { name: 'Statue of Liberty & Ellis Island', city: 'New York', country: 'USA', coords: { lat: 40.6892, lng: -74.0445 } },
        category: 'culture',
        startTime: '09:00',
        durationMinutes: 180,
        cost: 32,
        currency: 'USD',
        booked: true,
        confirmationCode: 'STATUE-CRUISE-20',
        order: 1
      },
      {
        id: 'act-nyc-3-2',
        dayId: 'day-3',
        title: 'Brooklyn Bridge Walk & DUMBO Pizza',
        location: { name: 'Brooklyn Bridge & DUMBO View', city: 'New York', country: 'USA', coords: { lat: 40.7061, lng: -73.9969 } },
        category: 'sightseeing',
        startTime: '15:00',
        durationMinutes: 120,
        cost: 40,
        currency: 'USD',
        booked: false,
        order: 2
      }
    ]
  },

  // Trip 5: Iceland
  {
    id: 'trip-iceland',
    title: '6-Day Iceland Golden Circle & South Coast',
    destination: 'Iceland South Coast',
    country: 'Iceland',
    coverImage: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-06-18',
    endDate: '2026-06-23',
    primaryCurrency: 'USD',
    totalBudget: 3900,
    tags: ['Volcanoes', 'Glaciers', 'Waterfalls', 'Northern Lights'],
    days: [
      {
        id: 'day-1',
        dayNumber: 1,
        date: '2026-06-18',
        title: 'Reykjavik Arrival & Blue Lagoon Spa',
        description: 'Geothermal silica soak and coastal drive.',
        hotelOrBase: { name: 'The Retreat at Blue Lagoon', coords: { lat: 63.8804, lng: -22.4495 } },
        themeColor: '#06b6d4'
      },
      {
        id: 'day-2',
        dayNumber: 2,
        date: '2026-06-19',
        title: 'The Golden Circle: Gullfoss & Geysir',
        description: 'Roaring double waterfall and exploding Strokkur geyser.',
        hotelOrBase: { name: 'Hotel Geysir', coords: { lat: 64.3104, lng: -20.3024 } },
        themeColor: '#3b82f6'
      },
      {
        id: 'day-3',
        dayNumber: 3,
        date: '2026-06-20',
        title: 'Seljalandsfoss & Skógafoss Waterfalls',
        description: 'Walk behind cascading waterfalls and coastal cliffs.',
        hotelOrBase: { name: 'Hotel Skógafoss', coords: { lat: 63.5321, lng: -19.5113 } },
        themeColor: '#10b981'
      },
      {
        id: 'day-4',
        dayNumber: 4,
        date: '2026-06-21',
        title: 'Reynisfjara Black Sand Beach & Vík Basalt',
        description: 'Volcanic black sands and basalt sea stacks.',
        hotelOrBase: { name: 'Hotel Vík í Mýrdal', coords: { lat: 63.4186, lng: -19.0060 } },
        themeColor: '#f59e0b'
      },
      {
        id: 'day-5',
        dayNumber: 5,
        date: '2026-06-22',
        title: 'Jökulsárlón Glacier Lagoon & Diamond Beach',
        description: 'Floating icebergs and glistening crystal ice on black shore.',
        hotelOrBase: { name: 'Fosshotel Glacier Lagoon', coords: { lat: 63.9531, lng: -16.4820 } },
        themeColor: '#8b5cf6'
      },
      {
        id: 'day-6',
        dayNumber: 6,
        date: '2026-06-23',
        title: 'Hallgrímskirkja & Reykjavik Harbor Return',
        description: 'Capital architecture, fresh seafood stew, and departure.',
        hotelOrBase: { name: 'Canopy by Hilton Reykjavik', coords: { lat: 64.1466, lng: -21.9333 } },
        themeColor: '#ec4899'
      }
    ],
    activities: [
      {
        id: 'act-ice-1-1',
        dayId: 'day-1',
        title: 'Blue Lagoon Premium Geothermal Experience',
        location: { name: 'Blue Lagoon Geothermal Spa', city: 'Grindavík', country: 'Iceland', coords: { lat: 63.8804, lng: -22.4495 } },
        category: 'relaxation',
        startTime: '13:00',
        durationMinutes: 180,
        cost: 115,
        currency: 'USD',
        booked: true,
        confirmationCode: 'BL-PREM-902',
        order: 1
      },
      {
        id: 'act-ice-2-1',
        dayId: 'day-2',
        title: 'Gullfoss Golden Waterfall Viewpoint',
        location: { name: 'Gullfoss Golden Falls', city: 'Golden Circle', country: 'Iceland', coords: { lat: 64.3271, lng: -20.1199 } },
        category: 'nature',
        startTime: '10:00',
        durationMinutes: 90,
        cost: 0,
        currency: 'USD',
        booked: true,
        order: 1
      },
      {
        id: 'act-ice-2-2',
        dayId: 'day-2',
        title: 'Geysir Geothermal Strokkur Eruption',
        location: { name: 'Geysir Geothermal Area', city: 'Golden Circle', country: 'Iceland', coords: { lat: 64.3104, lng: -20.3024 } },
        category: 'nature',
        startTime: '12:30',
        durationMinutes: 75,
        cost: 0,
        currency: 'USD',
        booked: true,
        order: 2
      },
      {
        id: 'act-ice-3-1',
        dayId: 'day-3',
        title: 'Seljalandsfoss & Skógafoss Waterfalls Trail',
        location: { name: 'Seljalandsfoss & Skógafoss Waterfalls', city: 'South Coast', country: 'Iceland', coords: { lat: 63.6156, lng: -19.9885 } },
        category: 'nature',
        startTime: '09:30',
        durationMinutes: 150,
        cost: 0,
        currency: 'USD',
        booked: true,
        order: 1
      },
      {
        id: 'act-ice-4-1',
        dayId: 'day-4',
        title: 'Reynisfjara Black Sand Beach & Basalt Columns',
        location: { name: 'Reynisfjara Black Sand Beach', city: 'Vík', country: 'Iceland', coords: { lat: 63.4057, lng: -19.0716 } },
        category: 'nature',
        startTime: '11:00',
        durationMinutes: 90,
        cost: 0,
        currency: 'USD',
        booked: true,
        order: 1
      },
      {
        id: 'act-ice-5-1',
        dayId: 'day-5',
        title: 'Jökulsárlón Glacier Lagoon Zodiac Boat Tour',
        location: { name: 'Jökulsárlón Glacier Lagoon & Diamond Beach', city: 'Vatnajökull', country: 'Iceland', coords: { lat: 64.0484, lng: -16.1795 } },
        category: 'nature',
        startTime: '10:30',
        durationMinutes: 120,
        cost: 95,
        currency: 'USD',
        booked: true,
        confirmationCode: 'ZODIAC-ICE-77',
        order: 1
      },
      {
        id: 'act-ice-6-1',
        dayId: 'day-6',
        title: 'Hallgrímskirkja Church & Reykjavik Old Harbor',
        location: { name: 'Hallgrímskirkja Church', city: 'Reykjavik', country: 'Iceland', coords: { lat: 64.1417, lng: -21.9266 } },
        category: 'culture',
        startTime: '10:00',
        durationMinutes: 90,
        cost: 12,
        currency: 'USD',
        booked: true,
        order: 1
      }
    ]
  }
];

export const SAMPLE_EXPENSES: Record<string, Expense[]> = {
  'trip-tokyo-kyoto': [
    {
      id: 'exp-1',
      tripId: 'trip-tokyo-kyoto',
      title: 'Shinkansen Bullet Train Group Tickets (Tokyo -> Kyoto)',
      category: 'Transit',
      amount: 520,
      currency: 'USD',
      convertedAmount: 520,
      date: '2026-10-13',
      payerId: 'comp-yan',
      splitType: 'EQUAL',
      splits: [
        { companionId: 'comp-yan', share: 1 },
        { companionId: 'comp-alex', share: 1 },
        { companionId: 'comp-jordan', share: 1 },
        { companionId: 'comp-taylor', share: 1 }
      ],
      receiptNote: 'JR Tokaido Line Reserved Car 5 Seats A-D',
      createdAt: 1729000000000
    },
    {
      id: 'exp-2',
      tripId: 'trip-tokyo-kyoto',
      title: 'teamLab Planets Group Entry & Audio Guides',
      category: 'Tickets',
      amount: 160,
      currency: 'USD',
      convertedAmount: 160,
      date: '2026-10-12',
      payerId: 'comp-alex',
      splitType: 'EQUAL',
      splits: [
        { companionId: 'comp-yan', share: 1 },
        { companionId: 'comp-alex', share: 1 },
        { companionId: 'comp-jordan', share: 1 },
        { companionId: 'comp-taylor', share: 1 }
      ],
      receiptNote: 'Online fast-track digital tickets',
      createdAt: 1729050000000
    },
    {
      id: 'exp-3',
      tripId: 'trip-tokyo-kyoto',
      title: 'Asakusa Imahan Sukiyaki Dinner Banquet',
      category: 'Food',
      amount: 320,
      currency: 'USD',
      convertedAmount: 320,
      date: '2026-10-10',
      payerId: 'comp-jordan',
      splitType: 'EQUAL',
      splits: [
        { companionId: 'comp-yan', share: 1 },
        { companionId: 'comp-alex', share: 1 },
        { companionId: 'comp-jordan', share: 1 },
        { companionId: 'comp-taylor', share: 1 }
      ],
      receiptNote: '4x Kuroge Wagyu Set with local sake',
      createdAt: 1729100000000
    },
    {
      id: 'exp-4',
      tripId: 'trip-tokyo-kyoto',
      title: 'Kyoto Machiya Traditional Ryokan (3 Nights)',
      category: 'Lodging',
      amount: 1050,
      currency: 'USD',
      convertedAmount: 1050,
      date: '2026-10-13',
      payerId: 'comp-taylor',
      splitType: 'EQUAL',
      splits: [
        { companionId: 'comp-yan', share: 1 },
        { companionId: 'comp-alex', share: 1 },
        { companionId: 'comp-jordan', share: 1 },
        { companionId: 'comp-taylor', share: 1 }
      ],
      receiptNote: 'Private courtyard and onsen bath',
      createdAt: 1729150000000
    },
    {
      id: 'exp-5',
      tripId: 'trip-tokyo-kyoto',
      title: 'Pocket Wi-Fi & Unlimited 5G eSIMs',
      category: 'Misc',
      amount: 80,
      currency: 'USD',
      convertedAmount: 80,
      date: '2026-10-10',
      payerId: 'comp-yan',
      splitType: 'EQUAL',
      splits: [
        { companionId: 'comp-yan', share: 1 },
        { companionId: 'comp-alex', share: 1 },
        { companionId: 'comp-jordan', share: 1 },
        { companionId: 'comp-taylor', share: 1 }
      ],
      receiptNote: 'Haneda Airport pickup unit',
      createdAt: 1729200000000
    }
  ]
};
