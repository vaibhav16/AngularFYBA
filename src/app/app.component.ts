import {
  Component,
  VERSION,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { LoginService } from "./common/services/login.service";
import { NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DataSharingService } from "./data-sharing.service";
import { CookieService } from "ngx-cookie-service";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  providers: [NgbModalConfig, NgbModal],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = "app";
  closeResult: string;
  siteOfflineText: string;

  constructor(
    config: NgbModalConfig,
    public loginService: LoginService,
    public dss: DataSharingService,
    public cookieService: CookieService
  ) {
    this.dss.textSize = this.cookieService.get(
      "textSize"
    );

    config.backdrop = "static";
    config.keyboard = false;
    //this.textSize = this.loginService.cookieService.get('textSize') ;
  }

  ngOnInit() {
    //console.log(!window.navigator.onLine);
    if (!window.navigator.onLine) {
     
    }
    this.dss.textSize = this.cookieService.get("textSize");
    //console.log(this.dss.textSize);
    var iOS = ["iPad", "iPhone", "iPod"].indexOf(navigator.platform) >= 0;
    //console.log(iOS);
  }
}
