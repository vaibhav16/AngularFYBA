import { Component, OnInit, Input, ElementRef, Renderer2 } from '@angular/core';
import {FormGroup,FormArray,FormBuilder,FormControl,Validator,Validators } from '@angular/forms';
import { ScoreSheetImages } from '../../classes/reportgame/ScoreSheet.model';
import { DeletedScoreSheetImages } from './../../classes/reportgame/DeletedScoreSheetImages';
import { APIGamePost, DeleteIncidentReport } from '../../classes/reportgame/APIGamePost.model';
import { IndividualGame } from './../../classes/reportgame/IndividualGame.model';
import { CookieService } from 'ngx-cookie-service';
import { DomSanitizer } from '@angular/platform-browser';
import { APIPlayerScorePost } from '../../classes/reportgame/APIPlayerScorePost.model';
import { IncidentReports } from './../../classes/reportgame/Incident.model';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NewIncidentComponent } from './../new-incident/new-incident.component';
import { ShowIncidentComponent } from './../show-incident/show-incident.component';
import { ShowNewIncidentComponent } from './../show-new-incident/show-new-incident.component';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { OfficialService } from './../../official.service';
import { ValidationModalComponent } from './../validation-modal/validation-modal.component';
import { ErrorModalComponent } from './../../../common/error-modal/error-modal.component';
import { SuccessPopupComponent } from './../success-popup/success-popup.component';
import { PlatformLocation } from '@angular/common';
import { DataSharingService } from './../../../data-sharing.service';

@Component({
  selector: 'app-gamelist-form',
  templateUrl: './gamelist-form.component.html',
  styleUrls: ['./gamelist-form.component.css']
})
export class GamelistFormComponent implements OnInit {
  @Input() gameData: IndividualGame;
  @Input() gameIndex: number;
  isScorekeeper: boolean;
  form: FormGroup;
  dataChanged: boolean = false;
  incidentCount: number = 0;
  homePON: number = 0;
  visitingPON: number = 0;
  finalHomeScore: number = 0;
  finalVisitingScore: number = 0;

  constructor(
    public fb: FormBuilder,
    public elRef: ElementRef,
    public renderer: Renderer2,
    private cookieService: CookieService,
    private _sanitizer: DomSanitizer,
    private modalService: BsModalService,
    public officialService: OfficialService,
    public dss: DataSharingService,
    public location: PlatformLocation
  ) {
    this.dss.isBackButtonClicked = false;
  }

  ngOnInit() {
    this.officialService.dataChanged = false;
    console.log(this.gameData);
    this.incidentCount = this.gameData.IncidentReports.length;
    this.finalHomeScore = parseInt(this.gameData.HomeTeamScore);
    this.finalVisitingScore = parseInt(this.gameData.VisitingTeamScore);
    this.form = this.populateGameList(this.gameData);
    if (this.gameData.OfficiatingPositionId == '3') {
      this.isScorekeeper = true;
      this.form.enable();
      this.homePON = this.gameData.TotalHomePON;
      this.visitingPON = this.gameData.TotalVisitingPON;
      this.disablePointsAndPON();
      if (this.homePON >= 3 || this.visitingPON >= 3) this.disablePONCheckboxes();

      if (this.gameData.IsHomeForfeit || this.gameData.IsVisitorForfeit) {
        this.form.disable();
        this.form.controls['IsHomeForfeit'].enable();
        this.form.controls['IsVisitorForfeit'].enable();
      }
      //this.setInitialPON();
    } else {
      this.isScorekeeper = false;
      this.form.disable();
    }

    //console.log(this.form.value);
  }

  ngAfterViewChecked() {
    //console.log(this.form);
  }

  get reportGameData() {
    return this.officialService.reportGameJson;
  }

  ngAfterViewInit() {
    this.location.onPopState(() => {
      //Hides the bsModal incase the back button is pressed by user
      if (this.bsModalRef['content'].gameId) {
        console.log(this.bsModalRef['content']);
        this.bsModalRef.hide();
        console.log('back button clicked');
        this.dss.isBackButtonClicked = true;
        this.bsModalRef = null;
        return false;
      }
    });

    this.form.valueChanges.subscribe(() => {
      this.officialService.dataChanged = true;
    });

    this.form.controls.HomeTeamPlayerScores.valueChanges.subscribe((change) => {
      const calculateAmount = (HomeTeamPlayerScores: any[]): number => {
        return HomeTeamPlayerScores.reduce((acc, current) => {
          // also handling case when a new pay off is added with amount of null
          return acc + parseFloat(current.Points || 0);
        }, 0);
      };
      this.finalHomeScore = calculateAmount(this.form.controls.HomeTeamPlayerScores.value);
      //console.log(calculateAmount(this.form.controls.HomeTeamPlayerScores.value));
    });

    this.form.controls.VisitingTeamPlayerScores.valueChanges.subscribe((change) => {
      const calculateAmount = (VisitingTeamPlayerScores: any[]): number => {
        return VisitingTeamPlayerScores.reduce((acc, current) => {
          // also handling case when a new pay off is added with amount of null
          return acc + parseFloat(current.Points || 0);
        }, 0);
      };
      this.finalVisitingScore = calculateAmount(this.form.controls.VisitingTeamPlayerScores.value);
    });
  }

