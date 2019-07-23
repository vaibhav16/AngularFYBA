import { Component, OnInit } from '@angular/core';
import { Router,NavigationExtras } from '@angular/router';
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { CoachTeam } from '../models/blastemail.model';

@Component({
  selector: 'app-coachteam',
  templateUrl: './coachteam.component.html',
  styleUrls: ['./coachteam.component.css']
})
export class CoachteamComponent{
  CoachTeaminfo:CoachTeam=null;
  constructor(public router: Router,public config: NgbAccordionConfig,private modalService: BsModalService) { }

  ngOnInit() {
  }

  sendEmail(type){
        this.router.navigate(["/coach/blastemail",{blasttype:type}]);
    
  }
   
}
