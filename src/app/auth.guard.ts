import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from './login/login.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private loginService: LoginService) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.loginService.cookieService.check('SessionKey')) {
            this.loginService.sessionKey =  this.loginService.cookieService.get('SessionKey');    
            this.loginService.userId =  parseInt(this.loginService.cookieService.get('UserId')); 
            this.loginService.officialSeasonId =  this.loginService.cookieService.get('officialSeasonId'); 
            this.loginService.seasonId = this.loginService.cookieService.get('seasonId'); 
            this.loginService.roleId = this.loginService.cookieService.get('roleId');
            this.loginService.leagueId = this.loginService.cookieService.get('leagueId');  
            this.loginService.reportTagLabel = parseInt(this.loginService.cookieService.get('reportTagLabel'));
            // logged in so return true            
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}