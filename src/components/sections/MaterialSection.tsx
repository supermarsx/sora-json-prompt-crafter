
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchableDropdown } from '../SearchableDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
import { SoraOptions } from '../Dashboard';

interface MaterialSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
}

const materialOptions = [
  "default", "not defined", "keep original", "any", "surprise me",
  "real textures only", "original textures only", "wood", "oak", "bamboo",
  "driftwood", "lettuce", "metal", "steel", "debris", "plastic debris",
  "brass", "bronze", "copper", "iron", "aluminum", "gummy bears", "gum",
  "bubblegum", "pink bubblegum", "titanium", "gold", "waste", "plastic waste",
  "metallic waste", "silver", "platinum", "rusty metal", "plastic",
  "translucent plastic", "acrylic", "resin", "polycarbonate", "rubber",
  "silicone", "glass", "frosted glass", "stained glass", "crystal", "prism",
  "diamond", "emerald", "ruby", "sapphire", "amethyst", "opal", "pearl",
  "quartz", "obsidian", "granite", "marble", "slate", "sandstone", "limestone",
  "concrete", "brick", "ceramic", "porcelain", "pottery", "candlewax",
  "gatorade", "cocacola", "terracotta", "cloth", "snakeskin", "tacos",
  "cotton", "linen", "silk", "noodles", "wool", "chess pieces", "velvet",
  "denim", "leather", "suede", "pizza", "fur", "felt", "canvas", "burlap",
  "paper", "cardboard", "origami paper", "papyrus", "parchment", "netting",
  "lace", "chainmail", "kevlar", "carbon fiber", "fiberglass", "rope",
  "string", "yarn", "wire", "wax", "soap", "cheese", "butter", "chocolate",
  "candy", "jelly", "ice", "snow", "water", "liquid metal", "mercury", "oil",
  "honey", "amber", "tree sap", "slime", "gel", "foam", "sponge", "bubble",
  "cloud", "mist", "smoke", "ash", "dust", "sand", "gravel", "soil", "mud",
  "clay", "peat", "plants", "leaves", "moss", "grass", "vines", "flowers",
  "petals", "thorns", "mushrooms", "fungi", "coral", "shell", "bone",
  "ivory", "horn", "antler", "banana", "tooth", "scales", "skin", "flesh",
  "muscle", "tortilla", "cartilage", "blood", "old blood", "green blood",
  "spider silk", "chitin", "insect wings", "feathers", "quills", "spines",
  "eggshell", "lava", "molten rock", "star matter", "cosmic dust", "energy",
  "light", "neon", "hologram", "plasma", "radioactive material", "nanomaterial",
  "honeycomb", "living tissue", "bio-metal", "degraded alloys", "alien alloy",
  "void", "shadow", "aura", "dream", "memories", "sound", "music", "data",
  "code", "pixel", "circuitry", "wires", "cogs", "clockwork", "gears",
  "paper mache", "glitter", "sequins", "beads", "jewels", "spikes", "velcro",
  "magnet", "magnetic field", "force field", "arcane crystal", "enchanted stone",
  "runestone", "magic", "dreamstuff", "imagination", "illusion"
];

export const MaterialSection: React.FC<MaterialSectionProps> = ({
  options,
  updateOptions
}) => {
  return (
    <CollapsibleSection
      title="Material"
      isOptional={true}
      isEnabled={options.use_material}
      onToggle={(enabled) => updateOptions({ use_material: enabled })}
    >
      <div className="space-y-4">
        <div>
          <Label>Made Out Of</Label>
          <SearchableDropdown
            options={materialOptions}
            value={options.made_out_of}
            onValueChange={(value) => updateOptions({ made_out_of: value })}
            label="Material Options"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_secondary_material"
            checked={options.use_secondary_material}
            onCheckedChange={(checked) => updateOptions({ use_secondary_material: !!checked })}
          />
          <Label htmlFor="use_secondary_material">Use Secondary Material</Label>
        </div>

        <div>
          <Label>Secondary Material</Label>
          <SearchableDropdown
            options={materialOptions}
            value={options.secondary_material || 'default'}
            onValueChange={(value) => updateOptions({ secondary_material: value })}
            label="Secondary Material Options"
            disabled={!options.use_secondary_material}
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};
