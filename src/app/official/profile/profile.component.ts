import { Component, OnInit } from '@angular/core';
import { OfficialService } from './../official.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(public officialService: OfficialService) { }

  ngOnInit() {
    this.officialService.fetchProfileData();
  }

}
