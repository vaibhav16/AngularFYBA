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
  profileSection=null;

  constructor(public playerService: PlayerService,
    public router: Router) { 

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
    //this.router.navigate(["/player/profile"]);
    console.log("Player Id in profile:"+this.playerService.playerId);
    this.fetchingData=true;
    this.playerService.getPlayerProfile()
    .subscribe(
      (res)=>{
        this.profileSection=JSON.parse(res["_body"]);
        console.log(this.profileSection);
        this.fetchingData=false;
      }
    )
  }

}
