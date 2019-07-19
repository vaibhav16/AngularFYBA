import { Component, OnInit } from '@angular/core';
import { PlayerService } from './../player.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Form, FormArray, Validators, FormControl } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { DataSharingService } from './../../data-sharing.service';
import { MatSnackBar } from '@angular/material';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
//import { RequestStatusPopupComponent } from './../../common/request-status-popup/request-status-popup.component';
// import { format } from 'path';
// import { Observable, of, interval, Subscription, timer, pipe } from 'rxjs';
// import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.css']
})
export class PlayerProfileComponent implements OnInit {

  fetchingData: boolean;
  profileForm;
  
  dropdownList = [];
  dropdownSettings = {};
  numbers=[];
  constructor(public playerService: PlayerService,
    public router: Router, private fb: FormBuilder,
    private modalService: BsModalService,
    private config: NgbAccordionConfig,
    private snackbar: MatSnackBar) {
      config.closeOthers=true;
      
      for(var i=0;i<=100;i++)
      {
        this.numbers[i]=i;
      }

  }

  initProfileDetailsArray() {
    console.log(this.parentInfo);
    const formArr = new FormArray([]);

    for (var i in this.parentInfo) {
      formArr.push(
        this.fb.group({
          userId: this.parentInfo[i]["UserId"],
          parentName:this.parentInfo[i]["Parent_Name"],
          relationship:this.parentInfo[i]["Parent_Relationship"],
          email: new FormControl(this.parentInfo[i]["Parent_Email"],[Validators.email, Validators.required]),          
          homePhone: new FormControl(this.parentInfo[i]["Parent_HomePhone"],[ Validators.pattern(/^[- +()]*[0-9][- +()0-9]*$/),Validators.minLength(7), Validators.maxLength(14)]),          
          mobilePhone:new FormControl(this.parentInfo[i]["Parent_MobilePhone"],[ Validators.pattern(/^[- +()]*[0-9][- +()0-9]*$/),Validators.minLength(7),Validators.maxLength(14)]), 
          workPhone:new FormControl(this.parentInfo[i]["Parent_WorkPhone"],[ Validators.pattern(/^[- +()]*[0-9][- +()0-9]*$/),Validators.minLength(7),Validators.maxLength(14)]),
          textingoption:null,
          Volunteeredposition:null  
        })
      )
    }
    return formArr;
  }


  get profileSection() {
    return this.playerService.profileData;
  }


  get parentInfo() {
    return this.profileSection.Value.parentInfo;
  }

  get registrationStatus() {
    return this.profileSection.Value.registrationStatus;
  }

  get apparel() {
    return this.profileSection.Value.apparel;
  }


  subscription;
  timesRun;
  interval;
  modalRef: BsModalRef;
  
  ngOnInit() {
    this.fetchingData=true;
    console.log(this.playerService.profileData);

    console.log("Player Id in profile:" + this.playerService.playerId);

    // console.log(this.profileForm);

      this.interval = setInterval( () => {
      this.timesRun += 1;
      console.log(this.playerService.profileData);
      if (this.playerService.profileData) {
        this.profileForm = this.fb.group({
          ParentInfo: this.initProfileDetailsArray()
        });
        clearInterval(this.interval);
        console.log(this.profileForm.value);
        this.fetchingData=false;
      }
    }, 2000); 

    //this.fetchingData=true;

    // this.playerService.getPlayerProfile()
    // .subscribe(
    //   (res)=>{
    //     this.profileSection=JSON.parse(res["_body"]);
    //     console.log(this.profileSection);
    //     this.fetchingData=false;
    //   }
    // )
    this.dropdownList = [
      {"id":1,"itemName":"Email"},
      {"id":2,"itemName":"Home Phone"},
      {"id":3,"itemName":"Mobile Phone"},    
    ];
    
this.dropdownSettings = { 
        singleSelection: false, 
        text:"Select Texting",
        selectAllText:'Select All',
        unSelectAllText:'UnSelect All',
        enableSearchFilter: true,
        classes:"myclass custom-class"
      }; 
  }
  

  validEmail: boolean;

  onChange(newValue) {
    console.log(newValue);
    const validEmailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (validEmailRegEx.test(newValue)) {
      this.validEmail = true;
    } else {
      this.validEmail = false;
    }

  }
  


  onSubmit(){
    this.fetchingData=true;
    console.log(this.profileForm.value);    
    // for(var i=0; i<this.profileForm.controls['ParentInfo'].length; ++i){
    //   console.log(i);
    // }
    var rd = "[";
    (<FormArray>this.profileForm.get('ParentInfo')).controls.forEach((group) =>{
      console.log(group.value);
      rd += JSON.stringify({
        UserId:group.value.userId,
        Parent_HomePhone:group.value.homePhone,
        Parent_MobilePhone:group.value.mobilePhone,
        Parent_WorkPhone:group.value.workPhone,
        Parent_Email:group.value.email
      })+","
    });
    rd = rd.substring(0, rd.length - 1);
    rd +="]"

    console.log(JSON.stringify(rd));
    this.playerService.saveProfileData(rd)
    .subscribe((res)=>{
      res = JSON.parse(res["_body"]);
      
      this.fetchingData=false;
      this.snackbar.open(res.Message.PopupHeading,'',{duration:3000});
      
      //console.log(JSON.parse(res["_body"]));
    }
  );
  }

  modalRed: BsModalRef;
  withdraw(playerId : number,status :JSON){
    console.log(status);
    this.modalRef = this.modalService.show(WithdrawComponent);
    this.modalRef.content.playerId = playerId;
    this.modalRef.content.details = status;

    // this.modalRef.content.status = responseBody.Status;
    // this.modalRef.content.popupTitle = responseBody.Message.PopupHeading;
    // this.modalRef.content.popupMsg = responseBody.Message.PopupMessage;
    // this.modalRef.content.route = "/player/team";
  }

 


}

