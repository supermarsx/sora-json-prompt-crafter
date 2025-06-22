
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CollapsibleSection } from '../CollapsibleSection';
import type { SoraOptions } from '@/lib/soraOptions';

interface StyleSectionProps {
  options: SoraOptions;
  updateNestedOptions: (path: string, value: unknown) => void;
  updateOptions: (updates: Partial<SoraOptions>) => void;
}

const stylePresets = {
  "Classic Art & Painting": [
    "photorealistic", "hyperrealistic", "oil painting", "watercolor", "acrylic",
    "gouache", "pastel drawing", "pencil sketch", "ink drawing", "charcoal",
    "colored pencil", "impasto", "impressionist", "expressionist", "fauvism",
    "cubist", "surrealist", "abstract", "minimalism", "pop art", "art nouveau",
    "art deco", "ukiyo-e", "renaissance", "baroque", "classical painting",
    "romanticism", "rococo"
  ],
  "Modern Digital & Illustration": [
    "digital painting", "3d render", "2d digital art", "3d illustration",
    "vector art", "pixel art", "voxel art", "isometric", "low poly",
    "flat design", "comic book", "manga", "anime", "cartoon", "line art",
    "cel shading", "vaporwave", "synthwave", "glitch art", "cyberpunk",
    "steampunk", "dark fantasy", "fantasy art", "storybook", "children's illustration"
  ],
  "Photography & Cinematic": [
    "editorial photo", "cinematic", "film still", "documentary", "polaroid",
    "black and white", "sepia", "lomography", "macro", "tilt-shift",
    "aerial/drone", "timelapse", "high contrast", "soft focus", "vintage photo",
    "retro", "golden hour", "blue hour", "infrared", "ultraviolet", "HDR",
    "bokeh", "old iphone"
  ],
  "Fashion & Portrait": [
    "editorial fashion", "haute couture", "street style", "glamor",
    "beauty portrait", "close-up", "dramatic lighting", "studio portrait", "headshot"
  ],
  "Culture & World Inspiration": [
    "anime", "manga", "japanese woodblock", "chinese brush painting",
    "persian miniature", "byzantine mosaic", "ancient greek", "egyptian fresco",
    "native american art", "aboriginal art", "aztec/mayan", "nordic/viking",
    "african tribal", "japanese sumi-e painting"
  ],
  "Genre/Theme": [
    "fantasy", "dark fantasy", "horror", "sci-fi", "cyberpunk",
    "post-apocalyptic", "dystopian", "utopian", "fairy tale", "magical realism",
    "noir", "detective", "space opera", "medieval", "ancient", "futuristic", "surreal"
  ],
  "Lighting & Mood": [
    "neon", "moody", "dramatic", "romantic", "mysterious", "dreamy",
    "ethereal", "soft lighting", "harsh lighting", "chiaroscuro", "silhouette", "backlit"
  ],
  "Decorative & Textural": [
    "stained glass", "embroidery", "tapestry", "origami", "papercraft",
    "collage", "mosaic", "graffiti", "sticker bomb", "spray paint"
  ],
  "Commercial/Professional": [
    "architectural rendering", "product render", "interior design",
    "automotive render", "advertising", "medical illustration", "technical drawing"
  ],
  "Famous Artists/Influences": [
    "in the style of Van Gogh", "in the style of Monet", "in the style of Picasso",
    "in the style of Hokusai", "in the style of Moebius", "in the style of Alphonse Mucha",
    "in the style of Studio Ghibli", "in the style of Disney", "in the style of old DuckTales",
    "in the style of modern DuckTales", "in the style of Marvel comics",
    "in the style of old vintage Disney", "in the style of SpongeBob SquarePants",
    "in the style of Powerpuff Girls", "in the style of the Amazing Gumball",
    "in the style of Rick & Morty", "in the style of Cuphead", "in the style of The Simpsons",
    "in the style of ScoobyDoo", "in the style of The Smurfs", "in the style of Family Guy",
    "in the style of Kim Possible", "in the style of My Life as Teenage Robot",
    "in the style of old Dragon Ball", "in the style of Yu-Gi-Oh!", "in the style of Doraemon",
    "in the style of Naruto", "in the style of One Piece", "in the style of Attack on Titan",
    "in the style of Castlevania the modern anime", "in the style of Adventure Time",
    "in the style of Samurai Jack", "in the style of Futurama", "in the style of Star Wars"
  ]
};

export const StyleSection: React.FC<StyleSectionProps> = ({
  options,
  updateNestedOptions,
  updateOptions
}) => {
  const formatLabel = (value: string) => {
    return value.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <CollapsibleSection
      title="Style Preset"
      isOptional={true}
      isEnabled={options.use_style_preset}
      onToggle={(enabled) => updateOptions({ use_style_preset: enabled })}
    >
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="style_category">Style Category</Label>
          <Select
            value={options.style_preset.category}
            onValueChange={(value) => updateNestedOptions('style_preset.category', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(stylePresets).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="style_preset">Style</Label>
          <Select
            value={options.style_preset.style}
            onValueChange={(value) => updateNestedOptions('style_preset.style', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stylePresets[options.style_preset.category as keyof typeof stylePresets]?.map((style) => (
                <SelectItem key={style} value={style}>
                  {formatLabel(style)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </CollapsibleSection>
  );
};
