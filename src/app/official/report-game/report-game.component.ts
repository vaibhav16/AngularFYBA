import {
  Component,
  TemplateRef,
  ElementRef,
  Renderer2,
  ViewChild,
  Injectable,
  AfterViewInit,
  HostListener
} from "@angular/core";
import { NgbAccordionConfig } from "@ng-bootstrap/ng-bootstrap";
import { OfficialService } from "../official.service";
import { FormBuilder, FormGroup, FormArray, NgForm } from "@angular/forms";
import { APIGamePost } from "../classes/reportgame/APIGamePost.model";
import { ScoreSheetImages } from "../classes/reportgame/ScoreSheet.model";
import { DeletedScoreSheetImages } from "../classes/reportgame/DeletedScoreSheetImages";
import { APIPlayerScorePost } from "../classes/reportgame/APIPlayerScorePost.model";
import { Http } from "@angular/http";
import { LoginService } from "./../../common/services/login.service";
import { NgbPanelChangeEvent } from "@ng-bootstrap/ng-bootstrap";
import { ScoreSheetImages2 } from "./../classes/reportgame/ScoreSheet2.model";
import { DeletedScoreSheet2 } from "./../classes/reportgame/DeletedScoreSheet2.model";
//import { FinalFilter } from '../../models/official/select-game/finalFilter.model';
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
//import { Lightbox } from 'ngx-lightbox';
import { ErrorModalComponent } from './../../common/error-modal/error-modal.component';
import * as $ from "jquery";

@Component({
  selector: "app-report-game",
  templateUrl: "./report-game.component.html",
  styleUrls: ["./report-game.component.css"]
})
export class ReportGameComponent {
  @ViewChild("imgTemplate") imgTemplate: TemplateRef<any>;

  HomeTeamPlayerScores: APIPlayerScorePost[] = [];
  VisitingTeamPlayerScores: APIPlayerScorePost[] = [];
  ScoreSheetImages: ScoreSheetImages[] = [];
  ScoreSheetImages2: ScoreSheetImages2[] = [];
  DeletedScoreSheetImages: DeletedScoreSheetImages[] = [];
  DeletedScoreSheet2: DeletedScoreSheet2[] = [];
  tempIndex = 0;
  modalHeading: string;
  modalMsg: string;
  tempRemoveImage = ["shashank", "vishnu", "vaibhav", "seemant"];
  uploadTemplate: TemplateRef<any>;
  imgsrc: any;

  APIGamePost: APIGamePost = {
    Roleid: "",
    SeasonId: "",
    OfficialSeasonId: "",
    OfficiatingPositionId: "",
    GameId: "",
    GameName: "",
    GameDate: "",
    Location: "",
    GameStartTime: "",
    HomeTeam: "",
    VisitingTeam: "",
    HomeTeamId: "",
    VisitingTeamId: "",
    HomeTeamScore: "",
    VisitingTeamScore: "",
    Division: "",
    LeagueId: "",

    HomeTeamPlayerScores: [
      {
        GameId: "",
        PlayerName: "",
        PlayerSeasonalId: "",
        FoulId: "",
        Points: null,
        PlayerNote: null,
        NotPresent: null,
        Rebound: "",
        TeamId: "",
        TeamName: ""
      }
    ],
    VisitingTeamPlayerScores: [
      {
        GameId: "",
        PlayerName: "",
        PlayerSeasonalId: "",
        FoulId: "",
        Points: null,
        PlayerNote: null,
        NotPresent: null,
        Rebound: "",
        TeamId: "",
        TeamName: ""
      }
    ],
    ScoreSheetImages: [
      {
        ImageURL: "",
        NewImageByteCode: ""
      }
    ],
    DeletedScoreSheetImages: [
      {
        ImageURL: "",
        NewImageByteCode: ""
      }
    ]
  };

  //  ScoreSheetImages2: ScoreSheetImages2 = {
  //   ImageURL:'',
  //   NewImageByteCode:'',
  //   GameIndex:''
  //  }

  constructor(
    public officialService: OfficialService,
    public renderer: Renderer2,
    // private _lightbox: Lightbox,
    public fb: FormBuilder,
    public loginService: LoginService,
    public elRef: ElementRef,
    public http: Http,
    config: NgbAccordionConfig,
    private modalService: BsModalService
  ) {
    config.type = "info";
  }

  newRequest: boolean = null;
  ngOnInit() {
    this.officialService.requestSuccess = false;
    this.officialService.requestFailure = false;

    this.asyncReport();
  }

