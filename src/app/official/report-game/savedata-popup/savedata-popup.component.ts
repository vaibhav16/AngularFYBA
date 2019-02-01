import { Component, OnInit,EventEmitter, Input, Output } from '@angular/core';
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-savedata-popup',
  templateUrl: './savedata-popup.component.html',
  styleUrls: ['./savedata-popup.component.css']
})
export class SavedataPopupComponent implements OnInit {

  popupTitle:string = "Error";
  popupMsg:string = "Server Error has occured!";
  @Output() saveStatus = new EventEmitter<boolean>();

 constructor(public modalRef: BsModalRef) { }

 ngOnInit() {
 }

 save(){
   this.saveStatus.emit(true);
   this.modalRef.hide();
 }

 cancel(){
  this.saveStatus.emit(false);
  this.modalRef.hide();
 }
}
