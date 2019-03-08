import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder,FormControl,Validator,Validators } from '@angular/forms';
import { ScoreSheetImages } from '../../classes/reportgame/ScoreSheet.model';
import { APIGamePost } from '../../classes/reportgame/APIGamePost.model';
import { CookieService } from 'ngx-cookie-service';
import { APIPlayerScorePost } from '../../classes/reportgame/APIPlayerScorePost.model';
import { DISABLED } from '@angular/forms/src/model';

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
      //console.log("Value Changed");


  


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
          PlayerName: (PlayerScores[i]['PlayerName']),
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

  homeForfeitToggle($event:any){
    if($event.currentTarget.checked){ 
      //this.form.reset();
      this.form.disable();
      this.form.controls['IsHomeForfeit'].enable();
      //this.form.controls['IsHomeForfeit'].setValue(true);
      this.form.controls['IsVisitorForfeit'].enable();
      this.form.controls['IsVisitorForfeit'].setValue(false);
    }
    else{
      this.form.enable();
      this.form.controls['IsHomeForfeit'].enable();
      this.form.controls['IsVisitorForfeit'].enable();
    }
  }

  visitorfeitToggle($event:any){
    if($event.currentTarget.checked){ 
      //this.form.reset();
      this.form.disable();
      this.form.controls['IsVisitorForfeit'].enable();
      //this.form.controls['IsVisitorForfeit'].setValue(true);
      this.form.controls['IsHomeForfeit'].enable();    
      this.form.controls['IsHomeForfeit'].setValue(false); 
    }
    else{
      this.form.enable();
      this.form.controls['IsHomeForfeit'].enable();
      this.form.controls['IsVisitorForfeit'].enable();
    }
  }

  public inputValidator(event: any) {    
    const pattern = /^([0-9][0-9]{0,2}|1000)$/;
    if (!pattern.test(event.target.value)) {
      //console.log(event.target.value);
      event.target.value = '';
    }
  }

  toggleHomeNotPresent($event:any,index){
    //console.log($event);
    if($event.currentTarget.checked){ 
      //(<FormArray>this.form.controls['HomeTeamPlayerScores']).at(index).disable();
      (<FormArray>this.form.get('HomeTeamPlayerScores'))
      .controls
      .forEach(group => {       
        //console.log(group.value);
        let control = group.get('NotPresent') as FormControl;
        let playerNoteControl = group.get('PlayerNote') as FormControl;
        //console.log(control.value);
        if(control.value){
          group.disable();
          control.enable();
          playerNoteControl.setValue(false);
        }
      })

    }

    else{
      console.log("Not Checked");
      (<FormArray>this.form.get('HomeTeamPlayerScores'))
      .controls
      .forEach(group => {             
        let control = group.get('NotPresent') as FormControl;
        let nameControl = group.get('PlayerName') as FormControl;
       
        //console.log(control.value);
        if(!control.value){        
          group.enable();
          nameControl.disable();     
          
        }
      })
    }
  }

  toggleVisitingNotPresent($event:any,index){
    //console.log($event);
    if($event.currentTarget.checked){ 
      //(<FormArray>this.form.controls['HomeTeamPlayerScores']).at(index).disable();
      (<FormArray>this.form.get('VisitingTeamPlayerScores'))
      .controls
      .forEach(group => {       
        //console.log(group.value);
        let control = group.get('NotPresent') as FormControl;
        let playerNoteControl = group.get('PlayerNote') as FormControl;
        //console.log(control.value);
        if(control.value){
          group.disable();
          control.enable();
          playerNoteControl.setValue(false);
        }
      })

    }

    else{
      console.log("Not Checked");
      (<FormArray>this.form.get('VisitingTeamPlayerScores'))
      .controls
      .forEach(group => {       
        //console.log(group.value);
        let control = group.get('NotPresent') as FormControl;
        let nameControl = group.get('PlayerName') as FormControl;
        //console.log(control.value);
        if(!control.value){        
          group.enable();
          nameControl.disable();         
        }
      })
    }
  }


  homePON:number=0;
  toggleHomePlayerNote($event:any){
    if($event.currentTarget.checked){ 
     this.homePON++;
    }
    else{
      this.homePON--;
    }

    if(this.homePON>=3){
      console.log("Home Player Note is equal to three")
    }

    else if(this.homePON<=0){
      console.log("Home Player Note is equal to zero");
    }
  }

  visitingPON:number=0;
  toggleVisitingPlayerNote($event: any){
    if($event.currentTarget.checked){
      this.visitingPON++;
    }
    else{
      this.visitingPON--;
    }
    if(this.visitingPON>=3){
      console.log("Visiting Player Note greater than three.");
    }
    else if(this.visitingPON==0){
      console.log("Visiting Player Note equal to zero.");
    }
  }

  onSubmit(gameForm){
    console.log(gameForm);
  }

  }