  disablePointsAndPON() {
    (<FormArray>this.form.get('HomeTeamPlayerScores')).controls.forEach((group) => {
      //console.log(group.value);
      let control = group.get('NotPresent') as FormControl;
      let playerNoteControl = group.get('PlayerNote') as FormControl;
      //console.log(control.value);
      if (control.value) {
        group.disable();
        control.enable();
        playerNoteControl.setValue(false);
      }

      // if (playerNoteControl.value) {
      //   this.homePON++;
      // }
    });

    (<FormArray>this.form.get('VisitingTeamPlayerScores')).controls.forEach((group) => {
      //console.log(group.value);
      let control = group.get('NotPresent') as FormControl;
      let playerNoteControl = group.get('PlayerNote') as FormControl;
      //console.log(control.value);
      if (control.value) {
        group.disable();
        control.enable();
        playerNoteControl.setValue(false);
      }
      // if (playerNoteControl.value) {
      //   this.visitingPON++;
      // }
    });
  }

  disablePONCheckboxes() {
    if (this.homePON >= 3) {
      (<FormArray>this.form.get('HomeTeamPlayerScores')).controls.forEach((group) => {
        let playerNoteControl = group.get('PlayerNote') as FormControl;

        if (!playerNoteControl.value) {
          playerNoteControl.disable();
        }
      });
    }

    if (this.visitingPON >= 3) {
      (<FormArray>this.form.get('VisitingTeamPlayerScores')).controls.forEach((group) => {
        let playerNoteControl = group.get('PlayerNote') as FormControl;

        if (!playerNoteControl.value) {
          playerNoteControl.disable();
        }
      });
    }
  }

  populateGameList(GameList: APIGamePost): FormGroup {
    //console.log(GameList);
    const gameList = this.fb.group({
      Roleid: this.cookieService.get('roleId'),
      SeasonId: this.cookieService.get('seasonId'),
      OfficialSeasonId: GameList.OfficialSeasonId,
      OfficiatingPositionId: GameList.OfficialSeasonId,
      IsHomeForfeit: GameList.IsHomeForfeit,
      IsVisitorForfeit: GameList.IsVisitorForfeit,
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
      IncidentReports: this.fb.array([]),
      //IncidentReports:this.patchIncidentReports(GameList.IncidentReports),
      DeleteIncidentReport: this.fb.array([])
    });

    return gameList;
  }

