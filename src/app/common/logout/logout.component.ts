import { Component, OnInit, AfterViewInit } from "@angular/core";
import { LoginService } from "./../services/login.service";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-logout",
  templateUrl: "./logout.component.html",
  styleUrls: ["./logout.component.css"]
})
export class LogoutComponent implements OnInit {
  constructor(public cookieService: CookieService, private router: Router) {}

  ngOnInit() {
    this.cookieService.deleteAll();
  }

  ngAfterViewInit() {
    if (!this.cookieService.check("sessionKey")) {
      this.router.navigate(["login"]);
    } else {
      this.cookieService.deleteAll();
      this.router.navigate(["login"]);
    }
  }
}
