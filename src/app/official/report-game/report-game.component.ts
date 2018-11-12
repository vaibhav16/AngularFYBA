import { Component, ElementRef,Renderer2,ViewChild, Injectable } from '@angular/core';
import { NgbAccordionConfig} from '@ng-bootstrap/ng-bootstrap';
import { OfficialService } from '../official.service';
import { FormBuilder, FormGroup, FormArray, NgForm } from '@angular/forms';
import { map } from 'rxjs/operators';
import { APIGamePost } from './../../models/official/reportgame/APIGamePost.model';
import { APIPlayerScorePost } from './../../models/official/reportgame/APIPlayerScorePost.model';
import { Http, Response, Headers, RequestOptions, RequestMethod,JSONPConnection } from '@angular/http';
import { LoginService } from 'src/app/login/login.service';


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
      TeamId:'',
      TeamName:''
      
    }]
   }

   constructor(public officialService: OfficialService, 
    public fb: FormBuilder, public loginService: LoginService,
    public elRef: ElementRef
    ){ 
      this.fg = this.fb.group({
      GameList: this.fb.array([])
    });
    
  }

  ngOnInit() { 
    console.log("report");
    this.asyncReport();
  }

  async asyncReport(){
    await this.officialService.getReportData();
    await this.setGameList();
 }

  setGameList(){
    if(this.officialService.reportGameJson!=undefined){
      let control = <FormArray>this.fg.controls.GameList;
      this.officialService.reportGameJson["Value"].GameList.forEach(x => {
        //console.log(x);
        control.push(this.fb.group({ 
          SeasonId: this.loginService.seasonId,
          OfficialSeasonId: this.loginService.officialSeasonId,
          RoleId:this.loginService.roleId,
          GameId: x.GameId,
          HomeTeamId: x.HomeTeamId,
          VisitingTeamId: x.VisitingTeamId,
          HomeTeamScore: x.HomeTeamScore,
          VisitingTeamScore: x.VisitingTeamScore,      
          HomeTeamPlayerScores: this.setHomeScores(x),
          VisitingTeamPlayerScores: this.setVisitingScores(x) }))
      })
    }
  }

  setHomeScores(x) {
    //console.log(x);
    let arr = new FormArray([])
    x.HomeTeamPlayerScores.forEach(y => {
      arr.push(this.fb.group({ 
        GameId: y.GameId,
        PlayerName: y.PlayerName,
        PlayerSeasonalId : y.PlayerSeasonalId,
        FoulId : y.FoulId,
        Points : y.Points,
        PlayerNote : y.PlayerNote,
        TeamId : y.TeamId
      }))
    })
    return arr;
  }

  setVisitingScores(x) {
    //console.log(x);
    let arr = new FormArray([])
    x.VisitingTeamPlayerScores.forEach(y => {
      arr.push(this.fb.group({ 
        GameId: y.GameId,
        PlayerName: y.PlayerName,
        PlayerSeasonalId : y.PlayerSeasonalId,
        FoulId : y.FoulId,
        Points : y.Points,
        PlayerNote : y.PlayerNote,
        TeamId : y.TeamId
      }))
    })
    return arr;
  }



  onSubmit(form: NgForm, gameListIndex: number) {
    console.log(form.value);     
    for(let i=0;i<this.officialService.reportGameJson["Value"].GameList[gameListIndex].HomeTeamPlayerScores.length; ++i){
      
      let point = "HPoints"+i;
      let playername = "HPlayerName"+i;    
      let gameid = "HGameId"  +i;
      let playerseasonalId = "HPlayerSeasonalId"+i;
      let fouldId = "HFoulId"+i;
      let playernote = "HPlayerNote"+i;
      let teamid = "HTeamId"+i;
      let teamname = "HTeamName"+i;
    
      this.HomeTeamPlayerScores[i] = new APIPlayerScorePost();
      this.HomeTeamPlayerScores[i].PlayerName = form.value[playername];
      this.HomeTeamPlayerScores[i].Points = form.value[point];
      this.HomeTeamPlayerScores[i].GameId = form.value[gameid];
      this.HomeTeamPlayerScores[i].PlayerSeasonalId = form.value[playerseasonalId];
      this.HomeTeamPlayerScores[i].FoulId = form.value[fouldId];
      this.HomeTeamPlayerScores[i].PlayerNote = form.value[playernote];
      this.HomeTeamPlayerScores[i].TeamId = form.value[teamid];
      this.HomeTeamPlayerScores[i].TeamName = form.value[teamname];

    }

    for(let i=0;i<this.officialService.reportGameJson["Value"].GameList[gameListIndex].VisitingTeamPlayerScores.length; ++i){
      
      let point = "VPoints"+i;
      let playername = "VPlayerName"+i;    
      let gameid = "VGameId"  +i;
      let playerseasonalId = "VPlayerSeasonalId"+i;
      let fouldId = "VFoulId"+i;
      let playernote = "VPlayerNote"+i;
      let teamid = "VTeamId"+i;
      let teamname = "VTeamName"+i;

      this.VisitingTeamPlayerScores[i] = new APIPlayerScorePost();
      this.VisitingTeamPlayerScores[i].PlayerName = form.value[playername];
      this.VisitingTeamPlayerScores[i].Points = form.value[point];
      this.VisitingTeamPlayerScores[i].GameId = form.value[gameid];
      this.VisitingTeamPlayerScores[i].PlayerSeasonalId = form.value[playerseasonalId];
      this.VisitingTeamPlayerScores[i].FoulId = form.value[fouldId];
      this.VisitingTeamPlayerScores[i].PlayerNote = form.value[playernote];
      this.VisitingTeamPlayerScores[i].TeamId = form.value[teamid];
      this.VisitingTeamPlayerScores[i].TeamName = form.value[teamname];

    }

    console.log(this.VisitingTeamPlayerScores);
    
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
    this.APIGamePost.HomeTeamScore = this.officialService.reportGameJson["Value"].GameList[gameListIndex].HomeTeamScore;
    this.APIGamePost.VisitingTeamScore = this.officialService.reportGameJson["Value"].GameList[gameListIndex].VisitingTeamScore;
    this.APIGamePost.HomeTeamPlayerScores = this.HomeTeamPlayerScores;
    this.APIGamePost.VisitingTeamPlayerScores = this.VisitingTeamPlayerScores;
 
    console.log(this.APIGamePost);
    this.officialService.postReportData(this.APIGamePost);

    if (this.fg.valid) {
      //console.log("Form Submitted!");
      //console.log(this.fg.value);
      
      //console.log(JSON.stringify(this.fg.value));
      //this.myForm.reset();
    }
  }


}



