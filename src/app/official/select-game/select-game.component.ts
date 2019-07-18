import { Component, TemplateRef, OnInit, ViewEncapsulation } from '@angular/core';
import { OfficialService } from '../official.service';
import { NgbActiveModal, NgbAccordionConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Filter } from '../classes/selectgame/filter.model';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import { map, switchMap, tap, mergeMap, catchError } from 'rxjs/operators';
import { ModalContentComponent } from './../official.component';
import { Observable } from 'rxjs';
import { ErrorModalComponent } from './../../common/error-modal/error-modal.component';
import { DataSharingService } from './../../data-sharing.service';

@Component({
  selector: 'app-select-game',
  templateUrl: './select-game.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./select-game.component.css'],
  providers: [NgbAccordionConfig]
})
export class SelectGameComponent implements OnInit {
  modalRef: BsModalRef;
  activeIds: string[] = [];
  selectedItems = [];
  settings = {};

  selectedFilter: Filter = {
    Division: '',
    Location: '',
    StartTime: '',
    EndTime: '',
    Position: '',
    ShowSignedGames: null,
    ShowPastGames: null
  };

  constructor(
    public officialService: OfficialService,
    public sanitizer: DomSanitizer,
    config: NgbAccordionConfig,
    private modalService: BsModalService,
    public dss: DataSharingService
  ) {
    config.closeOthers = true;
    config.type = 'info';
  }

  template: TemplateRef<any>;

  ngOnInit() {
    this.settings = {
      text: 'Select....',
      classes: 'myclass custom-class'
    };

    this.officialService.postSelectGames(this.selectedFilter).then(() => {
      if (this.officialService.serviceError) {
        this.modalRef = this.modalService.show(ErrorModalComponent);
        if (this.officialService.timeoutError) {
          this.modalRef.content.errorMsg = 'Timeout has occured!';
        }
        this.modalRef.content.closeBtnName = 'Close';
      }
    });
  }

  get selectGameData() {
    //console.log(this.officialService.selectGameJson);
    return this.officialService.selectGameJson;
  }

  /* - Panel Change Event Function - */
  public beforeChange($event: NgbPanelChangeEvent) {
    this.activeIds.push($event.panelId);
  }

  /* - Code to Submit Filter Data to Service - */
  filterRequest: boolean;
  submitFilters(value: any) {
    console.log(value);
    this.filterRequest = true;
    this.selectedFilter = {
      Division: '',
      Location: '',
      StartTime: '',
      EndTime: '',
      Position: '',
      ShowSignedGames: null,
      ShowPastGames: null
    };

    if (value != null) {
      if (value.DivisionSelect != null) {
        for (let i = 0; i < value.DivisionSelect.length; ++i) {
          {
            this.selectedFilter.Division += value.DivisionSelect[i].id + ',';
          }
        }
      }

      if (value.LocationSelect != null) {
        for (let i = 0; i < value.LocationSelect.length; ++i) {
          {
            this.selectedFilter.Location += value.LocationSelect[i].id + ',';
          }
        }
      }

      if (value.PositionSelect != null) {
        for (let i = 0; i < value.PositionSelect.length; ++i) {
          {
            this.selectedFilter.Position += value.PositionSelect[i].id + ',';
          }
        }
      }

      if (value.TimeSelect != null) {
        for (let i = 0; i < value.TimeSelect.length; ++i) {
          {
            this.selectedFilter.StartTime += value.TimeSelect[i].id + ',';
          }
        }
      }
    }

    this.selectedFilter.ShowPastGames = value.pastGames;

    this.selectedFilter.ShowSignedGames = value.signedGames;

    this.officialService.postFilterData(this.selectedFilter).then((res) => {
      this.filterRequest = false;
    });
  }

  /* - Sends SignUp request to service - */
  tempGroupId: string;
  tempGameId: string;
  tempPositionId: string;
  tempForCancelSignUp: string;
  signUpRequest: boolean = false;

