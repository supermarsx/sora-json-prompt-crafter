
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchableDropdown } from '../SearchableDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
import { SoraOptions } from '../Dashboard';

interface SettingsLocationSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
}

const environmentOptions = [
  "default", "not defined", "keep original", "any", "real world only",
  "original worlds only", "forest", "rainforest", "jungle", "bamboo grove",
  "woods", "pine forest", "enchanted forest", "mystical grove", "meadow",
  "field", "savannah", "prairie", "grassland", "desert", "dunes", "oasis",
  "badlands", "canyon", "mesa", "mountains", "alpine", "glacier", "cliff",
  "hill", "valley", "volcano", "crater", "cave", "underground", "tunnel",
  "catacombs", "swamp", "bog", "marsh", "wetlands", "river", "creek",
  "stream", "waterfall", "lake", "pond", "ocean", "sea", "beach", "tidepool",
  "cliffs by the sea", "coast", "island", "archipelago", "lagoon", "coral reef",
  "arctic", "tundra", "frozen wasteland", "snowfield", "ice cave", "polar night",
  "steppe", "taiga", "urban", "city", "megacity", "metropolis", "city park",
  "alleyway", "suburbs", "village", "hamlet", "town", "old city", "ruins",
  "abandoned building", "skyscraper", "castle", "fortress", "palace", "temple",
  "shrine", "monastery", "cathedral", "crypt", "marketplace", "harbor", "docks",
  "train station", "airport", "ship", "submarine", "spaceship", "space station",
  "moon base", "asteroid belt", "alien planet", "exoplanet", "martian desert",
  "lunar landscape", "crystal cavern", "underdark", "fae realm", "shadow realm",
  "dreamscape", "astral plane", "spirit realm", "void", "dimension rift",
  "parallel universe", "time distortion", "cosmic nebula", "starlit sky",
  "aurora", "sunset", "sunrise", "twilight", "moonlit night", "starfield",
  "deep space", "black hole", "wormhole", "energy field", "magical forest",
  "haunted woods", "abandoned mine", "post-apocalyptic wasteland", "dystopian city",
  "utopian city", "clockwork world", "steampunk city", "floating island",
  "skylands", "flying city", "underwater city", "atlantis", "garden", "zen garden",
  "botanical garden", "orchard", "vineyard", "field of flowers", "maze",
  "labyrinth", "enchanted castle", "library", "museum", "school", "ancient ruins",
  "tower", "bridge", "rooftop", "market street", "busy crosswalk", "arcade",
  "arena", "theater", "concert hall", "circus", "playground", "dream world",
  "memory landscape", "digital world", "cyberspace", "data center",
  "holographic simulation", "virtual reality", "simulation chamber", "void corridor",
  "infinite hallway", "mirror dimension", "prism world", "kaleidoscopic landscape",
  "psychedelic environment", "energy vortex", "chakra temple", "healing springs",
  "spiritual sanctuary", "temple of light", "sacred mountain", "serene monastery",
  "field of dreams", "astral garden", "crystal fields", "luminescent cave",
  "mystic lake", "foggy moor", "stormy beach", "rainy alleyway", "sun-dappled forest",
  "star bridge", "chinese woods", "japanese woods", "european city", "american city", "wallstreet"
];

