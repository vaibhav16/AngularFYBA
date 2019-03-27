import { Component, OnInit, AfterViewInit } from '@angular/core';
import { OfficialService } from './official.service';
import { DataSharingService } from './../data-sharing.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
//import * as $ from "jquery";

@Component({
  selector: 'app-official',
  templateUrl: './official.component.html',
  styleUrls: ['./official.component.css']
})
export class OfficialComponent implements OnInit {
  isSelectGameActive: boolean = false;
  headerImg: string;
  bsModalRef: BsModalRef;

  constructor(
    private _router: Router,
    private modalService: BsModalService,
    public officialService: OfficialService,
    public dss: DataSharingService
  ) {}

  ngOnInit() {
    /*if(!this.loginService.sessionKey){
      this._router.navigate(['login']);
    }*/
    this.isSelectGameActive = true;
    this.headerImg = 'official_header_img';
  }

  ngAfterViewInit() {
    //console.log(this.loginService.promptChangePassword);
    // this.bsModalRef = this.modalService.show(ModalContentComponent);
    // this.bsModalRef.content.closeBtnName = 'Close';
    // if (this.loginService.promptChangePassword != null) {
    //   if (this.loginService.promptChangePassword.length > 1) {
    //     this.bsModalRef = this.modalService.show(ModalContentComponent);
    //     this.bsModalRef.content.closeBtnName = "Close";
    //   }
    // }
  }

  keepSelectActive() {
    if (this.isSelectGameActive == false) this.isSelectGameActive = true;
  }

  toggleSelectClass() {
    if (this.isSelectGameActive == true) this.isSelectGameActive = !this.isSelectGameActive;
  }
}

/* This is a component which we pass in modal*/

@Component({
  selector: 'modal-content',
  template: `
    <div class="modal-header" style="background-color:red">
      <h4 style="color:white" class="modal-title pull-left">{{ title }}</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">Please change your password!</div>
    <div class="modal-footer">
      <button type="button" class="btn btn-danger" (click)="changePw()">OK</button>
    </div>
  `
})
export class ModalContentComponent implements OnInit {
  title: string = 'Password Change Required';
  closeBtnName: string;

  constructor(public bsModalRef: BsModalRef, private _router: Router) {}

  ngOnInit() {}

  changePw() {
    this._router.navigate(['changepassword']);
    this.bsModalRef.hide();
  }
}
