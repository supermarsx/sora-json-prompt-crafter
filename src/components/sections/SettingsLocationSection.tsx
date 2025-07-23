import React from 'react';
import i18n from '@/i18n';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchableDropdown } from '../SearchableDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
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

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_environment"
            checked={options.use_environment}
            onCheckedChange={(checked) =>
              updateOptions({ use_environment: !!checked })
            }
          />
          <Label htmlFor="use_environment">{t('useEnvironment')}</Label>
        </div>

        <div>
          <Label>{t('environment')}</Label>
          <SearchableDropdown
            options={environmentOptions}
            value={options.environment}
            onValueChange={(value) => updateOptions({ environment: value })}
            label={t('environmentOptions')}
            disabled={!options.use_environment}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_location"
            checked={options.use_location}
            onCheckedChange={(checked) =>
              updateOptions({ use_location: !!checked })
            }
          />
          <Label htmlFor="use_location">{t('useLocation')}</Label>
        </div>

        <div>
          <Label>{t('location')}</Label>
          <SearchableDropdown
            options={locationOptions}
            value={options.location || 'Berlin, Germany'}
            onValueChange={(value) => updateOptions({ location: value })}
            label={t('locationOptions')}
            disabled={!options.use_location}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_season"
            checked={options.use_season}
            onCheckedChange={(checked) =>
              updateOptions({ use_season: !!checked })
            }
          />
          <Label htmlFor="use_season">{t('useSeason')}</Label>
        </div>

        <div>
          <Label>{t('season')}</Label>
          <SearchableDropdown
            options={seasonOptions}
            value={options.season || 'default (any season)'}
            onValueChange={(value) => updateOptions({ season: value })}
            label={t('seasonOptions')}
            disabled={!options.use_season}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_time_of_year"
            checked={options.use_time_of_year}
            onCheckedChange={(checked) =>
              updateOptions({ use_time_of_year: !!checked })
            }
          />
          <Label htmlFor="use_time_of_year">{t('useTimeOfYear')}</Label>
        </div>

        <div>
          <Label htmlFor="time_of_year">{t('timeOfYear')}</Label>
          <Input
            id="time_of_year"
            value={options.time_of_year}
            onChange={(e) => updateOptions({ time_of_year: e.target.value })}
            disabled={!options.use_time_of_year}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_atmosphere_mood"
            checked={options.use_atmosphere_mood}
            onCheckedChange={(checked) =>
              updateOptions({ use_atmosphere_mood: !!checked })
            }
          />
          <Label htmlFor="use_atmosphere_mood">{t('useAtmosphereMood')}</Label>
        </div>

        <div>
          <Label>{t('atmosphereMood')}</Label>
          <SearchableDropdown
            options={atmosphereMoodOptions}
            value={options.atmosphere_mood || 'default (neutral mood)'}
            onValueChange={(value) => updateOptions({ atmosphere_mood: value })}
            label={t('atmosphereMoodOptions')}
            disabled={!options.use_atmosphere_mood}
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};
