import { Component, OnInit,EventEmitter,Output } from '@angular/core';
import { BsModalRef } from "ngx-bootstrap/modal";
import { OfficialService } from './../../../official/official.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-success-popup',
  templateUrl: './success-popup.component.html',
  styleUrls: ['./success-popup.component.css']
})
export class SuccessPopupComponent implements OnInit {
  @Output() click = new EventEmitter<boolean>();

  status:boolean=null;
  popupTitle:string = "Error";
  popupMsg:string = "Server Error has occured!";

  constructor(public modalRef: BsModalRef,
    public router: Router,
    public officialService: OfficialService
    ) { }

  ngOnInit() {
    console.log(this.status);
  }

  ok(){
    this.modalRef.hide();
    this.officialService.getReportData().then(res=>{
      this.click.emit(true);
    });
    
    //this.router.navigate(["official/ReportGameComponent"]);
  }

}
