import { Component, ElementRef,Renderer2,ViewChild, Injectable } from '@angular/core';
import { NgbAccordionConfig} from '@ng-bootstrap/ng-bootstrap';
import { OfficialService } from '../official.service';
import { FormBuilder, FormGroup, FormArray, NgForm } from '@angular/forms';
import { map } from 'rxjs/operators';
import { APIGamePost } from './../../models/official/reportgame/APIGamePost.model';
import { ScoreSheetImages } from './../../models/official/reportgame/ScoreSheet.model';
import { APIPlayerScorePost } from './../../models/official/reportgame/APIPlayerScorePost.model';
import { Http, Response, Headers, RequestOptions, RequestMethod,JSONPConnection } from '@angular/http';
import { LoginService } from 'src/app/login/login.service';
import { ArraySortPipe } from "./../../shared/sort.pipe";
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FinalFilter } from './../../official/select-game/finalFilter.model';



@Component({
  selector: 'app-report-game',
  templateUrl: './report-game.component.html',
  styleUrls: ['./report-game.component.css']
})


export class ReportGameComponent{
  @ViewChild("acchead1", {read: ElementRef}) 
  private acchead1: ElementRef; 
  @ViewChild("Incidentlist", {read: ElementRef}) 
  private Incidentlist: ElementRef;
  
  HomeTeamPlayerScores: APIPlayerScorePost[] = [];
  VisitingTeamPlayerScores: APIPlayerScorePost[] = [];
  ScoreSheetImages: ScoreSheetImages[] =[];
  fg: FormGroup;

  APIGamePost: APIGamePost ={
    Roleid:'',
    SeasonId:'',
    OfficialSeasonId:'',
    OfficiatingPositionId:'',
    GameId : '',
    GameName:'',
    GameDate:'',
    Location:'',
    GameStartTime:'',
    HomeTeam:'',
    VisitingTeam:'',
    HomeTeamId : '',
    VisitingTeamId:'',   
    HomeTeamScore : '',
    VisitingTeamScore : '',
    Division:'',
    LeagueId:'',
   
    HomeTeamPlayerScores : [{
      GameId: '',
      PlayerName:'',
      PlayerSeasonalId: '',
      FoulId: '',
      Points: null,
      PlayerNote: null,
      NotPresent: null,
      Rebound:'',
      TeamId:'',
      TeamName:''
    }],
    VisitingTeamPlayerScores : [{
      GameId: '',
      PlayerName:'',
      PlayerSeasonalId: '',
      FoulId: '',
      Points: null,
      PlayerNote: null,
      NotPresent: null,
      Rebound:'',
      TeamId:'',
      TeamName:''
      
    }],
    ScoreSheetImages:[{
      ImageURL:'',
      NewImageByteCode:''}]
   }

   constructor(public officialService: OfficialService, 
    public fb: FormBuilder, public loginService: LoginService,
    public elRef: ElementRef,public http: Http
    ){ 
      this.fg = this.fb.group({
      GameList: this.fb.array([])
    });
    
  }

  ngOnInit() { 
    this.officialService.requestSuccess=false;
    this.officialService.requestFailure=false;
    //this.officialService.reportGameJson=null;    
    this.asyncReport();
  }

  async asyncReport(){
    await this.officialService.getReportData(); 
 }

