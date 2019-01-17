import { Component, OnInit, Input,TemplateRef,Output,EventEmitter  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { IncidentReports } from './../../classes/reportgame/Incident.model';
import { OfficialService } from './../../official.service';
import { DatePipe } from '@angular/common';
import { CookieService } from "ngx-cookie-service";

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
  
  constructor(public fb: FormBuilder,
    public bsModalRef: BsModalRef,
    public modalService: BsModalService,
    public officialService: OfficialService,
    public cookieService: CookieService
    ) { }

 
  ngOnInit() {
    console.log(this.gameId);
    console.log(this.incidentTypes);
    console.log(this.incidentSubDropDown);
    console.log(this.depedentIncidentDropdown);
    console.log(this.name);
    this.name= this.cookieService.get("name");
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
    console.log(this.incidentForm.value); 
    this.incident.GameId = this.gameId;
    this.incident.IncidentId = null;
    this.incident.IncidentType = this.incidentId;
    this.incident.IncidentValue =this.subDropDownId;
    this.incident.Notes = this.incidentForm.get('note').value;
    console.log(this.incident);
    this.officialService.IncidentReports.push(this.incident);
    console.log(this.officialService.IncidentReports);
    this.bsModalRef.hide();
  }
}