  postSignUp(
    groupId: string,
    gameId: string,
    positionId: string,
    ForCancelSignUp: string,
    template: TemplateRef<any>,
    standardTemplate: TemplateRef<any>
  ) {
    this.signUpRequest = true;
    this.tempGroupId = groupId;
    this.tempGameId = gameId;
    this.tempPositionId = positionId;
    this.tempForCancelSignUp = ForCancelSignUp;
    this.officialService.postSignUp(groupId, gameId, positionId, ForCancelSignUp).then((res) => {
      this.signUpRequest = false;
      if (this.officialService.signUpResponse == 'Registered') {
        this.modalRef = this.modalService.show(template, {
          class: 'modal-sm'
        });
      } else {
        this.modalRef = this.modalService.show(standardTemplate, {
          class: 'modal-sm'
        });
      }
    });
  }

  /* - Sends Cancel SignUp request to service - */
  cancelSignUp(
    groupId: string,
    gameId: string,
    positionId: string,
    ForCancelSignUp: string,
    cancelTemplate: TemplateRef<any>
  ) {
    this.signUpRequest = true;
    this.tempGroupId = groupId;
    this.tempGameId = gameId;
    this.tempPositionId = positionId;
    this.tempForCancelSignUp = ForCancelSignUp;
    this.officialService.postSignUp(groupId, gameId, positionId, ForCancelSignUp).then((res) => {
      this.signUpRequest = false;
      this.modalRef = this.modalService.show(cancelTemplate, {
        class: 'modal-sm'
      });
    });
  }

  /* - Implementing ngx-modal from ngx-bootstrap - */

  confirmSignUpEmail(): void {
    this.modalRef.hide();
    this.officialService.sendSignUpEmail(
      this.tempGroupId,
      this.tempGameId,
      this.tempPositionId,
      this.tempForCancelSignUp
    );
    this.officialService.signUpResponse = null;
  }

  declineSignUpEmail(): void {
    this.modalRef.hide();
    this.officialService.signUpResponse = null;
  }

  confirmCancelSignupModal() {
    this.officialService.sendCancelSignUpEmail(
      this.tempGroupId,
      this.tempGameId,
      this.tempPositionId,
      this.tempForCancelSignUp
    );
    this.modalRef.hide();
  }

  closeCancelSignupModal(): void {
    this.modalRef.hide();
    this.officialService.signUpResponse = null;
  }

  closeStandardModal() {
    this.modalRef.hide();
  }
  /* - ngx-modal implementation ends - */

  gameLocation: string;
  openMapModal(location: string, mapTemplate: TemplateRef<any>) {
    this.gameLocation = location;
    this.modalRef = this.modalService.show(mapTemplate, { class: 'modal-sm' });
    console.log(this.modalRef);
  }

  closeMapModal() {
    this.modalRef.hide();
  }

  getGameLocation() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.gameLocation);
  }

  pdfUrl: string;
  downloadRequest: boolean;
  downloadPdf(url) {
    this.downloadRequest = true;
    var downLoadUrl;
    this.officialService.getPdfUrl(url).subscribe((res) => {
      console.log(res);
      console.log(res['_body']);
      var x = JSON.parse(res['_body']);
      downLoadUrl = x['Value'].AbsoluteUrl;
      this.downloadRequest = false;
      window.location.href = downLoadUrl;
    });
  }

  // downloadPdf2(url) {
  //   this.downloadRequest = true;
  //   var downLoadUrl;
  //   var fileName;
  //   this.officialService
  //     .getPdfUrl(url)
  //     .pipe(
  //       map(res => {
  //         console.log(res);
  //         console.log(res["_body"]);
  //         var x = JSON.parse(res["_body"]);
  //         downLoadUrl = x["Value"].RelativeUrl;
  //         fileName = x["Value"].FileName;
  //       })
  //     )
  //     .pipe(mergeMap(_body => this.officialService.downloadPdf(downLoadUrl)))
  //     .pipe(
  //       catchError(e => {
  //         console.log(e);
  //         this.downloadRequest = false;
  //         return Observable.throw(e);
  //       })
  //     )
  //     .subscribe(res => {
  //       console.log(res);
  //       saveAs(res, fileName);
  //       this.downloadRequest = false;
  //     });
  // }
}
