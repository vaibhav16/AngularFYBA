import { Component,ElementRef, OnInit,Renderer2 } from '@angular/core';
import { OfficialService } from './../official.service';
import { LoginService } from './../../login/login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  imgUrl:string = '';
  constructor(public officialService: OfficialService,
    public elRef: ElementRef,
     public loginService: LoginService,
     public renderer:Renderer2) {
    //const formData: FormData = new FormData();
   }

  ngOnInit() {
    // this.loginService.newRequest=true;
    // this.loginService.refreshRequest=false;
    this.officialService.fetchProfileData().then(res=>{
      
      if(this.officialService.profileJson["Value"][0].PersonalInfo.profilePhotos.length>0){
        this.imgUrl = this.officialService.profileJson["Value"][0].PersonalInfo.profilePhotos[0].Link;
        this.imgThumbnail = this.officialService.profileJson["Value"][0].PersonalInfo.profilePhotos[0].Thumbnail;
      }
    });
  }

 
  uploadTempImage:boolean;
  async processFile(imageInput:any){ 
    if(imageInput){
      console.log(imageInput.files[0]);
      var reader = await new FileReader();
      reader.onload = await this._handleReaderLoaded.bind(this);
      await reader.readAsBinaryString(imageInput.files[0]);
      

      
    }    
  }

  newImgByteCode;
  source_code;
  imgThumbnail:string = '';
 
  async _handleReaderLoaded(readerEvt) {
    var binaryString=null;
    binaryString = await readerEvt.target.result;   
    this.newImgByteCode = await btoa(binaryString);

    // var tempId = await this.elRef.nativeElement.querySelector('#temporaryImage');
    // var source_code = 'data:image/jpeg;base64,' + await this.newImgByteCode;
    //   await console.log(source_code);
    
    //   await this.renderer.setAttribute(tempId,'src',source_code);
     
    await this.officialService.uploadProfileImage(this.newImgByteCode).then(res=>{
      this.imgUrl=this.officialService.newImage;
      this.imgThumbnail=this.officialService.newThumbnail;
      console.log(this.imgUrl);
    });   

   }  

   deleteProfileImage(fileName){
    console.log(this.imgUrl);
    this.officialService.deleteProfileImage(this.imgUrl).then(res=>{
       this.imgUrl='';
       this.imgThumbnail='';
      });
   }
}
