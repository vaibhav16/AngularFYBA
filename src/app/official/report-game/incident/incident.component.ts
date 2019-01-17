import { Component, OnInit, Input,TemplateRef,Output,EventEmitter  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { IncidentReports } from './../../classes/reportgame/Incident.model';
import { OfficialService } from './../../official.service';

@Component({
  selector: 'app-incident',
  templateUrl: './incident.component.html',
  styleUrls: ['./incident.component.css']
})
export class IncidentComponent implements OnInit {
  //@Output() newIncident: EventEmitter<any> = new EventEmitter<any>();
  public incidentTypes;
  public incidentSubDropDown;
  public depedentIncidentDropdown = [];
  public gameId;
  
  constructor(public fb: FormBuilder,
    public bsModalRef: BsModalRef,
    public modalService: BsModalService,
    public officialService: OfficialService
    ) { }

  incidentForm: FormGroup
  incidentId:number;
  subDropDownId:number;
  ngOnInit() {
    console.log(this.gameId);
    console.log(this.incidentTypes);
    console.log(this.incidentSubDropDown);
    console.log(this.depedentIncidentDropdown);
    this.incidentForm = this.fb.group({
      incidentType: ["",Validators.required],
      incidentSubDropDown: [{value:"" , disabled: true},Validators.required],
      note: [{value:"" , disabled: true},Validators.required]
    });
  }

  incidentSelected(){    
    const incidentType = this.incidentForm.get('incidentType').value;
    //console.log(incidentType);
    //console.log(this.incidentTypes);
   
    for(var i=0; i<this.incidentTypes.length; ++i){
      //console.log(this.incidentTypes[i]);
      if(this.incidentTypes[i]['DependentDropdownName']==incidentType){
        this.incidentId = this.incidentTypes[i]['Id'];
      }
    }

    this.depedentIncidentDropdown = this.incidentSubDropDown[incidentType];
    if(this.depedentIncidentDropdown){
      this.incidentForm.controls['incidentSubDropDown'].enable();
      this.incidentForm.controls['note'].enable();
    }
    //console.log(this.incidentForm.value);
  }

  dependentDropDownSelected(){
    //console.log(this.depedentIncidentDropdown);
    for(var i=0; i<this.depedentIncidentDropdown.length; ++i){
      //console.log(this.depedentIncidentDropdown[i]);
      if(this.depedentIncidentDropdown[i]['Item']==this.incidentForm.get('incidentSubDropDown').value){
        this.subDropDownId = this.depedentIncidentDropdown[i]['Id'];
        //console.log(this.subDropDownId);
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
    //this.incident.IncidentType = this.incidentForm.get('incidentType').value;
    this.incident.IncidentType = this.incidentId;
    this.incident.IncidentValue =this.subDropDownId;
    this.incident.Notes = this.incidentForm.get('note').value;
    console.log(this.incident);
    this.officialService.IncidentReports.push(this.incident);
    console.log(this.officialService.IncidentReports);
    this.bsModalRef.hide();
    //this.newIncident.emit(this.newIncident);
  }
}
