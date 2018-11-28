import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { FinalFilter } from '../../models/official/select-game/finalFilter.model';
//import { read } from 'fs';

@Injectable({
  providedIn: 'root'
})

export class ImageServiceService {
  finalFilter: FinalFilter={
    UserID:'11221',
    SessionKey:'',
    RequestedData:''
   }

  constructor(private http: Http) {}
  base64textString: string;


  async uploadImage(image: File){
    const formData = new FormData();
    console.log(image);
    
    if (image) {
      var reader = new FileReader();
      reader.onload = await this._handleReaderLoaded.bind(this);
      this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(image);
  }

    //formData.append('image', image);


  
  }

 async _handleReaderLoaded(readerEvt) {
    var binaryString = await readerEvt.target.result;
    this.base64textString = await btoa(binaryString);
    this.finalFilter.RequestedData = await this.base64textString;
    var body = await JSON.stringify(this.finalFilter);
    console.log(body);
    this.http.post('http://testfaafireworks.1city.us/api/ImageUp', body);
    //console.log(btoa(binaryString));
   }
}