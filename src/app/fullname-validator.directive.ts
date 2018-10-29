import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidationErrors, Validator, FormControl } from '@angular/forms';

@Directive({
  selector: '[appFullnameValidator]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: FullnameValidatorDirective, multi: true }
  ]
})
export class FullnameValidatorDirective implements Validator {
  static validateName(control: FormControl): ValidationErrors | null {
    if (control.value && control.value.split(' ').length === 1
    ) {
      // Return error if card is not Amex, Visa or Mastercard
      return { fullName: 'Please give a first and last name' };
    }
    return null; // If no error, return null
  }
  validate(c: FormControl): ValidationErrors | null {
    return FullnameValidatorDirective.validateName(c);
  }
}
