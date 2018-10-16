import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OfficialService } from '../official.service';
import { NgbAccordionConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm, FormGroup,  FormBuilder } from '@angular/forms';
import { Filter } from './filter.model';
import { count } from 'rxjs/operators';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-select-game',
  templateUrl: './select-game.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./select-game.component.css'],
  providers: [ NgbAccordionConfig ] 
})

export class SelectGameComponent implements OnInit {
  selectGameJson: JSON;
  closeResult: string;
  public shouldShow = true;
  optionSelected: any;

  divisionList = [];
  selectedItems = [];
  settings = {};
  filterModel = {     
      Division: [],
      Location: [],
      StartTime: [],
      EndTime: [],
      Position:[]
  };
  submitted = false;
  
  selectedFilter:Filter = {      
    Division: '',
    Location: '',
    StartTime: '',
    EndTime: '',
    Position: ''        
  } 

  constructor(fb:FormBuilder, private http: Http,
    public officialService: OfficialService,
    config: NgbAccordionConfig, private modalService: NgbModal) {
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
    
    console.log(value);  
    console.log(value.DivisionSelect.length);
    for(let i=0; i<value.DivisionSelect.length-1; ++i){
      { 
        //if(i==value.DivisionSelect.length-1)
        //this.selectedFilter.Division+=value.DivisionSelect[i].itemName;
        //else
        this.selectedFilter.Division+=value.DivisionSelect[i].itemName+',';    
      }         
    }  
    //this.selectedFilter.Division = this.selectedFilter.Division.slice(0,-1);

    for(let i=0; i<value.LocationSelect.length-1; ++i){
      { 
        //if(i==value.LocationSelect.length-1)
        //this.selectedFilter.Location+=value.LocationSelect[i].itemName;
        //else
        this.selectedFilter.Location+=value.LocationSelect[i].itemName+',';    
      }         
    }

    //console.log(Object.keys(value.PositionSelect).length-1);
    //console.log(value.PositionSelect.length);
    for(let i=0; i<(value.PositionSelect.length-1); ++i){
      { 
        //if(i==(value.PositionSelect.length-1))
        //this.selectedFilter.Position+=value.PositionSelect[i].itemName;
        //else
        this.selectedFilter.Position+=value.PositionSelect[i].itemName+',';  
        //console.log(value.PositionSelect[i].itemName);
      }         
    }
    console.log("Selected Filter"); 
    console.log(this.selectedFilter);
    this.officialService.postFilterData(this.selectedFilter);
    
  }


  ngOnInit() {
    //this.selectGameJson = this.officialService.getSelectGames(); 
    this.selectGameJson = this.officialService.getSelectGames();  


    this.settings = {
      text: "Select Skills",
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
}
