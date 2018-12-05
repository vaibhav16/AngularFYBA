import { Component, OnInit,ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from './login.service';
import { Login } from './login.model';
import { Router } from '@angular/router';
import { FybaloaderComponent } from '../common/fybaloader/fybaloader.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {  
 @ViewChild(FybaloaderComponent) loader;
  constructor(public loginService: LoginService,private router: Router) { }

  ngOnInit() {
    this.resetForm();
    
    const cookieExists: boolean = this.loginService.cookieService.check('SessionKey');   

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
