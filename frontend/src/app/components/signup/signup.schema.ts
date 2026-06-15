import {
  schema,
  required,
  email,
  minLength,
  validate,
  validateAsync,
  debounce,
  validateHttp,
  applyEach,
} from '@angular/forms/signals';
import { resource } from '@angular/core';
import { PHONE_PATTERN } from '../phone-input/phone-input.model';
import { SignupModel } from './signup.model';

export const validationSchema = schema<SignupModel>((path) => {
  required(path.email, { message: 'Email is required' });
  email(path.email, { message: 'Please enter a valid email address' });
  debounce(path.email, 500);

  validateHttp(path.email, {
    request: ({ value }) => `/api/check-email?email=${value()}`,
    onSuccess: (response: any) =>
      response.exists
        ? { kind: 'emailTaken', message: 'This email is already registered' }
        : null,
    onError: () => ({ kind: 'networkError', message: 'Could not verify email availability' }),
  });

  /* validateAsync(path.email, {
    params: ({ value }) => value(),
    factory: (emailParam) => resource({
      params: emailParam,
      loader: async ({ params: emailValue }) => {
        const res = await fetch(`/api/check-email?email=${emailValue}`);
        if (!res.ok) throw new Error('Request failed');
        return await res.json();
      },
    }),
    onSuccess: (result: any) =>
      result.exists
        ? { kind: 'emailTaken', message: 'This email is already registered' }
        : undefined,
    onError: () => ({ kind: 'networkError', message: 'Could not verify email availability' }),
  }); */

  required(path.password, { message: 'Password is required' });
  minLength(path.password, 5, { message: 'Password must be at least 5 characters' });

  applyEach(path.phones, (phone) => {
    required(phone, {
      message: 'Phone number is required',
      when: ({ valueOf }) => valueOf(path.smsNotifications),
    });
    validate(phone, ({ value, valueOf }) => {
      if (!valueOf(path.smsNotifications)) return undefined;
      const val = value();
      if (!val) return undefined;
      if (!PHONE_PATTERN.test(val)) {
        return { kind: 'invalidPhone', message: 'Phone number must be exactly 9 digits' };
      }
      return undefined;
    });
  });
});
