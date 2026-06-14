import { Component, signal } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  FormField,
  submit,
  required,
  email,
  validate,
  validateHttp,
  debounce,
} from '@angular/forms/signals';
import { compatForm } from '@angular/forms/signals/compat';
import { PhoneInputComponent } from '../phone-input/phone-input.component';
import { PHONE_PATTERN } from '../phone-input/phone-input.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormField, PhoneInputComponent, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  passwordControl = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
  ]);

  model = signal({
    email: '',
    password: this.passwordControl,
    phone: '',
  });

  signupForm = compatForm(this.model, (s) => {
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
            body: JSON.stringify({
              email: this.signupForm.email().value(),
              password: this.signupForm.password().value(),
              phone: this.signupForm.phone().value(),
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            this.submitError.set(data.error || 'Signup failed');
            return;
          }

          this.submitted.set(true);
        } catch (e) {
          this.submitError.set('Network error. Please try again.');
          console.error(e);
        }
      },
      onInvalid(field, detail) {
        console.log('Form invalid:', field, detail);
      },
      ignoreValidators: 'none',
    });
  }
}
