import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ValueTransformer } from '@angular/compiler/src/util';

@Component({
  selector: 'app-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.css']
})

export class MultiselectComponent implements OnInit {
  itemList = [];
  selectedItems = [];
  settings = {};
  formModel = {
      name: null,
      email: '',
      skills: []
  };
  submitted = false;
  
  onSubmit(form: any) 
  { 
    this.submitted = true;
    console.log(form); 
    for(let i=0; i<form.skills.length; ++i){
      console.log(form.skills[i].itemName);
    }  
  }

  constructor() { }
  ngOnInit() {
      this.itemList = [
          { "id": 1, "itemName": "Angular" },
          { "id": 2, "itemName": "JavaScript" },
          { "id": 3, "itemName": "HTML" },
          { "id": 4, "itemName": "CSS" },
          { "id": 5, "itemName": "ReactJS" },
          { "id": 6, "itemName": "HTML5" }
      ];

      this.settings = {
          text: "Select Skills",
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          classes: "myclass custom-class"
      };
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

}