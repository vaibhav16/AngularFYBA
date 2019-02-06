import { Injectable, ViewChild } from "@angular/core";
import { Login } from "./../models/login.model";
import {
  Http,
  Response,
  Headers,
  RequestOptions,
  RequestMethod
} from "@angular/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { DataSharingService } from "./../../data-sharing.service";
import { OfficialService } from "./../../official/official.service";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { Observable } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { Constants } from "./../models/constants";
import { IUserData } from './../models/IUser.model';
import { dataUri } from "@rxweb/reactive-form-validators";

@Injectable({
  providedIn: "root"
})
export class LoginService {
  email: string = null;
  requestStatus: boolean = null;
  
  // isLoggedIn: boolean;
  // jsonResult: JSON;
  // loginFailed: boolean;
  // userId: number = null;
  // reportTagLabel: number = null;
  // sessionKey: string = null;
  // officialSeasonId: string = null;
  // seasonId: string = null;
  // roleId: string = null;
  // leagueId: string = null;
  // roundThumbnail: string = null;
  // textSize: string = null;
  // promptChangePassword: string = null;
  // name: string = null;

  constructor(
    private http: Http,
    private router: Router,
    public cookieService: CookieService,
    public dataSharingService: DataSharingService
  ) {
    //this.isLoggedIn = false;
    //console.log(this.isLoggedIn);
  }

  postLoginCredentials(userVar:Login):Observable<IUserData>{
    var headerOptions = new Headers({"Content-Type":"application/json"});
    var requestOptions = new RequestOptions({
      method:RequestMethod.Post,
      headers:headerOptions
    });
    return this.http.post(Constants.apiURL + "/api/Home", userVar, requestOptions)
    .pipe(map(
      (res) => <IUserData>res.json()
    ))
  }

  // postLoginData(userVar: Login) {
  //   this.loginFailed = false;
  //   this.serviceError = false;
  //   this.requestStatus = true;
  //   userVar.Email = userVar.Email.toLowerCase();
  //   var headerOptions = new Headers({ "Content-Type": "application/json" });
  //   var requestOptions = new RequestOptions({
  //     method: RequestMethod.Post,
  //     headers: headerOptions
  //   });
  //   return this.http
  //     .post(Constants.apiURL + "/api/Home", userVar, requestOptions)
  //     .pipe(
  //       map((data: Response) => {
  //         return data.json() as JSON;
  //       })
  //     )
  //     .toPromise()
  //     .then(x => {
  //       console.log(x);
  //       this.jsonResult = x;
  //       this.sessionKey = x["SessionKey"];
  //       this.requestStatus = false;

  //       if (this.jsonResult["Error"] == 200) {
  //         this.cookieService.set("sessionKey", this.sessionKey, 365);
  //         this.cookieService.set(
  //           "userId",
  //           this.jsonResult["Value"].UserId,
  //           365
  //         );
  //         this.cookieService.set(
  //           "officialSeasonId",
  //           this.jsonResult["Value"].OfficialSeasonalId,
  //           365
  //         );
  //         this.cookieService.set(
  //           "seasonId",
  //           this.jsonResult["Value"].SeasonId,
  //           365
  //         );
  //         this.cookieService.set(
  //           "roleId",
  //           this.jsonResult["Value"].RoleId,
  //           365
  //         );
  //         this.cookieService.set(
  //           "leagueId",
  //           this.jsonResult["Value"].LeagueId,
  //           365
  //         );
  //         this.cookieService.set(
  //           "reportTagLabel",
  //           this.jsonResult["Value"].tagsLables.ReportCount,
  //           365
  //         );
  //         this.cookieService.set(
  //           "textSize",
  //           this.jsonResult["Value"].Text_Size,
  //           365
  //         );
  //         this.cookieService.set(
  //           "name",
  //           this.jsonResult["Value"].FirstName+this.jsonResult["Value"].LastName,
  //           365
  //         );
       
  //         this.cookieService.set("email", this.jsonResult["Value"].Email, 365);
  //         this.cookieService.set("name", this.jsonResult["Value"].FirstName + " " + this.jsonResult["Value"].LastName, 365);
  //         this.dataSharingService.textSize = this.jsonResult["Value"].Text_Size;
  //         //console.log
  //         if (
  //           this.jsonResult["Value"].RoundThumbnail != null &&
  //           this.jsonResult["Value"].RoundThumbnail.length > 0
  //         ) {
  //           this.cookieService.set(
  //             "roundThumbnail",
  //             this.jsonResult["Value"].RoundThumbnail,
  //             365
  //           );
  //         }

  //         this.isLoggedIn = true;
  //         this.loginFailed = false;
  //         this.userId = this.jsonResult["Value"].UserId;
  //         this.router.navigate(["official"]);
  //         this.officialSeasonId = this.jsonResult["Value"].OfficialSeasonalId;
  //         //console.log(this.officialSeasonId);
  //         this.seasonId = this.jsonResult["Value"].SeasonId;
  //         this.roleId = this.jsonResult["Value"].RoleId;
  //         this.leagueId = this.jsonResult["Value"].LeagueId;
  //         this.reportTagLabel = this.jsonResult["Value"].tagsLables.ReportCount;
  //         this.email = this.jsonResult["Value"].Email;
  //         this.textSize = this.jsonResult["Value"].Text_Size;
  //         this.promptChangePassword = this.jsonResult[
  //           "Value"
  //         ].PromptChangePassword;
  //         this.name = this.jsonResult["Value"].FirstName + " " + this.jsonResult["Value"].LastName;
  //       } else {
  //         this.isLoggedIn = false;
  //         this.loginFailed = true;
  //         this.errorMsg = "Username/Password do not match. \nPlease try again.";
  //       }
  //     })
  //     .catch(err => {
  //       this.handleError(err);
  //     });
  // }

  // serviceError: boolean;
  // errorMsg: string;
  // private handleError(error: any) {
  //   this.serviceError = true;
  //   this.requestStatus = false;
  //   this.errorMsg = "A Server Error has Occured! Please try again later.";
  //   console.log("A Server Error has occured!", error);
  // }
}