const locationOptions = [
  "Berlin, Germany", "Shanghai, China", "Sydney, Australia", "New York City, USA",
  "Times Square, New York, USA", "Brooklyn Bridge, New York, USA", "Central Park, New York, USA",
  "Manhattan, New York, USA", "The Hague, Netherlands", "Amsterdam, Netherlands",
  "London, England", "Paris, France", "Eiffel Tower, Paris, France", "Louvre Museum, Paris, France",
  "Versailles, France", "Colosseum, Rome, Italy", "Vatican City", "Trevi Fountain, Rome, Italy",
  "Milan, Italy", "Venice, Italy", "Barcelona, Spain", "Sagrada Familia, Barcelona, Spain",
  "Madrid, Spain", "Lisbon, Portugal", "Belém Tower, Lisbon, Portugal", "Porto, Portugal",
  "Brussels, Belgium", "Grand Place, Brussels, Belgium", "Vienna, Austria", "Prague, Czech Republic",
  "Charles Bridge, Prague, Czech Republic", "Budapest, Hungary", "Chain Bridge, Budapest, Hungary",
  "Athens, Greece", "Acropolis, Athens, Greece", "Santorini, Greece", "Istanbul, Turkey",
  "Hagia Sophia, Istanbul, Turkey", "Moscow, Russia", "Red Square, Moscow, Russia",
  "Saint Petersburg, Russia", "Kremlin, Moscow, Russia", "Tokyo, Japan", "Shibuya Crossing, Tokyo, Japan",
  "Kyoto, Japan", "Mount Fuji, Japan", "Seoul, South Korea", "Hong Kong", "Singapore",
  "Kuala Lumpur, Malaysia", "Petronas Towers, Kuala Lumpur, Malaysia", "Bangkok, Thailand",
  "Chiang Mai, Thailand", "Jakarta, Indonesia", "Bali, Indonesia", "New Delhi, India",
  "Taj Mahal, Agra, India", "Mumbai, India", "Beijing, China", "Forbidden City, Beijing, China",
  "Great Wall of China", "Jerusalem, Israel", "Petra, Jordan", "Cairo, Egypt",
  "Pyramids of Giza, Egypt", "Cape Town, South Africa", "Table Mountain, Cape Town, South Africa",
  "Johannesburg, South Africa", "Marrakech, Morocco", "Casablanca, Morocco", "Rio de Janeiro, Brazil",
  "Christ the Redeemer, Rio de Janeiro, Brazil", "São Paulo, Brazil", "Buenos Aires, Argentina",
  "Iguazu Falls, Argentina/Brazil", "Santiago, Chile", "Easter Island, Chile", "Lima, Peru",
  "Machu Picchu, Peru", "Cusco, Peru", "Quito, Ecuador", "Galápagos Islands, Ecuador",
  "La Paz, Bolivia", "Mexico City, Mexico", "Chichen Itza, Yucatan, Mexico", "Cancún, Mexico",
  "Toronto, Canada", "CN Tower, Toronto, Canada", "Vancouver, Canada", "Niagara Falls, Canada/USA",
  "Montreal, Canada", "Los Angeles, California, USA", "Hollywood Sign, Los Angeles, USA",
  "San Francisco, California, USA", "Golden Gate Bridge, San Francisco, USA", "Las Vegas Strip, Nevada, USA",
  "Grand Canyon, Arizona, USA", "Yosemite National Park, California, USA", "Chicago, Illinois, USA",
  "Willis Tower, Chicago, USA", "Miami Beach, Florida, USA", "Orlando, Florida, USA",
  "Walt Disney World, Florida, USA", "Washington, D.C., USA", "White House, Washington, D.C., USA",
  "Boston, Massachusetts, USA", "Harvard University, Cambridge, USA", "Seattle, Washington, USA",
  "Space Needle, Seattle, USA", "San Diego, California, USA", "Phoenix, Arizona, USA",
  "Salt Lake City, Utah, USA", "Denver, Colorado, USA", "Rocky Mountains, Colorado, USA",
  "Mount Rushmore, South Dakota, USA", "Yellowstone National Park, USA", "Death Valley, California, USA",
  "Alaska, USA", "Denali National Park, Alaska, USA", "Hawaii, USA", "Waikiki Beach, Honolulu, Hawaii, USA",
  "Pearl Harbor, Hawaii, USA", "The Arctic Circle", "The Antarctic Peninsula", "North Pole",
  "South Pole", "Mount Everest, Nepal/China", "Himalayas, Asia", "The Moon (Sea of Tranquility, Apollo 11 site)",
  "Tycho Crater, The Moon", "Valles Marineris, Mars", "Olympus Mons, Mars"
];

const seasonOptions = [
  "default (any season)", "not defined", "spring", "late spring", "early spring",
  "peak spring", "summer", "early summer", "midsummer", "late summer",
  "monsoon season", "dry season", "rainy season", "autumn", "fall", "early autumn",
  "mid autumn", "late autumn", "golden autumn", "harvest season", "leaf-fall season",
  "winter", "early winter", "midwinter", "late winter", "snow season", "wet season",
  "hot season", "cold season", "holiday season", "festive season", "cherry blossom season",
  "maple season", "pumpkin season", "equinox", "solstice", "vernal equinox",
  "autumnal equinox", "summer solstice", "winter solstice"
];

