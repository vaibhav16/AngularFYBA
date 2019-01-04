import { Component, OnInit } from "@angular/core";
import { OfficialService } from "./../official.service";
import { LoginService } from "./../../common/services/login.service";

@Component({
  selector: "app-pay",
  templateUrl: "./pay.component.html",
  styleUrls: ["./pay.component.css"]
})
export class PayComponent implements OnInit {
  constructor(
    public officialService: OfficialService,
    public loginService: LoginService
  ) {}

  ngOnInit() {
    this.officialService.fetchGetPaidData().then(res => {
      // this.loginService.refreshRequest=false;
    });
  }
}