  ngAfterViewInit() {
    $(document).on("click", ".glyphicon", e => {
      var targetid = e.target.id;
      e.target.parentNode.remove();
      this.ScoreSheetImages.splice(targetid, 1);
      this.ScoreSheetImages = this.ScoreSheetImages.filter(function(el) {
        return el != null;
      });
      console.log(this.ScoreSheetImages);
    });
  }

  async asyncReport() {
    await this.officialService.getReportData().then(res => {
      if(this.officialService.serviceError){
        this.modalRef = this.modalService.show(ErrorModalComponent);
        this.modalRef.content.closeBtnName = "Close";        
      }
    });
  }

  async makeScoreSheetArray() {
    for (var i = 0; i < this.tempIndex; ++i) {
      console.log(i);
      if (this.ScoreSheetImages2[i].GameIndex == this.panelId.toString()) {
        this.ScoreSheetImages[i] = await new ScoreSheetImages();
        this.ScoreSheetImages[i].ImageURL = await "";
        this.ScoreSheetImages[i].NewImageByteCode = await this
          .ScoreSheetImages2[i].NewImageByteCode;
      }
    }
  }

  /* - When Edited Data is sent by ScoreKeeper this function is called - */
  async onSubmit(
    form: NgForm,
    gameListIndex: number,
    invalidScoreTemplate: TemplateRef<any>,
    unEqualHomeScoreTemplate: TemplateRef<any>,
    unEqualVisitingScoreTemplate: TemplateRef<any>,
    uploadTemplate: TemplateRef<any>
  ) {
    console.log(form.value);
    this.uploadTemplate = uploadTemplate;

    await this.makeScoreSheetArray().then(res => {
      this.ScoreSheetImages = this.ScoreSheetImages.filter(function(el) {
        return el != null;
      });
      console.log(this.ScoreSheetImages);
    });

    if (form.value.HTeamScore.length <= 0 && form.value.VTeamScore.length <= 0) {
      this.modalRef = this.modalService.show(invalidScoreTemplate, {
        class: "modal-sm"
      });
      console.log("Invalid");
    } else if (
      this.checkFinalScore(
        form,
        gameListIndex,
        unEqualHomeScoreTemplate,
        unEqualVisitingScoreTemplate
      ) == true
    ) {
      this.prepareDatatoUpdate(form, gameListIndex);
    }
  }

  tempSumHomePoint: number = 0;
  tempSumVisitingPoint: number = 0;
  tempHomeTeamName: string;
  tempVisitingTeamName: string;
  checkFinalScore(
    form: NgForm,
    gameListIndex: number,
    unEqualHomeScoreTemplate: TemplateRef<any>,
    unEqualVisitingScoreTemplate: TemplateRef<any>
  ) {
    this.tempSumHomePoint = 0;
    this.tempSumVisitingPoint = 0;
    if (
      this.officialService.reportGameJson["Value"].GameList[gameListIndex]
        .HomeTeamPlayerScores != null
    ) {
      this.tempHomeTeamName = this.officialService.reportGameJson[
        "Value"
      ].GameList[gameListIndex].HomeTeam;
      for (
        let i = 0;
        i <
        this.officialService.reportGameJson["Value"].GameList[gameListIndex]
          .HomeTeamPlayerScores.length;
        ++i
      ) {
        let hpoint = "HPoints" + i;
        if (form.value[hpoint] != null && parseInt(form.value[hpoint]) > 0) {
          this.tempSumHomePoint += parseInt(form.value[hpoint]);
          console.log(form.value[hpoint]);
        }
      }
    }

    if (
      this.officialService.reportGameJson["Value"].GameList[gameListIndex]
        .VisitingTeamPlayerScores != null
    ) {
      this.tempVisitingTeamName = this.officialService.reportGameJson[
        "Value"
      ].GameList[gameListIndex].VisitingTeam;
      for (
        let i = 0;
        i <
        this.officialService.reportGameJson["Value"].GameList[gameListIndex]
          .VisitingTeamPlayerScores.length;
        ++i
      ) {
        let vpoint = "VPoints" + i;
        if (form.value[vpoint] != null && parseInt(form.value[vpoint]) > 0) {
          this.tempSumVisitingPoint += parseInt(form.value[vpoint]);
          console.log(vpoint, form.value[vpoint]);
        }
      }
    }

    if (this.tempSumVisitingPoint != parseInt(form.value.VTeamScore)) {
      this.modalRef = null;
      console.log(this.tempSumVisitingPoint, form.value.VTeamScore);
      this.modalRef = this.modalService.show(unEqualVisitingScoreTemplate, {
        class: "modal-sm"
      });
      return false;
    } else if (this.tempSumHomePoint != parseInt(form.value.HTeamScore)) {
      this.modalRef = null;
      console.log(this.tempSumHomePoint, form.value.HTeamScore);
      this.modalRef = this.modalService.show(unEqualHomeScoreTemplate, {
        class: "modal-sm"
      });
      return false;
    }
    //change to true
    return true;
  }

