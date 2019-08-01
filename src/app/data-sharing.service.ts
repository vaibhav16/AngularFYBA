import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  constructor(public cookieService: CookieService) {
    this.textSize = this.cookieService.get('textSize');
  }
  textSize: string = null;
  initialFetchError: boolean = null;
  isLoggedIn: boolean;
  jsonResult: JSON;
  loginFailed: boolean;
  userId: number = null;
  reportTagLabel: number = null;
  sessionKey: string = null;
  officialSeasonId: string = null;
  seasonId: string = null;
  roleId: string = null;
  leagueId: string = null;
  roundThumbnail: string = null;
  promptChangePassword: string = null;
  name: string = null;
  email: string = null;
  VolunteerId:string = null;
  VolunteerSeasonalId: string = null;
  VolunteerStatusId: string = null;
  DivisionId:number=null;
  isBackButtonClicked: boolean = null;
  currentRoute: string = null;
  isCoach:boolean = null;
  isOfficial:boolean = null;
  isPlayer:boolean = null;
}
