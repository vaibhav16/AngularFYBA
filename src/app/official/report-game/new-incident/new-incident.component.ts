import { Component, OnInit, Input,TemplateRef,Output,EventEmitter  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { IncidentReports } from './../../classes/reportgame/Incident.model';
import { OfficialService } from './../../official.service';
import { CookieService } from "ngx-cookie-service";
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-new-incident',
  templateUrl: './new-incident.component.html',
  styleUrls: ['./new-incident.component.css']
})
export class NewIncidentComponent implements OnInit {

  incidentForm: FormGroup;
  public incidentTypes;
  public incidentSubDropDown;
  public depedentIncidentDropdown = [];
  public gameId;
  public incidentId:number;
  public subDropDownId:number;
  today= new Date();
  name: string;
  private readonly notifier: NotifierService;
  
  constructor(public fb: FormBuilder,
    public notifierService: NotifierService,
    public bsModalRef: BsModalRef,
    public modalService: BsModalService,
    public officialService: OfficialService,
    public cookieService: CookieService
    ) { 
      this.notifier = notifierService;
    }

 
  ngOnInit() {
    //console.log(this.gameId);
    //console.log(this.incidentTypes);
    //console.log(this.incidentSubDropDown);
   // console.log(this.depedentIncidentDropdown);
    //console.log(this.name);
    // this.name= this.cookieService.get("name");
    this.incidentForm = this.fb.group({
      incidentType: ["",Validators.required],
      incidentSubDropDown: [{value:"" , disabled: true},Validators.required],
      note: [{value:"" , disabled: true},Validators.required]
    });
  }

  incidentSelected(){    
    const incidentType = this.incidentForm.get('incidentType').value;
    for(var i=0; i<this.incidentTypes.length; ++i){
      if(this.incidentTypes[i]['DependentDropdownName']==incidentType){
        this.incidentId = this.incidentTypes[i]['Id'];
      }
    }

    this.depedentIncidentDropdown = this.incidentSubDropDown[incidentType];
    if(this.depedentIncidentDropdown){
      this.incidentForm.controls['incidentSubDropDown'].enable();
      this.incidentForm.controls['note'].enable();
    }
  }

  dependentDropDownSelected(){
    for(var i=0; i<this.depedentIncidentDropdown.length; ++i){
      if(this.depedentIncidentDropdown[i]['Item']==this.incidentForm.get('incidentSubDropDown').value){
        this.subDropDownId = this.depedentIncidentDropdown[i]['Id'];
      }
    }
  }

  incident: IncidentReports = {
    GameId:null,
    IncidentId:null,
    IncidentType:null,
    IncidentValue:null,
    Notes:''
  };

  submitForm(){
    //console.log(this.incidentForm.value); 
    //“Be sure to save the Game Report to complete the incident reporting.”
    this.notifier.notify( 'success', 'Be sure to save the Game Report to complete the incident reporting' );
    this.incident.GameId = this.gameId;
    this.incident.IncidentId = null;
    this.incident.IncidentType = this.incidentId;
    this.incident.IncidentValue =this.subDropDownId;
    this.incident.Notes = this.incidentForm.get('note').value;
    console.log(this.incident);
    this.officialService.IncidentReports.push(this.incident);
    //this.officialService.IncidentReports = this.officialService.IncidentReports.slice();
    console.log(this.officialService.IncidentReports);
    this.bsModalRef.hide();
    //this.notifier.notify( 'success', 'You are awesome! I mean it!' );
  }
}