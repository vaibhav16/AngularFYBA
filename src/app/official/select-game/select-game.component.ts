import { Component, TemplateRef, OnInit, ViewEncapsulation,ElementRef,Renderer2,ViewChild } from '@angular/core';
import { OfficialService } from '../official.service';
import { NgbActiveModal,NgbAccordionConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm, FormGroup,  FormBuilder } from '@angular/forms';
import { Filter } from '../../models/official/select-game/filter.model';
import { count } from 'rxjs/operators';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { map } from 'rxjs/operators';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from './../../login/login.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DomSanitizer } from '@angular/platform-browser';
import { isBoolean } from 'util';


@Component({
  selector: 'app-select-game',
  templateUrl: './select-game.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./select-game.component.css'],
  providers: [ NgbAccordionConfig ] 
})

export class SelectGameComponent implements OnInit {
  //@ViewChild("acchead1", {read: ElementRef})
  //private acchead1: ElementRef;
  //sessionKey:string;
  //panels = [0,1,2,3];
  //itemList = [];

  //onItemSelect(item: any) {
  //console.log(item);
  //console.log(this.selectedItems);
//}
//OnItemDeSelect(item: any) {
  //console.log(item);
  //console.log(this.selectedItems);
//}
//onSelectAll(items: any) {
  //console.log(items);
//}
//onDeSelectAll(items: any) {
  //console.log(items);
//}

  /*filterModel = {     
      Division: [],
      Location: [],
      StartTime: [],
      EndTime: [],
      Position:[]
  };*/

  modalRef: BsModalRef;  
  activeIds: string[] =[];
  selectedItems = [];
  settings = {};
  
  selectedFilter:Filter = {      
    Division: '',
    Location: '',
    StartTime: '',
    EndTime: '',
    Position: '',
    ShowSignedGames:null,
    ShowPastGames:null        
  } 

  constructor(public officialService: OfficialService,
    public sanitizer: DomSanitizer,
    config: NgbAccordionConfig,
    public loginService: LoginService,
    private modalService: BsModalService
    ) {
      config.closeOthers = false;
      config.type = 'info';  
   }  

   ngOnInit() {
     //this.officialService.selectGameJson=null;
    
    this.settings = {
        text: "Select....",
        classes: "myclass custom-class"
    };
    //this.signUpRequest=true;    
    
    this.officialService.postSelectGames(this.selectedFilter);
      
  }
 
  /* - Panel Change Event Function - */
  public beforeChange($event: NgbPanelChangeEvent) {
    this.activeIds.push($event.panelId);
  }


  // clearFilters(form: NgForm){
  //   form.reset();

  // }

  /* - Code to Submit Filter Data to Service - */
  filterRequest:boolean;
  submitFilters(value: any) {
    console.log(value);
    this.filterRequest=true;
    this.selectedFilter = {      
      Division: '',
      Location: '',
      StartTime: '',
      EndTime: '',
      Position: '',
      ShowSignedGames:null,
      ShowPastGames:null        
    } 
    
    if(value!=null){
      
      if(value.DivisionSelect!=null){
        for(let i=0; i<value.DivisionSelect.length; ++i){
          { 
            this.selectedFilter.Division+=value.DivisionSelect[i].id+',';    
          }         
        } 
      }
     
      if(value.LocationSelect!=null){
        for(let i=0; i<value.LocationSelect.length; ++i){
          { 
            this.selectedFilter.Location+=value.LocationSelect[i].id+',';    
          }         
        }    
      }
  
      if(value.PositionSelect!=null){
        for(let i=0; i<(value.PositionSelect.length); ++i){
          {        
            this.selectedFilter.Position+=value.PositionSelect[i].id+',';         
          }         
        }
    
      }
   
      if(value.TimeSelect!=null){
        for(let i=0; i<(value.TimeSelect.length); ++i){
          {        
            this.selectedFilter.StartTime+=value.TimeSelect[i].id+',';         
          }         
        }
      }
    
    }
   

    this.selectedFilter.ShowPastGames = (value.pastGames);

    this.selectedFilter.ShowSignedGames = (value.signedGames);

    this.officialService.postFilterData(this.selectedFilter).then(res=>{this.filterRequest=false;});
    
  }

/* - Sends SignUp request to service - */
tempGroupId: string;
tempGameId: string;
tempPositionId: string;
tempForCancelSignUp:string;
signUpRequest:boolean=false;

postSignUp(groupId : string, gameId: string, positionId: string, ForCancelSignUp: string,template: TemplateRef<any>,standardTemplate: TemplateRef<any>){
  this.signUpRequest=true;
  this.tempGroupId = groupId;
  this.tempGameId = gameId;
  this.tempPositionId = positionId;
  this.tempForCancelSignUp = ForCancelSignUp;
  this.officialService.postSignUp(groupId, gameId, positionId, ForCancelSignUp)
  .then(res => {
    //console.log(res);
    this.signUpRequest=false;
    if(this.officialService.signUpResponse=="Registered")
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'})
    else
    this.modalRef = this.modalService.show(standardTemplate, {class: 'modal-sm'})
  });  
  
}

/* - Sends Cancel SignUp request to service - */
cancelSignUp(groupId : string, gameId: string, positionId: string, ForCancelSignUp: string,cancelTemplate: TemplateRef<any>){
  this.signUpRequest=true;
  this.tempGroupId = groupId;
  this.tempGameId = gameId;
  this.tempPositionId = positionId;
  this.tempForCancelSignUp = ForCancelSignUp;
  this.officialService.postSignUp(groupId, gameId, positionId, ForCancelSignUp)
  .then(res => {
    this.signUpRequest=false;
    this.modalRef = this.modalService.show(cancelTemplate, {class: 'modal-sm'})
  });  
  
}

/* - Implementing ngx-modal from ngx-bootstrap - */

confirmSignUpEmail(): void {
  //this.officialService.selectGameJson=null;
 
  this.modalRef.hide();
  this.officialService.sendSignUpEmail(this.tempGroupId, this.tempGameId, this.tempPositionId, this.tempForCancelSignUp);
  this.officialService.signUpResponse=null;
}

declineSignUpEmail(): void {
  //this.officialService.selectGameJson=null;
  
  this.modalRef.hide();
  //this.officialService.postSelectGames(this.selectedFilter);
  //this.officialService.sendSignUpEmail();
  this.officialService.signUpResponse=null;
}

confirmCancelSignupModal(){
  //this.officialService.selectGameJson=null;
  this.officialService.sendCancelSignUpEmail(this.tempGroupId, this.tempGameId, this.tempPositionId, this.tempForCancelSignUp);
  this.modalRef.hide();
}

closeCancelSignupModal(): void {
  //this.officialService.selectGameJson=null; 
  this.modalRef.hide();
  //this.officialService.postSelectGames(this.selectedFilter);
  //this.officialService.sendSignUpEmail();
  this.officialService.signUpResponse=null;
}

closeStandardModal(){
  this.modalRef.hide();
}
/* - ngx-modal implementation ends - */

gameLocation:string
openMapModal(location:string,mapTemplate: TemplateRef<any>){
  this.gameLocation = location;
  this.modalRef = this.modalService.show(mapTemplate, {class: 'modal-sm'});
  console.log(this.modalRef);
}

closeMapModal(){
  this.modalRef.hide();  
}

getGameLocation(){
  return this.sanitizer.bypassSecurityTrustResourceUrl(this.gameLocation);

}

}