import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-coach',
	templateUrl: './coach.component.html',
	styleUrls: ['./coach.component.css']
})
export class CoachComponent implements OnInit {
	
	headerImg:string;
	calender_icon:string;
	game1:string;
	game2:string;
	team_icon:string;
	game_icon:string;
	report_icon:string;
	officiating:string;
	constructor() {
		this.calender_icon = './assets/images/calender_icon.png';
		this.game1 = './assets/images/game1.png';
		this.game2 = './assets/images/game2.png';
		this.team_icon = './assets/images/team-icon.png';
		this.game_icon = './assets/images/game_icon.png';
		this.report_icon = './assets/images/report_icon.png';
		this.officiating = './assets/images/officiating.png';
	}
	ngOnInit() {
		this.headerImg = 'coach_header_img';
	}
	
	
}