import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Constants } from '../models/constants';
import { map } from 'rxjs/operators';
import { DataSharingService } from './../../data-sharing.service';
import { FinalFilter } from '../../models/official/select-game/finalFilter.model';
import { LoginService } from './login.service';   
import { CookieService } from 'ngx-cookie-service';
//import { DataSharingService } from './../datasharing.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(public dataSharingService: DataSharingService,
    public cookieService: CookieService, 
    public loginService: LoginService,
    public http: Http){

  }

  apiModel: FinalFilter={
    UserID:'',
    SessionKey:'',
    RequestedData:''
   }

  TextSizeModel = {
    TextSize:''
  };

  request;
  toggleTextSize(){
    this.request=true;
    var currentTxtSize = this.cookieService.get('textSize');
		if(currentTxtSize=="Small")
		this.TextSizeModel.TextSize = "Large";
		else
		this.TextSizeModel.TextSize = "Small";
    this.apiModel.UserID = this.loginService.userId.toString();
    this.apiModel.SessionKey = this.loginService.sessionKey.toString();
    this.apiModel.RequestedData = JSON.stringify(this.TextSizeModel);

    var body = JSON.stringify(this.apiModel);
    console.log(this.apiModel);
    console.log(body);
    var headerOptions =  new Headers({'Content-Type':'application/json'});
    var requestOptions = new RequestOptions({method: RequestMethod.Put, headers: headerOptions});
    return this.http.post(Constants.apiURL+'/api/credreset/',body,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {     
      console.log(x);      
      if(x["Error"]=="200"){
        this.dataSharingService.textSize = this.TextSizeModel.TextSize;
        this.loginService.textSize = this.TextSizeModel.TextSize;
        this.cookieService.set('textSize',this.dataSharingService.textSize) ;
      }
      this.request=false;  

      return Promise.resolve();          
    }).catch(err=>{this.handleError(err)});

    }

    serviceError;
    private handleError(error: any) {    
      this.serviceError=true;    
      this.request=false;
      console.log('A Server Error has occured!', error);    
      }

}
