import { Component, OnInit } from '@angular/core';
import { PlayerService } from './../player.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.css']
})
export class PlayerProfileComponent implements OnInit {

  fetchingData:boolean;
  
  constructor(public playerService: PlayerService,
    public router: Router) { 

  }

  
  get profileSection(){
    return this.playerService.profileData;
  }


  get parentInfo(){
    return this.profileSection.Value.parentInfo;
  }

  get registrationStatus(){
    return this.profileSection.Value.registrationStatus;
  }

  get apparel(){
    return this.profileSection.Value.apparel;
  }

  
   ngOnInit() {
    console.log(this.playerService.profileData);
    //this.router.navigate(["/player/profile"]);
    //this.fetchingData=true;
  
    console.log("Player Id in profile:"+this.playerService.playerId);


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

  // ngAfterViewInit(){
  //   this.fetchingData=false;
  // }

}
