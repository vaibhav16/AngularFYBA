import { Component, OnInit, ViewEncapsulation,ElementRef,Renderer2,ViewChild } from '@angular/core';
import { OfficialService } from '../official.service';
import { NgbAccordionConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm, FormGroup,  FormBuilder } from '@angular/forms';
import { Filter } from './filter.model';
import { count } from 'rxjs/operators';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { map } from 'rxjs/operators';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from './../../login/login.service';

@Component({
  selector: 'app-select-game',
  templateUrl: './select-game.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./select-game.component.css'],
  providers: [ NgbAccordionConfig ] 
})

export class SelectGameComponent implements OnInit {
  @ViewChild("acchead1", {read: ElementRef})
  private acchead1: ElementRef;
  sessionKey:string;
  //selectGameJson: JSON;
  expandTriangle:boolean=false;
  public shouldShow = true; 
  
  activeIds: string[] =[];
  panels = [0, 1,2,3];

  selectedItems = [];
  itemList = [];
  settings = {};
  
  filterModel = {     
      Division: [],
      Location: [],
      StartTime: [],
      EndTime: [],
      Position:[]
  };
  
  selectedFilter:Filter = {      
    Division: '',
    Location: '',
    StartTime: '',
    EndTime: '',
    Position: ''        
  } 

  constructor(fb:FormBuilder, private http: Http,
    private renderer:Renderer2,
    public officialService: OfficialService,
    config: NgbAccordionConfig, private modalService: NgbModal, 
    public loginService: LoginService,
    ) {

    config.closeOthers = false;
    config.type = 'info';  
   }  


  logForm(value: any) {
    this.selectedFilter = {      
      Division: '',
      Location: '',
      StartTime: '',
      EndTime: '',
      Position: ''        
    } 
    
   
    for(let i=0; i<value.DivisionSelect.length; ++i){
      { 
        this.selectedFilter.Division+=value.DivisionSelect[i].id+',';    
      }         
    }  
    //this.selectedFilter.Division = this.selectedFilter.Division.slice(0,-1);

    for(let i=0; i<value.LocationSelect.length; ++i){
      { 
        this.selectedFilter.Location+=value.LocationSelect[i].id+',';    
      }         
    }


    for(let i=0; i<(value.PositionSelect.length); ++i){
      {        
        this.selectedFilter.Position+=value.PositionSelect[i].id+',';         
      }         
    }

    
    for(let i=0; i<(value.TimeSelect.length); ++i){
      {        
        this.selectedFilter.StartTime+=value.TimeSelect[i].id+',';         
      }         
    }
  
    this.loginService.sessionKey = this.officialService.selectGameJson["SessionKey"];

    this.officialService.postFilterData(this.selectedFilter);
    
  }


  ngOnInit() {
  this.settings = {
      text: "Select....",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class"
  };
       
    this.officialService.postSelectGames(this.selectedFilter);  
    //this.officialService.getSelectGames();
    
}

onItemSelect(item: any) {
  console.log(item);
  console.log(this.selectedItems);
}
OnItemDeSelect(item: any) {
  console.log(item);
  console.log(this.selectedItems);
}
onSelectAll(items: any) {
  console.log(items);
}
onDeSelectAll(items: any) {
  console.log(items);
}

postSignUp(groupId : string, gameId: string, positionId: string, ForCancelSignUp: string){
  this.officialService.postSignUp(groupId, gameId, positionId, ForCancelSignUp);

}

public beforeChange($event: NgbPanelChangeEvent) {

  //this.activeIds = this.panels.map(p => "panel-"+ p);
  this.activeIds.push($event.panelId);
  console.log($event.panelId);
  console.log(this.activeIds);
}

}