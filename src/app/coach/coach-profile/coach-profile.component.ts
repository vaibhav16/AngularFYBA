import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataSharingService } from './../../data-sharing.service';
import { CoachService }  from './../coach.service';
import { Router } from '@angular/router';
import { CoachProfileResponse } from './../models/profileResponse.model';
import { FormBuilder,FormArray,FormControl, FormGroup } from '@angular/forms';
import { ArrayValidators } from './checkbox.validator';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-coach-profile',
  templateUrl: './coach-profile.component.html',
  styleUrls: ['./coach-profile.component.css']
})
export class CoachProfileComponent implements OnInit {
  dataRequest: boolean;
  profileData: CoachProfileResponse = null;
  personalDetailsForm;
  preferenceForm;
  img1:string;
  img2:string;
  currentSrc:string;
  
 

  constructor(private dss: DataSharingService, 
    private coachService: CoachService,
    private config: NgbAccordionConfig,
    private router: Router,
    private fb: FormBuilder) {   
      config.closeOthers=true;
      this.img1="./assets/images/lock.png",
      this.img2="./assets/images/unlock.png"
      this.currentSrc = this.img1;
    
       
      
    }
    

  ngOnInit() {
   
 
    this.dataRequest=true;
    
    this.coachService.getCoach()
    .subscribe(
      (res)=>{        
        this.profileData = res;
        console.log(res);      
        this.generateDetailsForm();
        this.generatePracticePreferenceForm();
        
        
        this.dataRequest = false;
      },
      (error)=>{
        this.dataRequest = false;
        console.log(error);       
      }
    )
  }

  get CoachProfile(){
    return this.profileData.Value;
  }
  


  async generateDetailsForm(){

    this.personalDetailsForm = await this.fb.group({
      coachName:this.profileData.Value.CoachName,
      email: this.profileData.Value.Email,
      shirtSize: new FormControl({value:this.initShirtSize(), disabled:true}),
      
      snacksField: ''
    })

    var x = await setInterval(() => {
      console.log(this.personalDetailsForm.value);
      clearInterval(x);
    }, 1000);    
    
  }

  initShirtSize(){
    for(var i=0; i<this.profileData.Value.ShirtSizeValue.length; ++i){   
       if(this.profileData.Value.ShirtSizeValue[i].Selected)
       return this.profileData.Value.ShirtSizeValue[i].Size;
      }

  }


  

  toggle(){
    console.log(this.personalDetailsForm.controls["shirtSize"].disabled);
    if(this.personalDetailsForm.controls["shirtSize"].disabled)
    {
      // debugger;
      this.personalDetailsForm.controls["shirtSize"].enable();
      console.log(this.personalDetailsForm.controls["shirtSize"].disabled);
      
    }
    else
    {
      //  debugger;
      this.personalDetailsForm.controls["shirtSize"].disable();
    }
    
    this.currentSrc = (this.currentSrc == this.img1)? this.img2 : this.img1;
    
    }


  async generatePracticePreferenceForm(){
    this.preferenceForm = await this.fb.group({
      locationPreference: this.patchLocationPreference(),
      locationRank: '',
      dayOfTheWeekPreference: this.patchDayOfTheWeekPreference(),
      dayOfTheWeekRank: '',
      timeOfTheDayPreference: this.patchTimeOfTheDayPreference(),
      timeOfTheDayRank: '',
      daysYouCantHavePractice: this.patchDaysYouCantHavePractice(),
      timeYouCantHavePractice: this.patchTimeYouCantHavePractice()

    })

    var x = await setInterval(() => {
      console.log(this.preferenceForm.value);
      clearInterval(x);
    }, 1000);    
    

  }

  patchLocationPreference(){
    let arr = new FormArray([]);
    return arr;
  }

  patchDayOfTheWeekPreference(){
    let arr = new FormArray([]);
    for(var i=0; i<this.profileData.Value.DayOfTheWeekPreferenceValues.length;++i){
      arr.push(this.fb.group({
        DayId:this.profileData.Value.DayOfTheWeekPreferenceValues[i].DayId,
        DayName:this.profileData.Value.DayOfTheWeekPreferenceValues[i].DayName,
        Selected:this.profileData.Value.DayOfTheWeekPreferenceValues[i].Selected
      }))
    }
    return arr;
  }

  patchTimeOfTheDayPreference(){
    let arr = new FormArray([]);
    for(var i=0; i<this.profileData.Value.TimeOfDayPreferenceValues.length;++i){
      arr.push(this.fb.group({
        TimeId:this.profileData.Value.TimeOfDayPreferenceValues[i].TimeId,
        TimeName:this.profileData.Value.TimeOfDayPreferenceValues[i].Time,
        Selected:this.profileData.Value.TimeOfDayPreferenceValues[i].Selected
      }))
    }
    return arr;
  }

