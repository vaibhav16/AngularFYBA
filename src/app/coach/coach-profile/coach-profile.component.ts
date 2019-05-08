import { Component, OnInit } from '@angular/core';
import { DataSharingService } from './../../data-sharing.service';
import { CoachService }  from './../coach.service';
import { Router } from '@angular/router';
import { CoachProfileResponse } from './../models/profileResponse.model';
import { FormBuilder,FormArray,FormControl } from '@angular/forms';


@Component({
  selector: 'app-coach-profile',
  templateUrl: './coach-profile.component.html',
  styleUrls: ['./coach-profile.component.css']
})
export class CoachProfileComponent implements OnInit {
  dataRequest: boolean;
  profileData: CoachProfileResponse;
  personalDetailsForm;
  preferenceForm;

  constructor(private dss: DataSharingService, 
    private coachService: CoachService,
    private router: Router,
    private fb: FormBuilder) { 
  
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
      shirtSize: this.initShirtSize(),
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
    return arr;
  }

  patchTimeOfTheDayPreference(){
    let arr = new FormArray([]);
    return arr;
  }

  patchDaysYouCantHavePractice(){
    let arr = new FormArray([]);
    return arr;
  }

  patchTimeYouCantHavePractice(){
    let arr = new FormArray([]);
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



}
