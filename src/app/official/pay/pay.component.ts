import { Component, OnInit } from '@angular/core';
import { OfficialService } from './../official.service';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {

  constructor(public officialService: OfficialService) { 

  }

  ngOnInit() {
    this.officialService.fetchGetPaidData();
  }

}
