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

interface SettingsLocationSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
}

export const SettingsLocationSection: React.FC<
  SettingsLocationSectionProps
> = ({ options, updateOptions }) => {
  const t = i18n.t.bind(i18n);
  return (
    <CollapsibleSection
      title={t('settingsLocation')}
      isOptional={true}
      isEnabled={options.use_settings_location}
      onToggle={(enabled) => updateOptions({ use_settings_location: enabled })}
    >
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="year">{t('year')}</Label>
          <Input
            id="year"
            type="number"
            value={options.year}
            onChange={(e) => updateOptions({ year: parseInt(e.target.value) })}
            min="1800"
            max="2100"
          />
        </div>

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
              options={environmentOptions}
              value={options.environment}
              onValueChange={(value) => updateOptions({ environment: value })}
              label={t('environmentOptions')}
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
              options={locationOptions}
              value={options.location || 'Berlin, Germany'}
              onValueChange={(value) => updateOptions({ location: value })}
              label={t('locationOptions')}
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
              options={seasonOptions}
              value={options.season || 'default (any season)'}
              onValueChange={(value) => updateOptions({ season: value })}
              label={t('seasonOptions')}
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
              options={atmosphereMoodOptions}
              value={
                options.atmosphere_mood || 'default (neutral mood)'
              }
              onValueChange={(value) =>
                updateOptions({ atmosphere_mood: value })
              }
              label={t('atmosphereMoodOptions')}
            />
          </div>
        </ToggleField>
      </div>
    </CollapsibleSection>
  );
};
