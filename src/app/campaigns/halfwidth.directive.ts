import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appHalfwidth][ngModel]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: HalfwidthValidatorDirective, multi: true }],
})
export class HalfwidthValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null;
    const text = String(value);
    const hasFullwidth = /[\u3000\uFF01-\uFF60\uFFE0-\uFFE6]/.test(text);
    return hasFullwidth ? { fullwidth: true } : null;
  }
}


