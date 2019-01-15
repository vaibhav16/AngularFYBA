import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { LoginService } from "./common/services/login.service";
import { CookieService } from "ngx-cookie-service";
import { DataSharingService } from './data-sharing.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, 
    private cookieService: CookieService,
    private dataSharingService: DataSharingService,
    private loginService: LoginService) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.cookieService.check("sessionKey")) {
      this.loginService.sessionKey = this.cookieService.get(
        "sessionKey"
      );
      this.loginService.userId = parseInt(
        this.loginService.cookieService.get("userId")
      );
      this.loginService.officialSeasonId = this.cookieService.get(
        "officialSeasonId"
      );
      this.loginService.seasonId = this.cookieService.get(
        "seasonId"
      );
      this.loginService.roleId = this.cookieService.get("roleId");
      this.loginService.leagueId = this.cookieService.get(
        "leagueId"
      );
      this.loginService.reportTagLabel = parseInt(
        this.loginService.cookieService.get("reportTagLabel")
      );
      this.loginService.roundThumbnail = this.cookieService.get(
        "roundThumbnail"
      );
      this.dataSharingService.textSize = this.cookieService.get(
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
