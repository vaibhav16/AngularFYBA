import {
  Component,
  TemplateRef,
  ElementRef,
  Renderer2,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { saveAs } from "file-saver";
import { map, switchMap, tap, mergeMap, catchError } from "rxjs/operators";
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
  //@ViewChild('imgTemplate') imgTemplate: TemplateRef<any>;

  initialJson: string = null;
  HomeTeamPlayerScores: APIPlayerScorePost[] = [];
  VisitingTeamPlayerScores: APIPlayerScorePost[] = [];
  ScoreSheetImages: ScoreSheetImages[] = [];
  ScoreSheetImages2: ScoreSheetImages2[] = [];
  DeletedScoreSheetImages: DeletedScoreSheetImages[] = [];
  DeletedScoreSheet2: DeletedScoreSheet2[] = [];
  tempIndex = 0;
  modalHeading: string;
  modalMsg: string;
  //uploadTemplate: TemplateRef<any>;
  //imgsrc: any;
  //msgs: Message[] = [];

  APIGamePost: APIGamePost = {
    Roleid: '',
    SeasonId: '',
    OfficialSeasonId: '',
    OfficiatingPositionId: '',
    GameId: '',
    GameName: '',
    GameDate: '',
    Location: '',
    IsHomeForfeit:null,
    IsVisitorForfeit:null,
    GameStartTime: '',
    HomeTeam: '',
    VisitingTeam: '',
    HomeTeamId: '',
    VisitingTeamId: '',
    HomeTeamScore: '',
    VisitingTeamScore: '',
    Division: '',
    LeagueId: '',

    HomeTeamPlayerScores: [
      {
        GameId: '',
        PlayerName: '',
        PlayerSeasonalId: '',
        FoulId: '',
        Points: null,
        PlayerNote: null,
        NotPresent: null,
        Rebound: '',
        TeamId: '',
        TeamName: ''
      }
    ],
    VisitingTeamPlayerScores: [
      {
        GameId: '',
        PlayerName: '',
        PlayerSeasonalId: '',
        FoulId: '',
        Points: null,
        PlayerNote: null,
        NotPresent: null,
        Rebound: '',
        TeamId: '',
        TeamName: ''
      }
    ],
    ScoreSheetImages: [
      {
        ImageURL: '',
        NewImageByteCode: ''
      }
    ],
    DeletedScoreSheetImages: [
      {
        ImageURL: '',
        NewImageByteCode: ''
      }
    ],
    IncidentReports: [
      {
        GameId: null,
        IncidentId: null,
        IncidentType: null,
        IncidentValue: null,
        Notes: ''
      }
    ],
    DeleteIncidentReport: [
      {
        GameId: null,
        IncidentId: null,
        IncidentType: null,
        IncidentValue: null,
        Notes: ''
      }
    ]
  };

  //  ScoreSheetImages2: ScoreSheetImages2 = {
  //   ImageURL:'',
  //   NewImageByteCode:'',
  //   GameIndex:''
  //  }
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
  ngOnInit() {
    this.asyncReport();
  }


  ngAfterViewInit() {
    
  }

  async asyncReport() {
    //console.log(this.tempGameIndex);
    await this.officialService.getReportData().then((res) => {
      this.initialJson = JSON.stringify(this.officialService.reportGameJson);
      
      if (this.officialService.serviceError) {
        this.modalRef = this.modalService.show(ErrorModalComponent);
        this.modalRef.content.closeBtnName = 'Close';
      }

    });
  }

  async makeScoreSheetArray() {
    console.log(this.ScoreSheetImages);
    console.log(this.ScoreSheetImages2);   
    //console.log(this.tempIndex);
    
    for (var i = 0; i < this.ScoreSheetImages2.length; ++i) {
      console.log(this.ScoreSheetImages2.length);
      this.ScoreSheetImages[i] = await new ScoreSheetImages();
      this.ScoreSheetImages[i].ImageURL = await '';
      this.ScoreSheetImages[i].NewImageByteCode = await this.ScoreSheetImages2[i]
        .NewImageByteCode;
      // if (this.ScoreSheetImages2[i].GameIndex == this.panelId.toString()) {
      
      // }
    }
  }

  /* - When Edited Data is sent by ScoreKeeper this function is called - */
  async onSubmit(
    form: NgForm,
    gameListIndex: number
  ) {
    console.log(form.value);

    if (!form.value.homeForfeit && !form.value.visitingForfeit) {
      //this.uploadTemplate = uploadTemplate;
      await this.makeScoreSheetArray().then((res) => {
        this.ScoreSheetImages = this.ScoreSheetImages.filter(function (el) {
          return el != null;
        });
        console.log(this.ScoreSheetImages);
      });

      if (form.value.HTeamScore.length <= 0 && form.value.VTeamScore.length <= 0) {
        /*---------------------------------------------------------------------------*/
        /*Bootstrap Modal shown in case home/visiting final score not entered by the user*/
        /*---------------------------------------------------------------------------*/
        const initialState = {
          popupTitle: 'Invalid Final Scores',
          popupMsg: 'Final Score can not be zero.'
        };

        this.bsModalRef = this.modalService.show(
          ValidationModalComponent,
          Object.assign({}, { class: 'customModalWidth75', initialState })
        );
      } else if (
        this.checkFinalScore(
          form,
          gameListIndex
        ) == true
        //&&
        //this.checkMinPON(form,gameListIndex) 
        //&&
        //this.checkFinalPON(gameListIndex)
      ) {
        this.prepareDatatoUpdate(form, gameListIndex);
      }
    }
    else{
      this.prepareDatatoUpdate(form, gameListIndex);
    }
    


  }

  tempSumHomePoint: number = 0;
  tempSumVisitingPoint: number = 0;
  tempHomeTeamName: string;
  tempVisitingTeamName: string;
  checkFinalScore(
    form: NgForm,
    gameListIndex: number
  ) {

    this.homePON = 0;
    this.visitingPON = 0;
    this.maxPON = 0;

    this.tempSumHomePoint = 0;
    this.tempSumVisitingPoint = 0;

    let homeTeamName = this.officialService.reportGameJson['Value'].GameList[gameListIndex]
      .HomeTeam;

    let visitingTeamName = this.officialService.reportGameJson['Value'].GameList[gameListIndex]
      .VisitingTeam;
    if (
      this.officialService.reportGameJson['Value'].GameList[gameListIndex].HomeTeamPlayerScores !=
      null
    ) {
      this.tempHomeTeamName = this.officialService.reportGameJson['Value'].GameList[
        gameListIndex
      ].HomeTeam;
      for (
        let i = 0;
        i <
        this.officialService.reportGameJson['Value'].GameList[gameListIndex].HomeTeamPlayerScores
          .length;
        ++i
      ) {
        let hpoint = 'HPoints' + i;
        if (form.value[hpoint] != null && parseInt(form.value[hpoint]) > 0) {
          this.tempSumHomePoint += parseInt(form.value[hpoint]);
          //console.log(form.value[hpoint]);
        }

        let hpon = 'HPlayerNote' + i;
        if (form.value[hpon] != null && form.value[hpon]) {
          this.homePON++;
          this.maxPON++;
          console.log(this.homePON, this.visitingPON, this.maxPON);
          if (this.homePON > 3) {
            /*---------------------------------------------------------------------------*/
            /*Bootstrap Modal shown in case PON greater than three.*/
            /*---------------------------------------------------------------------------*/
            const initialState = {
              popupTitle: 'Error',
              popupMsg:
                'The players of note in Team ' +
                homeTeamName +
                ' can not be greater than three.'
            };

            this.modalRef = this.modalService.show(
              ValidationModalComponent,
              Object.assign({}, { class: 'customModalWidth75', initialState })
            );

            return false;
          }
        }
      }
    }

    if (
      this.officialService.reportGameJson['Value'].GameList[gameListIndex]
        .VisitingTeamPlayerScores != null
    ) {
      this.tempVisitingTeamName = this.officialService.reportGameJson['Value'].GameList[
        gameListIndex
      ].VisitingTeam;
      for (
        let i = 0;
        i <
        this.officialService.reportGameJson['Value'].GameList[gameListIndex]
          .VisitingTeamPlayerScores.length;
        ++i
      ) {
        let vpoint = 'VPoints' + i;
        if (form.value[vpoint] != null && parseInt(form.value[vpoint]) > 0) {
          this.tempSumVisitingPoint += parseInt(form.value[vpoint]);
          //console.log(vpoint, form.value[vpoint]);
        }

        let vpon = 'VPlayerNote' + i;
        if (form.value[vpoint] != null && form.value[vpon]) {
          this.visitingPON++;
          this.maxPON++;

          if (this.visitingPON > 3) {
            /*---------------------------------------------------------------------------*/
            /*Bootstrap Modal shown in case PON grater than three.*/
            /*---------------------------------------------------------------------------*/

            const initialState = {
              popupTitle: 'Error',
              popupMsg:
                'The players of note in Team ' +
                visitingTeamName +
                ' can not be greater than three.'
            };

            this.modalRef = this.modalService.show(
              ValidationModalComponent,
              Object.assign({}, { class: 'customModalWidth75', initialState })
            );

            return false;
          }
          console.log(this.homePON, this.visitingPON, this.maxPON);


        }
      }

      if (this.homePON == 0) {

        /*---------------------------------------------------------------------------*/
        /*Bootstrap Modal shown in case PON count is Zero.*/
        /*---------------------------------------------------------------------------*/

        const initialState = {
          popupTitle: 'Error',
          popupMsg:
            'The players of note in Team ' +
            homeTeamName +
            ' can not be Zero.'
        };

        this.modalRef = this.modalService.show(
          ValidationModalComponent,
          Object.assign({}, { class: 'customModalWidth75', initialState })
        );

        return false;
      }
      else if (this.visitingPON == 0) {
        /*---------------------------------------------------------------------------*/
        /*Bootstrap Modal shown in case PON count is Zero.*/
        /*---------------------------------------------------------------------------*/
        const initialState = {
          popupTitle: 'Error',
          popupMsg:
            'The players of note in Team ' +
            visitingTeamName +
            ' can not be Zero.'
        };

        this.modalRef = this.modalService.show(
          ValidationModalComponent,
          Object.assign({}, { class: 'customModalWidth75', initialState })
        );

        return false;
      }

      console.log(this.homePON, this.visitingPON, this.maxPON);
    }

    if (this.tempSumVisitingPoint != parseInt(form.value.VTeamScore)) {
      const initialState = {
        popupTitle: 'Error',
        popupMsg:
          ' The sum of the scores of the players in Team ' +
          visitingTeamName +
          ' must be equal to the final score.'
      };

      this.modalRef = this.modalService.show(
        ValidationModalComponent,
        Object.assign({}, { class: 'customModalWidth75', initialState })
      );

      return false;
    } else if (this.tempSumHomePoint != parseInt(form.value.HTeamScore)) {
      const initialState = {
        popupTitle: 'Error',
        popupMsg:
          ' The sum of the scores of the players in Team ' +
          homeTeamName +
          ' must be equal to the final score.'
      };
      //console.log('319');
      this.modalRef = this.modalService.show(
        ValidationModalComponent,
        Object.assign({}, { class: 'customModalWidth75', initialState })
      );
      return false;
    }
    //change to true
    return true;
  }

  prepareDatatoUpdate(form: NgForm, gameListIndex: number) {
    for (
      let i = 0;
      i <
      this.officialService.reportGameJson['Value'].GameList[gameListIndex].HomeTeamPlayerScores
        .length;
      ++i
    ) {
      let point = 'HPoints' + i;
      let playername = 'HPlayerName' + i;
      let gameid = 'HGameId' + i;
      let playerseasonalId = 'HPlayerSeasonalId' + i;
      let fouldId = 'HFoulId' + i;
      let playernote = 'HPlayerNote' + i;
      let notpresent = 'HNotPresent' + i;
      let rebound = 'HRebound' + i;
      let teamid = 'HTeamId' + i;
      //let teamname = "HTeamName"+i;

      this.HomeTeamPlayerScores[i] = new APIPlayerScorePost();
      this.HomeTeamPlayerScores[i].PlayerName = form.value[playername];
      this.HomeTeamPlayerScores[i].Points = form.value[point];
      this.HomeTeamPlayerScores[i].GameId = form.value[gameid];
      this.HomeTeamPlayerScores[i].PlayerSeasonalId = form.value[playerseasonalId];
      this.HomeTeamPlayerScores[i].FoulId = form.value[fouldId];
      this.HomeTeamPlayerScores[i].PlayerNote = form.value[playernote];
      this.HomeTeamPlayerScores[i].NotPresent = form.value[notpresent];
      this.HomeTeamPlayerScores[i].Rebound = form.value[rebound];
      this.HomeTeamPlayerScores[i].TeamId = form.value[teamid];
      this.HomeTeamPlayerScores[i].TeamName = this.officialService.reportGameJson['Value'].GameList[
        gameListIndex
      ].HomeTeam;
      //this.HomeTeamPlayerScores[i].TeamName = form.value[teamname];
    }

    for (
      let i = 0;
      i <
      this.officialService.reportGameJson['Value'].GameList[gameListIndex].VisitingTeamPlayerScores
        .length;
      ++i
    ) {
      let point = 'VPoints' + i;
      let playername = 'VPlayerName' + i;
      let gameid = 'VGameId' + i;
      let playerseasonalId = 'VPlayerSeasonalId' + i;
      let fouldId = 'VFoulId' + i;
      let playernote = 'VPlayerNote' + i;
      let notpresent = 'VNotPresent' + i;
      let rebound = 'VRebound' + i;
      let teamid = 'VTeamId' + i;
      let teamname = 'VTeamName' + i;

      this.VisitingTeamPlayerScores[i] = new APIPlayerScorePost();
      this.VisitingTeamPlayerScores[i].PlayerName = form.value[playername];
      this.VisitingTeamPlayerScores[i].Points = form.value[point];
      this.VisitingTeamPlayerScores[i].GameId = form.value[gameid];
      this.VisitingTeamPlayerScores[i].PlayerSeasonalId = form.value[playerseasonalId];
      this.VisitingTeamPlayerScores[i].FoulId = form.value[fouldId];
      this.VisitingTeamPlayerScores[i].PlayerNote = form.value[playernote];
      this.VisitingTeamPlayerScores[i].NotPresent = form.value[notpresent];
      this.VisitingTeamPlayerScores[i].Rebound = form.value[rebound];
      this.VisitingTeamPlayerScores[i].TeamId = form.value[teamid];
      this.VisitingTeamPlayerScores[i].TeamName = this.officialService.reportGameJson[
        'Value'
      ].GameList[gameListIndex].VisitingTeam;
      //this.VisitingTeamPlayerScores[i].TeamName = form.value[teamname];
    }

    this.APIGamePost.Roleid = this.dss.roleId;
    this.APIGamePost.SeasonId = this.dss.seasonId;
    this.APIGamePost.OfficialSeasonId = this.dss.officialSeasonId;
    this.APIGamePost.OfficiatingPositionId = this.officialService.reportGameJson['Value'].GameList[
      gameListIndex
    ].OfficiatingPositionId;

    this.APIGamePost.IsHomeForfeit = form.value.homeForfeit;
    this.APIGamePost.IsVisitorForfeit = form.value.visitingForfeit;

    this.APIGamePost.Location = this.officialService.reportGameJson['Value'].GameList[
      gameListIndex
    ].Location;
    this.APIGamePost.Division = this.officialService.reportGameJson['Value'].GameList[
      gameListIndex
    ].Division;
    this.APIGamePost.LeagueId = this.dss.leagueId;

    this.APIGamePost.GameId = this.officialService.reportGameJson['Value'].GameList[
      gameListIndex
    ].GameId;
    this.APIGamePost.GameName = this.officialService.reportGameJson['Value'].GameList[
      gameListIndex
    ].GameName;
    this.APIGamePost.GameDate = this.officialService.reportGameJson['Value'].GameList[
      gameListIndex
    ].GameDate;
    this.APIGamePost.GameStartTime = this.officialService.reportGameJson['Value'].GameList[
      gameListIndex
    ].GameStartTime;

    this.APIGamePost.HomeTeam = this.officialService.reportGameJson['Value'].GameList[
      gameListIndex
    ].HomeTeam;
    this.APIGamePost.VisitingTeam = this.officialService.reportGameJson['Value'].GameList[
      gameListIndex
    ].VisitingTeam;
    this.APIGamePost.HomeTeamId = this.officialService.reportGameJson['Value'].GameList[
      gameListIndex
    ].HomeTeamId;
    this.APIGamePost.VisitingTeamId = this.officialService.reportGameJson['Value'].GameList[
      gameListIndex
    ].VisitingTeamId;
    //this.APIGamePost.HomeTeamScore = this.officialService.reportGameJson["Value"].GameList[gameListIndex].HomeTeamScore;
    this.APIGamePost.HomeTeamScore = form.value['HTeamScore'];
    this.APIGamePost.VisitingTeamScore = form.value['VTeamScore'];
    //this.APIGamePost.VisitingTeamScore = this.officialService.reportGameJson["Value"].GameList[gameListIndex].VisitingTeamScore;
    this.APIGamePost.HomeTeamPlayerScores = this.HomeTeamPlayerScores;
    this.APIGamePost.VisitingTeamPlayerScores = this.VisitingTeamPlayerScores;
    this.APIGamePost.ScoreSheetImages = this.ScoreSheetImages;
    this.APIGamePost.DeletedScoreSheetImages = this.DeletedScoreSheetImages;
    this.APIGamePost.IncidentReports = this.officialService.IncidentReports;
    this.APIGamePost.DeleteIncidentReport = this.DeletedIncidentReports;
    //console.log(this.APIGamePost);
    this.officialService.postReportData(this.APIGamePost).then((res) => {
      if (this.officialService.postReportMsg) {
        
        this.showModal();
      }
      if (this.officialService.serviceError) {
        this.modalRef = this.modalService.show(ErrorModalComponent);
        this.modalRef.content.closeBtnName = 'Close';
      }
     
      this.formChange = false;
      this.tempIndex = 0;
      this.deletedIndex=0;      
      this.checkBtnClick = 0;
      this.ScoreSheetImages = [];
      this.ScoreSheetImages = this.ScoreSheetImages.filter(function (el) {
            return el != null;
          });
      this.ScoreSheetImages2 = [];
      this.DeletedScoreSheet2 = [];
      this.DeletedScoreSheetImages = [];
      this.DeletedScoreSheetImages = this.DeletedScoreSheetImages.filter(function (el) {
        return el != null;
      });
      this.officialService.IncidentReports = [];
      this.officialService.ModifiedIncidents = [];
      this.officialService.NewIncidents = [];
      //console.log("Incident Reports:" + this.officialService.IncidentReports);
      this.DeletedIncidentReports = [];
      this.TempScoreSheets = [];
      this.homePON = 0;
      this.visitingPON = 0;
      this.maxPON = 0;
      //this.ScoreSheetImages
    });
  }

  /* - On clicking save button, a message is shown to the user. 
  We hide the message if the user clicks on a new panel - */
  incidentCount=0;
  panelChange($event: NgbPanelChangeEvent) {
    //this.incidentIndex = this.officialService.reportGameJson
    //console.log($event);
    if (this.checkBtnClick > 0 || this.formChange) {
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

        //console.log($e);
        if (!$e) {
          this.formChange = false;          
          this.checkBtnClick = 0;
          this.ScoreSheetImages = [];
          this.ScoreSheetImages = this.ScoreSheetImages.filter(function (el) {
            return el != null;
          });
          this.ScoreSheetImages2 = [];
          //this.DeletedScoreSheet2 = [];
          this.DeletedScoreSheetImages = [];
          this.DeletedScoreSheetImages = this.DeletedScoreSheetImages.filter(function (el) {
            return el != null;
          });
          this.officialService.IncidentReports = [];
          this.officialService.ModifiedIncidents = [];
          this.officialService.NewIncidents = [];
          this.DeletedIncidentReports = [];
          this.TempScoreSheets = []
          this.homePON = 0;
          this.visitingPON = 0;
          this.maxPON = 0;
          this.deletedIndex=0;
          this.tempIndex=0;
          this.config.closeOthers = true;
          //console.log(this.initialJson);
          //console.log(JSON.parse(this.initialJson));
          //this.officialService.reportGameJson['Value'] = JSON.parse(this.initialJson['Value']);
          this.officialService.reportGameJson = JSON.parse(this.initialJson);
          //console.log(this.officialService.reportGameJson['Value'])
          this.incidentCount = this.officialService.reportGameJson['Value'].GameList[this.tempGameIndex].IncidentReports.length;
          //this.incidentCount = 0;
        }

      })

    } else {
      let gameListId = parseInt($event.panelId);
      this.tempGameIndex = gameListId;
      //console.log(this.tempGameIndex);
      this.homePON = this.officialService.reportGameJson['Value'].GameList[gameListId].TotalHomePON;
      this.visitingPON = this.officialService.reportGameJson['Value'].GameList[gameListId].TotalVisitingPON;
      this.maxPON = this.officialService.reportGameJson['Value'].GameList[gameListId].TotalGamePON;
      this.incidentCount = this.officialService.reportGameJson['Value'].GameList[gameListId].IncidentReports.length;
      //console.log("Incident index: ", this.incidentCount);
      //console.log(this.homePON, this.visitingPON, this.maxPON);
    }

  }

  checkMinPON(form, gameListIndex: number) {
    //console.log(form.value);
    let homeTeamName = this.officialService.reportGameJson['Value'].GameList[gameListIndex]
      .HomeTeam;

    let visitingTeamName = this.officialService.reportGameJson['Value'].GameList[gameListIndex]
      .VisitingTeam;

    if (this.homePON <= 0) {
      const initialState = {
        popupTitle: 'Error',
        popupMsg: 'Players of Note in Team ' + homeTeamName + ' can not be zero.'
      };

      this.bsModalRef = this.modalService.show(
        ValidationModalComponent,
        Object.assign({}, { class: 'customModalWidth75', initialState })
      );

      return false;
    }
    if (this.visitingPON <= 0) {
      const initialState = {
        popupTitle: 'Error',
        popupMsg: 'Players of Note in Team ' + visitingTeamName + ' can not be zero.'
      };

      this.bsModalRef = this.modalService.show(
        ValidationModalComponent,
        Object.assign({}, { class: 'customModalWidth75', initialState })
      );
      return false;
    }
    // } else {
    //   for (
    //     let i = 0;
    //     i <
    //     this.officialService.reportGameJson['Value'].GameList[gameListIndex].HomeTeamPlayerScores
    //       .length;
    //     ++i
    //   ) {
    //     if (
    //       this.officialService.reportGameJson['Value'].GameList[gameListIndex].HomeTeamPlayerScores[
    //         i
    //       ].PlayerNote == true
    //     ) {
    //       this.homePON++;
    //     }

    //     if (
    //       this.officialService.reportGameJson['Value'].GameList[gameListIndex]
    //         .VisitingTeamPlayerScores[i].PlayerNote == true
    //     ) {
    //       this.visitingPON++;
    //     }
    //   }

    //   if (this.homePON <= 0) {
    //     const initialState = {
    //       popupTitle: 'Error',
    //       popupMsg: 'Players of Note in Team ' + homeTeamName + ' can not be zero.'
    //     };

    //     this.bsModalRef = this.modalService.show(
    //       ValidationModalComponent,
    //       Object.assign({}, { class: 'customModalWidth75', initialState })
    //     );
    //     return false;
    //   }
    //   if (this.visitingPON <= 0) {
    //     const initialState = {
    //       popupTitle: 'Error',
    //       popupMsg: 'Players of Note in Team ' + visitingTeamName + ' can not be zero.'
    //     };

    //     this.bsModalRef = this.modalService.show(
    //       ValidationModalComponent,
    //       Object.assign({}, { class: 'customModalWidth75', initialState })
    //     );
    //     return false;
    //   }

    return true;
  }

  /* - Function to check the number of 'Player of Note' in a particular game.
  If it exceeds 3, a validation error will be displayed. - */
  maxPON: number = 0;
  homePON: number = 0;
  visitingPON: number = 0;
  checkBtnClick = 0;
  modalRef: BsModalRef;
  tempGameIndex: number;



  checkMaxPON(e, gameIndex, teamType: string) {

    //console.log(e.target);

    if (e.target.checked && this.maxPON < 6) {
      //console.log("MaxPon Checked")
      this.maxPON++;
      if (teamType == 'home' && this.homePON <= 2) {
        this.homePON++;
        //console.log("HomePon Checked");
      }
      else if (teamType == 'visiting' && this.visitingPON <= 2) {
        //console.log("VisitingPon Checked");
        this.visitingPON++;
      }

    } else {
      this.maxPON--;
      console.log("MaxPon Unchecked");
      if (teamType == 'home') {
        this.homePON--;
        console.log("HomePon Unchecked");
      } else if (teamType == 'visiting') {
        this.visitingPON--;
        console.log("Visiting Pon Unchecked");
      }

    }

    // if (!e.target.checked && this.maxPON <= 6 && this.maxPON >= 1) {
    //   this.maxPON--;
    //   if (teamType == 'home' && this.homePON <= 3 && this.homePON >= 1) this.homePON--;
    //   else if (teamType == 'visiting' && this.visitingPON <= 3 && this.visitingPON>=1) 
    //   this.visitingPON--;
    // } else {
    //   this.maxPON--;
    //   if (teamType == 'home') {
    //     this.homePON--;
    //   } else if (teamType == 'visiting') this.visitingPON--;
    // }

    //console.log(e);
    // if (this.tempGameIndex != gameIndex && this.checkBtnClick==0) {
    //   this.maxPON = 0;
    //   this.homePON = 0;
    //   this.visitingPON = 0;
    //   this.checkBtnClick = 0;
    // }
    this.checkBtnClick++;
    // if (this.checkBtnClick == 1) {
    //   this.tempGameIndex = gameIndex;
    //   //this.checkBtnClick++;
    //   if (this.maxPON <= 6) {
    //     for (
    //       let i = 0;
    //       i <
    //       this.officialService.reportGameJson['Value'].GameList[gameIndex].HomeTeamPlayerScores
    //         .length;
    //       ++i
    //     ) {
    //       if (
    //         this.officialService.reportGameJson['Value'].GameList[gameIndex].HomeTeamPlayerScores[i]
    //           .PlayerNote == true
    //       ) {
    //         console.log('home team');
    //         console.log(i);
    //         console.log(
    //           this.officialService.reportGameJson['Value'].GameList[gameIndex].HomeTeamPlayerScores[
    //             i
    //           ].PlayerNote
    //         );
    //         this.maxPON++;
    //         this.homePON++;
    //       }
    //     }
    //   }

    //   if (this.maxPON <= 6) {
    //     for (
    //       let i = 0;
    //       i <
    //       this.officialService.reportGameJson['Value'].GameList[gameIndex].VisitingTeamPlayerScores
    //         .length;
    //       ++i
    //     ) {
    //       if (
    //         this.officialService.reportGameJson['Value'].GameList[gameIndex]
    //           .VisitingTeamPlayerScores[i].PlayerNote == true
    //       ) {
    //         console.log('visiting team');
    //         console.log(i);
    //         console.log(
    //           this.officialService.reportGameJson['Value'].GameList[gameIndex]
    //             .VisitingTeamPlayerScores[i].PlayerNote
    //         );
    //         this.maxPON++;
    //         this.visitingPON++;
    //       }
    //     }
    //   }
    // }

    // if (this.checkBtnClick > 0) {
    //   //console.log(this.checkBtnClick, this.maxPON);

    // }

    //console.log(this.homePON, this.visitingPON, this.maxPON);
  }


  onChange(e: Event) {
    //console.log(e);
  }

  formChange: boolean;

  public inputValidator(event: any) {
    this.dataChanged();
    const pattern = /^([0-9][0-9]{0,2}|1000)$/;
    if (!pattern.test(event.target.value)) {
      //console.log(event.target.value);
      event.target.value = '';
    }
  }

  showModal() {
  
    const initialState = {
      status: this.officialService.postReportStatus,
      popupTitle: this.officialService.postReportTitle,
      popupMsg: this.officialService.postReportMsg
    };

  
    this.modalRef = this.modalService.show(
      SuccessPopupComponent,
      Object.assign({}, { class: 'customModalWidth75', initialState })
    );
    this.modalRef.content.click.subscribe(($e) => {     
      if ($e) {
        this.homePON = this.officialService.reportGameJson['Value'].GameList[this.tempGameIndex].TotalHomePON;
        this.visitingPON = this.officialService.reportGameJson['Value'].GameList[this.tempGameIndex].TotalVisitingPON;
        this.maxPON = this.officialService.reportGameJson['Value'].GameList[this.tempGameIndex].TotalGamePON;
        this.incidentCount = this.officialService.reportGameJson['Value'].GameList[this.tempGameIndex].IncidentReports.length;      
      }
    })

  }


  public panelId: number;
  //uploadRequest:boolean;
  async processFile(imageInput: any, id: any) {
   
    //this.uploadRequest = true;
    this.panelId = id;
    //console.log(this.panelId);
    await this.makeImageByteArray(imageInput, id);
    //this.uploadRequest = await false;
  }

  async makeImageByteArray(imageInput: any, id: number) {
    for (var i = 0; i < imageInput.files.length; i++) {
      if (imageInput.files[i]) {
        var reader = await new FileReader();
        reader.onload = await this._handleReaderLoaded.bind(this);
        await reader.readAsBinaryString(imageInput.files[i]);
        //await console.log(this.ScoreSheetImages2);
        //await this.improviseArray(id);
      }
    }
  }

  /*-----Array to showcase images added by the user in template----*/
  TempScoreSheets: any[] = [];


  async _handleReaderLoaded(readerEvt) {
    this.dataChanged();
    var binaryString = null;
    binaryString = await readerEvt.target.result;
    //console.log(this.ScoreSheetImages);
    //console.log(this.tempIndex);
    this.ScoreSheetImages2[this.tempIndex] = await new ScoreSheetImages2();
    this.ScoreSheetImages2[this.tempIndex].ImageURL = await '';
    this.ScoreSheetImages2[this.tempIndex].NewImageByteCode = await btoa(binaryString);
    //this.ScoreSheetImages[this.tempIndex].GameIndex = this.panelId.toString();

    var source_code = await this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
      + btoa(binaryString));
    await this.TempScoreSheets.push(source_code);

    //console.log(this.TempScoreSheets);
    //console.log(this.ScoreSheetImages);

    // var source_code =
    //   'data:image/jpeg;base64,' + this.ScoreSheetImages2[this.tempIndex].NewImageByteCode;

    // var el = this.elRef.nativeElement.querySelector('#IncidentListClass_' + this.panelId);
    // var refchild = this.elRef.nativeElement.querySelector('#Incidentclass_' + this.panelId);

    // let li = this.renderer.createElement('li');
    // this.renderer.setProperty(li, 'id', 'incident_li_' + this.tempIndex);

    // let img = this.renderer.createElement('img');
    // this.renderer.setProperty(img, 'id', 'incident_img_' + this.tempIndex);
    // //this.renderer.setStyle(img, "width", "100px");
    // //this.renderer.setStyle(img, "height", "100px");
    // this.renderer.setAttribute(img, 'src', source_code);
    // this.renderer.appendChild(li, img);

    // let span = this.renderer.createElement('span');
    // this.renderer.setProperty(span, 'id', this.tempIndex);
    // this.renderer.addClass(span, 'glyphicon');
    // this.renderer.addClass(span, 'glyphicon-remove-circle');
    // this.renderer.listen(span, 'click', this.DeleteTempImage.bind(span));
    // this.renderer.appendChild(li, span);
    // this.renderer.insertBefore(el, li, refchild);
    await this.tempIndex++;
  }

  /* - Image implementation ends - */


  /*--------Delete Temp UnSaved Image--------------*/

  deleteTempImage($event: Event, tempSSIndex: number) {
    this.dataChanged();
    //console.log($event);
    //console.log(tempSSIndex);
    //console.log(this.ScoreSheetImages2);
    this.ScoreSheetImages2.splice(tempSSIndex, 1);
    this.ScoreSheetImages2 = this.ScoreSheetImages2.filter(function (el) {
      return el != null;
    });

    this.TempScoreSheets.splice(tempSSIndex,1);    
    this.TempScoreSheets = this.TempScoreSheets.filter(function (el) {
      return el != null;
    });
    //console.log(this.ScoreSheetImages);

  }

  /* - Code to Delete Image - */
  deletedIndex = 0;
  deleteImage(e: any, url: string, ssIndex: string) {
    this.dataChanged();    
    var tempId = this.elRef.nativeElement.querySelector('#' + ssIndex);
    this.renderer.setProperty(tempId, 'style', 'display:none');

    this.DeletedScoreSheet2= this.DeletedScoreSheet2.filter(function (el) {
      return el != null;
    });

    //console.log(this.DeletedScoreSheetImages);

    this.DeletedScoreSheetImages[this.deletedIndex] = new DeletedScoreSheetImages();
    this.DeletedScoreSheetImages[this.deletedIndex].ImageURL = url;
    this.DeletedScoreSheetImages[this.deletedIndex].NewImageByteCode = '';
    // this.DeletedScoreSheet2.forEach(element => {
    //   console.log(element);      
    // });
    this.deletedIndex++;
  }

  DeleteTempImage(obj: any) {

    obj.target.parentNode.remove();
  }

  /* - Code to check if Player Not Present. If the user says the Player is not present, then
  his score will be changed to zero.*/
  checkNP(e: Event, teamType: string, playerofNote: string, id: string, form: any) {
    //console.log(e.target);
    //console.log(form.value);
    for (var i = 0; i < 10; ++i) {
      let hpon = 'HPlayerNote' + i;
      let hnp = 'HNotPresent' + i;
      let vpon = 'VPlayerNote' + i;
      let vnp = 'VNotPresent' + i;
      if (form.value[hnp] && form.value[hpon] && this.homePON <= 3) {
        this.homePON--;
        this.maxPON--;
       //console.log(this.homePON, this.maxPON)
      }
      if (form.value[vpon] && form.value[vnp] && this.visitingPON <= 3) {
        this.visitingPON--;
        this.maxPON--;
        //console.log(this.visitingPON, this.maxPON)
      }
      if (form.value[hnp] == false && form.value[hpon] == false && this.homePON >= 0 && this.homePON <= 2) {
        this.homePON++;
        this.maxPON++;
        //console.log(this.homePON, this.maxPON)
      }
      if (form.value[vpon] == false && form.value[vnp] == false && this.visitingPON >= 0 && this.visitingPON <= 2) {
        this.visitingPON++;
        this.maxPON++;
        //console.log(this.visitingPON, this.maxPON)
      }

    }

    this.dataChanged();
    // var tempId = this.elRef.nativeElement.querySelector('#' + teamType + id);
    // this.renderer.setProperty(tempId, 'value', 0);

    // var tempId2 = this.elRef.nativeElement.querySelector('#' + playerofNote + id);
    // this.renderer.setProperty(tempId2, 'value', false);
    // this.renderer.setProperty(tempId2, 'checked', false);
  }


  bsModalRef: BsModalRef;
  addIncident(gameIndex) {
   
    //const config: ModalOptions = { class: 'modal-sm' };
    //this.messageService.add({severity:'success', summary:'Service Message', detail:'Via MessageService'});


  /*************************************************************************** */
  /*initialState consists of Nav Params that consist of initial value of child component.*/
  /* It is being user here whenever multiple initial values are being passed. */
  /*************************************************************************** */

    const initialState = {
      name: this.officialService.reportGameJson['Value'].GameList[gameIndex].UserName,
      gameId: this.officialService.reportGameJson['Value'].GameList[gameIndex].GameId,
      incidentTypes: this.officialService.reportGameJson['Value'].GameList[gameIndex].IncidentTypes,
      incidentSubDropDown: this.officialService.reportGameJson['Value'].GameList[gameIndex]
        .IncidentSubDropDown,
      locationId:this.officialService.reportGameJson['Value'].GameList[gameIndex].LocationId,
      locationName:this.officialService.reportGameJson['Value'].GameList[gameIndex].LocationName,
      incidentCount:this.incidentCount+this.officialService.IncidentReports.length+1
    };
    this.bsModalRef = this.modalService.show(
      NewIncidentComponent,
      Object.assign({}, { class: 'customModalWidth90', initialState })
    );


    this.bsModalRef.content.saveStatus.subscribe(($e) => {      
    /*************************************************************************** */
    /* When user submits a new incident,
    the formchange variable will be set to true */
    /*************************************************************************** */
      this.dataChanged();
    })
    //this.modalRef.content.closeBtnName = "Close";
  }

  showIncident(incidentIndex, gameIndex) {
  
  /*************************************************************************** */
  /* initialState consists of Nav Params that consist of initial value of child component.*/
  /* It is being user here whenever multiple initial values are being passed. */
  /*************************************************************************** */
    const initialState = {
      gameId: this.officialService.reportGameJson['Value'].GameList[gameIndex].GameId,
      incident: this.officialService.reportGameJson['Value'].GameList[gameIndex].IncidentReports[
        incidentIndex
      ],
      allIncidentTypes: this.officialService.reportGameJson['Value'].GameList[gameIndex]
        .IncidentTypes,
      allDependentDropdowns: this.officialService.reportGameJson['Value'].GameList[gameIndex]
        .IncidentSubDropDown,
        incidentCount: incidentIndex+1,
        locationId:this.officialService.reportGameJson['Value'].GameList[gameIndex].LocationId
    };

    this.bsModalRef = this.modalService.show(
      ShowIncidentComponent,
      Object.assign({}, { class: 'customModalWidth90', initialState })
    );

    this.bsModalRef.content.saveStatus.subscribe(($e) => {
    /*************************************************************************** */
    /* When user submits change to a pre-existing incident from Database
    the formchange variable will be set to true */
    /*************************************************************************** */
      this.dataChanged();  
       //this.officialService.reportGameJson['Value'].GameList[gameIndex].IncidentReports.splice(incidentIndex,1);       

       for(var i=0; i<this.officialService.ModifiedIncidents.length;++i ){
         if(this.officialService.ModifiedIncidents[i].GameId==this.officialService.reportGameJson['Value'].GameList[gameIndex].GameId){     
           
           this.officialService.reportGameJson['Value'].GameList[gameIndex].IncidentReports[
            incidentIndex
          ].IncidentId=this.officialService.ModifiedIncidents[i].IncidentId;
          this.officialService.reportGameJson['Value'].GameList[gameIndex].IncidentReports[
            incidentIndex
          ].IncidentType=this.officialService.ModifiedIncidents[i].IncidentType;
          this.officialService.reportGameJson['Value'].GameList[gameIndex].IncidentReports[
            incidentIndex
          ].IncidentValue=this.officialService.ModifiedIncidents[i].IncidentValue;
          this.officialService.reportGameJson['Value'].GameList[gameIndex].IncidentReports[
            incidentIndex
          ].Notes=this.officialService.ModifiedIncidents[i].Notes;
         }
       }

     
    })
  }

  setDeletedIncident() {
    return {
      GameId: null,
      IncidentId: null,
      IncidentType: null,
      IncidentValue: null,
      Notes: null
    }
  }

  DeletedIncidentReports: DeleteIncidentReport[] = [];
  //toggleDeleteClass:boolean;
  async deleteIncident(incidentIndex, gameIndex) {
    this.dataChanged();
  /*************************************************************************** */
  /* s is of 'var' dataType and used as a temp model of deleted incident due to its limited block-scope*/
  /* After setting values, it is pushed to DeletedIncidentReports */
  /*************************************************************************** */

  // var tempId = this.elRef.nativeElement.querySelector('#' +"incident" + incidentIndex);
  // this.renderer.setProperty(tempId, 'style', 'display:none');

    var s = this.setDeletedIncident();

    let reportGameJson = await this.officialService.reportGameJson['Value'];
    s['GameId'] = await reportGameJson.GameList[gameIndex].GameId;
    s['IncidentId'] = await
      reportGameJson.GameList[gameIndex].IncidentReports[incidentIndex].IncidentId;
    s['IncidentType'] = await
      reportGameJson.GameList[gameIndex].IncidentReports[incidentIndex].IncidentType;
    s['IncidentValue'] = await
      reportGameJson.GameList[gameIndex].IncidentReports[incidentIndex].IncidentValue;
    s['Notes'] = await
      reportGameJson.GameList[gameIndex].IncidentReports[incidentIndex].Notes;

    await this.DeletedIncidentReports.push(s);

    await this.officialService.reportGameJson['Value'].GameList[gameIndex].IncidentReports.splice(incidentIndex,1);
    
    this.incidentCount--;
  }

  showTempIncident(newIncidentIndex, gameIndex) {   
    
  /*************************************************************************** */
  /* initialState consists of Nav Params that consist of initial value of child component.*/
  /* It is being user here whenever multiple initial values are being passed. */
  /*************************************************************************** */

    const initialState = {
      index: newIncidentIndex,
      gameId: this.officialService.reportGameJson['Value'].GameList[gameIndex].GameId,
      incident: this.officialService.IncidentReports[newIncidentIndex],
      allIncidentTypes: this.officialService.reportGameJson['Value'].GameList[gameIndex]
        .IncidentTypes,
      allDependentDropdowns: this.officialService.reportGameJson['Value'].GameList[gameIndex]
        .IncidentSubDropDown,
        incidentCount: this.incidentCount+newIncidentIndex+1,
        locationId:this.officialService.reportGameJson['Value'].GameList[gameIndex].LocationId
    };

    this.bsModalRef = this.modalService.show(
      ShowNewIncidentComponent,
      Object.assign({}, { class: 'customModalWidth90', initialState })
    );
    
    this.bsModalRef.content.saveStatus.subscribe(($e) => {
   
    /*************************************************************************** */
    /* When user clicks save button on an Unsaved incident,
    the formchange variable will be set to true */
    /*************************************************************************** */

      this.dataChanged();
    })


  }

  deleteTempIncident(newIncidentIndex) {
    this.dataChanged();
  /*************************************************************************** */
  /* Incident Reports array in maintained in officialService. */
  /* If the user wishes to delete an unsaved incident, the array is simply popped at that index. */
  /*************************************************************************** */   
  
  for(var i=0; i<this.officialService.IncidentReports.length; ++i){
    if(this.officialService.IncidentReports[i].IncidentType==this.officialService.NewIncidents[newIncidentIndex].IncidentType){
      // console.log("Incident Reports:");
      // console.log(this.officialService.IncidentReports[i]);
      // console.log("New Incidents:");
      // console.log(this.officialService.NewIncidents[newIncidentIndex]);
      this.officialService.IncidentReports.splice(i, 1);    
      this.officialService.NewIncidents.splice(newIncidentIndex, 1); 
      // console.log("New Incidents: "+this.officialService.NewIncidents.length);
      // console.log("Incident Reports: "+this.officialService.IncidentReports.length);
    }
  }  
  }

  homeForfeitToggle($event:Event,gamelistindex){
    //console.log($event);
    console.log("Before:");
    console.log("Home Forfeit:");
    console.log(this.officialService.reportGameJson['Value'].GameList[gamelistindex].IsHomeForfeit);
    console.log("Visitor Forfeit:");
    console.log(this.officialService.reportGameJson['Value'].GameList[gamelistindex].IsVisitorForfeit);

    if($event){
      this.officialService.reportGameJson['Value'].GameList[gamelistindex].IsVisitorForfeit=!($event);
    }

    // this.officialService.reportGameJson['Value'].GameList[gamelistindex].IsVisitorForfeit=
    // !this.officialService.reportGameJson['Value'].GameList[gamelistindex].IsHomeForfeit

    console.log("After: ");
    console.log("Home Forfeit:");
    console.log(this.officialService.reportGameJson['Value'].GameList[gamelistindex].IsHomeForfeit);
    console.log("Visitor Forfeit:");
    console.log(this.officialService.reportGameJson['Value'].GameList[gamelistindex].IsVisitorForfeit);
  }

  visitorfeitToggle($event:Event,gamelistindex){
    //console.log($event);
    console.log("Before:");     
    console.log("Home Forfeit:");
    console.log(this.officialService.reportGameJson['Value'].GameList[gamelistindex].IsHomeForfeit);
    console.log("Visitor Forfeit:");
    console.log(this.officialService.reportGameJson['Value'].GameList[gamelistindex].IsVisitorForfeit);

    if($event){
      this.officialService.reportGameJson['Value'].GameList[gamelistindex].IsHomeForfeit=!($event);
    }


    // this.officialService.reportGameJson['Value'].GameList[gamelistindex].IsHomeForfeit=
    // !this.officialService.reportGameJson['Value'].GameList[gamelistindex].IsVisitorForfeit

    console.log("After: ");
    console.log("Home Forfeit:");
    console.log(this.officialService.reportGameJson['Value'].GameList[gamelistindex].IsHomeForfeit);
    console.log("Visitor Forfeit:");
    console.log(this.officialService.reportGameJson['Value'].GameList[gamelistindex].IsVisitorForfeit);
  }

  dataChanged() {
  /*************************************************************************** */
  /* This is useful to know if any data in the reportForm is changed by the user. */

  /* If the data has been changed, and user clicks on a different accordion, then user 
  will be given an option to save the data to database in the form of a bootstrap modal. 
  If the user doesn't save, all the data will be cleared and 
  formChange variable will be set to false.*/
  /*************************************************************************** */  
    this.formChange = true;
  }

  pdfUrl: string;
  downloadRequest: boolean;
  downloadPdf(url) {
  /*************************************************************************** */
  /* Download Pre-printed Scoresheet. */
  /*************************************************************************** */

    this.downloadRequest = true;
    var downLoadUrl;
    this.officialService
      .getPdfUrl(url)
      .subscribe(res => {
        console.log(res);
        console.log(res["_body"]);
        var x = JSON.parse(res["_body"]);
        downLoadUrl = x["Value"].AbsoluteUrl;
        this.downloadRequest = false;
        window.location.href = downLoadUrl;
      });
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
