import { Component, OnInit, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
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
  @Output() saveStatus = new EventEmitter<boolean>();
  public incidentCount: number;
  incidentForm: FormGroup;
  public incidentTypes;
  public incidentSubDropDown;
  public depedentIncidentDropdown = [];
  public gameId;
  public incidentId: number;
  public subDropDownId: number;
  public locationId:number;
  public locationName: string;
  today = new Date();
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

    this.incidentForm = this.fb.group({
      incidentType: ["Select Incident Type",Validators.required],
      incidentSubDropDown: [{ value: "", disabled: true }, Validators.required],
      note: [{ value: "", disabled: true }, Validators.required]
    });   
    
    console.log(this.incidentForm.valid);

    //this.incidentForm.controls['incidentType'].setValue("Select Incident Type", {onlySelf: true});

  }

  submitBtnDisable: boolean = true;
  ngOnInit() {
    console.log(this.incidentTypes);     
  }

  incidentSelected() {
    this.submitBtnDisable=false;
    this.depedentIncidentDropdown = [];
    const incidentType = this.incidentForm.get('incidentType').value;
    console.log(incidentType);

    if(incidentType){
      if(incidentType!='Select Incident Type'){
        for (var i = 0; i < this.incidentTypes.length; ++i) {
          if (this.incidentTypes[i]['DependentDropdownName'] == incidentType) {
            this.incidentId = this.incidentTypes[i]['Id'];
          }
        }

        if (incidentType!='Other') {
          
          if(incidentType=='Facilities'){            
         
            this.depedentIncidentDropdown = this.incidentSubDropDown[incidentType];
            this.incidentForm.controls['incidentSubDropDown'].enable();
            this.incidentForm.controls['incidentSubDropDown'].setValidators([Validators.required]);         
            this.depedentIncidentDropdown.forEach(element => {              
              if(element["Id"]==this.locationId){
               
                this.subDropDownId = element["Id"];
                this.incidentForm.patchValue({'incidentSubDropDown':element["Item"]});
              }
            });                   
          }
          else{
            for (var i = 0; i < this.incidentTypes.length; ++i) {
              if (this.incidentTypes[i]['DependentDropdownName'] == incidentType) {
                this.incidentId = this.incidentTypes[i]['Id'];
              }
            }
            console.log(incidentType);
            this.depedentIncidentDropdown = this.incidentSubDropDown[incidentType];
            this.incidentForm.controls['incidentSubDropDown'].enable();
            this.incidentForm.controls['incidentSubDropDown'].setValidators([Validators.required]);          
            this.incidentForm.controls['incidentSubDropDown'].setValue([]);
          }
          
        }
        else {
          console.log(incidentType);       
          this.depedentIncidentDropdown = [];
          this.incidentForm.get('incidentSubDropDown').clearValidators();
          this.incidentForm.get('incidentSubDropDown').updateValueAndValidity(); 
          this.incidentForm.controls['incidentSubDropDown'].setValue([undefined]);
        }
        this.incidentForm.controls['note'].enable();
        console.log(this.depedentIncidentDropdown);
      }
      else{        
        this.incidentForm.setErrors({ 'invalid': true });
      }
     
    }

  }

  dependentDropDownSelected() {
    for (var i = 0; i < this.depedentIncidentDropdown.length; ++i) {
      if (this.depedentIncidentDropdown[i]['Item'] == this.incidentForm.get('incidentSubDropDown').value) {
        this.subDropDownId = this.depedentIncidentDropdown[i]['Id'];
      }
    }
  }

  // incident: IncidentReports = {
  //   GameId:null,
  //   IncidentId:null,
  //   IncidentType:null,
  //   IncidentValue:null,
  //   Notes:''
  // };

  submitForm() {
    //console.log(this.incidentForm.value); 
    //“Be sure to save the Game Report to complete the incident reporting.”
    this.notifier.notify('success', 'Be sure to save the Game Report to complete the incident reporting');

    const newIncident = IncidentReports.create({
      GameId: this.gameId,
      IncidentId: null,
      IncidentType: this.incidentId,
      IncidentValue: this.subDropDownId,
      Notes: this.incidentForm.get('note').value
    })

    console.log(newIncident);

    // this.incident.GameId = this.gameId;
    // this.incident.IncidentId = null;
    // this.incident.IncidentType = this.incidentId;
    // this.incident.IncidentValue =this.subDropDownId;
    // this.incident.Notes = this.incidentForm.get('note').value;
    //console.log(this.incident);
    this.officialService.IncidentReports.push(newIncident);
    this.officialService.NewIncidents.push(newIncident);
    //this.officialService.IncidentReports = this.officialService.IncidentReports.slice();
    console.log(this.officialService.IncidentReports);
    this.bsModalRef.hide();
    this.saveStatus.emit(false);
    //this.notifier.notify( 'success', 'You are awesome! I mean it!' );
  }
}