  prepareDatatoUpdate(form: NgForm, gameListIndex: number) {
    for (
      let i = 0;
      i <
      this.officialService.reportGameJson["Value"].GameList[gameListIndex]
        .HomeTeamPlayerScores.length;
      ++i
    ) {
      let point = "HPoints" + i;
      let playername = "HPlayerName" + i;
      let gameid = "HGameId" + i;
      let playerseasonalId = "HPlayerSeasonalId" + i;
      let fouldId = "HFoulId" + i;
      let playernote = "HPlayerNote" + i;
      let notpresent = "HNotPresent" + i;
      let rebound = "HRebound" + i;
      let teamid = "HTeamId" + i;
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
      this.HomeTeamPlayerScores[
        i
      ].TeamName = this.officialService.reportGameJson["Value"].GameList[
        gameListIndex
      ].HomeTeam;
      //this.HomeTeamPlayerScores[i].TeamName = form.value[teamname];
    }

    for (
      let i = 0;
      i <
      this.officialService.reportGameJson["Value"].GameList[gameListIndex]
        .VisitingTeamPlayerScores.length;
      ++i
    ) {
      let point = "VPoints" + i;
      let playername = "VPlayerName" + i;
      let gameid = "VGameId" + i;
      let playerseasonalId = "VPlayerSeasonalId" + i;
      let fouldId = "VFoulId" + i;
      let playernote = "VPlayerNote" + i;
      let notpresent = "VNotPresent" + i;
      let rebound = "VRebound" + i;
      let teamid = "VTeamId" + i;
      let teamname = "VTeamName" + i;

      this.VisitingTeamPlayerScores[i] = new APIPlayerScorePost();
      this.VisitingTeamPlayerScores[i].PlayerName = form.value[playername];
      this.VisitingTeamPlayerScores[i].Points = form.value[point];
      this.VisitingTeamPlayerScores[i].GameId = form.value[gameid];
      this.VisitingTeamPlayerScores[i].PlayerSeasonalId =
        form.value[playerseasonalId];
      this.VisitingTeamPlayerScores[i].FoulId = form.value[fouldId];
      this.VisitingTeamPlayerScores[i].PlayerNote = form.value[playernote];
      this.VisitingTeamPlayerScores[i].NotPresent = form.value[notpresent];
      this.VisitingTeamPlayerScores[i].Rebound = form.value[rebound];
      this.VisitingTeamPlayerScores[i].TeamId = form.value[teamid];
      this.VisitingTeamPlayerScores[
        i
      ].TeamName = this.officialService.reportGameJson["Value"].GameList[
        gameListIndex
      ].VisitingTeam;
      //this.VisitingTeamPlayerScores[i].TeamName = form.value[teamname];
    }

    //console.log(this.VisitingTeamPlayerScores);

    this.APIGamePost.Roleid = this.loginService.roleId;
    this.APIGamePost.SeasonId = this.loginService.seasonId;
    this.APIGamePost.OfficialSeasonId = this.loginService.officialSeasonId;
    this.APIGamePost.OfficiatingPositionId = this.officialService.reportGameJson[
      "Value"
    ].GameList[gameListIndex].OfficiatingPositionId;

    this.APIGamePost.Location = this.officialService.reportGameJson[
      "Value"
    ].GameList[gameListIndex].Location;
    this.APIGamePost.Division = this.officialService.reportGameJson[
      "Value"
    ].GameList[gameListIndex].Division;
    this.APIGamePost.LeagueId = this.loginService.leagueId;

    this.APIGamePost.GameId = this.officialService.reportGameJson[
      "Value"
    ].GameList[gameListIndex].GameId;
    this.APIGamePost.GameName = this.officialService.reportGameJson[
      "Value"
    ].GameList[gameListIndex].GameName;
    this.APIGamePost.GameDate = this.officialService.reportGameJson[
      "Value"
    ].GameList[gameListIndex].GameDate;
    this.APIGamePost.GameStartTime = this.officialService.reportGameJson[
      "Value"
    ].GameList[gameListIndex].GameStartTime;

    this.APIGamePost.HomeTeam = this.officialService.reportGameJson[
      "Value"
    ].GameList[gameListIndex].HomeTeam;
    this.APIGamePost.VisitingTeam = this.officialService.reportGameJson[
      "Value"
    ].GameList[gameListIndex].VisitingTeam;
    this.APIGamePost.HomeTeamId = this.officialService.reportGameJson[
      "Value"
    ].GameList[gameListIndex].HomeTeamId;
    this.APIGamePost.VisitingTeamId = this.officialService.reportGameJson[
      "Value"
    ].GameList[gameListIndex].VisitingTeamId;
    //this.APIGamePost.HomeTeamScore = this.officialService.reportGameJson["Value"].GameList[gameListIndex].HomeTeamScore;
    this.APIGamePost.HomeTeamScore = form.value["HTeamScore"];
    this.APIGamePost.VisitingTeamScore = form.value["VTeamScore"];
    //this.APIGamePost.VisitingTeamScore = this.officialService.reportGameJson["Value"].GameList[gameListIndex].VisitingTeamScore;
    this.APIGamePost.HomeTeamPlayerScores = this.HomeTeamPlayerScores;
    this.APIGamePost.VisitingTeamPlayerScores = this.VisitingTeamPlayerScores;
    this.APIGamePost.ScoreSheetImages = this.ScoreSheetImages;
    this.APIGamePost.DeletedScoreSheetImages = this.DeletedScoreSheetImages;
    console.log(this.APIGamePost);
    this.officialService.postReportData(this.APIGamePost).then(res => {
      if (this.officialService.reportErrorMsg) {
        console.log(this.officialService.reportErrorMsg);
        this.showModal();
      }
      if(this.officialService.serviceError){
        this.modalRef = this.modalService.show(ErrorModalComponent);
        this.modalRef.content.closeBtnName = "Close";        
      }
      this.tempIndex = 0;
      this.ScoreSheetImages = [];
      this.ScoreSheetImages2 = [];
      //this.ScoreSheetImages
    });
  }

