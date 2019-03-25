import {
  Component,
  TemplateRef,
  ElementRef,
  Renderer2,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { saveAs } from 'file-saver';
import { map, switchMap, tap, mergeMap, catchError } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { NgbAccordionConfig, NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { OfficialService } from '../official.service';
import { FormBuilder, FormGroup, FormArray, NgForm } from '@angular/forms';
import { APIGamePost } from '../classes/reportgame/APIGamePost.model';
import { ScoreSheetImages } from '../classes/reportgame/ScoreSheet.model';
import { DeletedScoreSheetImages } from '../classes/reportgame/DeletedScoreSheetImages';
import { APIPlayerScorePost } from '../classes/reportgame/APIPlayerScorePost.model';
import { DeleteIncidentReport } from './../classes/reportgame/APIGamePost.model';
import { Http } from '@angular/http';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ScoreSheetImages2 } from './../classes/reportgame/ScoreSheet2.model';
import { DeletedScoreSheet2 } from './../classes/reportgame/DeletedScoreSheet2.model';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ErrorModalComponent } from './../../common/error-modal/error-modal.component';
import * as $ from 'jquery';
import { DataSharingService } from 'src/app/data-sharing.service';
import { NewIncidentComponent } from './new-incident/new-incident.component';
import { ShowIncidentComponent } from './show-incident/show-incident.component';
import { ValidationModalComponent } from './validation-modal/validation-modal.component';
import { SuccessPopupComponent } from './success-popup/success-popup.component';
import { ShowNewIncidentComponent } from './show-new-incident/show-new-incident.component';
import { SavedataPopupComponent } from './savedata-popup/savedata-popup.component';
import { DomSanitizer } from '@angular/platform-browser';
import { EventEmitter } from 'protractor';
//import { file } from '@rxweb/reactive-form-validators';
//import {Message} from 'primeng/api';
//import {MessageService} from 'primeng/components/common/messageservice';

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
    //private messageService: MessageService,
    // private _lightbox: Lightbox,
    public fb: FormBuilder,
    public elRef: ElementRef,
    public http: Http,
    public config: NgbAccordionConfig,
    private modalService: BsModalService,
    public dss: DataSharingService,
    public notifierService: NotifierService,
    private _sanitizer: DomSanitizer
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

  async asyncReport() {
    await this.officialService.getReportData().then(() => {
      this.initialJson = JSON.stringify(this.officialService.reportGameJson);

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
        console.log(this.officialService.reportGameJson['Value']);
        if ($e == false) {
          console.log('Should it be saved?' + $e);
          this.officialService.IncidentReports = [];
          this.officialService.NewIncidents = [];
          this.officialService.ModifiedIncidents = [];
          this.officialService.dataChanged = false;
          this.officialService.reportGameJson = JSON.parse(this.initialJson);
        }
      });
    }
  }

  //downloadRequest: boolean = false;
  // async downloadScoresheet(url: string) {
  //   this.downloadRequest = true;
  //   console.log(url);

  //   console.log(this.downloadRequest);
  //   await this.downloadUrl(url);
  //   console.log(this.downloadRequest);
  //   ////////////////////////////////////////
  // }

  // this.officialService.downloadPdfReportGames(url)
  //   .subscribe((data) => {
  //     console.log(data);
  //     const contentDisposition = data.headers.get('content-disposition') || '';
  //     const matches = /filename=([^;]+)/ig.exec(contentDisposition);
  //     var fileName = ((matches[1] || 'untitled').trim()).replace('.pdf','');
  //     //fileName.replace('.pdf','');
  //     //const finalName = fileName.substring(fileName.indexOf('.pdf')+1)
  //     console.log(fileName);
  //     const blob = new Blob([data.blob()], { type: 'application/pdf' });
  //     console.log(blob);
  //     saveAs(blob, fileName);
  //   },
  //     (err) => {
  //       this.downloadRequest=false;
  //       console.log(err);
  //       this.modalRef = this.modalService.show(ErrorModalComponent);
  //       this.modalRef.content.closeBtnName = 'Close';
  //     },
  //     () => {
  //        this.downloadRequest=false;
  //       //console.log("done");
  //     }
  //   );
}
