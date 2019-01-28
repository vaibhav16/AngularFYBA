import { Component, OnInit } from '@angular/core';
import { BsModalRef } from "ngx-bootstrap/modal";
import { Router } from "@angular/router";

@Component({
  selector: 'app-validation-modal',
  templateUrl: './validation-modal.component.html',
  styleUrls: ['./validation-modal.component.css']
})
export class ValidationModalComponent implements OnInit {

   popupTitle:string = "Error";
   popupMsg:string = "Server Error has occured!";

  constructor(public modalRef: BsModalRef) { }

  ngOnInit() {
  }

}
