import { Component, OnInit } from '@angular/core';
import { PlayerService } from './../player.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Form } from '@angular/forms';

@Component({
  selector: 'app-player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.css']
})
export class PlayerProfileComponent implements OnInit {

  fetchingData: boolean;
  detailsForm;

  constructor(public playerService: PlayerService,
    public router: Router, private fb: FormBuilder) {

    // this.detailsForm = this.fb.group({
    //   email:this.fb.control([]),
    //   homePhone:this.fb.control([]),
    //   mobilePhone:this.fb.control([]),
    //   workPhone:this.fb.control([])
    // });

  }


  get profileSection() {
    return this.playerService.profileData;
  }


  get parentInfo() {
    return this.profileSection.Value.parentInfo;
  }

  get registrationStatus() {
    return this.profileSection.Value.registrationStatus;
  }

  get apparel() {
    return this.profileSection.Value.apparel;
  }


  ngOnInit() {
    console.log(this.playerService.profileData);
    //this.router.navigate(["/player/profile"]);
    //this.fetchingData=true;

    console.log("Player Id in profile:" + this.playerService.playerId);


    //this.fetchingData=true;

    // this.playerService.getPlayerProfile()
    // .subscribe(
    //   (res)=>{
    //     this.profileSection=JSON.parse(res["_body"]);
    //     console.log(this.profileSection);
    //     this.fetchingData=false;
    //   }
    // )
  }

  validEmail:boolean;

  onChange(newValue) {
    console.log(newValue);
    const validEmailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (validEmailRegEx.test(newValue)) {
        this.validEmail = true;
    }else {
      this.validEmail = false;
    }

  }

  // ngAfterViewInit(){
  //   this.fetchingData=false;
  // }

}