  /* - On clicking save button, a message is shown to the user. 
  We hide the message if the user clicks on a new panel - */
  panelChange($event: NgbPanelChangeEvent) {
    //console.log($event);
    this.officialService.requestFailure = false;
    this.officialService.requestSuccess = false;
  }

  /* - Function to check the number of 'Player of Note' in a particular game.
  If it exceeds 3, a validation error will be displayed. - */
  maxPON: number = 0;
  homePON: number = 0;
  visitingPON: number = 0;
  checkBtnClick = 0;
  modalRef: BsModalRef;
  tempGameIndex: number;
  checkMaxPON(e, gameIndex, teamType: string, template: TemplateRef<any>) {
    console.log(e);
    if (this.tempGameIndex != gameIndex) {
      this.maxPON = 0;
      this.homePON = 0;
      this.visitingPON = 0;
      this.checkBtnClick = 0;
    }
    this.checkBtnClick++;
    if (this.checkBtnClick == 1) {
      this.tempGameIndex = gameIndex;
      //this.checkBtnClick++;
      if (this.maxPON <= 6) {
        for (
          let i = 0;
          i <
          this.officialService.reportGameJson["Value"].GameList[gameIndex]
            .HomeTeamPlayerScores.length;
          ++i
        ) {
          if (
            this.officialService.reportGameJson["Value"].GameList[gameIndex]
              .HomeTeamPlayerScores[i].PlayerNote == true
          ) {
            console.log("home team");
            console.log(i);
            console.log(
              this.officialService.reportGameJson["Value"].GameList[gameIndex]
                .HomeTeamPlayerScores[i].PlayerNote
            );
            this.maxPON++;
            this.homePON++;
          }
        }
      }

      if (this.maxPON <= 6) {
        for (
          let i = 0;
          i <
          this.officialService.reportGameJson["Value"].GameList[gameIndex]
            .VisitingTeamPlayerScores.length;
          ++i
        ) {
          if (
            this.officialService.reportGameJson["Value"].GameList[gameIndex]
              .VisitingTeamPlayerScores[i].PlayerNote == true
          ) {
            console.log("visiting team");
            console.log(i);
            console.log(
              this.officialService.reportGameJson["Value"].GameList[gameIndex]
                .VisitingTeamPlayerScores[i].PlayerNote
            );
            this.maxPON++;
            this.visitingPON++;
          }
        }
      }
    }

    if (this.checkBtnClick > 1) {
      console.log(this.checkBtnClick, this.maxPON);
      if (e.target.checked && this.maxPON < 6) {
        this.maxPON++;
        if (teamType == "home" && this.homePON <= 2) this.homePON++;
        else if (teamType == "visiting" && this.visitingPON <= 2)
          this.visitingPON++;
      } else {
        this.maxPON--;
        if (teamType == "home") this.homePON--;
        else if (teamType == "visiting") this.visitingPON--;
      }
    }

    if (e.target.checked) {
      if (this.maxPON >= 6) {
        this.modalMsg =
          "Only upto Six Players of Note are allowed in a single game.";
        //this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
      } else if (this.homePON >= 3) {
        this.modalMsg =
          "Only Three Players of Note are allowed from Home Team.";
        //this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
      } else if (this.visitingPON >= 3) {
        this.modalMsg =
          "Only Three Players of Note are allowed from Visiting Team.";
        //this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
      }
    }

    console.log(this.maxPON, this.homePON, this.visitingPON);
  }

