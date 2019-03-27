import { Injectable } from '@angular/core';
import { map, switchMap, tap, timeout } from 'rxjs/operators';
import { Filter } from './classes/selectgame/filter.model';
import { FinalFilter } from './classes/selectgame/finalFilter.model';
import { IPaidSection } from './classes/pay/pay.model';
import { IProfileSection } from './classes/profile/IProfile.model';
import { IncidentReports } from './classes/reportgame/Incident.model';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  Http,
  Response,
  Headers,
  RequestOptions,
  RequestMethod,
  ResponseContentType
} from '@angular/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { SignUpRequestedData } from './classes/selectgame/signUp_rd.model';
import { IntialFilter } from './classes/selectgame/initialFilter.model';
import { ReportGameData } from './classes/reportgame/reportGame.model';
import { Profile } from './classes/profile/profile.model';
import { UploadProfileImage } from './classes/profile/uploadProfileImg.model';
import { CookieService } from 'ngx-cookie-service';
import { Constants } from './../constants';
import { DataSharingService } from './../data-sharing.service';

@Injectable({
  providedIn: 'root'
})
export class OfficialService {
  selectGameJson: JSON = null;
  reportGameJson: JSON = null;
  initialData = new Filter();
  dataChanged: boolean = null;
  initialJson: string;

  IncidentReports: IncidentReports[] = [];
  NewIncidents: IncidentReports[] = [];
  ModifiedIncidents: IncidentReports[] = [];

  selectedFilter = new Filter();
  initialFilter = new IntialFilter();
  finalFilter = new FinalFilter();
  signUpRD = new SignUpRequestedData();
  reportGameData = new ReportGameData();

  headerOptions;
  postRequestOptions;

  // selectedFilter: Filter = {
  //   Division: '',
  //   Location: '',
  //   StartTime: '',
  //   EndTime: '',
  //   Position: '',
  //   ShowSignedGames: null,
  //   ShowPastGames: null
  // };

  // initialFilter: IntialFilter = {
  //   UserID: '',
  //   SessionKey: ''
  // };

  // finalFilter: FinalFilter = {
  //   UserID: '',
  //   SessionKey: '',
  //   RequestedData: ''
  // };

  /* Select Game Definitions */

  selectedDivisions = [];
  selectedPositions = [];
  selectedLocations = [];
  selectedTimes = [];

  // signUpRD: SignUpRequestedData = {
  //   GameIds: '',
  //   GroupId: '',
  //   PositionID: '',
  //   OfficialSeasonId: '',
  //   ForCancelSignUp: '',
  //   SeasonId: '',
  //   LeagueId: ''
  // };

  /* Report Game Definitions */

  // reportGameData: ReportGameData = {
  //   SeasonId: '',
  //   OfficialSeasonId: ''
  // };

  /* Profile Section Definitions */

  profileModel = new Profile();
  uploadProfileImg = new UploadProfileImage();
  // profileModel: Profile = {
  //   LeagueId: '',
  //   SeasonId: ''
  // };

  // uploadProfileImg: UploadProfileImage = {
  //   LeagueId: '',
  //   SeasonId: '',
  //   Page: '',
  //   FileName: ''
  // };

  constructor(
    private httpClient: HttpClient,
    private http: Http,
    private dss: DataSharingService,
    private cookieService: CookieService
  ) {
    this.headerOptions = new Headers({ 'Content-Type': 'application/json' });
    this.postRequestOptions = new RequestOptions({
      method: RequestMethod.Post,
      headers: this.headerOptions
    });
  }

  /**************************/
  /* - Select Games - */
  /**************************/

