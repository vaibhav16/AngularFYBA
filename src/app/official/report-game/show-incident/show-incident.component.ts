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
  @Output() saveStatus = new EventEmitter<boolean>();
  public incidentCount: number;
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

  // ngOnChanges(){
  //   console.log(this.editIncidentForm.get('incidentSubDropDown').value);
  //   if(this.editIncidentForm.get('incidentSubDropDown').value.length==undefined){        
  //     this.editIncidentForm.controls['incidentSubDropDown'].setValidators([Validators.required]);
  //     this.editIncidentForm.get('incidentSubDropDown').updateValueAndValidity(); 
  //   }
  // }

  // ngAfterViewOnInit(){
  //   if(this.editIncidentForm.get('incidentType').value!='Other'){
  //     this.editIncidentForm.controls['incidentSubDropDown'].setValidators([Validators.required]);
  //     this.editIncidentForm.get('incidentSubDropDown').updateValueAndValidity(); 

    
  //   }
   
  // }

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

      // if(this.dependentDropDownName!='Other'){
      //   this.editIncidentForm.controls['incidentSubDropDown'].setValidators([Validators.required]);
      // }
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
    //this.depedentIncidentDropdown=[];
    console.log(this.dependentDropDownName);
    //console.log( this.allDependentDropdowns[this.dependentDropDownName]);
    //console.log(this.incident.IncidentValue);
    //console.log( this.allDependentDropdowns[this.dependentDropDownName][1]['Id']);
    let selectedValue = [];
    if(this.allDependentDropdowns[this.dependentDropDownName]){
      for (var i = 0; i < this.allDependentDropdowns[this.dependentDropDownName].length; ++i) {
        if (
          this.allDependentDropdowns[this.dependentDropDownName][i]['Id'] ==
          this.incident.IncidentValue
        ) {
          selectedValue = this.allDependentDropdowns[this.dependentDropDownName][i]['Item'];
          //this.depedentIncidentDropdown = this.allDependentDropdowns[this.dependentDropDownName];
          //this.dependentSubDropDownName = this.incidentTypes[i]['DependentDropdownName'];
        }
      }
      
    }
    // else{
    //   this.editIncidentForm.controls['incidentSubDropDown'].setValidators([]);
    // }

    //console.log(this.depedentIncidentDropdown);
    return selectedValue;
  }

  incidentSelected() {
    const incidentType = this.editIncidentForm.get('incidentType').value;
    this.depedentIncidentDropdown = [];
    let incidentDropdownName;
    console.log(incidentType);

    // this.editIncidentForm.controls['incidentType'].valueChanges.subscribe(() => {
    //   this.editIncidentForm.controls['incidentSubDropDown'].setValue([]);
    // });
    if(incidentType!='Select Incident Type'){
    for (var i = 0; i < this.allIncidentTypes.length; ++i) {
      if (this.allIncidentTypes[i]['Item'] == incidentType) {
        this.incidentTypeId = this.allIncidentTypes[i]['Id'];
        incidentDropdownName = this.allIncidentTypes[i]['DependentDropdownName'];
      }
    }

    if(incidentType!='Other'){       

      this.depedentIncidentDropdown = this.allDependentDropdowns[incidentDropdownName];
      this.editIncidentForm.controls['incidentSubDropDown'].setValidators([Validators.required]);
      //this.editIncidentForm.get('incidentSubDropDown').setValidators([Validators.required]);
      this.editIncidentForm.get('incidentSubDropDown').updateValueAndValidity();    
      this.editIncidentForm.controls['incidentSubDropDown'].setValue([]);
      console.log(incidentDropdownName+" Dependent Dropdown Length: "+this.depedentIncidentDropdown.length);
    }
    else {
      this.depedentIncidentDropdown = [];
      this.editIncidentForm.get('incidentSubDropDown').clearValidators();
      this.editIncidentForm.get('incidentSubDropDown').updateValueAndValidity(); 
      this.editIncidentForm.controls['incidentSubDropDown'].setValue([]);
      console.log(incidentDropdownName+" Dependent Dropdown Length: "+this.depedentIncidentDropdown.length);
      //this.editIncidentForm.controls['incidentSubDropDown'].setValidators([]);
    }  

    return this.incidentTypeId;
  }
  else{
    this.editIncidentForm.setErrors({ 'invalid': true });
    this.editIncidentForm.controls['incidentType'].setValidators([Validators.required]);    
  }
  
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
    this.saveStatus.emit(false);
  }
}
