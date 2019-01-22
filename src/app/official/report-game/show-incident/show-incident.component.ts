import { Component, OnInit, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IncidentReports } from './../../classes/reportgame/Incident.model';
import { OfficialService } from './../../official.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-show-incident',
  templateUrl: './show-incident.component.html',
  styleUrls: ['./show-incident.component.css']
})
export class ShowIncidentComponent implements OnInit {
  public incident;
  public name: string;
  public gameid: string;
  public allIncidentTypes;
  public allDependentDropdowns;
  public depedentIncidentDropdown = [];
  public dependentDropDownName;
  today = new Date();
  constructor(
    public fb: FormBuilder,
    public bsModalRef: BsModalRef,
    public cookieService: CookieService,
    public officialService: OfficialService
  ) {}

  editIncidentForm: FormGroup;
  ngOnInit() {
    //console.log(this.incident);
    // console.log(this.allIncidentTypes);
    // console.log(this.allDependentDropdowns);
    this.name = this.incident.FiledByName;
    this.gameid = this.incident.GameId;
    this.editIncidentForm = this.fb.group({
      incidentType: [this.returnIncidentType(), Validators.required],
      incidentSubDropDown: [this.returnIncidentSubDropdown(), Validators.required],
      note: [this.incident.Notes, Validators.required]
    });
    //console.log(this.editIncidentForm.value);
  }

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
    return selectedValue;
  }

  returnIncidentSubDropdown() {
    let selectedValue;
    for (var i = 0; i < this.allDependentDropdowns[this.dependentDropDownName].length; ++i) {
      if (
        this.allDependentDropdowns[this.dependentDropDownName][i]['Id'] ==
        this.incident.IncidentValue
      ) {
        selectedValue = this.allDependentDropdowns[this.dependentDropDownName][i]['Item'];
        //this.dependentSubDropDownName = this.incidentTypes[i]['DependentDropdownName'];
      }
    }
    return selectedValue;
  }

  incidentSelected() {
    const incidentType = this.editIncidentForm.get('incidentType').value;
    let incidentDropdownName;

    for (var i = 0; i < this.allIncidentTypes.length; ++i) {
      if (this.allIncidentTypes[i]['Item'] == incidentType) {
        this.incidentTypeId = this.allIncidentTypes[i]['Id'];
        incidentDropdownName = this.allIncidentTypes[i]['DependentDropdownName'];
      }
    }

    // console.log(incidentType);
    // console.log(this.allDependentDropdowns);
    this.depedentIncidentDropdown = this.allDependentDropdowns[incidentDropdownName];
    return  this.incidentTypeId;
  }

  incidentTypeId;
  dependentDropdownId;

  dependentDropDownSelected() {
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

  changedIncident: IncidentReports = {
    GameId: null,
    IncidentId: null,
    IncidentType: null,
    IncidentValue: null,
    Notes: ''
  };

  submitForm() {
    console.log(this.editIncidentForm.value);
    this.changedIncident.GameId = parseInt(this.gameid);
    this.changedIncident.IncidentId = this.incident.IncidentId;
    this.changedIncident.IncidentType = this.incidentSelected();
    this.changedIncident.IncidentValue = this.dependentDropDownSelected();
    this.changedIncident.Notes = this.editIncidentForm.get('note').value;
    console.log(this.incident);
    this.officialService.IncidentReports.push(this.changedIncident);
    console.log(this.officialService.IncidentReports);
    this.bsModalRef.hide();
  }
}
