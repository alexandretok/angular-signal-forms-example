import { Component, signal } from '@angular/core';
import { form, FormField, submit } from '@angular/forms/signals';
import { PhoneInputComponent } from '../phone-input/phone-input.component';
import { SignupModel } from './signup.model';
import { validationSchema } from './signup.schema';

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
    smsNotifications: true,
    phones: [''],
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: '',
    },
  });

  signupForm = form(this.model, validationSchema);

  submitted = signal(false);
  submitError = signal('');

  addPhone(): void {
    this.model.update((model) => ({ ...model, phones: [...model.phones, ''] }));
  }

  removePhone(index: number): void {
    this.model.update((model) => ({
      ...model,
      phones: model.phones.filter((_, i) => i !== index),
    }));
  }

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
          this.submitError.set('Please try again.');
        }
      },
      onInvalid(field, detail) {
        console.log('Form invalid:', field, detail);
      },
      ignoreValidators: 'none',
    });
  }
}
