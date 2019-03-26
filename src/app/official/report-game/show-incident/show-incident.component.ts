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
  public filedDate:string;
  public incidentCount: number;
  public incident;
  public name: string;
  public gameid: number;
  public allIncidentTypes;
  public allDependentDropdowns;
  public dependentIncidentDropdown = [];
  public dependentDropDownName;
  public locationId;
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
    console.log(this.incident);
    // console.log(this.allIncidentTypes);
    // console.log(this.allDependentDropdowns);
    this.name = this.incident.FiledByName;
    this.gameid = this.incident.GameId;
    this.incidentTypeId = this.incident.IncidentType;
    
    if(this.incident.IncidentValue){
      console.log(this.incident.IncidentValue);
      this.dependentDropdownId = this.incident.IncidentValue;
    }
    this.editIncidentForm = this.fb.group({
      incidentType: [this.returnIncidentType(), Validators.required],
      incidentSubDropDown: [this.returnIncidentSubDropdown()],
      note: [this.incident.Notes, Validators.required]
    });

    console.log(this.editIncidentForm.value);

    // if(this.dependentDropDownName!='Other'){
    //   this.editIncidentForm.controls['incidentSubDropDown'].setValidators([Validators.required]);
    // }
  }

  isOther: boolean;
  returnIncidentType() {
    let selectedValue;

    for (var i = 0; i < this.allIncidentTypes.length; ++i) {
      if (this.allIncidentTypes[i]['Id'] == this.incident.IncidentType) {
        selectedValue = this.allIncidentTypes[i]['Item'];
        this.dependentDropDownName = this.allIncidentTypes[i]['DependentDropdownName'];
      }
    }
    this.dependentIncidentDropdown = this.allDependentDropdowns[this.dependentDropDownName];

    return selectedValue ? selectedValue : 'Other';
  }

  returnIncidentSubDropdown() {
    let selectedValue = [];
    if (this.allDependentDropdowns[this.dependentDropDownName]) {
      for (var i = 0; i < this.allDependentDropdowns[this.dependentDropDownName].length; ++i) {
        if (
          this.allDependentDropdowns[this.dependentDropDownName][i]['Id'] ==
          this.incident.IncidentValue
        ) {
          selectedValue = this.allDependentDropdowns[this.dependentDropDownName][i]['Item'];
          //this.dependentIncidentDropdown = this.allDependentDropdowns[this.dependentDropDownName];
          //this.dependentSubDropDownName = this.incidentTypes[i]['DependentDropdownName'];
        }
      }

    }
    // else{
    //   this.editIncidentForm.controls['incidentSubDropDown'].setValidators([]);
    // }

    //console.log(this.dependentIncidentDropdown);
    return selectedValue;
  }

  incidentSelected() {
    const incidentType = this.editIncidentForm.get('incidentType').value;
    this.dependentIncidentDropdown = [];
    let incidentDropdownName;
    //console.log(incidentType);

    // this.editIncidentForm.controls['incidentType'].valueChanges.subscribe(() => {
    //   this.editIncidentForm.controls['incidentSubDropDown'].setValue([]);
    // });
    if (incidentType != 'Select Incident Type') {
      for (var i = 0; i < this.allIncidentTypes.length; ++i) {
        if (this.allIncidentTypes[i]['Item'] == incidentType) {
          this.incidentTypeId = this.allIncidentTypes[i]['Id'];
          incidentDropdownName = this.allIncidentTypes[i]['DependentDropdownName'];
        }
      }

      if (incidentType != 'Other') {

        if (incidentType == 'Facilities Issue') {

          this.dependentIncidentDropdown = this.allDependentDropdowns[incidentDropdownName];
          this.editIncidentForm.controls['incidentSubDropDown'].enable();
          this.editIncidentForm.controls['incidentSubDropDown'].setValidators([Validators.required]);
          this.editIncidentForm.get('incidentSubDropDown').updateValueAndValidity();
          this.editIncidentForm.controls['incidentSubDropDown'].setValue([]);

          this.dependentIncidentDropdown.forEach(element => {
            if (element["Id"] == this.locationId) {
              //this.incidentTypeId = element["Id"];
              this.dependentDropdownId = element["Id"];
              console.log(element);
              this.editIncidentForm.patchValue({ 'incidentSubDropDown': element["Item"] });
              console.log(this.editIncidentForm.get('incidentSubDropDown').value);
            }
          });
        }

        else {
          this.dependentIncidentDropdown = this.allDependentDropdowns[incidentDropdownName];
          this.dependentDropdownId = 0;
          this.editIncidentForm.controls['incidentSubDropDown'].setValidators([Validators.required]);
          this.editIncidentForm.get('incidentSubDropDown').updateValueAndValidity();
          //this.editIncidentForm.controls['incidentSubDropDown'].setValue([]);

          this.editIncidentForm.patchValue({'incidentSubDropDown': this.dependentIncidentDropdown[0]['Item']});       
          this.editIncidentForm.setErrors({ 'invalid': true });
          console.log(incidentDropdownName + " Dependent Dropdown Length: " + this.dependentIncidentDropdown.length);
        }
      }

      else {
        this.dependentDropdownId=undefined;
        this.dependentIncidentDropdown = [];
        this.editIncidentForm.get('incidentSubDropDown').clearValidators();
        this.editIncidentForm.get('incidentSubDropDown').updateValueAndValidity();
        this.editIncidentForm.controls['incidentSubDropDown'].setValue([]);
        console.log(incidentDropdownName + " Dependent Dropdown Length: " + this.dependentIncidentDropdown.length);
        //this.editIncidentForm.controls['incidentSubDropDown'].setValidators([]);
      }

      console.log(this.incidentTypeId);
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

    console.log(this.editIncidentForm.get('incidentSubDropDown').value);
    if (this.dependentIncidentDropdown) {
      for (var i = 0; i < this.dependentIncidentDropdown.length; ++i) {
        if (
          this.dependentIncidentDropdown[i]['Item'] == 
          this.editIncidentForm.get('incidentSubDropDown').value
        ) {
          console.log(this.dependentIncidentDropdown[i]['Id']);
          if(this.dependentIncidentDropdown[i]['Id']==0){
            console.log(this.dependentIncidentDropdown[i]['Id']);
            this.dependentDropdownId=0;
            this.editIncidentForm.controls['incidentSubDropDown'].setValidators([Validators.required]);
            this.editIncidentForm.setErrors({ 'invalid': true });            
          }
          else{   
            console.log(this.dependentIncidentDropdown[i]['Id']);         
            this.dependentDropdownId = this.dependentIncidentDropdown[i]['Id'];
          }
          
          //  console.log(this.dependentDropdownId);
        }
      }
      console.log(this.dependentDropdownId);
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

  async submitForm() {
    console.log(this.editIncidentForm.value);
    await this.notifier.notify('success', 'Be sure to save the Game Report to complete the incident reporting');

    const changedIncident = await IncidentReports.create({
      GameId: this.gameid,
      IncidentId: this.incident.IncidentId,
      IncidentType:this.incidentTypeId,
      IncidentValue: this.dependentDropdownId,
      Notes: this.editIncidentForm.get('note').value
    })

    await console.log(changedIncident);

    // this.changedIncident.GameId = this.gameid;
    // this.changedIncident.IncidentId = this.incident.IncidentId;
    // this.changedIncident.IncidentType = this.incidentSelected();
    // this.changedIncident.IncidentValue = this.dependentDropDownSelected();
    // this.changedIncident.Notes = this.editIncidentForm.get('note').value;
    //console.log(this.incident);

    await this.officialService.IncidentReports.push(changedIncident);

    var flag;

    if(await this.officialService.ModifiedIncidents.length>0){
      for(var i=0; i<this.officialService.ModifiedIncidents.length;++i){       
        if (await this.officialService.ModifiedIncidents[i].GameId==changedIncident.GameId){
          flag = await true;
          this.officialService.ModifiedIncidents[i].IncidentId = await changedIncident.IncidentId;
          this.officialService.ModifiedIncidents[i].IncidentType = await changedIncident.IncidentType;
          this.officialService.ModifiedIncidents[i].IncidentValue = await changedIncident.IncidentValue;
          this.officialService.ModifiedIncidents[i].Notes = await changedIncident.Notes;
        }
        else{
          flag = await false;
        }
      }
    }

    if(await !flag){
      await this.officialService.ModifiedIncidents.push(changedIncident);
    }
   
    console.log(this.officialService.IncidentReports);
    console.log(this.officialService.ModifiedIncidents);
    await this.bsModalRef.hide();
    await this.saveStatus.emit(false);
  }
}
