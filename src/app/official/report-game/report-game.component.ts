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
  styles: [`.incidentimg {
    float: left,
    width: 100px,
    margin-left: 20px,
    height: 100px,
    background: #999999,
    text-align: center,
    line-height: 100px,
    color: #ffffff,
    position: relative,
    border: 3px solid #3c98db;

  }`]
})
export class ReportGameComponent {
  @ViewChild("acchead1", {read: ElementRef}) 
  private acchead1: ElementRef; 
  @ViewChild("Incidentlist", {read: ElementRef}) 
  private Incidentlist: ElementRef;
  
  gameListIndex: number = null;

  APIGamePost: APIGamePost ={
    Roleid:'',
    SeasonId:'',
    OfficialSeasonId:'',
    GameId : '',
    HomeTeamId : '',
    VisitingTeamId : '',
    HomeTeamScore : '',
    VisitingTeamScore : '',
    HomeTeamPlayerScores : '',
    VisitingTeamPlayerScores : ''
   }
  


 fg: FormGroup;
 //testJson;
  
  //playername = ['Bobby Brady', 'Greg Brady', 'Mike Brady'];
  constructor(public officialService: OfficialService, 
    public fb: FormBuilder, public loginService: LoginService,
    public elRef: ElementRef
    ) { 
    this.fg = this.fb.group({
      GameList: this.fb.array([])
    })

    //this.setGameList();
    
  }
  
  x;
  signValue;

  ngOnInit() { 
    console.log("report");
    this.asyncReport();
  
    
    //console.log("gamelist");
    //this.asyncGameList();
    
  }

  async asyncReport(){
    this.x = await this.officialService.getReportData();
    this.x = await this.setGameList();
  
    //var q = await this.setGameList();
 }

 HomeTeamPlayerScores: APIPlayerScorePost[] = [];
 VisitingTeamPlayerScores: APIPlayerScorePost[] = [];

  setGameList(){

    if(this.officialService.reportGameJson!=undefined){
      //console.log(this.officialService.reportGameJson);

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






  onSubmit(form: NgForm) {
    console.log(form.value.gameListIndex);
    //console.log(form.value["HomeTeamPlayerScores[1].PlayerName"]);
    for(let i=0;i<this.officialService.reportGameJson["Value"].GameList[0].HomeTeamPlayerScores.length; ++i){
      
      let point = "HPoints"+i;
      let playername = "HPlayerName"+i;    
      let gameid = "HGameId"  +i;
      let playerseasonId = "HPlayerSeasonId"+i;
      let fouldId = "HFoulId"+i;
      let playernote = "HPlayerNote"+i;
      let teamid = "HTeamId"+i;
      //console.log(form.value[point]);
      //console.log(form.value[playername]);
    
      this.HomeTeamPlayerScores[i] = new APIPlayerScorePost();
      this.HomeTeamPlayerScores[i].PlayerName = form.value[playername];
      this.HomeTeamPlayerScores[i].Points = form.value[point];
      this.HomeTeamPlayerScores[i].GameId = form.value[gameid];
      this.HomeTeamPlayerScores[i].PlayerSeasonalId = form.value[playername];
      this.HomeTeamPlayerScores[i].FoulId = form.value[playernote];
      this.HomeTeamPlayerScores[i].PlayerNote = form.value[playernote];
      this.HomeTeamPlayerScores[i].TeamId = form.value[teamid];

      //this.HomeTeamPlayerScores.push(this.test);
      

    }

    for(let i=0;i<this.officialService.reportGameJson["Value"].GameList[0].VisitingTeamPlayerScores.length; ++i){
      
      let point = "VPoints"+i;
      let playername = "VPlayerName"+i;    
      let gameid = "VGameId"  +i;
      let playerseasonId = "VPlayerSeasonId"+i;
      let fouldId = "VFoulId"+i;
      let playernote = "VPlayerNote"+i;
      let teamid = "VTeamId"+i;
      //console.log(form.value[point]);
      //console.log(form.value[playername]);
    
      this.VisitingTeamPlayerScores[i] = new APIPlayerScorePost();
      this.VisitingTeamPlayerScores[i].PlayerName = form.value[playername];
      this.VisitingTeamPlayerScores[i].Points = form.value[point];
      this.VisitingTeamPlayerScores[i].GameId = form.value[gameid];
      this.VisitingTeamPlayerScores[i].PlayerSeasonalId = form.value[playername];
      this.VisitingTeamPlayerScores[i].FoulId = form.value[playernote];
      this.VisitingTeamPlayerScores[i].PlayerNote = form.value[playernote];
      this.VisitingTeamPlayerScores[i].TeamId = form.value[teamid];

      //this.HomeTeamPlayerScores.push(this.test);
      

    }

    console.log(this.VisitingTeamPlayerScores);
    
    this.APIGamePost.Roleid = this.loginService.roleId;
    this.APIGamePost.SeasonId=this.loginService.seasonId;
    this.APIGamePost.OfficialSeasonId = this.loginService.officialSeasonId;
    this.APIGamePost.GameId = this.officialService.reportGameJson["Value"].GameList[0].GameId;
    this.APIGamePost.HomeTeamId = this.officialService.reportGameJson["Value"].GameList[0].HomeTeamId;
    this.APIGamePost.VisitingTeamId = this.officialService.reportGameJson["Value"].GameList[0].VisitingTeamId;
    this.APIGamePost.HomeTeamScore = this.officialService.reportGameJson["Value"].GameList[0].HomeTeamScore;
    this.APIGamePost.VisitingTeamScore = this.officialService.reportGameJson["Value"].GameList[0].VisitingTeamScore;
    this.APIGamePost.HomeTeamPlayerScores = JSON.stringify(this.HomeTeamPlayerScores);
    this.APIGamePost.VisitingTeamPlayerScores = JSON.stringify(this.VisitingTeamPlayerScores);
 
    console.log(this.APIGamePost);
    //console.log(this.officialService.reportGameJson["Value"].GameList[0].HomeTeamPlayerScores.length);
    //this.signValue = this.elRef.nativeElement.querySelector('#SeasonId');
    //console.log(this.loginService.seasonId);
    //console.log(this.elRef.nativeElement.querySelector('#SeasonId'));

    if (this.fg.valid) {
      //console.log("Form Submitted!");
      //console.log(this.fg.value);
      
      //console.log(JSON.stringify(this.fg.value));
      //this.myForm.reset();
    }
  }


  


}



