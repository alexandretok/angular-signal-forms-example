import {
  schema,
  required,
  email,
  minLength,
  validate,
  validateHttp,
  debounce,
} from '@angular/forms/signals';
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

  required(path.password, { message: 'Password is required' });
  minLength(path.password, 5, { message: 'Password must be at least 5 characters' });

  required(path.phone, {
    message: 'Phone number is required',
    when: ({ valueOf }) => valueOf(path.smsNotifications),
  });
  validate(path.phone, ({ value, valueOf }) => {
    if (!valueOf(path.smsNotifications)) return undefined;
    const phone = value();
    if (!phone) return undefined;
    if (!PHONE_PATTERN.test(phone)) {
      return { kind: 'invalidPhone', message: 'Phone number must be exactly 9 digits' };
    }
    return undefined;
  });
});
