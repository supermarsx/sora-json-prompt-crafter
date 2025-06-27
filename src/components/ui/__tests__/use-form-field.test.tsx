import React from 'react';
import { renderHook } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormFieldContext,
  FormItemContext,
  useFormField,
} from '../use-form-field';

type TestValues = { foo: string };

function Wrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm<TestValues>({ defaultValues: { foo: '' } });
  return (
    <FormProvider {...methods}>
      <FormFieldContext.Provider value={{ name: 'foo' }}>
        <FormItemContext.Provider value={{ id: 'id' }}>
          {children}
        </FormItemContext.Provider>
      </FormFieldContext.Provider>
    </FormProvider>
  );
}

describe('useFormField', () => {
  test('returns constructed ids and field state', () => {
    const { result } = renderHook(() => useFormField(), { wrapper: Wrapper });
    expect(result.current).toMatchObject({
      id: 'id',
      name: 'foo',
      formItemId: 'id-form-item',
      formDescriptionId: 'id-form-item-description',
      formMessageId: 'id-form-item-message',
      invalid: false,
    });
  });

  test('throws when used outside provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useFormField())).toThrow();
    spy.mockRestore();
  });
});
