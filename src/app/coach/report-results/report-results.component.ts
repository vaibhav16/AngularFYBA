import { Component, Renderer2 } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { CoachService } from '../coach.service';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ErrorModalComponent } from './../../common/error-modal/error-modal.component';
import { DataSharingService } from 'src/app/data-sharing.service';
//import { SavedataPopupComponent } from './savedata-popup/savedata-popup.component';

@Component({
  selector: 'app-report-results',
  templateUrl: './report-results.component.html',
  styleUrls: ['./report-results.component.css']
})
export class ReportResultsComponent{

  private readonly notifier: NotifierService;
  constructor(
    public router: Router,
    public officialService: CoachService,
    public renderer: Renderer2,
    public config: NgbAccordionConfig,
    private modalService: BsModalService,
    public dss: DataSharingService,
    public notifierService: NotifierService
  ) {
    this.notifier = notifierService;
    config.type = 'info';
    config.closeOthers = true;
  }

  newRequest: boolean = null;
  modalRef: BsModalRef;
  initialJson: string;
  ngOnInit() {
    this.asyncReportResultData();
  }

  ngAfterViewInit() {}

  async asyncReportResultData() {
    await this.officialService.getReportResultData();
    console.log(this.officialService.getReportResultData());
    
  }
 

}
