import { Component, OnInit, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IncidentReports } from './../../classes/reportgame/Incident.model';
import { OfficialService } from './../../official.service';
import { CookieService } from 'ngx-cookie-service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-show-incident',
  templateUrl: './show-incident.component.html',
  styleUrls: ['./show-incident.component.css']
})
export class ShowIncidentComponent implements OnInit {
  public incident;
  public name: string;
  public gameid: number;
  public allIncidentTypes;
  public allDependentDropdowns;
  public depedentIncidentDropdown = [];
  public dependentDropDownName;
  today = new Date();
  private readonly notifier: NotifierService;

  constructor(
    public fb: FormBuilder,
    public bsModalRef: BsModalRef,
    public cookieService: CookieService,
    public officialService: OfficialService,
    public notifierService: NotifierService,
  ) {
    this.notifier = notifierService;
  }

  editIncidentForm: FormGroup;
  ngOnInit() {
    //console.log(this.incident);
    // console.log(this.allIncidentTypes);
    // console.log(this.allDependentDropdowns);
    this.name = this.incident.FiledByName;
    this.gameid = this.incident.GameId;
    this.editIncidentForm = this.fb.group({
      incidentType: [this.returnIncidentType(), Validators.required],
      incidentSubDropDown: [this.returnIncidentSubDropdown()],
      note: [this.incident.Notes, Validators.required]
    });
    //console.log(this.editIncidentForm.value);
  }

  isOther:boolean;
  returnIncidentType() {
    let selectedValue;
    
    for (var i = 0; i < this.allIncidentTypes.length; ++i) {
      if (this.allIncidentTypes[i]['Id'] == this.incident.IncidentType) {
        selectedValue = this.allIncidentTypes[i]['Item'];
        this.dependentDropDownName = this.allIncidentTypes[i]['DependentDropdownName'];
      }
    }
    this.depedentIncidentDropdown = this.allDependentDropdowns[this.dependentDropDownName];
    // console.log(this.depedentIncidentDropdown);
    // console.log(this.dependentDropDownName);
    //selectedValue=='Other'? this.isOther=true: this.isOther=false;

    console.log(selectedValue);

    return selectedValue? selectedValue:'Other';
  }

  returnIncidentSubDropdown() {
    this.depedentIncidentDropdown=[];
    console.log(this.dependentDropDownName);
    let selectedValue;
    if(this.dependentDropDownName){
      for (var i = 0; i < this.allDependentDropdowns[this.dependentDropDownName].length; ++i) {
        if (
          this.allDependentDropdowns[this.dependentDropDownName][i]['Id'] ==
          this.incident.IncidentValue
        ) {
          selectedValue = this.allDependentDropdowns[this.dependentDropDownName][i]['Item'];
          //this.dependentSubDropDownName = this.incidentTypes[i]['DependentDropdownName'];
        }
      }
      this.editIncidentForm.controls['incidentSubDropDown'].setValidators([Validators.required]);
    }
    // else{
    //   this.editIncidentForm.controls['incidentSubDropDown'].setValidators([]);
    // }

    return selectedValue;
  }

  incidentSelected() {
    const incidentType = this.editIncidentForm.get('incidentType').value;
    this.depedentIncidentDropdown = [];
    let incidentDropdownName;

    for (var i = 0; i < this.allIncidentTypes.length; ++i) {
      if (this.allIncidentTypes[i]['Item'] == incidentType) {
        this.incidentTypeId = this.allIncidentTypes[i]['Id'];
        incidentDropdownName = this.allIncidentTypes[i]['DependentDropdownName'];
      }
    }

    if(incidentType!='Other'){  
      this.depedentIncidentDropdown = this.allDependentDropdowns[incidentDropdownName];
    }
    else {
      this.editIncidentForm.controls['incidentSubDropDown'].setValidators([]);
    }  
    return  this.incidentTypeId;
  }

  incidentTypeId;
  dependentDropdownId;

  dependentDropDownSelected() {
    //console.log(this.depedentIncidentDropdown);
    if(this.depedentIncidentDropdown){
      for (var i = 0; i < this.depedentIncidentDropdown.length; ++i) {
        if (
          this.depedentIncidentDropdown[i]['Item'] ==
          this.editIncidentForm.get('incidentSubDropDown').value
        ) {
          this.dependentDropdownId = this.depedentIncidentDropdown[i]['Id'];
          console.log(this.dependentDropdownId);
        }
      }
      return this.dependentDropdownId;
    }
    return null;
 
  }

  // changedIncident: IncidentReports = {
  //   GameId: null,
  //   IncidentId: null,
  //   IncidentType: null,
  //   IncidentValue: null,
  //   Notes: ''
  // };

  submitForm() {
    console.log(this.editIncidentForm.value);
    this.notifier.notify( 'success', 'Be sure to save the Game Report to complete the incident reporting' );

    const changedIncident = IncidentReports.create({
      GameId: this.gameid,
      IncidentId: this.incident.IncidentId,
      IncidentType: this.incidentSelected(),
      IncidentValue:  this.dependentDropDownSelected(),
      Notes:this.editIncidentForm.get('note').value
    })

    console.log(changedIncident);

    // this.changedIncident.GameId = this.gameid;
    // this.changedIncident.IncidentId = this.incident.IncidentId;
    // this.changedIncident.IncidentType = this.incidentSelected();
    // this.changedIncident.IncidentValue = this.dependentDropDownSelected();
    // this.changedIncident.Notes = this.editIncidentForm.get('note').value;
    //console.log(this.incident);

    this.officialService.IncidentReports.push(changedIncident);
    console.log(this.officialService.IncidentReports);
    this.bsModalRef.hide();
  }
}
