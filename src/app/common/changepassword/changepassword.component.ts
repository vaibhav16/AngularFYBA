import {
  Component,
  OnInit,
  TemplateRef,
  Directive,
  Input
} from "@angular/core";
import { ChangePw } from "../models/changepw.model";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { PasswordValidation } from "./confirm-password.validator";
import { FinalFilter } from "../../official/classes/selectgame/finalFilter.model";
import { LoginService } from "./../services/login.service";
import { ChangepwService } from "../services/changepw.service";
import {
  RxwebValidators,
  RxFormBuilder
} from "@rxweb/reactive-form-validators";
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-changepassword",
  templateUrl: "./changepassword.component.html",
  styleUrls: ["./changepassword.component.css"]
})
export class ChangepasswordComponent implements OnInit {
  headerImg: string;
  pass: PasswordValidation;

  apiModel: FinalFilter = {
    UserID: "",
    SessionKey: "",
    RequestedData: ""
  };

  changePwModel: ChangePw = {
    Email: null,
    OldPassword: null,
    NewPassword: null,
    ConfirmPassword: null
  };

  submitted: boolean = false;
  form: FormGroup;

  constructor(
    public fb: FormBuilder,
    public loginService: LoginService,
    public changePwService: ChangepwService,
    private modalService: BsModalService,
    public router: Router,
    public cookieService: CookieService
  ) {
    this.form = fb.group(
      {
        currentPassword: ["", Validators.required],
        newPassword: ["", Validators.required],
        confirmPassword: ["", Validators.required]
      },
      {
        validator: PasswordValidation.MatchPassword // your validation method,
      }
    );
  }

  email: string;
  ngOnInit() {
    this.headerImg = "official_header_img";
    this.email = this.cookieService.get("email").toString();
  }
  changeRequest: boolean;
  modalRef: BsModalRef;
  onSubmit(template: TemplateRef<any>) {
    this.changeRequest = true;
    this.submitted = true;

    console.log(this.form.value);
    this.changePwModel.Email = this.email;
    this.changePwModel.OldPassword = this.form.value.currentPassword;
    this.changePwModel.NewPassword = this.form.value.newPassword;
    this.changePwModel.ConfirmPassword = this.form.value.confirmPassword;
    this.apiModel.RequestedData = JSON.stringify(this.changePwModel);
    this.apiModel.SessionKey = this.loginService.sessionKey;
    this.apiModel.UserID = this.loginService.userId.toString();
    this.changePwService
      .changePassword(JSON.stringify(this.apiModel))
      .then(res => {
        this.changeRequest = false;
        this.modalRef = this.modalService.show(template, { class: "modal-sm" });
        console.log(this.modalRef);
      });
  }

  hideModal() {
    this.modalRef.hide();
    this.form.reset();
  }

  confirm() {
    this.modalRef.hide();
    this.router.navigate(["official"]);
  }

  goBack() {
    this.router.navigate(["official"]);
  }
}
