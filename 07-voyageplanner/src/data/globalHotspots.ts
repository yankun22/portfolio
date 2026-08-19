import type { ActivityCategory } from '../types/itinerary';

export interface Hotspot {
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  category: ActivityCategory;
  description: string;
}

export const GLOBAL_HOTSPOTS: Hotspot[] = [
  // Tokyo, Japan
  { name: 'Senso-ji Temple', city: 'Tokyo', country: 'Japan', lat: 35.7148, lng: 139.7967, category: 'culture', description: "Tokyo's oldest and most significant ancient Buddhist temple." },
  { name: 'Tokyo Skytree', city: 'Tokyo', country: 'Japan', lat: 35.7100, lng: 139.8107, category: 'sightseeing', description: 'World second tallest structure with panoramic observation decks.' },
  { name: 'Shibuya Scramble Crossing', city: 'Tokyo', country: 'Japan', lat: 35.6595, lng: 139.7004, category: 'sightseeing', description: 'The famous bustling pedestrian crossing surrounded by neon lights.' },
  { name: 'Meiji Jingu Shrine', city: 'Tokyo', country: 'Japan', lat: 35.6764, lng: 139.6993, category: 'culture', description: 'Serene Shinto shrine enveloped in an expansive 170-acre forest.' },
  { name: 'Tsukiji Outer Market', city: 'Tokyo', country: 'Japan', lat: 35.6655, lng: 139.7707, category: 'dining', description: 'Vibrant street food stalls serving fresh sashimi, wagyu, and tamagoyaki.' },
  { name: 'teamLab Planets', city: 'Tokyo', country: 'Japan', lat: 35.6491, lng: 139.7898, category: 'entertainment', description: 'Immersive digital art museum walking through water and flowers.' },
  { name: 'Akihabara Electric Town', city: 'Tokyo', country: 'Japan', lat: 35.6983, lng: 139.7731, category: 'shopping', description: 'Hub for electronics, anime, gaming culture, and maid cafes.' },
  { name: 'Shinjuku Gyoen National Garden', city: 'Tokyo', country: 'Japan', lat: 35.6852, lng: 139.7100, category: 'nature', description: 'Expansive historic park blending traditional Japanese and French gardens.' },
  { name: 'Roppongi Hills Mori Tower', city: 'Tokyo', country: 'Japan', lat: 35.6605, lng: 139.7292, category: 'sightseeing', description: 'Observation deck with open-air Sky Deck and contemporary art museum.' },
  { name: 'Giza Ginza Shopping District', city: 'Tokyo', country: 'Japan', lat: 35.6719, lng: 139.7650, category: 'shopping', description: 'Upscale shopping, dining, and luxury fashion boulevard.' },

  // Kyoto, Japan
  { name: 'Fushimi Inari-taisha', city: 'Kyoto', country: 'Japan', lat: 34.9671, lng: 135.7727, category: 'culture', description: 'Iconic shrine trail lined with 10,000 vibrant vermilion Torii gates.' },
  { name: 'Kinkaku-ji (Golden Pavilion)', city: 'Kyoto', country: 'Japan', lat: 35.0394, lng: 135.7292, category: 'culture', description: 'Zen temple whose top two floors are completely covered in gold leaf.' },
  { name: 'Arashiyama Bamboo Grove', city: 'Kyoto', country: 'Japan', lat: 35.0169, lng: 135.6713, category: 'nature', description: 'Towering emerald green bamboo stalks swaying with the mountain breeze.' },
  { name: 'Kiyomizu-dera Temple', city: 'Kyoto', country: 'Japan', lat: 34.9949, lng: 135.7850, category: 'culture', description: 'Historic wooden temple stage jutting over cherry blossoms and maples.' },
  { name: 'Gion Geisha District', city: 'Kyoto', country: 'Japan', lat: 35.0037, lng: 135.7770, category: 'culture', description: 'Historic wooden machiya houses, tea houses, and lantern-lit alleys.' },
  { name: 'Nishiki Market', city: 'Kyoto', country: 'Japan', lat: 35.0050, lng: 135.7649, category: 'dining', description: 'Kyoto kitchen with 100+ stalls serving pickles, skewers, and street eats.' },

  // Rome & Amalfi Coast, Italy
  { name: 'Colosseum & Roman Forum', city: 'Rome', country: 'Italy', lat: 41.8902, lng: 12.4922, category: 'culture', description: 'Grand amphitheatre of Ancient Rome and epicenter of imperial history.' },
  { name: 'Trevi Fountain', city: 'Rome', country: 'Italy', lat: 41.9009, lng: 12.4833, category: 'sightseeing', description: 'Baroque masterpiece fountain where tradition says throwing a coin ensures return.' },
  { name: 'Vatican Museums & Sistine Chapel', city: 'Rome', country: 'Italy', lat: 41.9065, lng: 12.4536, category: 'culture', description: 'World-renowned art collection culminating in Michelangelo painted ceiling.' },
  { name: 'Pantheon', city: 'Rome', country: 'Italy', lat: 41.8986, lng: 12.4769, category: 'culture', description: 'Immaculately preserved Roman temple with world largest unreinforced dome.' },
  { name: 'Positano Cliffside Village', city: 'Positano', country: 'Italy', lat: 40.6281, lng: 14.4850, category: 'sightseeing', description: 'Pastel-colored cliff houses cascading into the sparkling Mediterranean sea.' },
  { name: 'Ravello Villa Cimbrone', city: 'Ravello', country: 'Italy', lat: 40.6482, lng: 14.6111, category: 'nature', description: 'Infinity terrace with breathtaking panoramic vistas over the Gulf of Salerno.' },
  { name: 'Amalfi Cathedral (Duomo)', city: 'Amalfi', country: 'Italy', lat: 40.6342, lng: 14.6027, category: 'culture', description: 'Stunning 9th-century medieval cathedral with striped Arab-Norman facade.' },

  // Swiss Alps / Interlaken
  { name: 'Jungfraujoch — Top of Europe', city: 'Jungfrau', country: 'Switzerland', lat: 46.5475, lng: 7.9822, category: 'nature', description: 'Highest railway station in Europe at 3,454m with Aletsch Glacier views.' },
  { name: 'Lauterbrunnen Valley of 72 Waterfalls', city: 'Lauterbrunnen', country: 'Switzerland', lat: 46.5935, lng: 7.9090, category: 'nature', description: 'Fairytale glacial valley flanked by dramatic limestone cliffs and Staubbach falls.' },
  { name: 'Harder Kulm Panorama Viewpoint', city: 'Interlaken', country: 'Switzerland', lat: 46.6978, lng: 7.8631, category: 'sightseeing', description: 'Suspended two-lake observation platform overlooking Lake Brienz and Lake Thun.' },
  { name: 'Grindelwald First Cliff Walk', city: 'Grindelwald', country: 'Switzerland', lat: 46.6575, lng: 8.0558, category: 'nature', description: 'Suspended metal walkway along sheer rock face with mountain views.' },
  { name: 'Lake Brienz Steamboat Cruise', city: 'Brienz', country: 'Switzerland', lat: 46.7208, lng: 7.9719, category: 'relaxation', description: 'Turquoise glacial lake boat tour visiting Giessbach waterfalls.' },

  // New York City, USA
  { name: 'Central Park & Bethesda Terrace', city: 'New York', country: 'USA', lat: 40.7829, lng: -73.9654, category: 'nature', description: 'Iconic 843-acre urban oasis in the heart of Manhattan.' },
  { name: 'Empire State Building', city: 'New York', country: 'USA', lat: 40.7484, lng: -73.9857, category: 'sightseeing', description: 'Art Deco skyscraper with 86th & 102nd floor open-air observation decks.' },
  { name: 'The High Line & Hudson Yards', city: 'New York', country: 'USA', lat: 40.7539, lng: -74.0022, category: 'sightseeing', description: 'Elevated railway park with skyline murals, wildflowers, and The Vessel.' },
  { name: 'Statue of Liberty & Ellis Island', city: 'New York', country: 'USA', lat: 40.6892, lng: -74.0445, category: 'culture', description: 'Universal symbol of freedom standing guard at New York Harbor.' },
  { name: 'Broadway Theater District', city: 'New York', country: 'USA', lat: 40.7590, lng: -73.9845, category: 'entertainment', description: 'World-famous theater hub featuring blockbuster musicals and plays.' },
  { name: 'Metropolitan Museum of Art (The Met)', city: 'New York', country: 'USA', lat: 40.7794, lng: -73.9632, category: 'culture', description: 'One of the world largest and finest art museums spanning 5,000 years.' },
  { name: 'Brooklyn Bridge & DUMBO View', city: 'New York', country: 'USA', lat: 40.7061, lng: -73.9969, category: 'sightseeing', description: 'Historic suspension bridge walk offering dramatic Manhattan skyline views.' },

  // Iceland Ring Road & Reykjavik
  { name: 'Blue Lagoon Geothermal Spa', city: 'Grindavík', country: 'Iceland', lat: 63.8804, lng: -22.4495, category: 'relaxation', description: 'Mineral-rich milky blue geothermal waters surrounded by black lava fields.' },
  { name: 'Gullfoss Golden Falls', city: 'Golden Circle', country: 'Iceland', lat: 64.3271, lng: -20.1199, category: 'nature', description: 'Spectacular double-tiered roaring waterfall plunging into a rugged canyon.' },
  { name: 'Geysir Geothermal Area', city: 'Golden Circle', country: 'Iceland', lat: 64.3104, lng: -20.3024, category: 'nature', description: 'Active geothermal field with Strokkur erupting boiling water every 6-10 minutes.' },
  { name: 'Seljalandsfoss & Skógafoss Waterfalls', city: 'South Coast', country: 'Iceland', lat: 63.6156, lng: -19.9885, category: 'nature', description: 'Iconic cascades where visitors can walk directly behind the roaring water veil.' },
  { name: 'Reynisfjara Black Sand Beach', city: 'Vík', country: 'Iceland', lat: 63.4057, lng: -19.0716, category: 'nature', description: 'Dramatic volcanic black sand beach with hexagonal basalt columns.' },
  { name: 'Jökulsárlón Glacier Lagoon & Diamond Beach', city: 'Vatnajökull', country: 'Iceland', lat: 64.0484, lng: -16.1795, category: 'nature', description: 'Floating icebergs drifting into the sea onto glistening black sands.' },
  { name: 'Hallgrímskirkja Church', city: 'Reykjavik', country: 'Iceland', lat: 64.1417, lng: -21.9266, category: 'culture', description: 'Expressive basalt-inspired cathedral dominating the capital city skyline.' }
];

export function searchHotspots(query: string): Hotspot[] {
  if (!query || query.trim().length === 0) return GLOBAL_HOTSPOTS.slice(0, 10);
  const q = query.toLowerCase().trim();
  return GLOBAL_HOTSPOTS.filter(
    h =>
      h.name.toLowerCase().includes(q) ||
      h.city.toLowerCase().includes(q) ||
      h.country.toLowerCase().includes(q) ||
      h.category.toLowerCase().includes(q)
  );
}
