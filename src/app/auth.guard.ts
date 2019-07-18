import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { DataSharingService } from './data-sharing.service';

@Injectable()
export class AuthGuard implements CanActivate{
  constructor(private router: Router, 
    private cookieService: CookieService,
    private dss: DataSharingService) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let allCookies  = {};
    allCookies = this.cookieService.getAll();
    
    this.dss.isOfficial=false;
    this.dss.isCoach=false;
    this.dss.isPlayer=false;

    if (this.cookieService.check("sessionKey")) {
      this.dss.sessionKey = this.cookieService.get(
        "sessionKey"
      );
      this.dss.userId = parseInt(
        this.cookieService.get("userId")
      );
      this.dss.officialSeasonId = this.cookieService.get(
        "officialSeasonId"
      );
      this.dss.seasonId = this.cookieService.get(
        "seasonId"
      );
      this.dss.roleId = this.cookieService.get("roleId");
      this.dss.leagueId = this.cookieService.get(
        "leagueId"
      );
      this.dss.reportTagLabel = parseInt(
        this.cookieService.get("reportTagLabel")
      );
      this.dss.roundThumbnail = this.cookieService.get(
        "roundThumbnail"
      );
      this.dss.name = this.cookieService.get(
        "name"
      );
      this.dss.textSize = this.cookieService.get(
        "textSize"
      );
      
      console.log(this.cookieService.get("isOfficial"));
      console.log(this.cookieService.get("isPlayer"));
      console.log(this.cookieService.get("isCoach"));

      if((this.cookieService.get("isOfficial"))=="true"){
        this.dss.isOfficial = true;       
      }
     
      if((this.cookieService.get("isPlayer"))=="true"){
        this.dss.isPlayer = true;       
      }

      if((this.cookieService.get("isCoach"))=="true"){
        this.dss.isCoach = true;       
      }

      if((this.cookieService.get("isOfficial"))==null){
        this.dss.isOfficial = false;
      }
     
      if((this.cookieService.get("isPlayer"))==null){
        this.dss.isPlayer = false;
      }

      if((this.cookieService.get("isCoach"))==null){
        this.dss.isCoach = false;
      }
 
      this.dss.email = this.cookieService.get(
        "email"
      );

      this.dss.VolunteerId = this.cookieService.get(
        "volunteerId"
      );
      this.dss.VolunteerSeasonalId = this.cookieService.get(
        "volunteerSeasonId"
      );
      this.dss.VolunteerStatusId = this.cookieService.get(
        "volunteerStatusId"
      );

      console.log(this.dss.isOfficial);
      console.log(this.dss.isPlayer);
      console.log(this.dss.isCoach);
      // console.log(this.cookieService);


      // logged in so return true
      return true;
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    return false;
  }  
}
