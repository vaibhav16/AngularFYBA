import { Component, OnInit } from '@angular/core';
import { BsModalRef } from "ngx-bootstrap/modal";
import { Router } from "@angular/router";

@Component({
  selector: 'app-request-status-popup',
  templateUrl: './request-status-popup.component.html',
  styleUrls: ['./request-status-popup.component.css']
})
export class RequestStatusPopupComponent implements OnInit {
  status:boolean = null;
  popupTitle:string = "Error";
  popupMsg:string = "Server Error has occured!";
  route:string;

 constructor(public modalRef: BsModalRef, public router: Router) { }

 ngOnInit() {
   console.log(status);
   //this.route = "/player/team";
 }

 ok(){
   this.router.navigate([this.route]);
   this.modalRef.hide();
 }

}
