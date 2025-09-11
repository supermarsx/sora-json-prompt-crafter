import React from 'react';
import i18n from '@/i18n';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SearchableDropdown } from '../SearchableDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
import { ToggleField } from '../ToggleField';
import type { SoraOptions } from '@/lib/soraOptions';
import {
  environmentOptions,
  locationOptions,
  seasonOptions,
  atmosphereMoodOptions,
} from '@/data/locationPresets';
import { mergeCustomValues } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';
import { PresetDropdown } from '../PresetDropdown';

interface SettingsLocationSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
}

/**
 * Section for configuring environmental and location-based settings.
 *
 * @param props - Component props.
 * @param props.options - Current Sora options.
 * @param props.updateOptions - Function to update the options state.
 */
export const SettingsLocationSection: React.FC<
  SettingsLocationSectionProps
> = ({ options, updateOptions }) => {
  const t = i18n.t.bind(i18n);
  const currentValues = {
    use_settings_location: options.use_settings_location,
    use_year: options.use_year,
    year: options.year,
    use_environment: options.use_environment,
    environment: options.environment,
    use_location: options.use_location,
    location: options.location,
    use_season: options.use_season,
    season: options.season,
    use_time_of_year: options.use_time_of_year,
    time_of_year: options.time_of_year,
    use_atmosphere_mood: options.use_atmosphere_mood,
    atmosphere_mood: options.atmosphere_mood,
  };
  return (
    <CollapsibleSection
      title={t('settingsLocation')}
      isOptional={true}
      isEnabled={options.use_settings_location}
      onToggle={(enabled) => updateOptions({ use_settings_location: enabled })}
    >
      <div className="grid grid-cols-1 gap-4">
        <div className="flex justify-end space-x-2">
          <PresetDropdown
            sectionKey="location"
            currentValues={currentValues}
            onApply={(values) =>
              updateOptions(values as Partial<SoraOptions>)
            }
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateOptions({
                use_settings_location: DEFAULT_OPTIONS.use_settings_location,
                use_year: DEFAULT_OPTIONS.use_year,
                year: DEFAULT_OPTIONS.year,
                use_environment: DEFAULT_OPTIONS.use_environment,
                environment: DEFAULT_OPTIONS.environment,
                use_location: DEFAULT_OPTIONS.use_location,
                location: DEFAULT_OPTIONS.location,
                use_season: DEFAULT_OPTIONS.use_season,
                season: DEFAULT_OPTIONS.season,
                use_time_of_year: DEFAULT_OPTIONS.use_time_of_year,
                time_of_year: DEFAULT_OPTIONS.time_of_year,
                use_atmosphere_mood: DEFAULT_OPTIONS.use_atmosphere_mood,
                atmosphere_mood: DEFAULT_OPTIONS.atmosphere_mood,
              })
            }
            className="gap-1"
          >
            <RotateCcw className="w-4 h-4" /> {t('reset')}
          </Button>
        </div>
        <ToggleField
          id="use_year"
          label={t('useYear')}
          checked={options.use_year}
          onCheckedChange={(checked) =>
            updateOptions({ use_year: !!checked })
          }
        >
          <div>
            <Label htmlFor="year">{t('year')}</Label>
            <Input
              id="year"
              type="number"
              value={options.year}
              onChange={(e) =>
                updateOptions({ year: parseInt(e.target.value) })
              }
              min="1800"
              max="2100"
            />
          </div>
        </ToggleField>

        <ToggleField
          id="use_environment"
          label={t('useEnvironment')}
          checked={options.use_environment}
          onCheckedChange={(checked) =>
            updateOptions({ use_environment: !!checked })
          }
        >
          <div>
            <Label>{t('environment')}</Label>
            <SearchableDropdown
              options={mergeCustomValues('environment', environmentOptions)}
              value={options.environment}
              onValueChange={(value) => updateOptions({ environment: value })}
              label={t('environmentOptions')}
              optionKey="environment"
            />
          </div>
        </ToggleField>

        <ToggleField
          id="use_location"
          label={t('useLocation')}
          checked={options.use_location}
          onCheckedChange={(checked) =>
            updateOptions({ use_location: !!checked })
          }
        >
          <div>
            <Label>{t('location')}</Label>
            <SearchableDropdown
              options={mergeCustomValues('location', locationOptions)}
              value={options.location || 'Berlin, Germany'}
              onValueChange={(value) => updateOptions({ location: value })}
              label={t('locationOptions')}
              optionKey="location"
            />
          </div>
        </ToggleField>

        <ToggleField
          id="use_season"
          label={t('useSeason')}
          checked={options.use_season}
          onCheckedChange={(checked) =>
            updateOptions({ use_season: !!checked })
          }
        >
          <div>
            <Label>{t('season')}</Label>
            <SearchableDropdown
              options={mergeCustomValues('season', seasonOptions)}
              value={options.season || 'default (any season)'}
              onValueChange={(value) => updateOptions({ season: value })}
              label={t('seasonOptions')}
              optionKey="season"
            />
          </div>
        </ToggleField>

        <ToggleField
          id="use_time_of_year"
          label={t('useTimeOfYear')}
          checked={options.use_time_of_year}
          onCheckedChange={(checked) =>
            updateOptions({ use_time_of_year: !!checked })
          }
        >
          <div>
            <Label htmlFor="time_of_year">{t('timeOfYear')}</Label>
            <Input
              id="time_of_year"
              value={options.time_of_year}
              onChange={(e) => updateOptions({ time_of_year: e.target.value })}
            />
          </div>
        </ToggleField>

        <ToggleField
          id="use_atmosphere_mood"
          label={t('useAtmosphereMood')}
          checked={options.use_atmosphere_mood}
          onCheckedChange={(checked) =>
            updateOptions({ use_atmosphere_mood: !!checked })
          }
        >
          <div>
            <Label>{t('atmosphereMood')}</Label>
            <SearchableDropdown
              options={mergeCustomValues('atmosphere_mood', atmosphereMoodOptions)}
              value={
                options.atmosphere_mood || 'default (neutral mood)'
              }
              onValueChange={(value) =>
                updateOptions({ atmosphere_mood: value })
              }
              label={t('atmosphereMoodOptions')}
              optionKey="atmosphere_mood"
            />
          </div>
        </ToggleField>
      </div>
    </CollapsibleSection>
  );
};
