import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.css"]
})
export class PlayerComponent implements OnInit {
  headerImg: string;
  calender_icon: string;
  team_icon: string;
  share_icon: string;
  report_icon: string;
  officiating: string;
  player1: string;
  player2: string;
  constructor() {
    this.calender_icon = "./assets/images/calender_icon.png";
    this.team_icon = "./assets/images/team-icon.png";
    this.share_icon = "./assets/images/share-icon.png";
    this.report_icon = "./assets/images/report_icon.png";
    this.officiating = "./assets/images/officiating.png";
    this.player1 = "./assets/images/player-1.png";
    this.player2 = "./assets/images/player-2.png";
  }
  ngOnInit() {
    this.headerImg = "player_header_img";
  }
}
