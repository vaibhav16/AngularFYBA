import { Component, OnInit } from '@angular/core';
import { PlayerService } from './../player.service';
import { Router,NavigationExtras } from '@angular/router';
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { ComposeEmailComponent } from './compose-email/compose-email.component';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})

export class TeamComponent implements OnInit {
  
  modalRef: BsModalRef;
  constructor(public playerService: PlayerService,
    public router: Router,
    private modalService: BsModalService) {
  

  }

  teamInfo=null;
  dataRequest:boolean;


  ngOnInit() {
    this.dataRequest=true;
    this.playerService.getTeamInfo()
    .subscribe(
      (res)=>{
        this.dataRequest=false;        
        this.teamInfo = JSON.parse(res["_body"]);
        console.log(this.teamInfo);
      }
    )
  }

  get TeamLeaders(){
    return this.teamInfo.Value.TeamLeaders;
  }

  get TeamPractices(){
    return this.teamInfo.Value.TeamPractices;
  }
  
  get TeamRoster(){
    return this.teamInfo.Value.TeamRoster;
  }

  get TeamName(){
    return this.teamInfo.Value.TeamName;
  }

  get TeamGames(){
    return this.teamInfo.Value.TeamGames;
  }


  sendEmail(){

    this.playerService.emailFlag=true;
    
    this.router.navigate(["/player/compose-email"]);

    this.playerService.recepient = "sample@gmail.com"
 
  
    // const initialState = {
    //   recepient: '1'
    // };

    // this.modalRef = this.modalService.show(
    //   ComposeEmailComponent,
    //   Object.assign({}, { class: 'customModalWidth75', initialState })
    // );
  }

}
