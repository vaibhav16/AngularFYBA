import { Component, OnInit } from '@angular/core';
import { OfficialService } from './../official.service';
import { LoginService } from './../../login/login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(public officialService: OfficialService, public loginService: LoginService) {
    //const formData: FormData = new FormData();
   }

  ngOnInit() {
    // this.loginService.newRequest=true;
    // this.loginService.refreshRequest=false;
    this.officialService.fetchProfileData().then(res=>{
      // this.loginService.newRequest=false;
    });
  }

  uploadedFiles: File[] = [];
  formData: FormData = new FormData();
  

  processFile(imageInput:any){

    const formData =  new FormData();    
    if(imageInput){
      console.log(imageInput.files[0]);
      formData.append('UserId', this.loginService.userId.toString());
      formData.append('SessionKey',this.loginService.sessionKey);
      formData.append('SeasonId',this.loginService.seasonId);
      formData.append('LeagueId',this.loginService.leagueId);
      formData.append('Page','Profile');
      formData.append('Files',imageInput.files[0], imageInput.files[0].name);
         
     
    
      this.officialService.uploadProfileImage(formData);

    }  
   
    // for(var i = 0; i < imageInput.files.length; i++) {     
    //   if (imageInput.files[i]) {
    //     this.formData.append(name, imageInput.files[i], imageInput.files[i].name);
    //     this.uploadedFiles.push(imageInput.files[i]);
    //     console.log(this.formData);  
    //   }
    // }

      
  }

  uploadPhoto(){
    var formData = new FormData();
    for (var file of this.uploadedFiles) {
        formData.append(name, file, file.name);
    }
    console.log(formData);
    //this.officialService.uploadProfileImage(this.uploadedFiles);
  }

}