  confirm(): void {
    this.modalRef.hide();
  }

  closeInvalidScoreModal(): void {
    this.modalRef.hide();
    this.modalRef = null;
  }

  closeUnEqualHomeScoreModal(): void {
    this.modalRef.hide();
    this.modalRef = null;
  }

  closeUnEqualVisitingScoreModal(): void {
    this.modalRef.hide();
    this.modalRef = null;
  }

  public inputValidator(event: any) {
    const pattern = /^([0-9][0-9]{0,2}|1000)$/;
    if (!pattern.test(event.target.value)) {
      console.log(event.target.value);
      event.target.value = "";
    }
  }

  showModal() {
    if (this.officialService.reportErrorMsg) {
      console.log(this.officialService.reportErrorMsg);
      console.log(this.modalRef);
      this.modalRef = this.modalService.show(this.uploadTemplate, {
        class: "modal-sm"
      });
    }
  }

  hideModal() {
    this.modalRef.hide();
    this.officialService.getReportData();
  }

  public panelId: number;
  //uploadRequest:boolean;
  async processFile(imageInput: any, id: any) {
    //this.uploadRequest = true;
    this.panelId = id;
    console.log(this.panelId);
    await this.makeImageByteArray(imageInput, id);
    //this.uploadRequest = await false;
  }

//   checkExtension(photoName){
//     var allowedExtensions = ["jpg","jpeg","png","JPG","JPEG","JFIF","BMP","SVG"];
//     var fileExtension = photoName.split('.').pop();
//     if(this.isInArray(allowedExtensions, fileExtension)) {
//       return true;
//   } else {
//       return false;
//   }

//   }

//   /*- checks if word exists in array -*/
//  isInArray(array, word) {
//   return array.indexOf(word.toLowerCase()) > -1;
// }

  async makeImageByteArray(imageInput: any, id: number) {
    for (var i = 0; i < imageInput.files.length; i++) {
      if (imageInput.files[i]) {
        var reader = await new FileReader();
        reader.onload = await this._handleReaderLoaded.bind(this);
        await reader.readAsBinaryString(imageInput.files[i]);
        await console.log(this.ScoreSheetImages2);
        //await this.improviseArray(id);
      }
    }
  }

  async _handleReaderLoaded(readerEvt) {
    var binaryString = null;
    binaryString = await readerEvt.target.result;
    //console.log(this.ScoreSheetImages);
    console.log(this.tempIndex);
    this.ScoreSheetImages2[this.tempIndex] = await new ScoreSheetImages2();
    this.ScoreSheetImages2[this.tempIndex].ImageURL = await "";
    this.ScoreSheetImages2[this.tempIndex].NewImageByteCode = await btoa(
      binaryString
    );
    this.ScoreSheetImages2[this.tempIndex].GameIndex = this.panelId.toString();

    var source_code =
      "data:image/jpeg;base64," +
      this.ScoreSheetImages2[this.tempIndex].NewImageByteCode;

    var el = this.elRef.nativeElement.querySelector(
      "#IncidentListClass_" + this.panelId
    );
    var refchild = this.elRef.nativeElement.querySelector(
      "#Incidentclass_" + this.panelId
    );

    let li = this.renderer.createElement("li");
    this.renderer.setProperty(li, "id", "incident_li_" + this.tempIndex);

    let img = this.renderer.createElement("img");
    this.renderer.setProperty(img, "id", "incident_img_" + this.tempIndex);
    this.renderer.setStyle(img, "width", "100px");
    this.renderer.setStyle(img, "height", "100px");
    this.renderer.setAttribute(img, "src", source_code);
    this.renderer.appendChild(li, img);

    let span = this.renderer.createElement("span");
    this.renderer.setProperty(span, "id", this.tempIndex);
    this.renderer.addClass(span, "glyphicon");
    this.renderer.addClass(span, "glyphicon-remove-circle");
    this.renderer.listen(span, "click", this.DeleteTempImage.bind(span));
    this.renderer.appendChild(li, span);
    this.renderer.insertBefore(el, li, refchild);
    await this.tempIndex++;
  }

