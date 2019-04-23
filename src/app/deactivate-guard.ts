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
import { PlayerService } from './player/player.service';


@Injectable({
  providedIn: 'root'
})

export class DeactivateGuard implements CanDeactivate<any> {

  constructor(private dss: DataSharingService) { }

  canDeactivate(component: any) {
    // will prevent user from going back
    if (this.dss.isBackButtonClicked) {
      this.dss.isBackButtonClicked = false;
      // push current state again to prevent further attempts.
      history.pushState(null, null, location.href);
      return false;
    }
    return true;
  }
}
