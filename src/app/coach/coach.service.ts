import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestMethod, } from '@angular/http';
import { Constants } from './../constants';
import { CoachProfileRequest } from './models/profileRequest.model';
import { CoachProfileResponse } from './models/profileResponse.model';
import { DataSharingService } from './../data-sharing.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class CoachService {

  constructor(private http: Http, private dss: DataSharingService) { 
    this.headerOptions = new Headers({ 'Content-Type': 'application/json' });
    this.postRequestOptions = new RequestOptions({
      method: RequestMethod.Post,
      headers: this.headerOptions
    });
  }

  postRequestOptions;
  headerOptions;

  getCoach(): Observable<CoachProfileResponse>{
    var getCoachModel = new CoachProfileRequest();
    getCoachModel.UserID = this.dss.userId;
    getCoachModel.SessionKey = this.dss.sessionKey;
    getCoachModel.RequestedData = JSON.stringify({
      LeagueId: this.dss.leagueId,
      SeasonId: this.dss.seasonId,
      VolunteerSeasonalId: this.dss.VolunteerSeasonalId,
      VolunteerId:this.dss.VolunteerId

    })

    var body = JSON.stringify(getCoachModel);
    console.log(body);
    return this.http.post(Constants.apiURL+'/api/CoachDetails', body, this.postRequestOptions)
    .pipe(map((res)=>res.json()))
    
  }

  getReportResultData(): Observable<any> {
    return this.http.get('assets/test.json')
      .pipe(map((res) => res))
  }
}