  /* - Fetch Initial Data in Select Games - */
  fetchSelectGames = null;
  postSelectGames(obj: Filter): any {
    this.dss.initialFetchError = null;
    this.serviceError = false;
    this.fetchSelectGames = true;
    this.initialFilter.SessionKey = this.dss.sessionKey;
    this.initialFilter.UserID = JSON.stringify(this.dss.userId);
    var body = JSON.stringify(this.initialFilter);
    console.log(JSON.stringify(this.initialFilter));
    var headerOptions = new Headers({ 'Content-Type': 'application/json' });
    var requestOptions = new RequestOptions({
      method: RequestMethod.Post,
      headers: headerOptions
    });
    return this.http
      .post(Constants.apiURL + '/api/officialgames', body, requestOptions)
      .pipe(
        timeout(60000),
        map((data: Response) => {
          return data.json();
        })
      )
      .toPromise()
      .then((x) => {
        console.log(x);

        this.fetchPreselectedFilters(x);
        this.fetchSelectGames = false;
        return Promise.resolve((this.selectGameJson = x));
      })
      .catch((err) => {
        this.dss.initialFetchError = true;
        this.handleError(err);
      });
  }

  // postSelectGames1(): Observable<any> {
  //   this.dss.initialFetchError = null;
  //   this.serviceError = false;
  //   this.fetchSelectGames = true;
  //   this.initialFilter.SessionKey = this.dss.sessionKey;
  //   this.initialFilter.UserID = JSON.stringify(this.dss.userId);
  //   var body = JSON.stringify(this.initialFilter);
  //   console.log(JSON.stringify(this.initialFilter));
  //   var headerOptions = new Headers({ 'Content-Type': 'application/json' });
  //   var requestOptions = new RequestOptions({
  //     method: RequestMethod.Post,
  //     headers: headerOptions
  //   });
  //   return this.http.post(Constants.apiURL + '/api/officialgames', body, requestOptions).pipe(
  //     timeout(60000),
  //     map((data: Response) => {
  //       data.json() as Observable<any>;
  //     }),
  //     catchError(this.handleError1)
  //   );
  // }

  /* - Used to refresh the Data in Select Games after some change - */
  refershSelectGameData(obj: Filter): any {
    this.initialFilter.SessionKey = this.dss.sessionKey;
    this.initialFilter.UserID = JSON.stringify(this.dss.userId);
    var body = JSON.stringify(this.initialFilter);
    var headerOptions = new Headers({ 'Content-Type': 'application/json' });
    var requestOptions = new RequestOptions({
      method: RequestMethod.Post,
      headers: headerOptions
    });
    return this.http
      .post(Constants.apiURL + '/api/officialgames', body, requestOptions)
      .pipe(
        map((data: Response) => {
          return data.json();
        })
      )
      .toPromise()
      .then((x) => {
        return Promise.resolve((this.selectGameJson = x));
      })
      .catch((err) => {
        this.handleError(err);
      });
  }

  /* - It prepares a JSON that can be used to populate the multi-select filters, in-case the 
  user had selected any in his previous session. If the user didn't it will be empty - */
  fetchPreselectedFilters(x: any) {
    let y;
    this.dss.sessionKey = x['SessionKey'];

    if (x['Value'].SelectedFilters != null) {
      if (x['Value'].SelectedFilters.Division != null) {
        y = x['Value'].SelectedFilters.Division.split(',');

        for (let i = 0; i < y.length; ++i) {
          x['Value'].Filters.Filter_Divisions.forEach((element) => {
            if (element.id == y[i]) {
              let existItem = this.selectedDivisions.filter(
                (item) => item.itemName === element.itemName
              );
              if (existItem.length < 1) {
                this.selectedDivisions.push(element);
              }
            }
          });
        }
      }

      if (x['Value'].SelectedFilters.StartTime != null) {
        y = x['Value'].SelectedFilters.StartTime.split(',');

        for (let i = 0; i < y.length; ++i) {
          x['Value'].Filters.Filter_StartTimes.forEach((element) => {
            if (element.id == y[i]) {
              let existItem = this.selectedTimes.filter(
                (item) => item.itemName === element.itemName
              );
              if (existItem.length < 1) {
                this.selectedTimes.push(element);
              }
            }
          });
        }
      }

      if (x['Value'].SelectedFilters.Location != null) {
        y = x['Value'].SelectedFilters.Location.split(',');

        for (let i = 0; i < y.length; ++i) {
          x['Value'].Filters.Filter_Locations.forEach((element) => {
            if (element.id == y[i]) {
              let existItem = this.selectedLocations.filter(
                (item) => item.itemName === element.itemName
              );
              if (existItem.length < 1) {
                this.selectedLocations.push(element);
              }
            }
          });
        }
      }

      if (x['Value'].SelectedFilters.Position != null) {
        y = x['Value'].SelectedFilters.Position.split(',');

        for (let i = 0; i < y.length; ++i) {
          x['Value'].Filters.Filter_Positions.forEach((element) => {
            if (element.id == y[i]) {
              let existItem = this.selectedPositions.filter(
                (item) => item.itemName === element.itemName
              );
              if (existItem.length < 1) {
                this.selectedPositions.push(element);
              }
            }
          });
        }
      }
    }
  }

