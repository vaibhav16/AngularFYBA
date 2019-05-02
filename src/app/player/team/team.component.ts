import { Component, OnInit } from '@angular/core';
import { PlayerService } from './../player.service';
import { Router,NavigationExtras } from '@angular/router';
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { ComposeEmailComponent } from './compose-email/compose-email.component';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
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
    public router: Router,public config: NgbAccordionConfig,
    private modalService: BsModalService) {

      config.closeOthers=true;

  }



  ngOnInit() {
    this.emails = [];
    this.rosterEmails = [];
    //this.config.closeOthers = true;
    this.dataRequest=true;
    this.playerService.getTeamInfo()
    .subscribe(
      (res)=>{
        this.dataRequest=false;        
        this.teamInfo = JSON.parse(res["_body"]);
        console.log(this.teamInfo);
      }
    );

    this.playerService.indicate.subscribe(
      (value)=>{

        console.log("In Subject");
        console.log(value);
       this.emails = [];
       this.rosterEmails = [];
      }
     );

  
  }

  ngAfterViewInit(){
 
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
    console.log(this.playerService.recepient);
    console.log(this.emails);

    this.playerService.emailFlag = true;

    this.playerService.recepient = " ";

    for(var i in this.emails){
      this.playerService.recepient += this.emails[i] + ", ";    
    }

    this.playerService.recepient = this.playerService.recepient.slice(0, -2); 
    
    const interval = setInterval(()=>{   
      console.log("email flag:", this.playerService.emailFlag)   ;
      console.log(this.playerService.recepient);
      this.router.navigate(["/player/team/compose-email"]);
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

  rosterSendEmail(){

    // console.log(this.playerService.recepient);
    // console.log(this.rosterEmails);

    this.playerService.emailFlag = true;

    this.playerService.recepient = " ";

    for(var i in this.rosterEmails){
      this.playerService.recepient += this.rosterEmails[i] + ", ";    
    }

    this.playerService.recepient = this.playerService.recepient.slice(0, -2); 
    
    const interval = setInterval(()=>{   
      console.log("email flag:", this.playerService.emailFlag)   ;
      console.log(this.playerService.recepient);
      this.router.navigate(["/player/compose-email"]);
      clearInterval(interval);
    },1000)
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

  emails: string[] = [];
  rosterEmails: string[] = [];
  allowSendEmail:boolean;
  allowRosterSendEmail:boolean;
  checkboxChange(e: any, email ){
    console.log(email);
    if(e.currentTarget.checked){
      this.emails.push(email);
     
      this.allowSendEmail = true;
    }
    else{
    
      this.emails = this.emails.filter(item => item !== email);

      if(this.emails.length==0){
        this.allowSendEmail = false;     
      }
     
    }
    console.log(this.emails);
  }

  rosterCheckboxChange(e: any, roster ){
    console.log(roster);

    if(e.currentTarget.checked){

      for(var i=0; i<roster.Parents.length; ++i){
        this.rosterEmails.push(roster.Parents[i].ParentEmail)
      }
      // this.rosterEmails.push(email);
      // if(email2){
      //   this.rosterEmails.push(email);
      // }
      this.allowRosterSendEmail = true;
    }
    else{

      console.log("unchecked");
      console.log(this.rosterEmails);
      


      for(var i=0; i<roster.Parents.length; ++i){

        this.rosterEmails = this.rosterEmails.filter(item => item !== roster.Parents[i].ParentEmail);
      
      }

      if(this.rosterEmails.length==0){
        this.allowRosterSendEmail = false;     
      }

  
    }
    console.log(this.rosterEmails);
  }

  // panelChange(e:any){
  //   console.log(e);
  //   this.emails = [];
  // }

}
