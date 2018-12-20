import {AbstractControl} from '@angular/forms';
export class PasswordValidation {

    static MatchPassword(AC: AbstractControl) {
       let password = AC.get('password').value; // to get value in input tag
       let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag       
       let oldPassword = AC.get('oldPassword').value; // to get value in input tag

       if(password != confirmPassword) {
            //console.log('false');
            AC.get('confirmPassword').setErrors( {MatchPassword: true} )
        } else if(oldPassword.length<=0||confirmPassword.length<=0||password.length<=0){
            AC.get('oldPassword').setErrors({EmptyField: true})                   
           
        }
        else{
            return null
        }
        
        
       
        
    }

    // static EmptyField(AC: AbstractControl) {
    //     let password = AC.get('password').value; // to get value in input tag
    //     let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
            
    //  }
}