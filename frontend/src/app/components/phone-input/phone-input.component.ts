import {
  Component,
  forwardRef,
  signal,
  computed,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
} from '@angular/forms';

export interface PhoneNumber {
  countryCode: string;
  number: string;
}

interface CountryConfig {
  code: string;
  dialCode: string;
  label: string;
  mask: string;
  pattern: RegExp;
}

export const SUPPORTED_COUNTRIES: CountryConfig[] = [
  {
    code: 'PT',
    dialCode: '+351',
    label: 'Portugal (+351)',
    mask: '9XX XXX XXX',
    pattern: /^9\d{8}$/,
  },
  {
    code: 'BR',
    dialCode: '+55',
    label: 'Brazil (+55)',
    mask: '(XX) XXXXX-XXXX',
    pattern: /^\d{11}$/,
  },
];

@Component({
  selector: 'app-phone-input',
  standalone: true,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="phone-input-container">
      <select
        [ngModel]="selectedCountry()"
        (ngModelChange)="onCountryChange($event)"
        class="country-select"
        [disabled]="isDisabled()"
      >
        @for (country of countries; track country.code) {
          <option [ngValue]="country.code">{{ country.label }}</option>
        }
      </select>
      <input
        type="tel"
        [ngModel]="displayValue()"
        (ngModelChange)="onInputChange($event)"
        (blur)="onTouched()"
        [disabled]="isDisabled()"
        [placeholder]="currentPlaceholder()"
        class="phone-number-input"
      />
    </div>
  `,
  styles: `
    .phone-input-container {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .country-select {
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      background: white;
      min-width: 160px;
    }

    .phone-number-input {
      flex: 1;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
    }

    .country-select:disabled,
    .phone-number-input:disabled {
      background: #f3f4f6;
      cursor: not-allowed;
    }

    .phone-number-input:focus,
    .country-select:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
    }
  `,
})
export class PhoneInputComponent implements ControlValueAccessor {
  readonly countries = SUPPORTED_COUNTRIES;

  selectedCountry = signal<string>('PT');
  rawNumber = signal<string>('');
  isDisabled = signal(false);

  currentCountryConfig = computed(() =>
    SUPPORTED_COUNTRIES.find((c) => c.code === this.selectedCountry())!
  );

  currentPlaceholder = computed(() => this.currentCountryConfig().mask);

  displayValue = computed(() => {
    const raw = this.rawNumber();
    const country = this.selectedCountry();

    if (!raw) return '';

    if (country === 'BR') {
      return this.formatBrazil(raw);
    }
    return this.formatPortugal(raw);
  });

  private onChange: (value: PhoneNumber) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: PhoneNumber | null): void {
    if (value) {
      this.selectedCountry.set(value.countryCode || 'PT');
      this.rawNumber.set(value.number || '');
    } else {
      this.selectedCountry.set('PT');
      this.rawNumber.set('');
    }
  }

  registerOnChange(fn: (value: PhoneNumber) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onCountryChange(code: string): void {
    this.selectedCountry.set(code);
    this.rawNumber.set('');
    this.emitValue();
  }

  onInputChange(formatted: string): void {
    const digits = formatted.replace(/\D/g, '');
    const country = this.selectedCountry();
    const maxLength = country === 'BR' ? 11 : 9;
    this.rawNumber.set(digits.slice(0, maxLength));
    this.emitValue();
  }

  private emitValue(): void {
    this.onChange({
      countryCode: this.selectedCountry(),
      number: this.rawNumber(),
    });
  }

  private formatPortugal(digits: string): string {
    // Format: 9XX XXX XXX
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
  }

  private formatBrazil(digits: string): string {
    // Format: (XX) XXXXX-XXXX
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }
}
