import {
  shotTypeOptions,
  cameraAngleOptions,
  compositionRulesOptions,
  cameraTypeOptions,
  lensTypeOptions,
  apertureOptions,
  blurStyleOptions,
  depthOfFieldOptions,
  subjectFocusOptions,
} from './cameraPresets';
import {
  subjectGenderOptions,
  makeupStyleOptions,
  characterMoodOptions,
} from './faceOptions';

const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const createMapping = (options: readonly string[], prefix: string) =>
  options.reduce<Record<string, string>>((acc, option) => {
    acc[option] = `${prefix}.${slugify(option)}`;
    return acc;
  }, {});

export const cameraOptionTranslations = {
  shotType: createMapping(shotTypeOptions, 'cameraPresets.shotType'),
  cameraAngle: createMapping(cameraAngleOptions, 'cameraPresets.cameraAngle'),
  compositionRules: createMapping(
    compositionRulesOptions,
    'cameraPresets.compositionRules',
  ),
  cameraType: createMapping(cameraTypeOptions, 'cameraPresets.cameraType'),
  lensType: createMapping(lensTypeOptions, 'cameraPresets.lensType'),
  aperture: createMapping(apertureOptions, 'cameraPresets.aperture'),
  blurStyle: createMapping(blurStyleOptions, 'cameraPresets.blurStyle'),
  depthOfField: createMapping(
    depthOfFieldOptions,
    'cameraPresets.depthOfField',
  ),
  subjectFocus: createMapping(
    subjectFocusOptions,
    'cameraPresets.subjectFocus',
  ),
};

export const faceOptionTranslations = {
  subjectGender: createMapping(
    subjectGenderOptions,
    'faceOptions.subjectGender',
  ),
  makeupStyle: createMapping(makeupStyleOptions, 'faceOptions.makeupStyle'),
  characterMood: createMapping(
    characterMoodOptions,
    'faceOptions.characterMood',
  ),
};
