import { Component, OnInit } from '@angular/core';
import { PlayerService } from './../player.service';
import { Router,NavigationExtras } from '@angular/router';
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { ComposeEmailComponent } from './compose-email/compose-email.component';
import { Team } from './../models/team.model';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})

export class TeamComponent implements OnInit {
  
  modalRef: BsModalRef;
  selectAll:boolean = false;
  teamInfo : Team =null;
  dataRequest:boolean;

  constructor(public playerService: PlayerService,
    public router: Router,
    private modalService: BsModalService) {
  

  }



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

    this.playerService.emailFlag = true;

    this.playerService.recepient = " ";

    for(var i in this.emails){
      this.playerService.recepient += this.emails[i] + ", ";    
    }

    this.playerService.recepient = this.playerService.recepient.slice(0, -2); 
    
    const interval = setInterval(()=>{   
      console.log("email flag:", this.playerService.emailFlag)   ;
      console.log(this.playerService.recepient);
      this.router.navigate(["/player/compose-email"]);
      clearInterval(interval);
    },1000)

  
    // const initialState = {
    //   recepient: '1'
    // };

    // this.modalRef = this.modalService.show(
    //   ComposeEmailComponent,
    //   Object.assign({}, { class: 'customModalWidth75', initialState })
    // );
  }

  updateAll(){
    this.emails = [];
    if(this.selectAll === true){
      this.allowSendEmail=true;
      this.TeamLeaders.map((leader)=>{       
        if(leader.Email.length>1){
          leader.selected=true;
          this.emails.push(leader.Email);
        }
       
      })
    }
    else{
      this.emails = [];
      this.allowSendEmail=false;
      this.TeamLeaders.map((leader)=>{
        leader.selected=false;
      })
    }

    console.log(this.emails);
  }

  emails: string[] = []
  allowSendEmail:boolean;
  checkboxChange(e: any, email ){
    if(e.currentTarget.checked){
      this.emails.push(email);
      this.allowSendEmail = true;
    }
    else{
      this.allowSendEmail = false;     
      this.emails = this.emails.filter(item => item !== email);
    }
    console.log(this.emails);
  }

}
