import { Component, OnInit } from "@angular/core";
import { OfficialService } from "./../official.service";
import { LoginService } from "./../../common/services/login.service";
import { ErrorModalComponent } from './../../common/error-modal/error-modal.component';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: "app-pay",
  templateUrl: "./pay.component.html",
  styleUrls: ["./pay.component.css"]
})
export class PayComponent implements OnInit {
  modalRef: BsModalRef;
  constructor(public modalService: BsModalService,
    public officialService: OfficialService,
    public loginService: LoginService
  ) {}

  ngOnInit() {
    this.officialService.fetchGetPaidData().then(res => {
      if(this.officialService.serviceError){
        this.modalRef = this.modalService.show(ErrorModalComponent);
        this.modalRef.content.closeBtnName = "Close";        
      }
    });
  }
}
