import { Component, OnInit, Input,  ElementRef, Renderer2 } from '@angular/core';
import { FormGroup, FormArray, FormBuilder,FormControl,Validator,Validators } from '@angular/forms';
import { ScoreSheetImages } from '../../classes/reportgame/ScoreSheet.model';
import { APIGamePost } from '../../classes/reportgame/APIGamePost.model';
import { CookieService } from 'ngx-cookie-service';
import { DomSanitizer } from '@angular/platform-browser';
import { APIPlayerScorePost } from '../../classes/reportgame/APIPlayerScorePost.model';
import { IncidentReports } from './../../classes/reportgame/Incident.model';

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
    public elRef: ElementRef,
    public renderer: Renderer2,
    private cookieService: CookieService,
    private _sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.form = this.populateGameList(this.gameData);
    //this.populateGameList(this.gameData)
    if(this.gameData.OfficiatingPositionId=='3')
    {
      this.isScorekeeper=true;
      this.form.enable();
      this.disablePointsAndPON();
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

  disablePointsAndPON(){
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
    });

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
    });

    
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
        //ScoreSheetImages: this.patchScoreSheets(GameList.ScoreSheetImages),
        ScoreSheetImages: this.fb.array([]),
        DeletedScoreSheetImages: this.fb.array([]),
        IncidentReports:this.fb.array([]),
        //IncidentReports:this.patchIncidentReports(GameList.IncidentReports),
        DeleteIncidentReport:this.fb.array([])
      });

    return gameList;
  }

  patchPlayerScores(PlayerScores: APIPlayerScorePost[]): FormArray {
    //console.log(PlayerScores);
    const homeTeamArray = new FormArray([]);
    for (var i in PlayerScores) {
      if(PlayerScores[i]['NotPresent']==true){
        homeTeamArray.push(
          this.fb.group({
            GameId: PlayerScores[i]['GameId'],
            PlayerName: PlayerScores[i]['PlayerName'],
            PlayerSeasonalId: PlayerScores[i]['PlayerSeasonalId'],
            FoulId: PlayerScores[i]['FoulId'],
            Points: this.fb.control({value: 0, disabled: true}),
            PlayerNote:this.fb.control({value: false, disabled: true}),
            NotPresent: PlayerScores[i]['NotPresent'],
            TeamId: PlayerScores[i]['TeamId'],
            TeamName: PlayerScores[i]['TeamName'],
            Rebound: PlayerScores[i]['Rebound']
          })
        );
      }
      else{
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


  patchIncidentReports(Incidents: IncidentReports[]): FormArray {
    const arr = new FormArray([]);
    for (var i in Incidents) {
      arr.push(
        this.fb.group({
          IncidentId: Incidents[i]['IncidentId'],
          GameId: Incidents[i]['GameId'],
          IncidentType: Incidents[i]['IncidentType'],
          IncidentValue: Incidents[i]['IncidentValue'],
          Notes: Incidents[i]['Notes']           
        })
      );
    }
    console.log(arr);
    return arr;
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
    if($event.currentTarget.checked){ 
      //(<FormArray>this.form.controls['HomeTeamPlayerScores']).at(index).disable();
      (<FormArray>this.form.get('HomeTeamPlayerScores'))
      .controls
      .forEach(group => {       
        let control = group.get('NotPresent') as FormControl;
        let playerNoteControl = group.get('PlayerNote') as FormControl;
        let pointsControl = group.get('Points') as FormControl;
        if(control.value){
          group.disable();
          control.enable();
          playerNoteControl.setValue(false);
          pointsControl.setValue(0);
        }
      })

    }

    else{
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
    if($event.currentTarget.checked){ 
      //(<FormArray>this.form.controls['HomeTeamPlayerScores']).at(index).disable();
      (<FormArray>this.form.get('VisitingTeamPlayerScores'))
      .controls
      .forEach(group => {       
        let control = group.get('NotPresent') as FormControl;
        let playerNoteControl = group.get('PlayerNote') as FormControl;
        let pointsControl = group.get('Points') as FormControl;
        if(control.value){
          group.disable();
          control.enable();
          playerNoteControl.setValue(false);
          pointsControl.setValue(0);
        }
      })

    }

    else{
      (<FormArray>this.form.get('VisitingTeamPlayerScores'))
      .controls
      .forEach(group => {       
        let control = group.get('NotPresent') as FormControl;
        let nameControl = group.get('PlayerName') as FormControl;
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


  async addImage(imageInput: any) {
    console.log(imageInput);
    await this.makeImageByteArray(imageInput);
  }

  async makeImageByteArray(imageInput: any) {
    //console.log(imageInput);
    for (var i = 0; i < imageInput.files.length; i++) {
      if (imageInput.files[i]) {
        var reader = await new FileReader();
        reader.onload = await this._handleReaderLoaded.bind(this);
        await reader.readAsBinaryString(imageInput.files[i]);
      }
    }
  }

  /*-----Array to showcase images added by the user in template----*/
  TempScoreSheets: any[] = [];

  async _handleReaderLoaded(readerEvt) {
    var binaryString = null;
    binaryString = await readerEvt.target.result;

    const homeTeamArray = (<FormArray>this.form.controls['ScoreSheetImages']);
    
      homeTeamArray.push(
        this.fb.group({
          ImageURL: await '',
          NewImageByteCode: await btoa(binaryString)     
        })
      );

      var source_code = await this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
      + btoa(binaryString));
    
      await this.TempScoreSheets.push(source_code);
    
    //await this.tempIndex++;
  }

  /* - Image implementation ends - */

  deleteImage(index){
    console.log(index);
    (<FormArray>this.form.controls['ScoreSheetImages']).removeAt(index);

    this.TempScoreSheets.splice(index,1);    
    this.TempScoreSheets = this.TempScoreSheets.filter(function (el) {
      return el != null;
    });
  }

  async deleteSavedImage(e: any, url: string, ssIndex: string) {
    
    var tempId = this.elRef.nativeElement.querySelector('#' + ssIndex);
    this.renderer.setProperty(tempId, 'style', 'display:none');

    const deleteImageArray = (<FormArray>this.form.controls['DeletedScoreSheetImages']);
    
    deleteImageArray.push(
      this.fb.group({
        ImageURL: await url,
        NewImageByteCode: await ''     
      })
    );
   
  }


  onSubmit(gameForm){
    console.log(gameForm);
  }

  }


