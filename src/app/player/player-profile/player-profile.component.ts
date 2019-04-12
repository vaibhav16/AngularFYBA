import { Component, OnInit } from '@angular/core';
import { PlayerService } from './../player.service';

@Component({
  selector: 'app-player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.css']
})
export class PlayerProfileComponent implements OnInit {

  fetchingData:boolean;
  playerData;

  constructor(public playerService: PlayerService) { 

  }

  ngOnInit() {
    this.fetchingData=true;
    this.playerService.getPlayerProfile()
    .subscribe(
      (res)=>{
        console.log(res);
        this.playerData=res;
        this.fetchingData=false;
      }
    )
  }

}
