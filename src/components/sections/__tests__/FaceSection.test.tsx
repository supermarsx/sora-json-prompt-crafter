import { render, screen, fireEvent, within } from '@testing-library/react';
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
    let section = screen.getByText('Subject Gender')
      .parentElement as HTMLElement;
    let dropdown = within(section).getByRole('button');
    fireEvent.click(dropdown);
    fireEvent.click(screen.getByRole('button', { name: /^female$/i }));
    expect(updateOptions).toHaveBeenCalledWith({ subject_gender: 'female' });

    const disabledOptions = { ...enabledOptions, use_subject_gender: false };
    rerender(
      <FaceSection options={disabledOptions} updateOptions={updateOptions} />,
    );
    section = screen.getByText('Subject Gender').parentElement as HTMLElement;
    dropdown = within(section).getByRole('button');
    expect(dropdown.hasAttribute('disabled')).toBe(true);
  });
});