  patchPlayerScores(PlayerScores: APIPlayerScorePost[]): FormArray {
    //console.log(PlayerScores);
    const homeTeamArray = new FormArray([]);
    for (var i in PlayerScores) {
      if (PlayerScores[i]['NotPresent'] == true) {
        homeTeamArray.push(
          this.fb.group({
            JersyNumber: PlayerScores[i]['JersyNumber'],
            GameId: PlayerScores[i]['GameId'],
            PlayerName: PlayerScores[i]['PlayerName'],
            PlayerSeasonalId: PlayerScores[i]['PlayerSeasonalId'],
            FoulId: PlayerScores[i]['FoulId'],
            Points: this.fb.control({ value: 0, disabled: true }),
            PlayerNote: this.fb.control({ value: false, disabled: true }),
            NotPresent: PlayerScores[i]['NotPresent'],
            TeamId: PlayerScores[i]['TeamId'],
            TeamName: PlayerScores[i]['TeamName'],
            Rebound: PlayerScores[i]['Rebound']
          })
        );
      } else {
        homeTeamArray.push(
          this.fb.group({
            JersyNumber: PlayerScores[i]['JersyNumber'],
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

  homeForfeitToggle($event: any) {
    if ($event.currentTarget.checked) {
      //this.form.reset();
      this.form.disable();
      this.form.controls['IsHomeForfeit'].enable();
      //this.form.controls['IsHomeForfeit'].setValue(true);
      this.form.controls['IsVisitorForfeit'].enable();
      this.form.controls['IsVisitorForfeit'].setValue(false);
    } else {
      this.form.enable();
      this.form.controls['IsHomeForfeit'].enable();
      this.form.controls['IsVisitorForfeit'].enable();
      this.disablePointsAndPON();
      if (this.homePON >= 3 || this.visitingPON >= 3) {
        this.disablePONCheckboxes();
      }
    }
  }

  visitorfeitToggle($event: any) {
    if ($event.currentTarget.checked) {
      //this.form.reset();
      this.form.disable();
      this.form.controls['IsVisitorForfeit'].enable();
      //this.form.controls['IsVisitorForfeit'].setValue(true);
      this.form.controls['IsHomeForfeit'].enable();
      this.form.controls['IsHomeForfeit'].setValue(false);
    } else {
      this.form.enable();
      this.form.controls['IsHomeForfeit'].enable();
      this.form.controls['IsVisitorForfeit'].enable();
      this.disablePointsAndPON();
      if (this.homePON >= 3 || this.visitingPON >= 3) {
        this.disablePONCheckboxes();
      }
    }
  }

  public inputValidator(event: any) {
    const pattern = /^([0-9][0-9]{0,2}|1000)$/;
    if (!pattern.test(event.target.value)) {
      //console.log(event.target.value);
      event.target.value = '';
    }
  }

  toggleHomeNotPresent($event: any, index) {
    if ($event.currentTarget.checked) {
      //(<FormArray>this.form.controls['HomeTeamPlayerScores']).at(index).disable();
      (<FormArray>this.form.get('HomeTeamPlayerScores')).controls.forEach((group) => {
        let control = group.get('NotPresent') as FormControl;
        let playerNoteControl = group.get('PlayerNote') as FormControl;
        let pointsControl = group.get('Points') as FormControl;
        if (control.value) {
          group.disable();
          control.enable();
          if (playerNoteControl.value) {
            this.homePON--;
            if (this.homePON < 3) {
              (<FormArray>this.form.get('HomeTeamPlayerScores')).enable();

              (<FormArray>this.form.get('HomeTeamPlayerScores')).controls.forEach((innerGroup) => {
                let notPresentControl = innerGroup.get('NotPresent') as FormControl;
                let playerNoteControl = innerGroup.get('PlayerNote') as FormControl;
                let pointsControl = innerGroup.get('Points') as FormControl;

                if (notPresentControl.value) {
                  playerNoteControl.disable();
                  pointsControl.disable();
                }
              });
            }
            playerNoteControl.setValue(false);
          } else {
            playerNoteControl.setValue(false);
          }
          pointsControl.setValue(0);
        }
      });
    } else {
      (<FormArray>this.form.get('HomeTeamPlayerScores')).controls.forEach((group) => {
        let playerNoteControl = group.get('PlayerNote') as FormControl;
        let notPresentControl = group.get('NotPresent') as FormControl;
        let nameControl = group.get('PlayerName') as FormControl;

        //console.log(control.value);
        if (!notPresentControl.value && this.homePON < 3) {
          console.log(group.value);
          group.enable();
          nameControl.disable();
        }
      });
    }
  }

  toggleVisitingNotPresent($event: any, index) {
    if ($event.currentTarget.checked) {
      //(<FormArray>this.form.controls['HomeTeamPlayerScores']).at(index).disable();
      (<FormArray>this.form.get('VisitingTeamPlayerScores')).controls.forEach((group) => {
        let control = group.get('NotPresent') as FormControl;
        let playerNoteControl = group.get('PlayerNote') as FormControl;
        let pointsControl = group.get('Points') as FormControl;
        if (control.value) {
          group.disable();
          control.enable();
          if (playerNoteControl.value) {
            this.visitingPON--;
            if (this.visitingPON < 3) {
              (<FormArray>this.form.get('VisitingTeamPlayerScores')).enable();

              (<FormArray>this.form.get('VisitingTeamPlayerScores')).controls.forEach(
                (innerGroup) => {
                  let notPresentControl = innerGroup.get('NotPresent') as FormControl;
                  let playerNoteControl = innerGroup.get('PlayerNote') as FormControl;
                  let pointsControl = innerGroup.get('Points') as FormControl;

                  if (notPresentControl.value) {
                    playerNoteControl.disable();
                    pointsControl.disable();
                  }
                }
              );
            }
            playerNoteControl.setValue(false);
          } else {
            playerNoteControl.setValue(false);
          }
          pointsControl.setValue(0);
        }
      });
    } else {
      (<FormArray>this.form.get('VisitingTeamPlayerScores')).controls.forEach((group) => {
        let playerNoteControl = group.get('PlayerNote') as FormControl;
        let notPresentControl = group.get('NotPresent') as FormControl;
        let nameControl = group.get('PlayerName') as FormControl;

        //console.log(control.value);
        if (!notPresentControl.value && this.visitingPON < 3) {
          console.log(group.value);
          group.enable();
          nameControl.disable();
        }
      });
    }
  }

  //homePON: number = 0;
  toggleHomePlayerNote($event: any) {
    if ($event.currentTarget.checked) {
      this.homePON++;
    } else {
      this.homePON--;
    }

    if (this.homePON >= 3) {
      console.log('Home Player Note is equal to three');
      const initialState = {
        popupTitle: 'Error',
        popupMsg:
          'The players of note in Team ' +
          this.gameData.HomeTeam +
          ' can not be greater than three.'
      };

      this.bsModalRef = this.modalService.show(
        ValidationModalComponent,
        Object.assign({}, { class: 'customModalWidth75', initialState })
      );

      (<FormArray>this.form.get('HomeTeamPlayerScores')).disable();

      (<FormArray>this.form.get('HomeTeamPlayerScores')).controls.forEach((group) => {
        //console.log(group.value);
        let notPresentControl = group.get('NotPresent') as FormControl;
        let playerNoteControl = group.get('PlayerNote') as FormControl;
        let pointsControl = group.get('Points') as FormControl;
        notPresentControl.enable();
        pointsControl.enable();
        //console.log(control.value);
        if (notPresentControl.value) {
          group.disable();
          notPresentControl.enable();
          playerNoteControl.setValue(false);
          //notPresentControl.enable();
          //playerNoteControl.disable();
        }

        if (playerNoteControl.value) {
          console.log(playerNoteControl.value);
          playerNoteControl.enable();
        }
      });
    } else if (this.homePON <= 3) {
      (<FormArray>this.form.get('HomeTeamPlayerScores')).enable();

      (<FormArray>this.form.get('HomeTeamPlayerScores')).controls.forEach((group) => {
        let notPresentControl = group.get('NotPresent') as FormControl;
        let playerNoteControl = group.get('PlayerNote') as FormControl;
        if (notPresentControl.value) {
          group.disable();
          playerNoteControl.setValue(false);
          notPresentControl.enable();
        }
      });
    }
  }

  //visitingPON: number = 0;
  toggleVisitingPlayerNote($event: any) {
    if ($event.currentTarget.checked) {
      this.visitingPON++;
    } else {
      this.visitingPON--;
    }

    if (this.visitingPON >= 3) {
      console.log('Visiting Player Note is equal to three');
      const initialState = {
        popupTitle: 'Error',
        popupMsg:
          'The players of note in Team ' +
          this.gameData.VisitingTeam +
          ' can not be greater than three.'
      };

      this.bsModalRef = this.modalService.show(
        ValidationModalComponent,
        Object.assign({}, { class: 'customModalWidth75', initialState })
      );

      (<FormArray>this.form.get('VisitingTeamPlayerScores')).disable();

      (<FormArray>this.form.get('VisitingTeamPlayerScores')).controls.forEach((group) => {
        let notPresentControl = group.get('NotPresent') as FormControl;
        let playerNoteControl = group.get('PlayerNote') as FormControl;
        let pointsControl = group.get('Points') as FormControl;
        pointsControl.enable();
        notPresentControl.enable();
        if (notPresentControl.value) {
          group.disable();
          notPresentControl.enable();
          playerNoteControl.setValue(false);
        }

        if (playerNoteControl.value) {
          console.log(playerNoteControl.value);
          playerNoteControl.enable();
        }
      });
    } else if (this.visitingPON <= 3) {
      (<FormArray>this.form.get('VisitingTeamPlayerScores')).enable();

      (<FormArray>this.form.get('VisitingTeamPlayerScores')).controls.forEach((group) => {
        let notPresentControl = group.get('NotPresent') as FormControl;
        let playerNoteControl = group.get('PlayerNote') as FormControl;
        if (notPresentControl.value) {
          group.disable();
          playerNoteControl.setValue(false);
          notPresentControl.enable();
        }
      });
    }
  }

  async addImage(imageInput: any) {
    console.log(imageInput);
    await this.makeImageByteArray(imageInput);
  }

  async makeImageByteArray(imageInput: any) {
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

    const homeTeamArray = <FormArray>this.form.controls['ScoreSheetImages'];

    homeTeamArray.push(
      this.fb.group({
        ImageURL: await '',
        NewImageByteCode: await btoa(binaryString)
      })
    );

    var source_code = await this._sanitizer.bypassSecurityTrustResourceUrl(
      'data:image/jpg;base64,' + btoa(binaryString)
    );

    await this.TempScoreSheets.push(source_code);

    //await this.tempIndex++;
  }

  /* - Image implementation ends - */

  deleteImage(index) {
    console.log(index);
    (<FormArray>this.form.controls['ScoreSheetImages']).removeAt(index);

    this.TempScoreSheets.splice(index, 1);
    this.TempScoreSheets = this.TempScoreSheets.filter(function(el) {
      return el != null;
    });
  }

  async deleteSavedImage(e: any, url: string, ssIndex: string) {
    var tempId = this.elRef.nativeElement.querySelector('#' + ssIndex);
    this.renderer.setProperty(tempId, 'style', 'display:none');

    const deleteImageArray = <FormArray>this.form.controls['DeletedScoreSheetImages'];

    deleteImageArray.push(
      this.fb.group({
        ImageURL: await url,
        NewImageByteCode: await ''
      })
    );
  }

  bsModalRef: BsModalRef;
  addIncident() {
    const initialState = {
      name: this.gameData['UserName'],
      gameId: this.gameData.GameId,
      incidentTypes: this.gameData['IncidentTypes'],
      incidentSubDropDown: this.gameData['IncidentSubDropDown'],
      locationId: this.gameData['LocationId'],
      locationName: this.gameData['LocationName'],
      incidentCount:
        this.gameData.IncidentReports.length + this.officialService.IncidentReports.length + 1
    };
    this.bsModalRef = this.modalService.show(
      NewIncidentComponent,
      Object.assign({}, { class: 'customModalWidth90', initialState })
    );

    this.bsModalRef.content.saveStatus.subscribe(($e) => {
      this.officialService.dataChanged = true;
    });

    console.log(this.bsModalRef.content.gameId);
  }

  showIncident(incidentIndex) {
    const initialState = {
      gameId: this.gameData.GameId,
      incident: this.gameData.IncidentReports[incidentIndex],
      allIncidentTypes: this.gameData['IncidentTypes'],
      allDependentDropdowns: this.gameData['IncidentSubDropDown'],
      incidentCount: incidentIndex + 1,
      locationId: this.gameData['LocationId'],
      filedDate: this.gameData.IncidentReports[incidentIndex]['FiledDate']
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
      //this.officialService.reportGameJson['Value'].GameList[gameIndex].IncidentReports.splice(incidentIndex,1);

      for (var i = 0; i < this.officialService.ModifiedIncidents.length; ++i) {
        if (this.officialService.ModifiedIncidents[i].GameId == parseInt(this.gameData.GameId)) {
          this.gameData.IncidentReports[
            incidentIndex
          ].IncidentId = this.officialService.ModifiedIncidents[i].IncidentId;

          this.gameData.IncidentReports[
            incidentIndex
          ].IncidentType = this.officialService.ModifiedIncidents[i].IncidentType;

          this.gameData.IncidentReports[
            incidentIndex
          ].IncidentValue = this.officialService.ModifiedIncidents[i].IncidentValue;

          this.gameData.IncidentReports[
            incidentIndex
          ].Notes = this.officialService.ModifiedIncidents[i].Notes;
        }
      }
    });

    this.bsModalRef.content.saveStatus.subscribe(($e) => {
      this.officialService.dataChanged = true;
    });
  }

  // setDeletedIncident() {
  //   return {
  //     GameId: null,
  //     IncidentId: null,
  //     IncidentType: null,
  //     IncidentValue: null,
  //     Notes: null
  //   }
  // }

  async deleteIncident(incidentIndex, gameIndex) {
    //var s = this.setDeletedIncident();

    var arr = <FormArray>this.form.get('DeleteIncidentReport');

    arr.push(
      this.fb.group({
        IncidentId: this.gameData.IncidentReports[incidentIndex].IncidentId,
        GameId: this.gameData.GameId,
        IncidentType: this.gameData.IncidentReports[incidentIndex].IncidentType,
        IncidentValue: this.gameData.IncidentReports[incidentIndex].IncidentValue,
        Notes: this.gameData.IncidentReports[incidentIndex].Notes
      })
    );

    await this.gameData.IncidentReports.splice(incidentIndex, 1);

    this.incidentCount--;
  }

  deleteTempIncident(newIncidentIndex) {
    console.log(this.officialService.NewIncidents);
    //(<FormArray> this.form.controls['IncidentReports']).removeAt(newIncidentIndex);

    for (var i = 0; i < this.officialService.IncidentReports.length; ++i) {
      if (
        this.officialService.IncidentReports[i].IncidentType ==
        this.officialService.NewIncidents[newIncidentIndex].IncidentType
      ) {
        this.officialService.IncidentReports.splice(i, 1);
        this.officialService.NewIncidents.splice(newIncidentIndex, 1);
        //console.log(this.officialService.NewIncidents);
      }
    }
  }

  onSubmit() {
    console.log(this.form);
    // await this.prepareScoresforSubmission();
    // await this.prepareScoreSheetsforSubmission();
    // await this.prepareDeletedScoreSheetsforSubmission();
    // await this.prepareDeletedIncidents();
    // await this.prepareFinalData();

    if (
      this.form.get('IsVisitorForfeit').value == true ||
      this.form.get('IsHomeForfeit').value == true
    ) {
      this.prepareScoresforSubmission().then(() => {
        this.prepareScoreSheetsforSubmission().then(() => {
          this.prepareDeletedScoreSheetsforSubmission().then(() => {
            this.prepareDeletedScoreSheetsforSubmission().then(() => {
              this.prepareDeletedIncidents().then(() => {
                this.prepareFinalData().then(() => {
                  console.log(this.APIGamePost);
                  this.officialService.postReportData(this.APIGamePost).then(() => {
                    if (this.officialService.postReportMsg) {
                      this.showModal();
                    }
                    if (this.officialService.serviceError) {
                      this.bsModalRef = this.modalService.show(ErrorModalComponent);
                      this.bsModalRef.content.closeBtnName = 'Close';
                    }
                  });
                });
              });
            });
          });
        });
      });
    } else {
      if (this.homePON > 0 && this.visitingPON > 0) {
        if (
          this.finalHomeScore == this.form.get('HomeTeamScore').value &&
          this.finalVisitingScore == this.form.get('VisitingTeamScore').value
        ) {
          this.prepareScoresforSubmission().then(() => {
            this.prepareScoreSheetsforSubmission().then(() => {
              this.prepareDeletedScoreSheetsforSubmission().then(() => {
                this.prepareDeletedScoreSheetsforSubmission().then(() => {
                  this.prepareDeletedIncidents().then(() => {
                    this.prepareFinalData().then(() => {
                      console.log(this.APIGamePost);
                      this.officialService.postReportData(this.APIGamePost).then(() => {
                        if (this.officialService.postReportMsg) {
                          this.showModal();
                        }
                        if (this.officialService.serviceError) {
                          this.bsModalRef = this.modalService.show(ErrorModalComponent);
                          this.bsModalRef.content.closeBtnName = 'Close';
                        }
                      });
                    });
                  });
                });
              });
            });
          });
        } else {
          console.log('Home Score' + this.finalHomeScore);
          console.log('Form home Score' + this.form.get('HomeTeamScore').value);

          if (this.finalHomeScore != this.form.get('HomeTeamScore').value) {
            const initialState = {
              popupTitle: 'Error',
              popupMsg:
                ' The sum of the scores of the players in Team ' +
                this.gameData.HomeTeam +
                ' must be equal to the final score.'
            };

            this.bsModalRef = this.modalService.show(
              ValidationModalComponent,
              Object.assign({}, { class: 'customModalWidth75', initialState })
            );
          }

          if (this.finalVisitingScore != this.form.get('VisitingTeamScore').value) {
            console.log('Visiting Score' + this.finalVisitingScore);
            console.log('Form visiting Score' + this.form.get('VisitingTeamScore').value);
            const initialState = {
              popupTitle: 'Error',
              popupMsg:
                ' The sum of the scores of the players in Team ' +
                this.gameData.VisitingTeam +
                ' must be equal to the final score.'
            };

            this.bsModalRef = this.modalService.show(
              ValidationModalComponent,
              Object.assign({}, { class: 'customModalWidth75', initialState })
            );
          }
        }
      } else {
        if (this.homePON == 0) {
          const initialState = {
            popupTitle: 'Error',
            popupMsg: 'The players of note in Team ' + this.gameData.HomeTeam + ' can not be Zero.'
          };

          this.bsModalRef = this.modalService.show(
            ValidationModalComponent,
            Object.assign({}, { class: 'customModalWidth75', initialState })
          );
        } else if (this.visitingPON == 0) {
          const initialState = {
            popupTitle: 'Error',
            popupMsg:
              'The players of note in Team ' + this.gameData.VisitingTeam + ' can not be Zero.'
          };

          this.bsModalRef = this.modalService.show(
            ValidationModalComponent,
            Object.assign({}, { class: 'customModalWidth75', initialState })
          );
        }
      }
    }
  }

  HomeTeamPlayerScores: APIPlayerScorePost[] = [];
  VisitingTeamPlayerScores: APIPlayerScorePost[] = [];
  ScoreSheets: ScoreSheetImages[] = [];
  DeletedSheets: DeletedScoreSheetImages[] = [];
  DeletedIncidents: DeleteIncidentReport[] = [];
  APIGamePost = new APIGamePost();

  showTempIncident(newIncidentIndex, gameIndex) {
    const initialState = {
      index: newIncidentIndex,
      gameId: this.gameData.GameId,
      incident: this.officialService.IncidentReports[newIncidentIndex],
      allIncidentTypes: this.gameData['IncidentTypes'],
      allDependentDropdowns: this.gameData['IncidentSubDropDown'],
      incidentCount: this.incidentCount + newIncidentIndex + 1,
      locationId: this.gameData['LocationId']
    };

    this.bsModalRef = this.modalService.show(
      ShowNewIncidentComponent,
      Object.assign({}, { class: 'customModalWidth90', initialState })
    );

    this.bsModalRef.content.saveStatus.subscribe(($e) => {
      this.dataChanged = true;
    });
  }

  async prepareScoresforSubmission() {
    this.HomeTeamPlayerScores = await [];
    this.VisitingTeamPlayerScores = await [];
    const homeTeamArray = await (<FormArray>this.form.get('HomeTeamPlayerScores'));

    for (let group of homeTeamArray.controls) {
      let point = await group.get('Points').value;
      let playernote = await group.get('PlayerNote').value;
      let notpresent = await group.get('NotPresent').value;

      let playername = await group.get('PlayerName').value;
      let gameid = await group.get('GameId').value;
      let playerseasonalId = await group.get('PlayerSeasonalId').value;
      let fouldId = await group.get('FoulId').value;

      let rebound = await group.get('Rebound').value;
      let teamid = await group.get('TeamId').value;

      if (
        this.form.get('IsVisitorForfeit').value == false &&
        this.form.get('IsHomeForfeit').value == false
      ) {
        await this.HomeTeamPlayerScores.push({
          GameId: gameid,
          PlayerName: playername,
          PlayerSeasonalId: playerseasonalId,
          FoulId: fouldId,
          Points: point,
          PlayerNote: playernote,
          NotPresent: notpresent,
          Rebound: rebound,
          TeamId: teamid,
          TeamName: this.gameData.HomeTeam
        });
      } else {
        await this.HomeTeamPlayerScores.push({
          GameId: gameid,
          PlayerName: playername,
          PlayerSeasonalId: playerseasonalId,
          FoulId: fouldId,
          Points: 0,
          PlayerNote: false,
          NotPresent: false,
          Rebound: rebound,
          TeamId: teamid,
          TeamName: this.gameData.HomeTeam
        });
      }
    }

    await console.log(this.HomeTeamPlayerScores);

    const visitingTeamArray = await (<FormArray>this.form.get('VisitingTeamPlayerScores'));
    for (let group of visitingTeamArray.controls) {
      let point = await group.get('Points').value;
      let playername = await group.get('PlayerName').value;
      let gameid = await group.get('GameId').value;
      let playerseasonalId = await group.get('PlayerSeasonalId').value;
      let fouldId = await group.get('FoulId').value;
      let playernote = await group.get('PlayerNote').value;
      let notpresent = await group.get('NotPresent').value;
      let rebound = await group.get('Rebound').value;
      let teamid = await group.get('TeamId').value;

      if (
        this.form.get('IsVisitorForfeit').value == false &&
        this.form.get('IsHomeForfeit').value == false
      ) {
        await this.VisitingTeamPlayerScores.push({
          GameId: gameid,
          PlayerName: playername,
          PlayerSeasonalId: playerseasonalId,
          FoulId: fouldId,
          Points: point,
          PlayerNote: playernote,
          NotPresent: notpresent,
          Rebound: rebound,
          TeamId: teamid,
          TeamName: this.gameData.HomeTeam
        });
      } else {
        await this.VisitingTeamPlayerScores.push({
          GameId: gameid,
          PlayerName: playername,
          PlayerSeasonalId: playerseasonalId,
          FoulId: fouldId,
          Points: 0,
          PlayerNote: false,
          NotPresent: false,
          Rebound: rebound,
          TeamId: teamid,
          TeamName: this.gameData.HomeTeam
        });
      }
    }
  }

  async prepareFinalData() {
    this.APIGamePost.Roleid = this.cookieService.get('roleId');
    this.APIGamePost.SeasonId = this.cookieService.get('seasonId');
    this.APIGamePost.OfficialSeasonId = this.gameData.OfficialSeasonId;
    this.APIGamePost.OfficiatingPositionId = this.gameData.OfficiatingPositionId;

    this.APIGamePost.IsHomeForfeit = this.form.get('IsHomeForfeit').value;
    this.APIGamePost.IsVisitorForfeit = this.form.get('IsVisitorForfeit').value;

    console.log(this.APIGamePost.IsHomeForfeit);
    console.log(this.APIGamePost.IsVisitorForfeit);

    this.APIGamePost.Location = this.gameData.Location;
    this.APIGamePost.Division = this.gameData.Division;
    this.APIGamePost.LeagueId = this.cookieService.get('leagueId');

    this.APIGamePost.GameId = this.gameData.GameId;
    this.APIGamePost.GameName = this.gameData.GameName;
    this.APIGamePost.GameDate = this.gameData.GameDate;
    this.APIGamePost.GameStartTime = this.gameData.GameStartTime;

    this.APIGamePost.HomeTeam = this.gameData.HomeTeam;
    this.APIGamePost.VisitingTeam = this.gameData.VisitingTeam;
    this.APIGamePost.HomeTeamId = this.gameData.HomeTeamId;
    this.APIGamePost.VisitingTeamId = this.gameData.VisitingTeamId;

    if (
      this.form.get('IsVisitorForfeit').value == false &&
      this.form.get('IsHomeForfeit').value == false
    ) {
      this.APIGamePost.HomeTeamScore = this.form.get('HomeTeamScore').value;
      this.APIGamePost.VisitingTeamScore = this.form.get('VisitingTeamScore').value;
    } else {
      this.APIGamePost.HomeTeamScore = '0';
      this.APIGamePost.VisitingTeamScore = '0';
    }

    this.APIGamePost.HomeTeamPlayerScores = this.HomeTeamPlayerScores;
    this.APIGamePost.VisitingTeamPlayerScores = this.VisitingTeamPlayerScores;
    this.APIGamePost.ScoreSheetImages = this.ScoreSheets;
    this.APIGamePost.DeletedScoreSheetImages = this.DeletedSheets;
    this.APIGamePost.IncidentReports = this.officialService.IncidentReports;
    this.APIGamePost.DeleteIncidentReport = this.DeletedIncidents;
  }

  async prepareScoreSheetsforSubmission() {
    this.ScoreSheets = await [];
    const scoreSheetArray = <FormArray>this.form.controls['ScoreSheetImages'];

    for (let group of scoreSheetArray.controls) {
      let url = await group.get('ImageURL').value;
      let newImageByteCode = await group.get('NewImageByteCode').value;

      await this.ScoreSheets.push({
        ImageURL: url,
        NewImageByteCode: newImageByteCode
      });
    }
  }

  async prepareDeletedScoreSheetsforSubmission() {
    this.DeletedSheets = await [];
    const deletedSheetArray = <FormArray>this.form.controls['DeletedScoreSheetImages'];

    for (let group of deletedSheetArray.controls) {
      let url = await group.get('ImageURL').value;
      let newImageByteCode = await group.get('NewImageByteCode').value;

      await this.DeletedSheets.push({
        ImageURL: url,
        NewImageByteCode: newImageByteCode
      });
    }
  }

  async prepareDeletedIncidents() {
    this.DeletedIncidents = [];
    const deletedIncidentArray = <FormArray>this.form.controls['DeleteIncidentReport'];

    for (let group of deletedIncidentArray.controls) {
      let incidentId = await group.get('IncidentId').value;
      let incidentType = await group.get('IncidentType').value;
      let incidentValue = await group.get('IncidentValue').value;
      let notes = await group.get('Notes').value;

      await this.DeletedIncidents.push({
        IncidentId: incidentId,
        GameId: parseInt(this.gameData.GameId),
        IncidentType: incidentType,
        IncidentValue: incidentValue,
        Notes: notes
      });
    }
  }

  showModal() {
    this.officialService.initialJson = JSON.stringify(this.reportGameData);

    const initialState = {
      status: this.officialService.postReportStatus,
      popupTitle: this.officialService.postReportTitle,
      popupMsg: this.officialService.postReportMsg
    };

    this.bsModalRef = this.modalService.show(
      SuccessPopupComponent,
      Object.assign({}, { class: 'customModalWidth75', initialState })
    );
    this.bsModalRef.content.click.subscribe(($e) => {
      if ($e) {
        console.log(this.gameIndex);
        console.log(this.reportGameData['Value'].GameList[this.gameIndex]);
        this.gameData = this.reportGameData['Value'].GameList[this.gameIndex];
        this.homePON = this.gameData.TotalHomePON;
        this.visitingPON = this.gameData.TotalVisitingPON;
        this.incidentCount = this.gameData.IncidentReports.length;
        this.officialService.IncidentReports = [];
        this.officialService.ModifiedIncidents = [];
        this.officialService.NewIncidents = [];

        // this.officialService.getReportData().then(()=>{

        // })
      }
    });
  }

  pdfUrl: string;
  downloadRequest: boolean;
  downloadPdf(url) {
    /*************************************************************************** */
    /* Download Pre-printed Scoresheet. */
    /*************************************************************************** */

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

  nonScorekeeperSubmit(form) {
    console.log(form);
    if (this.gameData.OfficiatingPositionId != '3') {
      console.log(this.gameData.OfficiatingPositionId);
      this.prepareScoresforSubmission().then(() => {
        this.prepareScoreSheetsforSubmission().then(() => {
          this.prepareDeletedScoreSheetsforSubmission().then(() => {
            this.prepareDeletedScoreSheetsforSubmission().then(() => {
              this.prepareDeletedIncidents().then(() => {
                this.prepareFinalData().then(() => {
                  console.log(this.APIGamePost);
                  this.officialService.postReportData(this.APIGamePost).then(() => {
                    if (this.officialService.postReportMsg) {
                      this.showModal();
                    }
                    if (this.officialService.serviceError) {
                      this.bsModalRef = this.modalService.show(ErrorModalComponent);
                      this.bsModalRef.content.closeBtnName = 'Close';
                    }
                  });
                });
              });
            });
          });
        });
      });
    }
  }
}
