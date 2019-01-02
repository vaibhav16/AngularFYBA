import { AbstractControl } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
export class PasswordValidation {
    static MatchPassword(AC: AbstractControl) {
        let password = AC.get('currentPassword').value; // to get value in input tag
        let newPassword = AC.get('newPassword').value; // to get value in input tag
        let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag       
        
 
        if(newPassword != confirmPassword) {
             //console.log('false');
             AC.get('confirmPassword').setErrors( {MatchPassword: true} )
         } 
         else{
             return null
         }
         
         
        
         
     }
}