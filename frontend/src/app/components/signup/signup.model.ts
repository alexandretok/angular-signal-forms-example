import { FormControl } from '@angular/forms';

export interface SignupModel {
  email: string;
  password: FormControl<string | null>;
  phone: string;
}
