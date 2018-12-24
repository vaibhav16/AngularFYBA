import { Component, OnInit,Directive, Input } from '@angular/core';
import { ChangePw } from '../models/changepw.model';
//import { Http, Response, Headers, RequestOptions, RequestMethod,JSONPConnection } from '@angular/http';
//import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PasswordValidation  } from './confirm-password.validator';
import { FinalFilter } from '../../official/classes/selectgame/finalFilter.model';
import { LoginService } from './../services/login.service';
import { ChangepwService } from '../services/changepw.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
  headerImg:string;

  apiModel: FinalFilter={
    UserID:'',
    SessionKey:'',
    RequestedData:''
   }

  changePwModel: ChangePw = {
    Email:null,
    OldPassword:null,
    NewPassword:null,
    ConfirmPassword:null
  }

  submitted:boolean=false;

  form: FormGroup;
  constructor(public fb: FormBuilder, 
    public loginService: LoginService,
    public changePwService: ChangepwService)
    // public http: Http)
  {
    this.form = fb.group({
      oldPassword:['',Validators.required, Validators.minLength(1),Validators.maxLength(30)],
      password: ['', Validators.required,Validators.minLength(1),Validators.maxLength(30)],
      confirmPassword: ['', Validators.required,Validators.minLength(1),Validators.maxLength(30)]
    }, {
      validators: [PasswordValidation.MatchPassword,
      PasswordValidation.LengthError]
      
    });
  }

  ngOnInit() {
    this.headerImg = 'official_header_img';
  }
  
  onSubmit() {
    this.submitted=true;
    console.log(this.form.value);
    this.changePwModel.Email = this.loginService.email;
    this.changePwModel.OldPassword = this.form.value.oldPassword;
    this.changePwModel.NewPassword= this.form.value.password;
    this.changePwModel.ConfirmPassword = this.form.value.confirmPassword;
    this.apiModel.RequestedData = JSON.stringify(this.changePwModel);
    this.apiModel.SessionKey = this.loginService.sessionKey;
    this.apiModel.UserID =  this.loginService.userId.toString();
    this.changePwService.changePassword(JSON.stringify(this.apiModel));
   }

  
}