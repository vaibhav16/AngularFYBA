import { Component, Renderer2 } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { OfficialService } from '../official.service';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ErrorModalComponent } from './../../common/error-modal/error-modal.component';
import { DataSharingService } from 'src/app/data-sharing.service';
import { SavedataPopupComponent } from './savedata-popup/savedata-popup.component';

@Component({
  selector: 'app-report-game',
  templateUrl: './report-game.component.html',
  styleUrls: ['./report-game.component.css']
})
export class ReportGameComponent {
  private readonly notifier: NotifierService;
  constructor(
    public router: Router,
    public officialService: OfficialService,
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
    this.asyncReport();
  }

  ngAfterViewInit() {}

  get reportGameData() {
    return this.officialService.reportGameJson;
  }

  set reportGameData(value) {
    this.officialService.reportGameJson = value;
  }

  async asyncReport() {
    await this.officialService.getReportData().then(() => {
      this.officialService.initialJson = JSON.stringify(this.reportGameData);

      if (this.officialService.serviceError) {
        this.modalRef = this.modalService.show(ErrorModalComponent);
        this.modalRef.content.closeBtnName = 'Close';
        if (this.officialService.timeoutError) {
          this.modalRef.content.errorMsg = 'Timeout has occured!';
        }
      }
    });
  }

  /* - On clicking save button, a message is shown to the user. 
  We hide the message if the user clicks on a new panel - */
  incidentCount = 0;
  panelChange($event: NgbPanelChangeEvent) {
    console.log($event);
    console.log(this.officialService.dataChanged);

    if (this.officialService.dataChanged == true) {
      $event.preventDefault();
      const initialState = {
        popupTitle: 'Save Game Data',
        popupMsg: 'Please save your previous game data else it will not be saved.'
      };

      const newPanelModal = this.modalService.show(
        SavedataPopupComponent,
        Object.assign({}, { class: 'customModalWidth75', initialState })
      );

      newPanelModal.content.saveStatus.subscribe(($e) => {
        console.log('Should it be saved?' + $e);
        console.log(this.reportGameData['Value']);
        if ($e == false) {
          console.log('Should it be saved?' + $e);
          this.officialService.IncidentReports = [];
          this.officialService.NewIncidents = [];
          this.officialService.ModifiedIncidents = [];
          this.officialService.dataChanged = false;
          this.reportGameData = JSON.parse(this.officialService.initialJson);
        }
      });
    }
  }
}
