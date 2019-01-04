import { Component, TemplateRef, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { LoginService } from "../services/login.service";
import { Login } from "./../models/login.model";
import { Router } from "@angular/router";
import { FybaloaderComponent } from "./../fybaloader/fybaloader.component";
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";

const { detect } = require("detect-browser");
const browser = detect();
declare var require: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  @ViewChild(FybaloaderComponent) loader;
  browser = require("detect-browser");
  browserName;
  iosStandalone;

  constructor(
    public loginService: LoginService,
    private router: Router,
    private modalService: BsModalService
  ) {}

  modalRef: BsModalRef;

  ngOnInit() {
    let newVariable: any;
    newVariable = window.navigator;
    this.resetForm();
    //this.ios = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
    //this.iosStandalone = window.navigator.standalone;
    if (newVariable.standalone) this.iosStandalone = true;

    if (this.loginService.cookieService.check("sessionKey")) {
      this.router.navigate(["official"]);
    }

    //this.loginService.isLoggedIn=false;

    if (browser) {
      this.browserName = browser.name;
      // console.log(browser.name);
      // console.log(browser.version);
      // console.log(browser.os);
    }
  }

  resetForm(form?: NgForm) {
    if (form != null) {
      form.reset();
    }

    this.loginService.selectedLogin = {
      Email: null,
      Password: null
    };
  }

  onSubmit(form: NgForm, template: TemplateRef<any>) {
    console.log(form.value);

    this.loginService.postLoginData(form.value).then(res => {
      if (this.loginService.serviceError || this.loginService.loginFailed) {
        this.modalRef = this.modalService.show(template, { class: "modal-sm" });
      } else if (this.loginService.promptChangePassword.length > 1) {
      }
    });
  }

  closeErrorModal() {
    this.modalRef.hide();
  }
}