  /* - If the user selects any filter, it will be posted to the API and the data in 
  select game tab will be refreshed using the below function. -*/

  postFilterData(obj: Filter) {
    this.finalFilter.RequestedData = JSON.stringify(obj);
    this.finalFilter.SessionKey = this.dss.sessionKey;
    this.finalFilter.UserID = this.dss.userId.toString();
    var body = JSON.stringify(this.finalFilter);
    console.log(JSON.stringify(this.finalFilter));

    var headerOptions = new Headers({ 'Content-Type': 'application/json' });
    var requestOptions = new RequestOptions({
      method: RequestMethod.Post,
      headers: headerOptions
    });
    return this.http
      .post(Constants.apiURL + '/api/officialgames', body, requestOptions)
      .pipe(
        map((data: Response) => {
          return data.json();
        })
      )
      .toPromise()
      .then((x) => {
        console.log(x);
        return Promise.resolve((this.selectGameJson = x));
      })
      .catch((err) => {
        this.handleError(err);
      });
  }

  /* - This functin sends a signup request - */

  signUpStatus: boolean = false;
  signUpResponse: string = null;
  postSignUp(groupId: string, gameId: string, positionId: string, ForCancelSignUp: string) {
    this.signUpStatus = true;
    this.signUpResponse = null;
    this.signUpRD.GroupId = groupId;
    this.signUpRD.GameIds = gameId;
    this.signUpRD.PositionID = positionId;
    this.signUpRD.OfficialSeasonId = this.dss.officialSeasonId;
    this.signUpRD.SeasonId = this.dss.seasonId;
    this.signUpRD.LeagueId = this.dss.leagueId;
    this.signUpRD.ForCancelSignUp = ForCancelSignUp;

    this.finalFilter.UserID = this.dss.userId.toString();
    this.finalFilter.SessionKey = this.dss.sessionKey;
    this.finalFilter.RequestedData = JSON.stringify(this.signUpRD);
    var body = JSON.stringify(this.finalFilter);
    console.log(JSON.stringify(this.finalFilter));
    var headerOptions = new Headers({ 'Content-Type': 'application/json' });
    var requestOptions = new RequestOptions({
      method: RequestMethod.Post,
      headers: headerOptions
    });
    return this.http
      .post(Constants.apiURL + '/api/SignOfficial', body, requestOptions)
      .pipe(
        map((data: Response) => {
          return data.json();
        })
      )
      .toPromise()
      .then((x) => {
        console.log(x);
        this.signUpStatus = false;
        this.signUpResponse = x['Message'].PopupMessage;
        //if(this.signUpResponse=="Registered")
        //console.log(this.signUpResponse);
        return Promise.resolve(this.refershSelectGameData(this.initialData));
      })
      .catch((err) => {
        this.handleError(err);
      });
  }

  /* - If the user signup is successful, an email is sent to his email, if he chooses to receive it - */

  sendSignUpEmail(groupId: string, gameId: string, positionId: string, ForCancelSignUp: string) {
    this.fetchSelectGames = true;
    this.signUpRD.GroupId = groupId;
    this.signUpRD.GameIds = gameId;
    this.signUpRD.PositionID = positionId;
    this.signUpRD.OfficialSeasonId = this.dss.officialSeasonId;
    this.signUpRD.SeasonId = this.dss.seasonId;
    this.signUpRD.LeagueId = this.dss.leagueId;
    this.signUpRD.ForCancelSignUp = ForCancelSignUp;

    this.finalFilter.RequestedData = JSON.stringify(this.signUpRD);
    this.finalFilter.SessionKey = this.dss.sessionKey;
    this.finalFilter.UserID = this.dss.userId.toString();

    var body = JSON.stringify(this.finalFilter);
    console.log(JSON.stringify(this.finalFilter));

    var headerOptions = new Headers({ 'Content-Type': 'application/json' });
    var requestOptions = new RequestOptions({
      method: RequestMethod.Post,
      headers: headerOptions
    });
    return this.http
      .post(Constants.apiURL + '/api//RequestSendMail', body, requestOptions)
      .pipe(
        map((data: Response) => {
          return data.json();
        })
      )
      .toPromise()
      .then((x) => {
        console.log(x);
        //this.paidRequest=false;
        this.postSelectGames(this.selectedFilter);
        return Promise.resolve();
      })
      .catch((err) => {
        this.handleError(err);
      });
  }

