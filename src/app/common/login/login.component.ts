import { Component, TemplateRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Login } from './../models/login.model';
import { Router } from '@angular/router';
import { FybaloaderComponent } from './../fybaloader/fybaloader.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { IUserData } from './../models/IUser.model';
import { CookieService } from 'ngx-cookie-service';
import { DataSharingService } from './../../data-sharing.service';

const { detect } = require('detect-browser');
const browser = detect();
declare var require: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild(FybaloaderComponent) loader;
  browser = require('detect-browser');
  userData: IUserData;
  browserName;
  iosStandalone;
  selectedLogin: Login;

  constructor(
    public loginService: LoginService,
    private router: Router,
    private modalService: BsModalService,
    public cookieService: CookieService,
    public dss: DataSharingService
  ) {}

  modalRef: BsModalRef;

  ngOnInit() {
    let newVariable: any;
    newVariable = window.navigator;
    this.resetForm();
    //this.ios = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
    //this.iosStandalone = window.navigator.standalone;
    if (newVariable.standalone) this.iosStandalone = true;

    if (this.loginService.cookieService.check('sessionKey')) {
      if (this.dss.isOfficial) this.router.navigate(['player']);
      else if (this.dss.isPlayer) this.router.navigate(['player']);
    }

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

    this.selectedLogin = {
      Email: null,
      Password: null
    };
  }

  loginRequest: boolean;
  //loginFailed: boolean;
  onSubmit(form: NgForm) {
    this.loginRequest = true;
    //this.loginFailed = false;
    console.log(form.value);

    // this.loginService.postLoginData(form.value).then(res => {
    //   if (this.loginService.serviceError || this.loginService.loginFailed) {
    //     this.modalRef = this.modalService.show(template, { class: "modal-sm" });
    //   } else if (this.loginService.promptChangePassword.length > 1) {
    //   }
    // });

    this.loginService.postLoginCredentials(form.value).subscribe(
      (res) => {
        console.log(res);
        this.userData = res;
        if (!res['Status']) {
          this.loginRequest = false;
          //this.loginFailed = true;
          // this.modalRef = this.modalService.show(ErrorModalComponent);
          // this.modalRef.content.closeBtnName = 'Close';
        }
      },
      (err) => {
        this.loginRequest = false;
        console.log(err);
        // this.modalRef = this.modalService.show(ErrorModalComponent);
        // this.modalRef.content.closeBtnName = 'Close';
      },
      () => {
        this.loginRequest = false;
        if (this.userData.Status) {

          if (this.userData.Value.PlayerIsPlayer) {
            this.router.navigate(['player']);
            this.cookieService.set('isPlayer', 'true', 365);
          }

          if (this.userData.Value.CoachIsCoach) {
            this.router.navigate(['coach']);
            this.cookieService.set('isCoach', 'true', 365);
          }

          if (this.userData.Value.OfficialIsOfficial) {
            this.router.navigate(['official']);
            this.cookieService.set('isOfficial', 'true', 365);
          }      
        

          this.cookieService.set('sessionKey', this.userData.SessionKey);
          this.cookieService.set('userId', this.userData.Value.UserId.toString(), 365);
          this.cookieService.set('officialSeasonId', this.userData.Value.OfficialSeasonalId, 365);
          this.cookieService.set('seasonId', this.userData.Value.SeasonId.toString(), 365);
          this.cookieService.set('roleId', this.userData.Value.RoleId.toString(), 365);
          this.cookieService.set('leagueId', this.userData.Value.LeagueId.toString(), 365);
          this.cookieService.set(
            'reportTagLabel',
            this.userData.Value.tagsLables.ReportCount.toString(),
            365
          );
          this.cookieService.set('textSize', this.userData.Value.Text_Size, 365);
          this.cookieService.set(
            'name',
            this.userData.Value.FirstName + this.userData.Value.LastName,
            365
          );

          this.cookieService.set('email', this.userData.Value.Email, 365);

         
          this.cookieService.set('volunteerId', this.userData.Value.VolunteerId, 365);
          this.cookieService.set('volunteerSeasonId', this.userData.Value.VolunteerSeasonalId, 365);          
          this.cookieService.set('volunteerStatusId', this.userData.Value.VolunteerStatusId, 365);
          //this.cookieService.set("name", this.userData.Value.FirstName + " " + this.userData.Value.LastName, 365);
          this.dss.textSize = this.userData.Value.Text_Size;
          //console.log
          if (
            this.userData.Value.RoundThumbnail != null &&
            this.userData.Value.RoundThumbnail.length > 0
          ) {
            this.cookieService.set('roundThumbnail', this.userData.Value.RoundThumbnail, 365);
          }

          this.dss.userId = this.userData.Value.UserId;
          this.dss.officialSeasonId = this.userData.Value.OfficialSeasonalId;
          //console.log(this.officialSeasonId);
          this.dss.seasonId = this.userData.Value.SeasonId.toString();
          this.dss.roleId = this.userData.Value.RoleId.toString();
          this.dss.leagueId = this.userData.Value.LeagueId.toString();
          this.dss.reportTagLabel = this.userData.Value.tagsLables.ReportCount;
          this.dss.email = this.userData.Value.Email;
          this.dss.textSize = this.userData.Value.Text_Size;
          this.dss.promptChangePassword = this.userData.Value.PromptChangePassword;
          this.dss.name = this.userData.Value.FirstName + ' ' + this.userData.Value.LastName;
          this.dss.VolunteerId = this.userData.Value.VolunteerId;
          this.dss.VolunteerSeasonalId = this.userData.Value.VolunteerSeasonalId;
          this.dss.VolunteerStatusId = this.userData.Value.VolunteerStatusId;
          this.dss.isCoach = this.userData.Value.CoachIsCoach;
          this.dss.isPlayer = this.userData.Value.PlayerIsPlayer;
          this.dss.isOfficial = this.userData.Value.OfficialIsOfficial;

        }
      }
    );
  }

  closeErrorModal() {
    this.modalRef.hide();
  }
}
