import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OfficialService } from '../official.service';
import { NgbAccordionConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm, FormGroup,  FormBuilder } from '@angular/forms';
import { Filter } from './filter.model';

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

  itemList = [];
  itemList1 = [];
  selectedItems = [];
  settings = {};
  formModel = {
      name: null,
      email: '',
      skills: []
  };
  submitted = false;
  

  selectedFilter:Filter = {      
    Division: '',
    Location: '',
    StartTime: '',
    EndTime: '',
    Position: ''        
  } 

  constructor(fb:FormBuilder, 
    public officialService: OfficialService,
    config: NgbAccordionConfig, private modalService: NgbModal) {
    config.closeOthers = true;
    config.type = 'info';  
   }  


  logForm(value: any) {
    console.log(value);
    console.log("Filter:");
    console.log(this.selectedFilter);
  }

  ngOnInit() {
    //this.selectGameJson = this.officialService.getSelectGames(); 
    this.selectGameJson = this.officialService.getSelectGames2();  

    this.settings = {
      text: "Select Skills",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class"
  };

  this.itemList1 = [
    { "id": 1, "itemName": "Angular" },
    { "id": 2, "itemName": "JavaScript" },
    { "id": 3, "itemName": "HTML" },
    { "id": 4, "itemName": "CSS" },
    { "id": 5, "itemName": "ReactJS" },
    { "id": 6, "itemName": "HTML5" }
];

  this.itemList = [
    {"id":1,"itemName":"1B"},
  {"id":2,"itemName":"2B"},
  {"id":3,"itemName":"3B"},
  {"id":4,"itemName":"4B"},
  {"id":5,"itemName":"5B"},
  {"id":6,"itemName":"6B"},
  {"id":7,"itemName":"7B"},
  {"id":8,"itemName":"8/9B"},
  {"id":12,"itemName":"3G"},
  {"id":13,"itemName":"4G"},
];

console.log(this.itemList);
//console.log(this.officialService.selectGameJson["Value"].Filters.Filter_Divisions)
    
    
  }

  onItemSelect(item: any) {
    console.log(item);
    console.log(this.officialService.selectGameJson["Value"].Filters.Filter_Divisions)
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
