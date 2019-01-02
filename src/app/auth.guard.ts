import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from './common/services/login.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private loginService: LoginService) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.loginService.cookieService.check('sessionKey')) {            
            this.loginService.sessionKey =  this.loginService.cookieService.get('sessionKey');    
            this.loginService.userId =  parseInt(this.loginService.cookieService.get('userId')); 
            this.loginService.officialSeasonId =  this.loginService.cookieService.get('officialSeasonId'); 
            this.loginService.seasonId = this.loginService.cookieService.get('seasonId'); 
            this.loginService.roleId = this.loginService.cookieService.get('roleId');
            this.loginService.leagueId = this.loginService.cookieService.get('leagueId');  
            this.loginService.reportTagLabel = parseInt(this.loginService.cookieService.get('reportTagLabel'));
            this.loginService.roundThumbnail = this.loginService.cookieService.get('roundThumbnail');
            this.loginService.textSize = this.loginService.cookieService.get('textSize');
            // logged in so return true            
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}