import { Component, OnInit } from '@angular/core';
import { PlayerService } from './../player.service';

@Component({
  selector: 'app-player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.css']
})
export class PlayerProfileComponent implements OnInit {

  fetchingData:boolean;
  profileSection=null;

  constructor(public playerService: PlayerService) { 

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
    this.fetchingData=true;
    this.playerService.getPlayerProfile()
    .subscribe(
      (res)=>{
        console.log(res);        
        this.profileSection=JSON.parse(res["_body"]);
        console.log(this.profileSection);
        this.fetchingData=false;
      }
    )
  }

}
