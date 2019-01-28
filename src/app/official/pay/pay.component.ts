import { Component, OnInit } from '@angular/core';
import { OfficialService } from './../official.service';
import { LoginService } from './../../common/services/login.service';
import { ErrorModalComponent } from './../../common/error-modal/error-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IPaidSection } from './../classes/pay/pay.model';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {
  modalRef: BsModalRef;
  constructor(
    public modalService: BsModalService,
    public officialService: OfficialService,
    public loginService: LoginService
  ) {}

  public paidSection: IPaidSection;
  initialFetchError = null;
  paidRequest: boolean;
  ngOnInit() {
    this.paidRequest = true;
    this.officialService.fetchGetPaidData().subscribe(
      (data) => {
        if (data['Status']) {
          this.paidSection = data;
          console.log(this.paidSection);
        } else {
          this.paidRequest = false;
          this.modalRef = this.modalService.show(ErrorModalComponent);
          this.modalRef.content.closeBtnName = 'Close';
        }
      },
      (err) => {
        this.paidRequest = false;
        this.initialFetchError = true;
        console.log(err);
        this.modalRef = this.modalService.show(ErrorModalComponent);
        this.modalRef.content.closeBtnName = 'Close';
      },
      () => {
        this.paidRequest = false;
        //console.log('finally');
      }
    );
  }

}
