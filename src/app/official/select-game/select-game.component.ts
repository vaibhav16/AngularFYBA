import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
  sessionKey:string;
  //selectGameJson: JSON;
  expandTriangle:boolean=false;
  public shouldShow = true; 
  
  selectedItems = [];
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
    public officialService: OfficialService,
    config: NgbAccordionConfig, private modalService: NgbModal, 
    public loginService: LoginService) {

    config.closeOthers = true;
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

    //console.log(this.officialService.selectGameJson);
  
    this.loginService.sessionKey = this.officialService.selectGameJson["SessionKey"];
    //console.log()
    this.officialService.postFilterData(this.selectedFilter);

    
  }


  ngOnInit() {
    
    //this.sessionKey = this.loginService.selectGameJson["SessionKey"];
    //this.officialService.selectGameJson = this.officialService.postSelectGames(this.selectedFilter,this.sessionKey);  
    this.officialService.postSelectGames(this.selectedFilter);  
    
    


    this.settings = {
      text: "Select...",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class"
  };
}

  onItemSelect(item: any) {
    console.log(item);
    //console.log(this.officialService.selectGameJson["Value"].Filters.Filter_Divisions)
    console.log("Selected");
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

  public beforeChange($event: NgbPanelChangeEvent) {
    
    if ($event.panelId === 'toggle-1' && $event.nextState === false) {
      console.log($event);
      this.expandTriangle=true;
      //$event.preventDefault();
    }
    if ($event.panelId === 'toggle-2' && $event.nextState === false) {
        $event.preventDefault();
    }
    if ($event.panelId === 'toggle-3' && $event.nextState === false) {
        $event.preventDefault();
    }
  }
}
