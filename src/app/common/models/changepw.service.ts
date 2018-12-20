import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestMethod,JSONPConnection } from '@angular/http';
import { Constants } from './constants';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChangepwService {

  constructor(private http: Http) { }

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
}
