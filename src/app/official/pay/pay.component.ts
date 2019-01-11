import { Component, OnInit } from '@angular/core';
import { OfficialService } from './../official.service';
import { LoginService } from './../../common/services/login.service';
import { ErrorModalComponent } from './../../common/error-modal/error-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DataSharingService } from './../../data-sharing.service';
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
    public loginService: LoginService,
    private dss: DataSharingService
  ) {
    
  }

  public paidSection: IPaidSection;
  initialFetchError = null;
  paidRequest: boolean;
  ngOnInit() {
    this.paidRequest = true;
    this.officialService.fetchGetPaidData1().subscribe(
      (data) => {
        this.paidSection = data;
        console.log(this.paidSection);
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
        console.log('finally');
      }
    );
  }
}
