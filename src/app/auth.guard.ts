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
      // logged in so return true
      return true;
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    return false;
  }  
}
