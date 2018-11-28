import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from './login.service';
import { Login } from './login.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {  

  constructor(public loginService: LoginService,private router: Router) { }

  tempCount=0;

  ngOnInit() {
    this.resetForm();
    console.log("inside login");
    
    const cookieExists: boolean = this.loginService.cookieService.check('SessionKey');
    
    //this.router.navigate(['player']);
    console.log(this.loginService.cookieService.get('SessionKey'));   
  
    // if(cookieExists)
    // {
    //   this.router.navigate(['official'])       
    // }
    // else{
    //   this.resetForm();       
    // }
    
    /*   if(this.loginService.cookieService.get('SessionKey').length>0){
      this.router.navigate(['official']);
    } */
   
  
    //this.loginService.isLoggedIn=false;
    
  }

  resetForm(form?: NgForm){
    if(form !=null){
      form.reset();
    }
   
    this.loginService.selectedLogin = {
      Email: null,
      Password: null
    }
  }

  onSubmit(form: NgForm)
  {   
    console.log(form.value);
    this.loginService.postLoginData(form.value);         
  }
}