  sendCancelSignUpEmail(
    groupId: string,
    gameId: string,
    positionId: string,
    ForCancelSignUp: string
  ) {
    this.fetchSelectGames = true;
    this.signUpRD.GroupId = groupId;
    this.signUpRD.GameIds = gameId;
    this.signUpRD.PositionID = positionId;
    this.signUpRD.OfficialSeasonId = this.dss.officialSeasonId;
    this.signUpRD.SeasonId = this.dss.seasonId;
    this.signUpRD.LeagueId = this.dss.leagueId;
    this.signUpRD.ForCancelSignUp = ForCancelSignUp;

    this.finalFilter.RequestedData = JSON.stringify(this.signUpRD);
    this.finalFilter.SessionKey = this.dss.sessionKey;
    this.finalFilter.UserID = this.dss.userId.toString();

    var body = JSON.stringify(this.finalFilter);
    console.log(JSON.stringify(this.finalFilter));

    var headerOptions = new Headers({ 'Content-Type': 'application/json' });
    var requestOptions = new RequestOptions({
      method: RequestMethod.Post,
      headers: headerOptions
    });
    return this.http
      .post(Constants.apiURL + '/api//RequestSendMail', body, requestOptions)
      .pipe(
        map((data: Response) => {
          return data.json();
        })
      )
      .toPromise()
      .then((x) => {
        console.log(x);
        this.postSelectGames(this.selectedFilter);
        //this.paidRequest=false;
        return Promise.resolve();
      })
      .catch((err) => {
        this.handleError(err);
      });
  }

  /**************************/
  /* - Report Games - */
  /**************************/

  /* - Used to get initial data to populate the Report Games section. - */

  reportRequest: boolean;
  getReportData() {
    this.dss.initialFetchError = null;
    this.serviceError = false;
    this.reportRequest = true;
    this.reportGameData.SeasonId = this.dss.seasonId;
    this.reportGameData.OfficialSeasonId = this.dss.officialSeasonId;
    this.finalFilter.RequestedData = JSON.stringify(this.reportGameData);

    this.finalFilter.SessionKey = this.dss.sessionKey;
    this.finalFilter.UserID = this.dss.userId.toString();
    var body = JSON.stringify(this.finalFilter);
    //console.log(JSON.stringify(this.finalFilter));

    var headerOptions = new Headers({ 'Content-Type': 'application/json' });
    var requestOptions = new RequestOptions({
      method: RequestMethod.Post,
      headers: headerOptions
    });
    return this.http
      .post(Constants.apiURL + '/api/loadreportgames', body, requestOptions)
      .pipe(
        timeout(60000),
        map((data: Response) => {
          return data.json();
        })
      )
      .toPromise()
      .then((x) => {
        this.reportRequest = false;
        console.log(x);
        return Promise.resolve((this.reportGameJson = x));
      })
      .catch((err) => {
        this.dss.initialFetchError = true;
        this.handleError(err);
      });
  }

  // getReportData1(): Observable<any> {
  //   this.dss.initialFetchError = null;
  //   this.serviceError = false;
  //   this.reportRequest = true;
  //   this.reportGameData.SeasonId = this.dss.seasonId;
  //   this.reportGameData.OfficialSeasonId = this.dss.officialSeasonId;
  //   this.finalFilter.RequestedData = JSON.stringify(this.reportGameData);

  //   this.finalFilter.SessionKey = this.dss.sessionKey;
  //   this.finalFilter.UserID = this.dss.userId.toString();
  //   var body = JSON.stringify(this.finalFilter);

