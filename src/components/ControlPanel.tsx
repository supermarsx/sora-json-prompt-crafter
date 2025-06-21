import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { SoraOptions } from './Dashboard';

interface ControlPanelProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
  updateNestedOptions: (path: string, value: any) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  options,
  updateOptions,
  updateNestedOptions,
}) => {
  // Style presets categorized
  const stylePresets = {
    "Classic Art & Painting": ["photorealistic", "hyperrealistic", "oil painting", "watercolor", "acrylic", "gouache", "pastel drawing", "pencil sketch", "ink drawing", "charcoal", "colored pencil", "impasto", "impressionist", "expressionist", "fauvism", "cubist", "surrealist", "abstract", "minimalism", "pop art", "art nouveau", "art deco", "ukiyo-e", "renaissance", "baroque", "classical painting", "romanticism", "rococo"],
    "Modern Digital & Illustration": ["digital painting", "3d render", "2d digital art", "3d illustration", "vector art", "pixel art", "voxel art", "isometric", "low poly", "flat design", "comic book", "manga", "anime", "cartoon", "line art", "cel shading", "vaporwave", "synthwave", "glitch art", "cyberpunk", "steampunk", "dark fantasy", "fantasy art", "storybook", "children's illustration"],
    "Photography & Cinematic": ["editorial photo", "cinematic", "film still", "documentary", "polaroid", "black and white", "sepia", "lomography", "macro", "tilt-shift", "aerial/drone", "timelapse", "high contrast", "soft focus", "vintage photo", "retro", "golden hour", "blue hour", "infrared", "ultraviolet", "HDR", "bokeh", "old iphone"],
    "Fashion & Portrait": ["editorial fashion", "haute couture", "street style", "glamor", "beauty portrait", "close-up", "dramatic lighting", "studio portrait", "headshot"],
    "Culture & World Inspiration": ["anime", "manga", "japanese woodblock", "chinese brush painting", "persian miniature", "byzantine mosaic", "ancient greek", "egyptian fresco", "native american art", "aboriginal art", "aztec/mayan", "nordic/viking", "african tribal", "japanese sumi-e painting"],
    "Genre/Theme": ["fantasy", "dark fantasy", "horror", "sci-fi", "cyberpunk", "post-apocalyptic", "dystopian", "utopian", "fairy tale", "magical realism", "noir", "detective", "space opera", "medieval", "ancient", "futuristic", "surreal"],
    "Lighting & Mood": ["neon", "moody", "dramatic", "romantic", "mysterious", "dreamy", "ethereal", "soft lighting", "harsh lighting", "chiaroscuro", "silhouette", "backlit"],
    "Decorative & Textural": ["stained glass", "embroidery", "tapestry", "origami", "papercraft", "collage", "mosaic", "graffiti", "sticker bomb", "spray paint"],
    "Commercial/Professional": ["architectural rendering", "product render", "interior design", "automotive render", "advertising", "medical illustration", "technical drawing"],
    "Famous Artists/Influences": ["in the style of Van Gogh", "in the style of Monet", "in the style of Picasso", "in the style of Hokusai", "in the style of Moebius", "in the style of Alphonse Mucha", "in the style of Studio Ghibli", "in the style of Disney", "in the style of old DuckTales", "in the style of modern DuckTales", "in the style of Marvel comics", "in the style of old vintage Disney", "in the style of SpongeBob SquarePants", "in the style of Powerpuff Girls", "in the style of the Amazing Gumball", "in the style of Rick & Morty", "in the style of Cuphead", "in the style of The Simpsons", "in the style of ScoobyDoo", "in the style of The Smurfs", "in the style of Family Guy", "in the style of Kim Possible", "in the style of My Life as Teenage Robot", "in the style of old Dragon Ball", "in the style of Yu-Gi-Oh!", "in the style of Doraemon", "in the style of Naruto", "in the style of One Piece", "in the style of Attack on Titan", "in the style of Castlevania the modern anime", "in the style of Adventure Time", "in the style of Samurai Jack", "in the style of Futurama", "in the style of Star Wars"]
  };

  const colorGradeOptions = ["default", "as is", "not defined", "keep original", "teal and orange", "cinematic teal-orange", "cinematic blue", "cinematic green", "blockbuster", "bleach bypass", "sepia", "classic sepia", "monochrome", "black and white", "high contrast black and white", "muted colors", "pastel", "soft pastel", "washed out", "desaturated", "vivid", "ultra-vivid", "vintage film", "retro color", "analog film", "kodachrome", "fuji film", "agfacolor", "lomography", "cross-processed", "instax", "polaroid", "matte", "faded", "low contrast", "high contrast", "cool tones", "warm tones", "cool shadows, warm highlights", "golden hour", "blue hour", "night blue", "sunset glow", "autumn", "spring bloom", "icy blue", "emerald green", "magenta dream", "purple haze", "cyan tint", "neon", "sci-fi neon", "duotone", "tritone", "orange and teal", "red and cyan", "yellow and blue", "split toning", "film noir", "giallo", "moody", "dramatic", "dreamy", "ethereal", "infrared", "ultraviolet", "infrared false color", "xpro", "cinema verité", "day for night", "classic hollywood", "technicolor", "desaturated greens", "sun-kissed", "pastel neon", "rustic", "earthy", "milky", "deep shadows", "highlight recovery", "HDR", "SDR", "washed film", "cool matte", "warm matte", "lush greens", "icy whites", "strong red and black only"];

  const lightingOptions = ["default", "as is", "not defined", "keep original", "natural", "soft natural", "hard natural", "window", "direct sunlight", "diffused sunlight", "overcast", "golden hour", "blue hour", "sunset", "sunrise", "dappled sunlight", "moonlight", "twilight", "dawn", "backlight", "rim", "edge", "side", "split", "top", "bottom", "under", "up", "down", "ambient", "soft ambient", "studio", "three-point", "butterfly", "Rembrandt", "loop", "broad", "short", "clamshell", "ring", "beauty dish", "softbox", "octabox", "hard", "soft", "spot", "key", "fill", "hair", "catchlight", "practical", "motivated", "cinematic", "dramatic", "moody", "high-key", "low-key", "harsh", "diffused", "glowing", "glare", "lens flare", "bokeh lights", "colored", "RGB", "neon", "fluorescent", "incandescent", "tungsten", "LED", "candlelight", "torchlight", "firelight", "lantern", "streetlight", "headlights", "car lights", "spotlights", "searchlights", "stage", "concert", "strobe", "light painting", "chiaroscuro", "silhouette", "shadow play", "patterned", "projected", "reflected", "bounce", "underwater", "volumetric", "god rays", "crepuscular rays", "foggy", "hazy", "misty", "storm", "lightning", "bioluminescence", "glow in the dark", "magic", "fairy lights", "crystal", "laser", "fiber optic", "psychedelic"];

  const shotTypeOptions = ["default", "as is", "not defined", "keep original", "establishing", "wide", "extreme wide", "very wide", "full", "long", "medium long", "cowboy", "medium", "medium close-up", "close-up", "extreme close-up", "detail", "insert", "over-the-shoulder", "point-of-view", "POV", "reaction", "two shot", "three shot", "group", "crowd", "aerial", "drone", "top-down", "bird's eye", "high angle", "low angle", "worm's eye", "tilted", "dutch angle", "profile", "cross", "reverse angle", "mirror", "reflection", "split screen", "mirror image", "tracking", "dolly", "push-in", "pull-out", "crane", "panoramic", "panorama", "static", "still", "freeze frame", "motion blur", "slow motion", "time-lapse", "macro", "cut-in", "cutaway", "insert detail", "subjective", "objective", "isometric"];

  const cameraAngleOptions = ["default", "as is", "not defined", "keep original", "eye-level", "high", "low", "bird's eye", "worm's eye", "overhead", "top-down", "shoulder-level", "knee-level", "hip-level", "ground-level", "canted", "dutch", "oblique", "reverse", "profile", "three-quarter", "front-facing", "back-facing", "behind", "above", "below", "under", "point-of-view", "POV", "over-the-shoulder", "mirror", "reflection", "through-glass", "through-object", "hidden", "peek", "peeking", "side", "diagonal", "tilted"];

  const lensOptions = ["default", "as is", "not defined", "keep original", "standard 50mm", "wide 24mm", "ultra wide 14mm", "fisheye 8mm", "telephoto 85mm", "super telephoto 300mm", "macro 100mm", "micro 5mm", "zoom 24-70mm", "prime 35mm", "prime 85mm", "prime 135mm", "anamorphic 40mm", "cinema 50mm", "portrait 85mm", "tilt-shift 90mm", "pinhole 35mm", "soft focus 80mm", "mirror 500mm", "catadioptric 250mm", "infrared 720nm", "ultraviolet 365nm", "vintage 35mm", "toy 22mm", "plastic 35mm", "crystal 28mm", "split diopter 50mm", "dual 35mm", "periscope 24mm", "rectilinear 24mm", "defocus 100mm", "superzoom 18-200mm", "perspective control 24mm"];

  const depthOfFieldOptions = ["default", "keep original", "not defined", "as is", "ultra shallow depth of field", "very shallow depth of field", "shallow depth of field", "medium depth of field", "deep depth of field", "very deep depth of field", "infinite depth of field", "selective focus", "split focus", "rack focus", "focus stacking", "tilt-shift effect", "macro focus", "bokeh background", "background blur", "foreground blur", "sharp foreground, blurred background", "sharp background, blurred foreground", "everything in focus", "subject in focus", "foreground in focus", "background in focus"];

  const availableCompositionRules = ["rule of thirds", "golden ratio", "golden spiral", "diagonal method", "leading lines", "centered composition", "symmetry", "asymmetry", "dynamic symmetry", "frame within a frame", "foreground interest", "background interest", "balance", "visual weight", "negative space", "positive space", "triangular composition", "pyramid composition", "odds rule", "fill the frame", "breathing room", "eye line", "vanishing point", "converging lines", "implied lines", "S-curve", "L-curve", "Z-pattern", "C-pattern", "figure to ground", "isolated subject", "layering", "framing", "repetition", "pattern", "texture", "rhythm", "visual flow", "juxtaposition", "minimalism", "clutter", "cropping", "tight crop", "open composition", "closed composition", "high horizon", "low horizon", "eye-level perspective", "bird's eye perspective", "worm's eye perspective"];

  const madeOutOfOptions = ["default", "not defined", "keep original", "any", "surprise me", "real textures only", "original textures only", "wood", "oak", "bamboo", "driftwood", "lettuce", "metal", "steel", "debris", "plastic debris", "brass", "bronze", "copper", "iron", "aluminum", "gummy bears", "gum", "bubblegum", "pink bubblegum", "titanium", "gold", "waste", "plastic waste", "metallic waste", "silver", "platinum", "rusty metal", "plastic", "translucent plastic", "acrylic", "resin", "polycarbonate", "rubber", "silicone", "glass", "frosted glass", "stained glass", "crystal", "prism", "diamond", "emerald", "ruby", "sapphire", "amethyst", "opal", "pearl", "quartz", "obsidian", "granite", "marble", "slate", "sandstone", "limestone", "concrete", "brick", "ceramic", "porcelain", "pottery", "candlewax", "gatorade", "cocacola", "terracotta", "cloth", "snakeskin", "tacos", "cotton", "linen", "silk", "noodles", "wool", "chess pieces", "velvet", "denim", "leather", "suede", "pizza", "fur", "felt", "canvas", "burlap", "paper", "cardboard", "origami paper", "papyrus", "parchment", "netting", "lace", "chainmail", "kevlar", "carbon fiber", "fiberglass", "rope", "string", "yarn", "wire", "wax", "soap", "cheese", "butter", "chocolate", "candy", "jelly", "ice", "snow", "water", "liquid metal", "mercury", "oil", "honey", "amber", "tree sap", "slime", "gel", "foam", "sponge", "bubble", "cloud", "mist", "smoke", "ash", "dust", "sand", "gravel", "soil", "mud", "clay", "peat", "plants", "leaves", "moss", "grass", "vines", "flowers", "petals", "thorns", "mushrooms", "fungi", "coral", "shell", "bone", "ivory", "horn", "antler", "banana", "tooth", "scales", "skin", "flesh", "muscle", "tortilla", "cartilage", "blood", "old blood", "green blood", "spider silk", "chitin", "insect wings", "feathers", "quills", "spines", "eggshell", "lava", "molten rock", "star matter", "cosmic dust", "energy", "light", "neon", "hologram", "plasma", "radioactive material", "nanomaterial", "honeycomb", "living tissue", "bio-metal", "degraded alloys", "alien alloy", "void", "shadow", "aura", "dream", "memories", "sound", "music", "data", "code", "pixel", "circuitry", "wires", "cogs", "clockwork", "gears", "paper mache", "glitter", "sequins", "beads", "jewels", "spikes", "velcro", "magnet", "magnetic field", "force field", "arcane crystal", "enchanted stone", "runestone", "magic", "dreamstuff", "imagination", "illusion"];

  const environmentOptions = ["default", "not defined", "keep original", "any", "real world only", "original worlds only", "forest", "rainforest", "jungle", "bamboo grove", "woods", "pine forest", "enchanted forest", "mystical grove", "meadow", "field", "savannah", "prairie", "grassland", "desert", "dunes", "oasis", "badlands", "canyon", "mesa", "mountains", "alpine", "glacier", "cliff", "hill", "valley", "volcano", "crater", "cave", "underground", "tunnel", "catacombs", "swamp", "bog", "marsh", "wetlands", "river", "creek", "stream", "waterfall", "lake", "pond", "ocean", "sea", "beach", "tidepool", "cliffs by the sea", "coast", "island", "archipelago", "lagoon", "coral reef", "arctic", "tundra", "frozen wasteland", "snowfield", "ice cave", "polar night", "steppe", "taiga", "urban", "city", "megacity", "metropolis", "city park", "alleyway", "suburbs", "village", "hamlet", "town", "old city", "ruins", "abandoned building", "skyscraper", "castle", "fortress", "palace", "temple", "shrine", "monastery", "cathedral", "crypt", "marketplace", "harbor", "docks", "train station", "airport", "ship", "submarine", "spaceship", "space station", "moon base", "asteroid belt", "alien planet", "exoplanet", "martian desert", "lunar landscape", "crystal cavern", "underdark", "fae realm", "shadow realm", "dreamscape", "astral plane", "spirit realm", "void", "dimension rift", "parallel universe", "time distortion", "cosmic nebula", "starlit sky", "aurora", "sunset", "sunrise", "twilight", "moonlit night", "starfield", "deep space", "black hole", "wormhole", "energy field", "magical forest", "haunted woods", "abandoned mine", "post-apocalyptic wasteland", "dystopian city", "utopian city", "clockwork world", "steampunk city", "floating island", "skylands", "flying city", "underwater city", "atlantis", "garden", "zen garden", "botanical garden", "orchard", "vineyard", "field of flowers", "maze", "labyrinth", "enchanted castle", "library", "museum", "school", "ancient ruins", "tower", "bridge", "rooftop", "market street", "busy crosswalk", "arcade", "arena", "theater", "concert hall", "circus", "playground", "dream world", "memory landscape", "digital world", "cyberspace", "data center", "holographic simulation", "virtual reality", "simulation chamber", "void corridor", "infinite hallway", "mirror dimension", "prism world", "kaleidoscopic landscape", "psychedelic environment", "energy vortex", "chakra temple", "healing springs", "spiritual sanctuary", "temple of light", "sacred mountain", "serene monastery", "field of dreams", "astral garden", "crystal fields", "luminescent cave", "mystic lake", "foggy moor", "stormy beach", "rainy alleyway", "sun-dappled forest", "star bridge", "chinese woods", "japanese woods", "european city", "american city", "wallstreet"];

  const blurStyleOptions = ["default", "no blur", "as is", "background blur", "foreground blur", "subject blur", "radial blur", "motion blur", "directional blur", "linear blur", "vertical blur", "horizontal blur", "zoom blur", "tilt-shift blur", "bokeh blur", "soft blur", "strong blur", "gaussian blur", "box blur", "lens blur", "surface blur", "median blur", "bilateral blur", "edge blur", "depth blur", "field blur", "iris blur", "spin blur", "path blur", "dreamlike blur", "ethereal blur", "glow blur", "crystal blur", "fractal blur", "pixelated blur", "anamorphic blur", "old handheld blur", "old iPhone blur", "old lens blur", "old phone blur", "vintage blur", "chromatic blur", "halo blur", "vignette blur", "atmospheric blur", "mist blur", "haze blur", "fog blur", "cloud blur", "water blur", "heat haze blur", "double vision blur", "ghosting blur", "glass blur", "frosted blur", "prism blur", "mirror blur", "diffraction blur", "neon blur", "glitter blur", "zoom burst blur"];

  const apertureOptions = ["default (auto aperture)", "not defined", "as is", "f/0.7 (ultra fast, extreme bokeh, specialty lens)", "f/0.8 (ultra fast, creamy background blur)", "f/0.95 (legendary bokeh, dreamy rendering)", "f/1.0 (super shallow depth, rare portraiture)", "f/1.2 (artistic bokeh, extreme low light)", "f/1.4 (classic fast prime, buttery background)", "f/1.7 (vintage look, character rendering)", "f/1.8 (common fast prime, strong subject isolation)", "f/2.0 (soft background, bright, low light)", "f/2.2 (gentle bokeh, classic street/portrait)", "f/2.4 (subtle separation, natural background)", "f/2.8 (standard bright zoom, low light workhorse)", "f/3.2 (transition zone, more context)", "f/3.5 (vintage zoom/aperture, moderate depth)", "f/4.0 (versatile, landscape, travel, sharper background)", "f/4.5 (good for group photos, more clarity)", "f/5.0 (mild background blur, more sharpness)", "f/5.6 (classic landscape, sharp across frame)", "f/6.3 (good depth, sunlight outdoors)", "f/6.7 (subtle isolation, older lens feel)", "f/7.1 (sharper, more in focus, environmental shots)", "f/8.0 (street, travel, deep focus, best sharpness)", "f/9.0 (rich context, large DOF)", "f/9.5 (older lens, specialty use)", "f/10 (transition to full sharpness, few effects)", "f/11 (great for landscapes, wide clarity)", "f/13 (full depth, less diffraction)", "f/14 (extra depth, rare specialty)", "f/16 (everything in focus, bright scenes)", "f/18 (full clarity, maximum daylight)", "f/19 (extreme DOF, creative look)", "f/20 (very deep focus, rare use)", "f/22 (maximum DOF, sharp foreground/background)", "f/25 (large format, specialty use)", "f/29 (hyper focus, creative/fine art)", "f/32 (ultimate landscape, nearly pinhole effect)", "f/36 (rare, technical, maximum DOF)", "f/40 (extreme focus, special lenses)", "f/45 (large format, technical camera work)", "f/51 (historic large format/technical use)", "f/57 (very rare, large format only)", "f/64 (famous Ansel Adams, Group f/64, maximum depth)"];

  const cameraTypeOptions = ["default (auto/any camera)", "not defined", "as is", "keep original", "DSLR (digital single-lens reflex)", "mirrorless (compact, digital interchangeable lens)", "rangefinder (classic street photography)", "SLR (film single-lens reflex)", "point and shoot (compact, easy use)", "bridge camera (hybrid zoom)", "medium format (pro, ultra high-res)", "large format (fine art, tilt/shift)", "instant camera (Polaroid, Instax style)", "disposable camera (lo-fi, retro)", "pinhole camera (experimental, soft focus)", "toy camera (Holga, Diana, quirky looks)", "twin-lens reflex (TLR, vintage)", "box camera (early 20th century style)", "folding camera (vintage portable)", "subminiature camera (spy, tiny format)", "action camera (GoPro, sports)", "360 camera (panoramic, immersive)", "smartphone camera (modern, casual)", "old phone camera (lo-fi, nostalgic)", "old iPhone camera (retro digital look)", "webcam (lo-fi, candid)", "camcorder (video, home movies)", "handheld camcorder (retro video)", "old handheld camera (vintage, shaky aesthetic)", "film camera (general analog)", "super 8 camera (home movies, film grain)", "vhs camcorder (analog video aesthetic)", "security camera (CCTV, fisheye)", "dashcam (in-car, wide angle)", "drone camera (aerial, birds-eye)", "thermal camera (heat vision, IR effect)", "infrared camera (night vision, special effect)", "night vision camera (low-light scenes)", "stereo camera (3D, VR)", "holographic camera (sci-fi, virtual capture)", "digital back (pro, modular studio)", "modular camera system (customizable pro)", "underwater camera (diving, marine shots)", "body camera (POV, documentary)", "surveillance camera (hidden, covert)", "robotic camera (automated, sci-fi)", "AI camera (smart, auto-enhanced)", "cinema camera (professional movie making)", "IMAX camera (ultra-wide, blockbuster)", "panoramic camera (wide landscapes)", "tilt-shift camera (architectural, creative DOF)", "field camera (large format outdoor)", "studio camera (broadcast, TV)", "toy digital camera (kids, low-fi)", "Sony Alpha 1 (flagship mirrorless)", "Sony Alpha 7R V (high-res full-frame)", "Sony FX6 (cinema line)", "Sony Venice (digital cinema camera)", "RED Komodo (compact cinema)", "RED V-Raptor (high-end cinema)", "RED Helium 8K (legendary cinema)", "Nikon Z9 (flagship mirrorless)", "Nikon D6 (pro DSLR)", "Nikon F6 (classic film SLR)", "Panasonic GH6 (hybrid mirrorless)", "Panasonic S1H (cinema mirrorless)", "Fujifilm GFX100 (medium format)", "Fujifilm X-T5 (APS-C mirrorless)", "Blackmagic Pocket Cinema Camera 6K", "Blackmagic URSA Mini Pro 12K", "DJI Osmo Pocket (portable gimbal)", "DJI Mavic 3 (drone camera)", "GoPro HERO12 Black (action camera)", "GoPro Max (360 action cam)"];

  const seasonOptions = ["default (any season)", "not defined", "spring", "late spring", "early spring", "peak spring", "summer", "early summer", "midsummer", "late summer", "monsoon season", "dry season", "rainy season", "autumn", "fall", "early autumn", "mid autumn", "late autumn", "golden autumn", "harvest season", "leaf-fall season", "winter", "early winter", "midwinter", "late winter", "snow season", "wet season", "hot season", "cold season", "holiday season", "festive season", "cherry blossom season", "maple season", "pumpkin season", "equinox", "solstice", "vernal equinox", "autumnal equinox", "summer solstice", "winter solstice"];

  const atmosphereMoodOptions = ["default (neutral mood)", "not defined", "bright", "cheerful", "warm", "cool", "chilly", "hot", "fresh", "crisp", "mild", "soft", "serene", "peaceful", "tranquil", "dreamy", "ethereal", "heavenly", "airy", "uplifting", "joyful", "playful", "romantic", "passionate", "intimate", "inviting", "cozy", "welcoming", "friendly", "magical", "mystical", "enchanting", "mysterious", "eerie", "ominous", "spooky", "foreboding", "tense", "suspenseful", "dramatic", "intense", "bold", "powerful", "grand", "epic", "heroic", "noble", "moody", "melancholic", "wistful", "nostalgic", "pensive", "sad", "gloomy", "bleak", "somber", "dreary", "lonely", "isolated", "haunting", "ghostly", "dark", "shadowy", "stormy", "rainy", "foggy", "misty", "hazy", "smoky", "dusty", "windy", "breezy", "calm", "still", "stifling", "humid", "dry", "refreshing", "invigorating", "hopeful", "optimistic", "festive", "celebratory", "chaotic", "surreal", "psychedelic", "hypnotic", "otherworldly", "alien", "cosmic", "timeless", "futuristic", "ancient", "timid", "secretive", "safe", "protected", "abandoned", "forgotten", "restless", "electrifying", "tenebrous"];

  const subjectMoodOptions = ["default (neutral mood)", "not defined", "happy", "joyful", "cheerful", "delighted", "ecstatic", "excited", "enthusiastic", "amused", "playful", "mischievous", "flirty", "seductive", "confident", "proud", "arrogant", "regal", "majestic", "noble", "powerful", "strong", "determined", "focused", "inspired", "thoughtful", "pensive", "curious", "inquisitive", "contemplative", "relaxed", "calm", "peaceful", "serene", "gentle", "kind", "friendly", "compassionate", "caring", "protective", "empathetic", "hopeful", "optimistic", "dreamy", "wistful", "nostalgic", "melancholic", "lonely", "isolated", "shy", "timid", "anxious", "nervous", "worried", "fearful", "scared", "vulnerable", "sensitive", "sad", "tearful", "depressed", "gloomy", "broken", "defeated", "sorrowful", "mournful", "angry", "furious", "annoyed", "irritated", "frustrated", "aggressive", "defiant", "rebellious", "cynical", "sarcastic", "skeptical", "suspicious", "secretive", "mysterious", "enigmatic", "intense", "passionate", "fiery", "bold", "daring", "adventurous", "restless", "wild", "chaotic", "eccentric", "quirky", "surprised", "startled", "shocked", "stunned", "bewildered", "confused", "lost", "disoriented", "absent-minded", "stoic", "neutral", "apathetic", "emotionless", "blank", "cold", "aloof", "distant", "sinister", "menacing", "evil", "diabolical", "malicious", "haunted", "possessed", "enchanted", "magical", "angelic", "divine", "transcendent", "otherworldly", "alien", "robotic", "mechanical", "animalistic", "feral"];

  const swordTypeOptions = ["default (any sword)", "not defined", "longsword", "broadsword", "shortsword", "greatsword", "claymore", "zweihander", "bastard sword", "arming sword", "rapier", "sabre", "cutlass", "scimitar", "falchion", "katana", "wakizashi", "tachi", "uchigatana", "ninjato", "dao", "jian", "kris", "kopis", "kukri", "gladius", "spatha", "xiphos", "machete", "estoc", "flamberge", "hand-and-a-half sword", "messer", "shamshir", "talwar", "khopesh", "parang", "kris sword", "sword cane", "stiletto", "main gauche", "court sword", "executioner's sword", "training sword (bokken, waster, shinai, etc)", "fantasy sword", "magic sword", "enchanted sword", "flaming sword", "ice sword", "crystal sword", "demonic sword", "angelic sword", "cursed sword", "holy sword", "void blade", "energy sword", "laser sword", "plasma sword", "sci-fi sword", "steampunk sword", "clockwork sword", "organic sword", "living sword", "bone sword", "shadow blade", "light blade", "sunblade", "moonblade", "starforged sword", "dragonbone sword", "runeblade", "legendary sword", "king's sword", "queen's sword", "samurai sword", "pirate sword", "vampire sword", "undead sword", "serrated sword", "barbed sword", "curved sword", "straight sword", "double-edged sword", "single-edged sword", "jewel-encrusted sword", "ornate sword",  "minimalist sword", "futuristic sword", "ancient sword", "rusted sword", "ethereal sword", "illusionary sword", "mirror sword", "glass sword", "translucent sword", "runic sword", "chimeric sword", "mythic sword", "heroic sword", "villain's sword"];

  const swordVibeOptions = ["default (neutral vibe)", "not defined", "ancient", "mysterious", "elegant", "ornate", "minimalist", "brutal", "bloodstained", "sinister", "wicked", "demonic", "holy", "sacred", "cursed", "blessed", "heroic", "legendary", "forgotten", "lost", "famed", "infamous", "royal", "regal", "noble", "rusted", "weathered", "pristine", "shattered", "restored", "glowing", "radiant", "dark", "shadowy", "ethereal", "spectral", "ghostly", "fiery", "flaming", "icy", "chilling", "frozen", "crystalline", "glimmering", "gleaming", "shimmering", "translucent", "mirror-like", "fractured", "barbed", "serrated", "vicious", "vampiric", "undead", "dragon-forged", "starforged", "celestial", "arcane", "runic", "enchanted", "spellbound", "whispering", "singing", "resonant", "bloodthirsty", "hungry", "devouring", "unyielding", "indestructible", "swift", "lightweight", "heavy", "massive", "balanced", "nimble", "graceful", "futuristic", "steampunk", "mechanical", "organic", "living", "possessed", "sentient", "rebellious", "loyal", "protective", "forbidden", "unstoppable", "invincible", "mythic", "otherworldly"];

  const handleCompositionRuleToggle = (ruleId: string, checked: boolean) => {
    const currentRules = options.composition_rules;
    const newRules = checked
      ? [...currentRules, ruleId]
      : currentRules.filter(r => r !== ruleId);
    updateOptions({ composition_rules: newRules });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Prompt Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge variant="outline" className="bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">Prompt</Badge>
            Main Prompt & Negative
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Main Prompt</Label>
            <Textarea
              id="prompt"
              value={options.prompt}
              onChange={(e) => updateOptions({ prompt: e.target.value })}
              placeholder="Describe your scene in detail..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="negative_prompt">Negative Prompt</Label>
            <Textarea
              id="negative_prompt"
              value={options.negative_prompt}
              onChange={(e) => updateOptions({ negative_prompt: e.target.value })}
              placeholder="What to avoid in the generation..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="space-y-0.5">
              <Label htmlFor="use-signature" className="text-sm font-medium">Use Signature</Label>
              <p className="text-xs text-muted-foreground">Add a signature to the image</p>
            </div>
            <Switch
              id="use-signature"
              checked={options.use_signature}
              onCheckedChange={(checked) => updateOptions({ use_signature: checked })}
            />
          </div>

          {options.use_signature && (
            <div className="space-y-2">
              <Label htmlFor="signature">Signature</Label>
              <Input
                id="signature"
                value={options.signature || ''}
                onChange={(e) => updateOptions({ signature: e.target.value })}
                placeholder="Your signature..."
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generation Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">Generation</Badge>
            Core Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seed">Seed</Label>
              <Input
                id="seed"
                type="number"
                value={options.seed || ''}
                onChange={(e) => updateOptions({ seed: e.target.value ? parseInt(e.target.value) : null })}
                placeholder="Random"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={options.year}
                onChange={(e) => updateOptions({ year: parseInt(e.target.value) || new Date().getFullYear() })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Quality</Label>
            <Select
              value={options.quality}
              onValueChange={(value: 'draft' | 'standard' | 'high' | 'ultra' | 'low') =>
                updateOptions({ quality: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="ultra">Ultra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Steps</Label>
              <Badge variant="secondary">{options.steps}</Badge>
            </div>
            <Slider
              value={[options.steps]}
              onValueChange={(value) => updateOptions({ steps: value[0] })}
              max={50}
              min={10}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Guidance Scale</Label>
              <Badge variant="secondary">{options.guidance_scale}</Badge>
            </div>
            <Slider
              value={[options.guidance_scale]}
              onValueChange={(value) => updateOptions({ guidance_scale: value[0] })}
              max={20}
              min={1}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Sampler</Label>
            <Select
              value={options.sampler}
              onValueChange={(value: 'Euler a' | 'DPM++ 2M Karras' | 'DDIM' | 'PLMS') =>
                updateOptions({ sampler: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Euler a">Euler a</SelectItem>
                <SelectItem value="DPM++ 2M Karras">DPM++ 2M Karras</SelectItem>
                <SelectItem value="DDIM">DDIM</SelectItem>
                <SelectItem value="PLMS">PLMS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Output Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300">Output</Badge>
            Dimensions & Format
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="space-y-0.5">
              <Label htmlFor="use-dimensions" className="text-sm font-medium">Use Custom Dimensions</Label>
              <p className="text-xs text-muted-foreground">Override aspect ratio with custom width/height</p>
            </div>
            <Switch
              id="use-dimensions"
              checked={options.use_dimensions}
              onCheckedChange={(checked) => updateOptions({ use_dimensions: checked })}
            />
          </div>

          {options.use_dimensions && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  value={options.width || ''}
                  onChange={(e) => updateOptions({ width: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  value={options.height || ''}
                  onChange={(e) => updateOptions({ height: parseInt(e.target.value) })}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Aspect Ratio</Label>
            <Select
              value={options.aspect_ratio}
              onValueChange={(value: '16:9' | '21:9' | '4:3' | '1:1' | '9:16') =>
                updateOptions({ aspect_ratio: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                <SelectItem value="21:9">21:9 (Ultrawide)</SelectItem>
                <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                <SelectItem value="1:1">1:1 (Square)</SelectItem>
                <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Output Format</Label>
            <Select
              value={options.output_format}
              onValueChange={(value: 'png' | 'jpg' | 'webp') =>
                updateOptions({ output_format: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpg">JPG</SelectItem>
                <SelectItem value="webp">WebP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Style Settings - Updated with categorized presets */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300">Style</Badge>
            Visual Style & Preset
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Style Category</Label>
            <Select
              value={options.style_preset.category}
              onValueChange={(value) => updateOptions({ 
                style_preset: { 
                  category: value, 
                  style: stylePresets[value as keyof typeof stylePresets][0] 
                } 
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(stylePresets).map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Style</Label>
            <Select
              value={options.style_preset.style}
              onValueChange={(value) => updateOptions({ 
                style_preset: { ...options.style_preset, style: value } 
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {stylePresets[options.style_preset.category as keyof typeof stylePresets]?.map((style) => (
                  <SelectItem key={style} value={style}>{style}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Color Grading</Label>
            <Select
              value={options.color_grade}
              onValueChange={(value) => updateOptions({ color_grade: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {colorGradeOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Lighting</Label>
            <Select
              value={options.lighting}
              onValueChange={(value) => updateOptions({ lighting: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {lightingOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Made Out Of */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300">Material</Badge>
            Made Out Of
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Material</Label>
            <Select
              value={options.made_out_of}
              onValueChange={(value) => updateOptions({ made_out_of: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {madeOutOfOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Environment */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge variant="outline" className="bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">Environment</Badge>
            Setting & Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Environment</Label>
            <Select
              value={options.environment}
              onValueChange={(value) => updateOptions({ environment: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {environmentOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Camera & Composition */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge variant="outline" className="bg-pink-50 dark:bg-pink-950 text-pink-700 dark:text-pink-300">Camera</Badge>
            Camera & Composition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Camera Type</Label>
            <Select
              value={options.camera_type}
              onValueChange={(value) => updateOptions({ camera_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {cameraTypeOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Shot Type</Label>
              <Select
                value={options.shot_type}
                onValueChange={(value) => updateOptions({ shot_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {shotTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Camera Angle</Label>
              <Select
                value={options.camera_angle}
                onValueChange={(value) => updateOptions({ camera_angle: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {cameraAngleOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Lens Type</Label>
            <Select
              value={options.lens}
              onValueChange={(value) => updateOptions({ lens: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {lensOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Aperture</Label>
            <Select
              value={options.aperture}
              onValueChange={(value) => updateOptions({ aperture: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {apertureOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Depth of Field</Label>
            <Select
              value={options.depth_of_field}
              onValueChange={(value) => updateOptions({ depth_of_field: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {depthOfFieldOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Blur Style</Label>
            <Select
              value={options.blur_style}
              onValueChange={(value) => updateOptions({ blur_style: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {blurStyleOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Composition Rules</Label>
            <div className="grid grid-cols-1 gap-1 max-h-60 overflow-y-auto">
              {availableCompositionRules.map((rule) => (
                <div key={rule} className="flex items-center space-x-2 p-1 rounded hover:bg-muted/30 transition-colors">
                  <Checkbox
                    id={rule}
                    checked={options.composition_rules.includes(rule)}
                    onCheckedChange={(checked) => handleCompositionRuleToggle(rule, checked === true)}
                  />
                  <Label htmlFor={rule} className="text-xs cursor-pointer flex-1 leading-tight">
                    {rule}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optional Motion & Animation */}
      {options.use_motion_animation && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Badge variant="outline" className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300">Video</Badge>
              Motion & Animation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Duration (seconds)</Label>
                  <Badge variant="secondary">{options.duration_seconds}s</Badge>
                </div>
                <Slider
                  value={[options.duration_seconds]}
                  onValueChange={(value) => updateOptions({ duration_seconds: value[0] })}
                  max={30}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">FPS</Label>
                  <Badge variant="secondary">{options.fps}</Badge>
                </div>
                <Slider
                  value={[options.fps]}
                  onValueChange={(value) => updateOptions({ fps: value[0] })}
                  max={60}
                  min={12}
                  step={6}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Camera Motion</Label>
              <Select
                value={options.camera_motion}
                onValueChange={(value) => updateOptions({ camera_motion: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="static">Static</SelectItem>
                  <SelectItem value="dolly_in">Dolly In</SelectItem>
                  <SelectItem value="dolly_out">Dolly Out</SelectItem>
                  <SelectItem value="orbit">Orbit</SelectItem>
                  <SelectItem value="pan_left">Pan Left</SelectItem>
                  <SelectItem value="pan_right">Pan Right</SelectItem>
                  <SelectItem value="tilt_up">Tilt Up</SelectItem>
                  <SelectItem value="tilt_down">Tilt Down</SelectItem>
                  <SelectItem value="zoom_in">Zoom In</SelectItem>
                  <SelectItem value="zoom_out">Zoom Out</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Motion Strength</Label>
                <Badge variant="secondary">{options.motion_strength}</Badge>
              </div>
              <Slider
                value={[options.motion_strength]}
                onValueChange={(value) => updateOptions({ motion_strength: value[0] })}
                max={1}
                min={0}
                step={0.05}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optional Enhancement & Safety */}
      {options.use_enhancement_safety && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Badge variant="outline" className="bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300">Advanced</Badge>
              Enhancement & Safety
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="space-y-0.5">
                  <Label htmlFor="face-enhance" className="text-sm font-medium">Face Enhancement</Label>
                  <p className="text-xs text-muted-foreground">Improve facial details</p>
                </div>
                <Switch
                  id="face-enhance"
                  checked={options.face_enhance}
                  onCheckedChange={(checked) => updateOptions({ face_enhance: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="space-y-0.5">
                  <Label htmlFor="highres-fix" className="text-sm font-medium">Hi-Res Fix</Label>
                  <p className="text-xs text-muted-foreground">Upscaling enhancement</p>
                </div>
                <Switch
                  id="highres-fix"
                  checked={options.highres_fix}
                  onCheckedChange={(checked) => updateOptions({ highres_fix: checked })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Upscale Factor</Label>
                <Badge variant="secondary">{options.upscale}x</Badge>
              </div>
              <Slider
                value={[options.upscale]}
                onValueChange={(value) => updateOptions({ upscale: value[0] })}
                max={4}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Safety Filter</Label>
              <Select
                value={options.safety_filter}
                onValueChange={(value: 'strict' | 'moderate' | 'off') =>
                  updateOptions({ safety_filter: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strict">Strict</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="off">Off</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Chaos/Randomness</Label>
                <Badge variant="secondary">{options.chaos}</Badge>
              </div>
              <Slider
                value={[options.chaos]}
                onValueChange={(value) => updateOptions({ chaos: value[0] })}
                max={1}
                min={0}
                step={0.05}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optional Season */}
      {options.use_season && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">Season</Badge>
              Time of Year
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Season</Label>
              <Select
                value={options.season || 'default (any season)'}
                onValueChange={(value) => updateOptions({ season: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {seasonOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optional Atmosphere Mood */}
      {options.use_atmosphere_mood && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Badge variant="outline" className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">Atmosphere</Badge>
              Environmental Mood
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Atmosphere Mood</Label>
              <Select
                value={options.atmosphere_mood || 'default (neutral mood)'}
                onValueChange={(value) => updateOptions({ atmosphere_mood: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {atmosphereMoodOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optional Subject Mood */}
      {options.use_subject_mood && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Badge variant="outline" className="bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300">Subject</Badge>
              Character Mood
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Subject Mood</Label>
              <Select
                value={options.subject_mood || 'default (neutral mood)'}
                onValueChange={(value) => updateOptions({ subject_mood: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {subjectMoodOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optional Sword Type */}
      {options.use_sword_type && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Badge variant="outline" className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300">Sword</Badge>
              Weapon Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Sword Type</Label>
              <Select
                value={options.sword_type || 'default (any sword)'}
                onValueChange={(value) => updateOptions({ sword_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {swordTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sword Vibe</Label>
              <Select
                value={options.sword_vibe || 'default (neutral vibe)'}
                onValueChange={(value) => updateOptions({ sword_vibe: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {swordVibeOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Toggle Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Optional Sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <Label htmlFor="use-motion" className="text-sm font-medium">Use Motion & Animation options</Label>
            <Switch
              id="use-motion"
              checked={options.use_motion_animation}
              onCheckedChange={(checked) => updateOptions({ use_motion_animation: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <Label htmlFor="use-enhancement" className="text-sm font-medium">Use Enhancement & Safety options</Label>
            <Switch
              id="use-enhancement"
              checked={options.use_enhancement_safety}
              onCheckedChange={(checked) => updateOptions({ use_enhancement_safety: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <Label htmlFor="use-season" className="text-sm font-medium">Use Season</Label>
            <Switch
              id="use-season"
              checked={options.use_season}
              onCheckedChange={(checked) => updateOptions({ use_season: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <Label htmlFor="use-atmosphere" className="text-sm font-medium">Use Atmosphere Mood</Label>
            <Switch
              id="use-atmosphere"
              checked={options.use_atmosphere_mood}
              onCheckedChange={(checked) => updateOptions({ use_atmosphere_mood: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <Label htmlFor="use-subject" className="text-sm font-medium">Use Subject Mood</Label>
            <Switch
              id="use-subject"
              checked={options.use_subject_mood}
              onCheckedChange={(checked) => updateOptions({ use_subject_mood: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <Label htmlFor="use-sword" className="text-sm font-medium">Use Sword Type</Label>
            <Switch
              id="use-sword"
              checked={options.use_sword_type}
              onCheckedChange={(checked) => updateOptions({ use_sword_type: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
