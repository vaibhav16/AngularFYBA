import { Component, OnInit } from '@angular/core';
import { PlayerService } from './player.service';
import { IPlayerList } from './models/IPlayerList.interface';
import { Router } from '@angular/router';
import { DataSharingService } from './../data-sharing.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  //--Image Declarations
  headerImg: string;
  calender_icon: string;
  team_icon: string;
  share_icon: string;
  report_icon: string;
  officiating: string;
  player1: string;
  player2: string;
  //--Image Declarations

  //--Variable Declarations
  dataRequest: boolean;
  public playerSection: IPlayerList = null;
  constructor(
    public playerService: PlayerService,
    public router: Router,
    public dss: DataSharingService
  ) {
    this.calender_icon = './assets/images/calender_icon.png';
    this.team_icon = './assets/images/team-icon.png';
    this.share_icon = './assets/images/share-icon.png';
    this.report_icon = './assets/images/report_icon.png';
    this.officiating = './assets/images/officiating.png';
    this.player1 = './assets/images/player-1.png';
    this.player2 = './assets/images/player-2.png';
    this.headerImg = 'player_header_img';
  }

  ngOnInit() {
    this.getPlayerData();
    this.dss.currentRoute = 'player';
    this.playerData = this.playerLists[0];
  }

  getPlayerData() {
    this.playerService.getPlayerData().subscribe((res) => {
      //console.log(res);
      this.playerSection = JSON.parse(res['_body']);
      this.dataRequest = false;
      console.log(this.playerLists);
    });
  }

  get playerLists() {
    return this.playerSection.Value[0]['playerList'];
  }

  playerData: JSON;
  filterPlayer(id: number) {
    console.log(this.playerData);
    this.playerData = this.playerLists.filter((item) => item.PlayerId == id);
  }
}