  patchDaysYouCantHavePractice(){
    let arr = new FormArray([],ArrayValidators.maxLength(3));
    for(var i=0; i<this.profileData.Value.DaysYouCannotHavePracticeValues.length;++i){
      arr.push(this.fb.group({
        DayId:this.profileData.Value.DaysYouCannotHavePracticeValues[i].DayId,
        DayName:this.profileData.Value.DaysYouCannotHavePracticeValues[i].DayName,
        Selected:this.profileData.Value.DaysYouCannotHavePracticeValues[i].Selected
      }))
    }
    //arr.setValidators(minLengthError);
    return arr;
  }

  patchTimeYouCantHavePractice(){
    let arr = new FormArray([],ArrayValidators.maxLength(3));
    for(var i=0; i<this.profileData.Value.TimeYouCannotHavePracticeValues.length;++i){
      arr.push(this.fb.group({
        TimeId:this.profileData.Value.TimeYouCannotHavePracticeValues[i].TimeId,
        TimeName:this.profileData.Value.TimeYouCannotHavePracticeValues[i].Time,
        Selected:this.profileData.Value.TimeYouCannotHavePracticeValues[i].Selected
      }))
    }
    //arr.setValidators(minLengthError);
    return arr;
  }

  locationPreference: number[] = []

  preferenceChange(e: any, locationId:number){
    if(e.currentTarget.checked){
      this.locationPreference.push(locationId);
      
    }
    else{
      this.locationPreference = this.locationPreference.filter(item =>  item !== locationId);
    }

    console.log(this.locationPreference);

  }

  onSubmit(){
    
  }

  //Event Handling
  dayOfTheWeekPreferenceChange(e:any, id:number){  
    if(e.currentTarget.checked){
      //const control = <FormArray>this.preferenceForm.get('daysYouCantHavePractice');      
      (<FormArray>this.preferenceForm.get('dayOfTheWeekPreference')).controls.forEach((group) => {
        let dayIdControl = group.get('DayId') as FormControl;  
        let selectedControl = group.get('Selected') as FormControl;    
       
        if (dayIdControl.value == id) {
          console.log("Disable" + dayIdControl.value);
          
          selectedControl.setValue(false);
          selectedControl.disable();
          group.updateValueAndValidity();
          group.disable();        
        }
         
      });
    }
    // else{
    //   (<FormArray>this.preferenceForm.get('dayOfTheWeekPreference')).controls.forEach((group) => {
    //     let dayIdControl = group.get('DayId') as FormControl;    
        
        
    //     if (dayIdControl.value == id) {
    //       console.log("Enable" + dayIdControl.value);   
    //       group.enable();        
    //     }
    //   });
    // }

  }

  daysYouCantHavePracticeChange(e:any, id:number){
    if(e.currentTarget.checked){
      //const control = <FormArray>this.preferenceForm.get('daysYouCantHavePractice');

      
      (<FormArray>this.preferenceForm.get('dayOfTheWeekPreference')).controls.forEach((group) => {
        let dayIdControl = group.get('DayId') as FormControl;  
        let selectedControl = group.get('Selected') as FormControl;    
       
        if (dayIdControl.value == id) {
          console.log("Disable" + dayIdControl.value);
          selectedControl.setValue(false);
          selectedControl.disable();
          group.disable();        
        }
         
      });
    }
    // else{
    //   (<FormArray>this.preferenceForm.get('dayOfTheWeekPreference')).controls.forEach((group) => {
    //     let dayIdControl = group.get('DayId') as FormControl;    
        
        
    //     if (dayIdControl.value == id) {
    //       console.log("Enable" + dayIdControl.value);   
    //       group.enable();        
    //     }
    //   });
    // }

    console.log("Form Valid?"+this.preferenceForm.valid);

  }

  
  // timeOfTheDayPreference
  // timeYouCantHavePractice

  timeOfTheDayPreferenceChange(e:any, id:number){
    if(e.currentTarget.checked){
      //const control = <FormArray>this.preferenceForm.get('daysYouCantHavePractice');

      
      (<FormArray>this.preferenceForm.get('timeYouCantHavePractice')).controls.forEach((group) => {
        let timeIdControl = group.get('TimeId') as FormControl;  
        let selectedControl = group.get('Selected') as FormControl;    
       
        if (timeIdControl.value == id) {
          console.log("Disable" + timeIdControl.value);
          selectedControl.setValue(false);
          selectedControl.disable();
          group.disable();        
        }
         
      });
    }
  }
  
  timeYouCantHavePracticeChange(e:any, id:number){
    if(e.currentTarget.checked){
      //const control = <FormArray>this.preferenceForm.get('daysYouCantHavePractice');

      
      (<FormArray>this.preferenceForm.get('timeOfTheDayPreference')).controls.forEach((group) => {
        let timeIdControl = group.get('TimeId') as FormControl;  
        let selectedControl = group.get('Selected') as FormControl;    
       
        if (timeIdControl.value == id) {
          console.log("Disable" + timeIdControl.value);
          selectedControl.setValue(false);
          selectedControl.disable();
          group.disable();        
        }
         
      });
    }

    

  }

  



}