  //   var headerOptions = new Headers({ 'Content-Type': 'application/json' });
  //   var requestOptions = new RequestOptions({
  //     method: RequestMethod.Post,
  //     headers: headerOptions
  //   });

  //   return this.http.post(Constants.apiURL + '/api/loadreportgames', body, requestOptions).pipe(
  //     timeout(60000),
  //     map((res) => <any>res.json()),
  //     catchError(this.handleError1)
  //   );
  // }

  /* - This function is used to post the entire gameList model to the API.
  It comes into play when the ScoreKeeper make any changes to the player scores in a specific game. 
  An updated model with all the scores is sent to the database and the records are updated. - */
  postReportTitle: string;
  postReportMsg: string;
  postReportStatus: boolean;
  postReportData(gameListObj: any) {
    console.log(gameListObj);
    var trailingUrl;
    if (gameListObj.OfficiatingPositionId == 3) {
      trailingUrl = '/api/savereportgames';
    } else {
      trailingUrl = '/api/SaveReportGamesNonScoreKeeper';
    }
    this.reportRequest = true;
    this.postReportMsg = null;
    this.finalFilter.RequestedData = JSON.stringify(gameListObj);
    this.finalFilter.SessionKey = this.dss.sessionKey;
    this.finalFilter.UserID = this.dss.userId.toString();
    console.log(this.finalFilter);
    var body = JSON.stringify(this.finalFilter);
    console.log(JSON.stringify(this.finalFilter));

    var headerOptions = new Headers({ 'Content-Type': 'application/json' });
    var requestOptions = new RequestOptions({
      method: RequestMethod.Post,
      headers: headerOptions
    });
    return this.http
      .post(Constants.apiURL + trailingUrl, body, requestOptions)
      .pipe(
        map((data: Response) => {
          return data.json();
        })
      )
      .toPromise()
      .then((x) => {
        console.log(x);
        this.reportRequest = false;
        if (x['Status']) {
          this.postReportMsg = x['Message'].PopupMessage;
          this.postReportTitle = x['Message'].PopupHeading;
          this.postReportStatus = x['Status'];
          this.dss.reportTagLabel = x['Value'];
          this.cookieService.set('reportTagLabel', x['Value']);
        } else {
          this.postReportMsg = x['Message'].PopupMessage;
          this.postReportTitle = x['Message'].PopupHeading;
          this.postReportStatus = x['Status'];
          this.dss.reportTagLabel = x['Value'];
          this.cookieService.set('reportTagLabel', x['Value']);
        }
        return Promise.resolve();
      })
      .catch((err) => {
        this.reportRequest = false;
        this.handleError(err);
      });
  }

  /**************************/
  /* - Get Paid Section - */
  /**************************/

  /* - This function is used to fetch the initial data to populate the Get Paid section. - */

  fetchGetPaidData(): Observable<any> {
    this.reportGameData.SeasonId = this.dss.seasonId;
    this.reportGameData.OfficialSeasonId = this.dss.officialSeasonId;
    this.finalFilter.RequestedData = JSON.stringify(this.reportGameData);

    this.finalFilter.SessionKey = this.dss.sessionKey;
    this.finalFilter.UserID = this.dss.userId.toString();
    var body = JSON.stringify(this.finalFilter);
    console.log(JSON.stringify(this.finalFilter));

    return this.http.post(Constants.apiURL + '/api/GetPaid', body, this.postRequestOptions).pipe(
      timeout(60000),
      map((res) => <any>res.json()),
      catchError(this.handleError1)
    );
  }

  /**************************/
  /* - Profile Section - */
  /************************/

  /* - This function is used to fetch the initial data to populate the Profile section. - */
  fetchProfileData(): Observable<any> {
    this.profileModel.SeasonId = this.dss.seasonId;
    this.profileModel.LeagueId = this.dss.leagueId;
    this.finalFilter.RequestedData = JSON.stringify(this.profileModel);
    this.finalFilter.SessionKey = this.dss.sessionKey;
    this.finalFilter.UserID = this.dss.userId.toString();
    var body = JSON.stringify(this.finalFilter);
    console.log(JSON.stringify(this.finalFilter));

    return this.http
      .post(Constants.apiURL + '/api/OfficiatingProfile', body, this.postRequestOptions)
      .pipe(
        timeout(60000),
        map((res) => <any>res.json()),
        catchError(this.handleError1)
      );
  }

