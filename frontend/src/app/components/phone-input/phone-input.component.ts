import {
  Component,
  model,
  input,
  output,
  signal,
  computed,
  effect,
} from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-phone-input',
  standalone: true,
  templateUrl: './phone-input.component.html',
  styleUrl: './phone-input.component.css',
})
export class PhoneInputComponent implements FormValueControl<string> {
  readonly value = model.required<string>();
  readonly disabled = input(false);
  readonly touch = output<void>();

  rawDigits = signal('');

  displayValue = computed(() => {
    const digits = this.rawDigits();
    if (!digits) return '';
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
  });

  constructor() {
    effect(() => {
      const val = this.value();
      this.rawDigits.set(val || '');
    });
  }

  onInput(raw: string): void {
    const digits = raw.replace(/\D/g, '');
    this.rawDigits.set(digits);
    this.value.set(digits);
  }

  onBlur(): void {
    this.touch.emit();
  }
}
