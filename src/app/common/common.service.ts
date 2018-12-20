import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestMethod,JSONPConnection } from '@angular/http';
import { Constants } from './../models/constants';
import { map } from 'rxjs/operators';
import { FinalFilter } from './../models/official/select-game/finalFilter.model';
import { LoginService } from './../login/login.service';
//import { DataSharingService } from './../datasharing.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: Http, 
    public loginService: LoginService,
    public dataSharingService) { }

  changePassword(apiModel: string){
    this.request=true;
    console.log(apiModel);
    var headerOptions =  new Headers({'Content-Type':'application/json'});
    var requestOptions = new RequestOptions({method: RequestMethod.Post, headers: headerOptions});
    return this.http.post(Constants.apiURL+'/api/credreset/',apiModel,requestOptions)
    .pipe(map((data: Response) => {
      return data.json()
    })).toPromise().then(x => {     
      console.log(x);
      this.request=false;  
      return Promise.resolve();          
    }).catch(err=>{this.handleError(err)});

   }

   serviceError=false;
   request=false;
   private handleError(error: any) {    
    this.serviceError=true;
    this.request=false;
  
    console.log('A Server Error has occured!', error);    
    }

    apiModel: FinalFilter={
      UserID:'',
      SessionKey:'',
      RequestedData:''
     }

     TextSizeModel = {
      TextSize:''
    };

    toggleTextSize(){
    this.request=true;
    var currentTxtSize = this.loginService.cookieService.get('textSize');
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
        //this.dataSharingService.textSize = this.TextSizeModel.TextSize;
        this.loginService.textSize = this.TextSizeModel.TextSize;
        this.loginService.cookieService.set('textSize',this.loginService.textSize) ;
      }
      this.request=false;  

      return Promise.resolve();          
    }).catch(err=>{this.handleError(err)});
      
    }
}