  uploadProfileImage(newImgByteCode: string): Observable<any> {
    this.uploadProfileImg.SeasonId = this.dss.seasonId;
    this.uploadProfileImg.LeagueId = this.dss.leagueId;
    this.uploadProfileImg.FileName = newImgByteCode;
    this.uploadProfileImg.Page = 'Profile';

    this.finalFilter.RequestedData = JSON.stringify(this.uploadProfileImg);
    this.finalFilter.SessionKey = this.dss.sessionKey;
    this.finalFilter.UserID = this.dss.userId.toString();

    console.log(this.finalFilter);
    var body = JSON.stringify(this.finalFilter);
    console.log(JSON.stringify(this.finalFilter));

    return this.http.post(Constants.apiURL + '/api/ftp', body, this.postRequestOptions).pipe(
      map((res) => <any>res.json()),
      catchError(this.handleError1)
    );
  }

  deleteProfileImage(fileName: string): Observable<any> {
    var headerOptions = new Headers();
    var headerOptions = new Headers({ 'Content-Type': 'application/json' });
    //headerOptions.append('Accept', 'application/json');
    var requestOptions = new RequestOptions({
      method: RequestMethod.Delete,
      headers: headerOptions
    });

    this.uploadProfileImg.SeasonId = this.dss.seasonId;
    this.uploadProfileImg.LeagueId = this.dss.leagueId;
    this.uploadProfileImg.FileName = fileName;
    this.uploadProfileImg.Page = 'Profile';

    this.finalFilter.RequestedData = JSON.stringify(this.uploadProfileImg);
    this.finalFilter.SessionKey = this.dss.sessionKey;
    this.finalFilter.UserID = this.dss.userId.toString();

    console.log(this.finalFilter);
    var body = JSON.stringify(this.finalFilter);
    console.log(JSON.stringify(this.finalFilter));

    return this.http.post(Constants.apiURL + '/api/ftp', body, requestOptions).pipe(
      map((res) => <any>res.json()),
      catchError(this.handleError1)
    );
  }

  public getPdfUrl(url: string): any {
    return this.http.get(url);
  }

  public downloadPdf(url: string): any {
    let newUrl = url;
    console.log(newUrl);
    const headers = new Headers({
      'Content-Type': 'application/pdf'
    });

    return this.http
      .get(newUrl, {
        headers: headers,
        responseType: ResponseContentType.Blob
      })
      .pipe(
        map((res) => {
          console.log(res);
          return new Blob([res.blob()], { type: 'application/pdf' });
        })
      );
  }

  pdfFileName: string;
  public downloadPdfReportGames(url: string): any {
    let newUrl = url;
    console.log(newUrl);
    const headers = new Headers({
      'Content-Type': 'application/pdf'
    });

    return this.http
      .get(newUrl, {
        headers: headers,
        responseType: ResponseContentType.Blob
      })
      .pipe(
        map((res) => {
          console.log(res);
          // const contentDisposition = res.headers.get('content-disposition') || '';
          // const matches = /filename=([^;]+)/ig.exec(contentDisposition);
          // const fileName = (matches[1] || 'untitled').trim();
          // return new Blob([res.blob()], { type: 'application/pdf' });
          return res;
        })
      );
  }

  /**************************/
  /* - Error Handling - */
  /************************/
  private handleError1(error: HttpErrorResponse) {
    // TODO: seems we cannot use messageService from here...
    let errMsg = error.message ? error.message : 'Server error';
    console.error(errMsg);
    if (error.status === 401) {
      window.location.href = '/';
    }
    return throwError(errMsg);
  }

  serviceError: boolean;
  timeoutError: boolean;
  private handleError(error: any) {
    console.log(error);
    if (error instanceof TimeoutError) {
      this.timeoutError = true;
    }
    this.serviceError = true;
    this.fetchSelectGames = false;
    this.reportRequest = false;
    console.log('A Server Error has occured!', error);
  }
}
