
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchableDropdown } from '../SearchableDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
import { SoraOptions } from '../Dashboard';

interface FaceSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
}

const subjectGenderOptions = [
  "default (auto/inferred gender)", "not defined", "female", "male", "woman",
  "man", "girl", "boy", "feminine", "masculine", "androgynous", "genderqueer",
  "nonbinary", "agender", "bigender", "demiboy", "demigirl", "transgender woman",
  "trans woman", "transgender man", "trans man", "transfeminine", "transmasculine",
  "MTF (male to female)", "FTM (female to male)", "intersex", "third gender",
  "two-spirit", "neutrois", "pangender", "genderfluid", "questioning",
  "prefer not to say", "ambiguous", "unknown"
];

const makeupStyleOptions = [
  "default (no specific makeup)", "not defined", "no makeup", "natural",
  "barely-there", "dewy", "glowy", "matte", "fresh faced", "minimalist",
  "classic glam", "old Hollywood", "vintage pinup", "soft glam", "bold glam",
  "red carpet", "evening glam", "bridal", "romantic", "rosy cheeks",
  "sunkissed", "sunburn blush", "peachy", "bronzed", "high fashion",
  "runway", "editorial", "avant-garde", "graphic liner", "negative space liner",
  "floating liner", "cat eye", "winged liner", "smokey eye", "soft smokey",
  "cut crease", "halo eye", "monochrome", "pastel", "neon", "colorful",
  "rainbow", "glitter", "shimmer", "holographic", "duochrome", "metallic",
  "wet look", "glossy eyelids", "glossy lips", "ombre lips", "bold lips",
  "red lips", "nude lips", "black lips", "gradient lips", "popsicle lips",
  "overlined lips", "matte lips", "soft focus lips", "freckles", "faux freckles",
  "doll-like", "kawaii", "anime-inspired", "e-girl", "soft goth", "gothic",
  "punk", "grunge", "retro", "60s mod", "70s disco", "80s glam",
  "90s supermodel", "Y2K", "festival", "fantasy", "fairy", "mermaid",
  "elfin", "siren", "vampire", "witchy", "cosplay", "drag", "masquerade",
  "steampunk", "cyberpunk", "sci-fi", "alien", "robotic", "animal-inspired",
  "clowncore", "theatrical", "face paint", "body paint", "tribal", "cultural",
  "geisha", "indigenous", "day of the dead", "sugar skull", "henna", "mehndi",
  "wedding", "festival", "holiday", "avant-garde glitter"
];

const characterMoodOptions = [
  "default (neutral mood)", "not defined", "happy", "sad", "angry", "surprised",
  "fearful", "disgusted", "contemptuous", "joyful", "excited", "calm", "relaxed",
  "peaceful", "serene", "confident", "determined", "focused", "intense",
  "mysterious", "seductive", "playful", "mischievous", "thoughtful", "pensive",
  "melancholic", "nostalgic", "dreamy", "ethereal", "fierce", "powerful",
  "vulnerable", "shy", "bold", "defiant", "proud", "humble", "compassionate",
  "loving", "tender", "passionate", "romantic", "sensual", "alluring"
];

export const FaceSection: React.FC<FaceSectionProps> = ({
  options,
  updateOptions
}) => {
  return (
    <CollapsibleSection
      title="Face"
      isOptional={true}
      isEnabled={options.use_face_enhancements}
      onToggle={(enabled) => updateOptions({ use_face_enhancements: enabled })}
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="add_same_face"
            checked={options.add_same_face}
            onCheckedChange={(checked) => updateOptions({ add_same_face: !!checked })}
          />
          <Label htmlFor="add_same_face">Add the Same Face</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="dont_change_face"
            checked={options.dont_change_face}
            onCheckedChange={(checked) => updateOptions({ dont_change_face: !!checked })}
          />
          <Label htmlFor="dont_change_face">Don't Change the Face</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_subject_gender"
            checked={options.use_subject_gender}
            onCheckedChange={(checked) => updateOptions({ use_subject_gender: !!checked })}
          />
          <Label htmlFor="use_subject_gender">Use Subject Gender</Label>
        </div>

        <div>
          <Label>Subject Gender</Label>
          <SearchableDropdown
            options={subjectGenderOptions}
            value={options.subject_gender || 'default (auto/inferred gender)'}
            onValueChange={(value) => updateOptions({ subject_gender: value })}
            label="Subject Gender Options"
            disabled={!options.use_subject_gender}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_makeup_style"
            checked={options.use_makeup_style}
            onCheckedChange={(checked) => updateOptions({ use_makeup_style: !!checked })}
          />
          <Label htmlFor="use_makeup_style">Use Makeup Style</Label>
        </div>

        <div>
          <Label>Makeup Style</Label>
          <SearchableDropdown
            options={makeupStyleOptions}
            value={options.makeup_style || 'default (no specific makeup)'}
            onValueChange={(value) => updateOptions({ makeup_style: value })}
            label="Makeup Style Options"
            disabled={!options.use_makeup_style}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_character_mood"
            checked={options.use_character_mood}
            onCheckedChange={(checked) => updateOptions({ use_character_mood: !!checked })}
          />
          <Label htmlFor="use_character_mood">Use Character Mood</Label>
        </div>

        <div>
          <Label>Character Mood</Label>
          <SearchableDropdown
            options={characterMoodOptions}
            value={options.character_mood || 'default (neutral mood)'}
            onValueChange={(value) => updateOptions({ character_mood: value })}
            label="Character Mood Options"
            disabled={!options.use_character_mood}
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};