  // async _handleReaderLoaded(readerEvt) {
  //   var binaryString=null;
  //   binaryString = await readerEvt.target.result;
  //   this.ScoreSheetImages[this.tempIndex]= await new ScoreSheetImages();
  //   this.ScoreSheetImages[this.tempIndex].ImageURL = await '';
  //   this.ScoreSheetImages[this.tempIndex].NewImageByteCode = await btoa(binaryString);
  //   var source_code='data:image/jpeg;base64,'+this.ScoreSheetImages[this.tempIndex].NewImageByteCode;
  //   var el=this.elRef.nativeElement.querySelector('.IncidentListClass');
  //   var refchild=this.elRef.nativeElement.querySelector('.Incidentclass');
  //   let li= this.renderer.createElement('li');
  //   this.renderer.setProperty(li, 'id','incident_li_'+this.tempIndex);
  //   let img= this.renderer.createElement('img');
  //   this.renderer.setProperty(img, 'id','incident_img_'+this.tempIndex);
  //   this.renderer.setStyle(img, 'width','100px');
  //   this.renderer.setStyle(img, 'height','100px');
  //   this.renderer.setAttribute(img, 'src',source_code);
  //   this.renderer.appendChild(li, img);
  //   let span= this.renderer.createElement('span');
  //   this.renderer.setProperty(span, 'id',this.tempIndex);
  //   this.renderer.addClass(span,'glyphicon');
  //   this.renderer.addClass(span,'glyphicon-remove-circle');
  //   this.renderer.listen(span, 'click',this.DeleteTempImage.bind(span));
  //   this.renderer.appendChild(li, span);
  //   this.renderer.insertBefore(el, li,refchild);
  //   await this.tempIndex++;
  //  }
  /* - Image implementation ends - */

  /* - Code to Delete Image - */
  deletedIndex = 0;
  deleteImage(e: any, url: string, ssIndex: string) {
    console.log("delete server image");
    var tempId = this.elRef.nativeElement.querySelector("#" + ssIndex);
    this.renderer.setProperty(tempId, "style", "display:none");

    console.log(url);
    console.log(ssIndex);
    //this.DeletedScoreSheetImages
    this.DeletedScoreSheetImages[
      this.deletedIndex
    ] = new DeletedScoreSheetImages();
    this.DeletedScoreSheetImages[this.deletedIndex].ImageURL = url;
    this.DeletedScoreSheetImages[this.deletedIndex].NewImageByteCode = "";
    console.log(this.DeletedScoreSheetImages);
    this.deletedIndex++;
  }

  DeleteTempImage(obj: any) {
    obj.target.parentNode.remove();
  }

  /* - Code to check if Player no Not Present. If the user says the Player is not present, then
  his score will be changed to zero.*/
  checkNP(teamType: string, playerofNote: string, id: string) {
    var tempId = this.elRef.nativeElement.querySelector("#" + teamType + id);
    this.renderer.setProperty(tempId, "value", 0);

    var tempId2 = this.elRef.nativeElement.querySelector(
      "#" + playerofNote + id
    );
    this.renderer.setProperty(tempId2, "value", false);
    this.renderer.setProperty(tempId2, "checked", false);
  }
  async openTempImageModal(Imagesrc: string) {
    //this.imgsrc=null;
    this.imgsrc = await Imagesrc;
    if (this.imgsrc != null) {
      console.log(this.imgsrc);
      this.modalRef = this.modalService.show(this.imgTemplate, {
        class: "modal-sm"
      });
    }
  }

  public _album: Array<any> = [
    {
      src:
        "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      caption: "github",
      thumb:
        "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678110-sign-info-128.png"
    }
  ];
}
