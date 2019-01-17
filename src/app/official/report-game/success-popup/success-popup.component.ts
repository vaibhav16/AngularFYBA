import { Component, OnInit } from '@angular/core';
import { BsModalRef } from "ngx-bootstrap/modal";
import { Router } from "@angular/router";

@Component({
  selector: 'app-success-popup',
  templateUrl: './success-popup.component.html',
  styleUrls: ['./success-popup.component.css']
})
export class SuccessPopupComponent implements OnInit {

  popupTitle:string = "Error";
   popupMsg:string = "Server Error has occured!";

  constructor(public modalRef: BsModalRef) { }

  ngOnInit() {
  }

}
