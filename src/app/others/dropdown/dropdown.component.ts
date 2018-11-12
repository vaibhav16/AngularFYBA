import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {
  firstname = 'Pascal';
  lastname = 'Precht';

  logForm(value: any) {
    console.log(value);
  }

  constructor() { }

  ngOnInit() {
  }

}