const atmosphereMoodOptions = [
  "default (neutral mood)", "not defined", "bright", "cheerful", "warm", "cool",
  "chilly", "hot", "fresh", "crisp", "mild", "soft", "serene", "peaceful",
  "tranquil", "dreamy", "ethereal", "heavenly", "airy", "uplifting", "joyful",
  "playful", "romantic", "passionate", "intimate", "inviting", "cozy", "welcoming",
  "friendly", "magical", "mystical", "enchanting", "mysterious", "eerie", "ominous",
  "spooky", "foreboding", "tense", "suspenseful", "dramatic", "intense", "bold",
  "powerful", "grand", "epic", "heroic", "noble", "moody", "melancholic", "wistful",
  "nostalgic", "pensive", "sad", "gloomy", "bleak", "somber", "dreary", "lonely",
  "isolated", "haunting", "ghostly", "dark", "shadowy", "stormy", "rainy", "foggy",
  "misty", "hazy", "smoky", "dusty", "windy", "breezy", "calm", "still", "stifling",
  "humid", "dry", "refreshing", "invigorating", "hopeful", "optimistic", "festive",
  "celebratory", "chaotic", "surreal", "psychedelic", "hypnotic", "otherworldly",
  "alien", "cosmic", "timeless", "futuristic", "ancient", "timid", "secretive",
  "safe", "protected", "abandoned", "forgotten", "restless", "electrifying", "tenebrous"
];

export const SettingsLocationSection: React.FC<SettingsLocationSectionProps> = ({
  options,
  updateOptions
}) => {
  return (
    <CollapsibleSection
      title="Settings & Location"
      isOptional={true}
      isEnabled={options.use_settings_location}
      onToggle={(enabled) => updateOptions({ use_settings_location: enabled })}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            value={options.year}
            onChange={(e) => updateOptions({ year: parseInt(e.target.value) })}
            min="1800"
            max="2100"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_environment"
            checked={options.use_environment}
            onCheckedChange={(checked) => updateOptions({ use_environment: !!checked })}
          />
          <Label htmlFor="use_environment">Use Environment</Label>
        </div>

        <div className="md:col-span-2">
          <Label>Environment</Label>
          <SearchableDropdown
            options={environmentOptions}
            value={options.environment}
            onValueChange={(value) => updateOptions({ environment: value })}
            label="Environment Options"
            disabled={!options.use_environment}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_location"
            checked={options.use_location}
            onCheckedChange={(checked) => updateOptions({ use_location: !!checked })}
          />
          <Label htmlFor="use_location">Use Location</Label>
        </div>

        <div className="md:col-span-2">
          <Label>Location</Label>
          <SearchableDropdown
            options={locationOptions}
            value={options.location || 'Berlin, Germany'}
            onValueChange={(value) => updateOptions({ location: value })}
            label="Location Options"
            disabled={!options.use_location}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_season"
            checked={options.use_season}
            onCheckedChange={(checked) => updateOptions({ use_season: !!checked })}
          />
          <Label htmlFor="use_season">Use Season</Label>
        </div>

        <div>
          <Label>Season</Label>
          <SearchableDropdown
            options={seasonOptions}
            value={options.season || 'default (any season)'}
            onValueChange={(value) => updateOptions({ season: value })}
            label="Season Options"
            disabled={!options.use_season}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_atmosphere_mood"
            checked={options.use_atmosphere_mood}
            onCheckedChange={(checked) => updateOptions({ use_atmosphere_mood: !!checked })}
          />
          <Label htmlFor="use_atmosphere_mood">Use Atmosphere Mood</Label>
        </div>

        <div>
          <Label>Atmosphere Mood</Label>
          <SearchableDropdown
            options={atmosphereMoodOptions}
            value={options.atmosphere_mood || 'default (neutral mood)'}
            onValueChange={(value) => updateOptions({ atmosphere_mood: value })}
            label="Atmosphere Mood Options"
            disabled={!options.use_atmosphere_mood}
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};
