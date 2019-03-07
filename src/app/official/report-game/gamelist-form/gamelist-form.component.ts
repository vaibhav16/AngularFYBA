import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { ScoreSheetImages } from '../../classes/reportgame/ScoreSheet.model';
import { APIGamePost } from '../../classes/reportgame/APIGamePost.model';
import { CookieService } from 'ngx-cookie-service';
import { APIPlayerScorePost } from '../../classes/reportgame/APIPlayerScorePost.model';

@Component({
  selector: 'app-gamelist-form',
  templateUrl: './gamelist-form.component.html',
  styleUrls: ['./gamelist-form.component.css']
})
export class GamelistFormComponent implements OnInit {

  @Input() gameData : APIGamePost;
  isScorekeeper:boolean;
  form: FormGroup;
  dataChanged: boolean = false;
  constructor(public fb: FormBuilder,
    private cookieService: CookieService) { }

  ngOnInit() {
    this.form = this.populateGameList(this.gameData);
    //this.populateGameList(this.gameData)
    if(this.gameData.OfficiatingPositionId=='3')
    {
      this.isScorekeeper=true;
      this.form.enable();
    }
    else
    {
      this.isScorekeeper=false;
      this.form.disable();
    }
  
  }

  ngAfterViewInit(){
    console.log(this.form.value);
    this.form.valueChanges.subscribe(()=>{
      this.dataChanged=true;
      console.log("Value Changed");


  


    })
  }
  
  populateGameList(GameList: APIGamePost): FormGroup {
    //console.log(GameList);
    const gameList = 
      this.fb.group({
        Roleid: this.cookieService.get('roleId'),
        SeasonId: this.cookieService.get('seasonId'),
        OfficialSeasonId: GameList.OfficialSeasonId,
        OfficiatingPositionId: GameList.OfficialSeasonId,
        IsHomeForfeit:GameList.IsHomeForfeit,
        IsVisitorForfeit:GameList.IsVisitorForfeit,
        GameId: GameList.GameId,
        GameName: GameList.GameName,
        GameDate: GameList.GameDate,
        Location: GameList.Location,
        GameStartTime: GameList.GameStartTime,
        HomeTeam: GameList.HomeTeam,
        VisitingTeam: GameList.VisitingTeam,
        HomeTeamId: GameList.HomeTeamId,
        VisitingTeamId: GameList.VisitingTeamId,
        HomeTeamScore: GameList.HomeTeamScore,
        VisitingTeamScore: GameList.VisitingTeamScore,
        Division: GameList.Division,
        LeagueId: this.cookieService.get('leagueId'),
        HomeTeamPlayerScores: this.patchPlayerScores(GameList.HomeTeamPlayerScores),
        VisitingTeamPlayerScores: this.patchPlayerScores(GameList.VisitingTeamPlayerScores),
        ScoreSheetImages: this.patchScoreSheets(GameList.ScoreSheetImages),
        //DeletedScoreSheetImages: this.fb.array([])
      });

    return gameList;
  }

  patchPlayerScores(PlayerScores: APIPlayerScorePost[]): FormArray {
    //console.log(PlayerScores);
    const homeTeamArray = new FormArray([]);
    for (var i in PlayerScores) {
      homeTeamArray.push(
        this.fb.group({
          GameId: PlayerScores[i]['GameId'],
          PlayerName: PlayerScores[i]['PlayerName'],
          PlayerSeasonalId: PlayerScores[i]['PlayerSeasonalId'],
          FoulId: PlayerScores[i]['FoulId'],
          Points: PlayerScores[i]['Points'],
          PlayerNote: PlayerScores[i]['PlayerNote'],
          NotPresent: PlayerScores[i]['NotPresent'],
          TeamId: PlayerScores[i]['TeamId'],
          TeamName: PlayerScores[i]['TeamName'],
          Rebound: PlayerScores[i]['Rebound']
        })
      );
    }
    return homeTeamArray;
  }

  patchScoreSheets(ScoreSheets: ScoreSheetImages[]): FormArray {
    //console.log(ScoreSheets);
    const homeTeamArray = new FormArray([]);
    for (var i in ScoreSheets) {
      homeTeamArray.push(
        this.fb.group({
          ImageURL: ScoreSheets[i]['ImageURL'],
          NewImageByteCode: ScoreSheets[i]['NewImageByteCode']      
        })
      );
    }
    return homeTeamArray;
  }

  homeForfeitToggle($event:Event){
    if($event){
      this.form.disable();
      this.form.controls['IsHomeForfeit'].enable();
      this.form.controls['IsVisitorForfeit'].enable();
      this.form.controls['IsVisitorForfeit'].setValue(false);
      // if(this.form.controls['IsHomeForfeit'].value==true)
      // this.form.disable();
 
      // if(this.form.controls['IsVisitorForfeit'].value==true)
      // this.form.disable();
    }
  }

  visitorfeitToggle($event:Event){
    if($event){
      this.form.disable();
      this.form.controls['IsVisitorForfeit'].enable();
      this.form.controls['IsHomeForfeit'].enable();    
      this.form.controls['IsHomeForfeit'].setValue(false); 
      // if(this.form.controls['IsHomeForfeit'].value==true)
      // this.form.disable();
 
      // if(this.form.controls['IsVisitorForfeit'].value==true)
      // this.form.disable();
    }
  }

  public inputValidator(event: any) {    
    const pattern = /^([0-9][0-9]{0,2}|1000)$/;
    if (!pattern.test(event.target.value)) {
      //console.log(event.target.value);
      event.target.value = '';
    }
  }

  toggleNotPresent($event:Event,index){
    if($event){
      //this.form.disable();
      this.form.controls['IsVisitorForfeit'].enable();
      this.form.controls['IsHomeForfeit'].enable();   
      var x = (<FormArray>this.form.controls['HomeTeamPlayerScores']).at(index).setValidators([]);
      console.log(x);
      (<FormArray>this.form.controls['HomeTeamPlayerScores']).at(index).setValue('')
    }
  }

  toggleHomePlayerNote($event){
    if($event){
     
    }
  }


  }


