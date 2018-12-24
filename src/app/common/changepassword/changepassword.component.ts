import { Component, OnInit,TemplateRef,Directive, Input } from '@angular/core';
import { ChangePw } from '../models/changepw.model';
//import { Http, Response, Headers, RequestOptions, RequestMethod,JSONPConnection } from '@angular/http';
//import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { PasswordValidation  } from './confirm-password.validator';
import { FinalFilter } from '../../official/classes/selectgame/finalFilter.model';
import { LoginService } from './../services/login.service';
import { ChangepwService } from '../services/changepw.service';
import { RxwebValidators,RxFormBuilder } from "@rxweb/reactive-form-validators";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router,} from '@angular/router'; 
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
  headerImg:string;
  pass:PasswordValidation;

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

 
  submitted:boolean = false;

  pwFormGroup: FormGroup

    constructor(
        private formBuilder: RxFormBuilder,
        public loginService: LoginService,
        public changePwService: ChangepwService,
        private modalService: BsModalService,
        public router: Router,
        public cookieService: CookieService
    ) { }   

    ngOnInit() {
      this.headerImg = 'official_header_img';
      this.pwFormGroup = new FormGroup({
        currentPassword: new FormControl('', [Validators.required, Validators.minLength(1), 
          this.checkPassword]),
        newPassword: new FormControl('', [Validators.required, Validators.minLength(2)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(2)])
      },
      this.passwordsShouldMatch
    );
  }

  get currentPassword() { return this.pwFormGroup.get('currentPassword'); }

  get newPassword() { return this.pwFormGroup.get('newPassword'); }

  get confirmPassword() { return this.pwFormGroup.get('confirmPassword'); }

  private checkPassword(control: FormControl) {
    return control.value.toString().length >= 1 && control.value.toString().length <= 10
      ? null
      : {'outOfRange': true};
  }

  private passwordsShouldMatch(fGroup: FormGroup) {
    return fGroup.get('newPassword').value === fGroup.get('confirmPassword').value
      ? null : {'mismatch': true};
  }
  // this.pwFormGroup = this.formBuilder.group({
  //               currentPassword:['', RxwebValidators.minLength({value:1 })], 
  //                 newPassword:['',
  //                 RxwebValidators.password({validation:{maxLength: 10,minLength: 1} })], 
  //       confirmPassword:['', RxwebValidators.compare({fieldName:'newPassword' })], 
  //                               });
  
  modalRef:BsModalRef;
  onSubmit(template: TemplateRef<any>) {
    this.submitted=true;

     console.log(this.pwFormGroup.value);
    // this.changePwModel.Email = this.cookieService.get('email').toString();
    // this.changePwModel.OldPassword = this.pwFormGroup.value.currentPassword;
    // this.changePwModel.NewPassword= this.pwFormGroup.value.newPassword;
    // this.changePwModel.ConfirmPassword = this.pwFormGroup.value.confirmPassword;
    // this.apiModel.RequestedData = JSON.stringify(this.changePwModel);
    // this.apiModel.SessionKey = this.loginService.sessionKey;
    // this.apiModel.UserID =  this.loginService.userId.toString();
    // this.changePwService.changePassword(JSON.stringify(this.apiModel)).then(res=>{
    //   this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    // });
   }

   hideModal(){        
    this.modalRef.hide();
    this.pwFormGroup.reset();
    
  }
  //, RxwebValidators.different({fieldName:'currentPassword' })
  
  confirm(){        
    this.modalRef.hide();
    this.router.navigate(['official']);    
  }

  goBack(){
    this.router.navigate(['official']);    
  }
  

}