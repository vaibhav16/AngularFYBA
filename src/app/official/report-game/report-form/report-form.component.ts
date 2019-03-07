import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { ScoreSheetImages } from '../../classes/reportgame/ScoreSheet.model';
import { APIGamePost } from '../../classes/reportgame/APIGamePost.model';
import { CookieService } from 'ngx-cookie-service';
import { APIPlayerScorePost } from '../../classes/reportgame/APIPlayerScorePost.model';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})
export class ReportFormComponent implements OnInit {

  @Input() reportData: JSON;
  reportGameForm: FormGroup;
  constructor(public fb: FormBuilder,
    private cookieService: CookieService) { }

  ngOnInit() {
    this.reportGameForm = this.fb.group({
      GameList: this.fb.array([
      ])
    });

    this.populateReportForm();
  
  }

  // ngAfterViewInit(){
  //   console.log(this.reportGameForm.value);
  // }

  populateReportForm() {
    //this.reportGameForm.setControl('GameList', this.populateGameList(this.reportSection.Value));
    const GameListcontrol = <FormArray>this.reportGameForm.get('GameList');
    for (var i = 0; i < this.reportData['GameList'].length; ++i) {
      GameListcontrol.push(this.populateGameList(this.reportData['GameList'][i]));
    }
    console.log(this.reportGameForm.value);
  }

  populateGameList(GameList: APIGamePost): FormArray {
   // console.log(GameList);
    const gameList = new FormArray([
      this.fb.group({
        Roleid: this.cookieService.get('roleId'),
        SeasonId: this.cookieService.get('seasonId'),
        OfficialSeasonId: GameList.OfficialSeasonId,
        OfficiatingPositionId: GameList.OfficialSeasonId,
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
      })
    ]);

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

  }


