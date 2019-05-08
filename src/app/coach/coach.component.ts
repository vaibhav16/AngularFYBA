import { Component, OnInit } from '@angular/core';
import { DataSharingService } from './../data-sharing.service';
import { CoachService }  from './coach.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.css']
})
export class CoachComponent implements OnInit {
  headerImg: string;
  calender_icon: string;
  game1: string;
  game2: string;
  team_icon: string;
  game_icon: string;
  report_icon: string;
  officiating: string;
  constructor(public dss: DataSharingService, 
    private coachService: CoachService,
    private router: Router) {
    this.calender_icon = './assets/images/calender_icon.png';
    this.game1 = './assets/images/game1.png';
    this.game2 = './assets/images/game2.png';
    this.team_icon = './assets/images/team_icon.png';
    this.game_icon = './assets/images/game_icon.png';
    this.report_icon = './assets/images/report_icon.png';
    this.officiating = './assets/images/officiating.png';
  }

  ngOnInit() {
    this.headerImg = 'coach_header_img';
    this.dss.currentRoute = 'coach';
    this.router.navigate(["/coach/profile"]);

  }
}
