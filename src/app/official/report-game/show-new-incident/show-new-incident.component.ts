import { Component, OnInit, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IncidentReports } from './../../classes/reportgame/Incident.model';
import { OfficialService } from './../../official.service';
import { CookieService } from 'ngx-cookie-service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-show-new-incident',
  templateUrl: './show-new-incident.component.html',
  styleUrls: ['./show-new-incident.component.css']
})
export class ShowNewIncidentComponent implements OnInit {
  @Output() saveStatus = new EventEmitter<boolean>();
  public incidentCount: number;
  public incident;
  public name: string;
  public gameid: string;
  public allIncidentTypes;
  public allDependentDropdowns;
  public dependentIncidentDropdown = [];
  public dependentDropDownName;
  locationId: number;
  index: number;
  today = new Date();
  private readonly notifier: NotifierService;
  constructor(
    public fb: FormBuilder,
    public notifierService: NotifierService,
    public bsModalRef: BsModalRef,
    public cookieService: CookieService,
    public officialService: OfficialService
  ) {
    this.notifier = notifierService;
  }

  editIncidentForm: FormGroup;
  ngOnInit() {
    // console.log(this.incident);
    // console.log(this.allIncidentTypes);
    // console.log(this.allDependentDropdowns);
    this.name = this.incident.FiledByName;
    this.gameid = this.incident.GameId;
    this.editIncidentForm = this.fb.group({
      incidentType: [this.returnIncidentType(), Validators.required],
      incidentSubDropDown: [this.returnIncidentSubDropdown()],
      note: [this.incident.Notes, Validators.required]
    });

    console.log(this.editIncidentForm.value);

    // console.log(this.dependentDropDownName);

    //console.log(this.editIncidentForm.value);
  }

  // ngAfterViewOnInit(){
  //   if(this.dependentDropDownName!='Other'){
  //     this.editIncidentForm.controls['incidentSubDropDown'].setValidators([Validators.required]);
  //   }
  // }

  returnIncidentType() {
    let selectedValue;
    for (var i = 0; i < this.allIncidentTypes.length; ++i) {
      if (this.allIncidentTypes[i]['Id'] == this.incident.IncidentType) {
        selectedValue = this.allIncidentTypes[i]['Item'];
        this.dependentDropDownName = this.allIncidentTypes[i]['DependentDropdownName'];
        if (this.dependentDropDownName != 'Other') {
          this.dependentIncidentDropdown = this.allDependentDropdowns[this.dependentDropDownName];
        }
      }
    }

    console.log(this.dependentIncidentDropdown);
    // console.log(this.dependentIncidentDropdown);
    // console.log(this.dependentDropDownName);
    return selectedValue ? selectedValue : 'Other';
  }

  returnIncidentSubDropdown() {
    let selectedValue;
    if (this.allDependentDropdowns[this.dependentDropDownName]) {
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
    return [];

  }

  incidentSelected() {
    const incidentType = this.editIncidentForm.get('incidentType').value;
    let incidentDropdownName;

    // this.editIncidentForm.controls['incidentType'].valueChanges.subscribe(() => {
    //   this.editIncidentForm.controls['incidentSubDropDown'].setValue([]);
    // });

    if (incidentType != 'Select Incident Type') {
      for (var i = 0; i < this.allIncidentTypes.length; ++i) {
        if (this.allIncidentTypes[i]['Item'] == incidentType) {
          this.incidentTypeId = this.allIncidentTypes[i]['Id'];
          incidentDropdownName = this.allIncidentTypes[i]['DependentDropdownName'];
          console.log(incidentDropdownName);
          console.log(this.dependentIncidentDropdown);
          //console.log("Dependent Dropdown Length: "+this.dependentIncidentDropdown.length);

          if (incidentDropdownName != 'Other') {
            if (incidentDropdownName == 'Facilities') {

              this.dependentIncidentDropdown = this.allDependentDropdowns[incidentDropdownName];
              this.editIncidentForm.controls['incidentSubDropDown'].enable();
              this.editIncidentForm.controls['incidentSubDropDown'].setValidators([Validators.required]);

              this.dependentIncidentDropdown.forEach(element => {
                if (element["Id"] == this.locationId) {
                  this.incidentTypeId = element["Id"];
                  this.editIncidentForm.patchValue({ 'incidentSubDropDown': element["Item"] });
                }
              });
            }
            else {
              //this.editIncidentForm.controls['incidentSubDropDown'].setValidators([Validators.required]);
              this.dependentIncidentDropdown = this.allDependentDropdowns[incidentDropdownName];
              this.editIncidentForm.get('incidentSubDropDown').setValidators([Validators.required]);
              this.editIncidentForm.get('incidentSubDropDown').updateValueAndValidity();
              this.editIncidentForm.controls['incidentSubDropDown'].setValue([]);
              console.log(incidentDropdownName + " Dependent Dropdown Length: " + this.dependentIncidentDropdown.length);
            }
          }
          else {
            //this.editIncidentForm.controls['incidentSubDropDown'].setValidators([]);
            this.dependentIncidentDropdown = [];
            this.editIncidentForm.get('incidentSubDropDown').clearValidators();
            this.editIncidentForm.get('incidentSubDropDown').updateValueAndValidity();
            this.editIncidentForm.controls['incidentSubDropDown'].setValue([]);
            console.log(incidentDropdownName + "Dependent Dropdown Length: " + this.dependentIncidentDropdown.length);
          }

        }
      }

      // console.log(incidentType);
      // console.log(this.allDependentDropdowns);
      //this.dependentIncidentDropdown = this.allDependentDropdowns[incidentDropdownName];

      return this.incidentTypeId;
    }

    else {
      this.editIncidentForm.setErrors({ 'invalid': true });
      this.editIncidentForm.controls['incidentType'].setValidators([Validators.required]);
    }
  }

  incidentTypeId;
  dependentDropdownId;

  dependentDropDownSelected() {
    console.log(this.dependentIncidentDropdown);
    if (this.dependentIncidentDropdown) {
      for (var i = 0; i < this.dependentIncidentDropdown.length; ++i) {
        if (
          this.dependentIncidentDropdown[i]['Item'] ==
          this.editIncidentForm.get('incidentSubDropDown').value
        ) {
          this.dependentDropdownId = this.dependentIncidentDropdown[i]['Id'];
          console.log(this.dependentDropdownId);
        }
      }

      return (this.dependentDropdownId);
    }

    return null;

  }


  submitForm() {
    console.log(this.editIncidentForm.value);
    this.notifier.notify('success', 'Be sure to save the Game Report to complete the incident reporting');
    //this.changedIncident.GameId = parseInt(this.gameid);
    this.officialService.IncidentReports[this.index].IncidentId = this.incident.IncidentId;
    // this.officialService.IncidentReports[this.index].IncidentType = this.incidentTypeId;
    // this.officialService.IncidentReports[this.index].IncidentValue = this.dependentDropdownId;
    this.officialService.IncidentReports[this.index].IncidentType = this.incidentSelected();
    this.officialService.IncidentReports[this.index].IncidentValue = this.dependentDropDownSelected();
    this.officialService.IncidentReports[this.index].Notes = this.editIncidentForm.get('note').value;
    //console.log(this.incident);
    //for(var i=0; i<)
    //this.officialService.IncidentReports[this.index].
    //this.officialService.IncidentReports.push(this.changedIncident);
    console.log(this.officialService.IncidentReports);
    this.bsModalRef.hide();
    this.saveStatus.emit(false);
  }
}
