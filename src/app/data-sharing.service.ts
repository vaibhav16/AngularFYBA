import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: "root"
})
export class DataSharingService {
  constructor(public cookieService: CookieService) {
    this.textSize = this.cookieService.get(
      "textSize"
    );
  }
  textSize: string = null;
  initialFetchError: boolean = null;
}
