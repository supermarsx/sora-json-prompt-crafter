
import React from 'react';
import { SoraOptions } from './Dashboard';
import { PromptSection } from './sections/PromptSection';
import { CoreSettingsSection } from './sections/CoreSettingsSection';
import { DimensionsFormatSection } from './sections/DimensionsFormatSection';
import { StyleSection } from './sections/StyleSection';
import { CameraCompositionSection } from './sections/CameraCompositionSection';
import { VideoMotionSection } from './sections/VideoMotionSection';
import { MaterialSection } from './sections/MaterialSection';
import { LightingSection } from './sections/LightingSection';
import { ColorGradingSection } from './sections/ColorGradingSection';
import { SettingsLocationSection } from './sections/SettingsLocationSection';
import { FaceSection } from './sections/FaceSection';
import { EnhancementsSection } from './sections/EnhancementsSection';
import { DnDSection } from './sections/DnDSection';

interface ControlPanelProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
  updateNestedOptions: (path: string, value: unknown) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  options,
  updateOptions,
  updateNestedOptions,
}) => {
  return (
    <div className="space-y-6 p-6">
      <PromptSection options={options} updateOptions={updateOptions} />
      
      <CoreSettingsSection 
        options={options} 
        updateOptions={updateOptions}
        isEnabled={options.use_core_settings}
        onToggle={(enabled) => updateOptions({ use_core_settings: enabled })}
      />
      
      <DimensionsFormatSection 
        options={options} 
        updateOptions={updateOptions}
        isEnabled={options.use_dimensions_format}
        onToggle={(enabled) => updateOptions({ use_dimensions_format: enabled })}
      />
      
      <StyleSection
        options={options}
        updateNestedOptions={updateNestedOptions}
        updateOptions={updateOptions}
      />
      
      <CameraCompositionSection
        options={options}
        updateOptions={updateOptions}
        isEnabled={options.use_camera_composition}
        onToggle={(enabled) => updateOptions({ use_camera_composition: enabled })}
      />
      
      <VideoMotionSection 
        options={options} 
        updateOptions={updateOptions}
        isEnabled={options.use_motion_animation}
        onToggle={(enabled) => updateOptions({ use_motion_animation: enabled })}
      />
      
      <MaterialSection
        options={options}
        updateOptions={updateOptions}
      />

      <LightingSection
        options={options}
        updateOptions={updateOptions}
      />

      <ColorGradingSection
        options={options}
        updateOptions={updateOptions}
      />

      <SettingsLocationSection
        options={options}
        updateOptions={updateOptions}
      />
      
      <FaceSection 
        options={options} 
        updateOptions={updateOptions}
      />
      
      <EnhancementsSection 
        options={options} 
        updateOptions={updateOptions}
        isEnabled={options.use_enhancement_safety}
        onToggle={(enabled) => updateOptions({ use_enhancement_safety: enabled })}
      />
      
      <DnDSection
        options={options}
        updateOptions={updateOptions}
        isEnabled={options.use_dnd_section}
        onToggle={(enabled) => updateOptions({ use_dnd_section: enabled })}
      />
    </div>
  );
};
