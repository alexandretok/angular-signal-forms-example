import { Component, signal } from '@angular/core';
import {
  form,
  FormField,
  submit,
  required,
  email,
  minLength,
  validate,
  validateHttp,
  debounce,
} from '@angular/forms/signals';
import { PhoneInputComponent } from '../phone-input/phone-input.component';
import { PHONE_PATTERN } from '../phone-input/phone-input.model';
import { SignupModel } from './signup.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormField, PhoneInputComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  model = signal<SignupModel>({
    email: '',
    password: '',
    phone: '',
  });

  signupForm = form(this.model, (s) => {
    required(s.email, { message: 'Email is required' });
    email(s.email, { message: 'Please enter a valid email address' });
    debounce(s.email, 1000);
    validateHttp(s.email, {
      request: ({ value }) => `/api/check-email?email=${value()}`,
      onSuccess: (response: any) =>
        response.exists
          ? { kind: 'emailTaken', message: 'This email is already registered' }
          : null,
      onError: () => ({ kind: 'networkError', message: 'Could not verify email availability' }),
    });

    required(s.password, { message: 'Password is required' });
    minLength(s.password, 5, { message: 'Password must be at least 5 characters' });

    required(s.phone, { message: 'Phone number is required' });
    validate(s.phone, ({ value }) => {
      const phone = value();
      if (!phone) return undefined;
      if (!PHONE_PATTERN.test(phone)) {
        return { kind: 'invalidPhone', message: 'Phone number must be exactly 9 digits' };
      }
      return undefined;
    });
  });

  submitted = signal(false);
  submitError = signal('');

  onSubmit(): void {
    submit(this.signupForm, {
      action: async () => {
        this.submitError.set('');

        try {
          const response = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.model()),
          });

          const data = await response.json();

          if (!response.ok) {
            this.submitError.set(data.error || 'Signup failed');
            return;
          }

          this.submitted.set(true);
        } catch {
          this.submitError.set('Network error. Please try again.');
        }
      },
      onInvalid(field, detail) {
        console.log('Form invalid:', field, detail);
      },
      ignoreValidators: 'none',
    });
  }
}
