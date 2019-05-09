import { ValidatorFn, AbstractControl, FormArray } from '@angular/forms';

// Array Validators
export class ArrayValidators {

    // max length
    public static maxLength(max: number): ValidatorFn | any {
        return (control: AbstractControl[]) => {
            if (!(control instanceof FormArray)) return;
            return control.length > max ? { maxLength: true } : null;
        }
    }
}

// import { AbstractControl } from "@angular/forms";

// export function minLengthError() {
//     return (c: AbstractControl): {[key: string]: any} => {
//         if (c.value.length <= 3)
//             return null;

//         return { 'minLengthError': {valid: false }};
//     }
// }