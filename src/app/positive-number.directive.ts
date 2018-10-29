import { Directive } from '@angular/core';
import { ValidatorFn, AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[appPositiveNumber]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PositiveNumberDirective, multi: true }]
})
export class PositiveNumberDirective {

  constructor() { }

  validate(c: AbstractControl): { [key: string]: any; } {
    return positiveNumberValidator()(c);
  }

}

export function positiveNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const isNotOk = Number(control.value) < 1;
    return isNotOk ? { nonPositive: { value: control.value } } : null;
  };
}
