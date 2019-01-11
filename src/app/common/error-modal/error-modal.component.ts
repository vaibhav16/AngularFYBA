import { Component, OnInit } from '@angular/core';
import { BsModalRef } from "ngx-bootstrap/modal";
import { Router } from "@angular/router";

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent implements OnInit {
  //modalRef: BsModalRef;
  errorTitle:string = "Error";
  errorMsg:string = "Server Error has occured!";
  
  constructor(public modalRef: BsModalRef) { }

  ngOnInit() {
  }

  tryAgain(){
    window.location.reload();
    console.log("Try Again!");
  }

  ok(){
    this.modalRef.hide();
  }

}
