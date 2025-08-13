import { render, screen, fireEvent, within } from '@testing-library/react';
import i18n, { changeLanguageAsync } from '@/i18n';
import { FaceSection } from '../FaceSection';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('FaceSection', () => {
  test('checkbox toggle updates option', () => {
    const updateOptions = jest.fn();
    const options = {
      ...DEFAULT_OPTIONS,
      use_face_enhancements: true,
      use_subject_gender: false,
    };
    render(<FaceSection options={options} updateOptions={updateOptions} />);
    fireEvent.click(screen.getByLabelText(/use subject gender/i));
    expect(updateOptions).toHaveBeenCalledWith({ use_subject_gender: true });
  });

  test('subject gender dropdown updates value and disabled when flag off', () => {
    const updateOptions = jest.fn();
    const enabledOptions = {
      ...DEFAULT_OPTIONS,
      use_face_enhancements: true,
      use_subject_gender: true,
      subject_gender: 'default (auto/inferred gender)',
    };
    const { rerender } = render(
      <FaceSection options={enabledOptions} updateOptions={updateOptions} />,
    );
    let section = screen.getByText(i18n.t('subjectGender'))
      .parentElement as HTMLElement;
    let dropdown = within(section).getByRole('button');
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByRole('button', { name: /^female$/i }));
    expect(updateOptions).toHaveBeenCalledWith({ subject_gender: 'female' });

    const disabledOptions = { ...enabledOptions, use_subject_gender: false };
    rerender(
      <FaceSection options={disabledOptions} updateOptions={updateOptions} />,
    );
    section = screen.getByText(i18n.t('subjectGender'))
      .parentElement as HTMLElement;
    dropdown = within(section).getByRole('button');
    expect(dropdown.hasAttribute('disabled')).toBe(true);
  });

  test('makeup style flag toggles and dropdown updates', () => {
    const updateOptions = jest.fn();
    let options = {
      ...DEFAULT_OPTIONS,
      use_face_enhancements: true,
      use_makeup_style: false,
    };

    const { rerender } = render(
      <FaceSection options={options} updateOptions={updateOptions} />,
    );

    let section = screen.getByText(i18n.t('makeupStyle'))
      .parentElement as HTMLElement;
    let dropdown = within(section).getByRole('button');
    expect(dropdown.hasAttribute('disabled')).toBe(true);

    fireEvent.click(screen.getByLabelText(/use makeup style/i));
    expect(updateOptions).toHaveBeenCalledWith({ use_makeup_style: true });

    options = {
      ...options,
      use_makeup_style: true,
      makeup_style: 'default (no specific makeup)',
    };
    rerender(<FaceSection options={options} updateOptions={updateOptions} />);

    section = screen.getByText(i18n.t('makeupStyle'))
      .parentElement as HTMLElement;
    dropdown = within(section).getByRole('button');
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByRole('button', { name: /^bold glam$/i }));
    expect(updateOptions).toHaveBeenCalledWith({ makeup_style: 'bold glam' });
  });

  test('character mood flag toggles and dropdown updates', () => {
    const updateOptions = jest.fn();
    let options = {
      ...DEFAULT_OPTIONS,
      use_face_enhancements: true,
      use_character_mood: false,
    };

    const { rerender } = render(
      <FaceSection options={options} updateOptions={updateOptions} />,
    );

    let section = screen.getByText(i18n.t('characterMood'))
      .parentElement as HTMLElement;
    let dropdown = within(section).getByRole('button');
    expect(dropdown.hasAttribute('disabled')).toBe(true);

    fireEvent.click(screen.getByLabelText(/use character mood/i));
    expect(updateOptions).toHaveBeenCalledWith({ use_character_mood: true });

    options = {
      ...options,
      use_character_mood: true,
      character_mood: 'default (neutral mood)',
    };
    rerender(<FaceSection options={options} updateOptions={updateOptions} />);

    section = screen.getByText(i18n.t('characterMood'))
      .parentElement as HTMLElement;
    dropdown = within(section).getByRole('button');
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByRole('button', { name: /^happy$/i }));
    expect(updateOptions).toHaveBeenCalledWith({ character_mood: 'happy' });
  });

  test('dropdown shows localized options when language changes', async () => {
    await changeLanguageAsync('es-ES');
    render(
      <FaceSection
        options={{
          ...DEFAULT_OPTIONS,
          use_face_enhancements: true,
          use_subject_gender: true,
        }}
        updateOptions={() => {}}
      />,
    );
    const section = screen.getByText(i18n.t('subjectGender'))
      .parentElement as HTMLElement;
    fireEvent.click(within(section).getByRole('button'));
    expect(
      await screen.findByRole('button', { name: /femenino/i }),
    ).toBeDefined();
    await changeLanguageAsync('en-US');
  });
});
