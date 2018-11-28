import { Component, OnInit } from '@angular/core';
import { OfficialService } from './../official.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(public officialService: OfficialService) {
    //const formData: FormData = new FormData();
   }

  ngOnInit() {
    this.officialService.fetchProfileData();
  }

  uploadedFiles: File[] = [];
  formData: FormData = new FormData();
  

  processFile(imageInput:any){
    for(var i = 0; i < imageInput.files.length; i++) {     
      if (imageInput.files[i]) {
        this.formData.append(name, imageInput.files[i], imageInput.files[i].name);
        this.uploadedFiles.push(imageInput.files[i]);
        console.log(this.formData);  
      }
    }
      
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