  onSubmit(form: NgForm, gameListIndex: number) {
    console.log(form.value);   
    //console.log(form);
    for(let i=0;i<this.officialService.reportGameJson["Value"].GameList[gameListIndex].HomeTeamPlayerScores.length; ++i){
      
      let point = "HPoints"+i;
      let playername = "HPlayerName"+i;    
      let gameid = "HGameId"  +i;
      let playerseasonalId = "HPlayerSeasonalId"+i;
      let fouldId = "HFoulId"+i;
      let playernote = "HPlayerNote"+i;
      let notpresent = "HNotPresent"+i;
      let rebound = "HRebound"+i;
      let teamid = "HTeamId"+i;
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
      this.HomeTeamPlayerScores[i].TeamName = this.officialService.reportGameJson["Value"].GameList[gameListIndex].HomeTeam;
      //this.HomeTeamPlayerScores[i].TeamName = form.value[teamname];

    }

    for(let i=0;i<this.officialService.reportGameJson["Value"].GameList[gameListIndex].VisitingTeamPlayerScores.length; ++i){
      
      let point = "VPoints"+i;
      let playername = "VPlayerName"+i;    
      let gameid = "VGameId"  +i;
      let playerseasonalId = "VPlayerSeasonalId"+i;
      let fouldId = "VFoulId"+i;
      let playernote = "VPlayerNote"+i;
      let notpresent = "VNotPresent"+i;
      let rebound = "VRebound"+i;
      let teamid = "VTeamId"+i;
      let teamname = "VTeamName"+i;

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
      this.VisitingTeamPlayerScores[i].TeamName = this.officialService.reportGameJson["Value"].GameList[gameListIndex].VisitingTeam;
      //this.VisitingTeamPlayerScores[i].TeamName = form.value[teamname];

    }

    //console.log(this.VisitingTeamPlayerScores);
    
    this.APIGamePost.Roleid = this.loginService.roleId;
    this.APIGamePost.SeasonId=this.loginService.seasonId;
    this.APIGamePost.OfficialSeasonId = this.loginService.officialSeasonId;
    this.APIGamePost.OfficiatingPositionId = this.officialService.reportGameJson["Value"].GameList[gameListIndex].OfficiatingPositionId;
    
    this.APIGamePost.Location = this.officialService.reportGameJson["Value"].GameList[gameListIndex].Location;
    this.APIGamePost.Division = this.officialService.reportGameJson["Value"].GameList[gameListIndex].Division;
    this.APIGamePost.LeagueId = this.loginService.leagueId;


    this.APIGamePost.GameId = this.officialService.reportGameJson["Value"].GameList[gameListIndex].GameId;
    this.APIGamePost.GameName= this.officialService.reportGameJson["Value"].GameList[gameListIndex].GameName;
    this.APIGamePost.GameDate = this.officialService.reportGameJson["Value"].GameList[gameListIndex].GameDate;
    this.APIGamePost.GameStartTime = this.officialService.reportGameJson["Value"].GameList[gameListIndex].GameStartTime;
    
    this.APIGamePost.HomeTeam = this.officialService.reportGameJson["Value"].GameList[gameListIndex].HomeTeam;
    this.APIGamePost.VisitingTeam = this.officialService.reportGameJson["Value"].GameList[gameListIndex].VisitingTeam;
    this.APIGamePost.HomeTeamId = this.officialService.reportGameJson["Value"].GameList[gameListIndex].HomeTeamId;
    this.APIGamePost.VisitingTeamId = this.officialService.reportGameJson["Value"].GameList[gameListIndex].VisitingTeamId;
    //this.APIGamePost.HomeTeamScore = this.officialService.reportGameJson["Value"].GameList[gameListIndex].HomeTeamScore;
    this.APIGamePost.HomeTeamScore = form.value["HTeamScore"];
    this.APIGamePost.VisitingTeamScore = form.value["VTeamScore"];
    //this.APIGamePost.VisitingTeamScore = this.officialService.reportGameJson["Value"].GameList[gameListIndex].VisitingTeamScore;
    this.APIGamePost.HomeTeamPlayerScores = this.HomeTeamPlayerScores;
    this.APIGamePost.VisitingTeamPlayerScores = this.VisitingTeamPlayerScores;
    this.APIGamePost.ScoreSheetImages = this.ScoreSheetImages;
 
    console.log(this.APIGamePost);
    this.officialService.postReportData(this.APIGamePost);
  
  }
  panelChange($event: NgbPanelChangeEvent){
    console.log($event);
    this.officialService.requestFailure=false;
    this.officialService.requestSuccess=false;
      
  }

  myFiles:File [] = [];
  base64textString;
  tempScoreSheet: ScoreSheetImages = {
    ImageURL:'',
    NewImageByteCode:''
  };

   processFile(imageInput: any) {
    this.makeImageByteArray(imageInput);       
  }

  async makeImageByteArray(imageInput:any){
    for(var i = 0; i < imageInput.files.length; i++) {     
      this.tempScoreSheet.ImageURL='';   
      this.tempScoreSheet.NewImageByteCode='';
      this.base64textString=null;
      if (imageInput.files[i]) {
        console.log(imageInput.files[i]);
        var reader = await new FileReader();         
        await reader.readAsBinaryString(imageInput.files[i]);  
        reader.onload = await this._handleReaderLoaded.bind(this);
        await this.setByteValue();                               
     
      }
    }
    //console.log(this.ScoreSheetImages);
  }


  async _handleReaderLoaded(readerEvt) {
    //console.log(readerEvt.target.result);
    this.base64textString=null;
    var binaryString=null;
    binaryString = await readerEvt.target.result;
    this.base64textString = await btoa(binaryString);
    await this.setByteValue();
    
    
   }

   async setByteValue(){ 
    if(this.base64textString!=null){
      this.tempScoreSheet.ImageURL = '';
      this.tempScoreSheet.NewImageByteCode=this.base64textString; 
      console.log(this.tempScoreSheet);
      this.ScoreSheetImages.push(this.tempScoreSheet);
      console.log(this.ScoreSheetImages);

    }

   }

}



