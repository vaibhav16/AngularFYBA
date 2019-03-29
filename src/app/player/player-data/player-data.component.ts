import { Component, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
  selector: 'player-data',
  templateUrl: './player-data.component.html',
  styleUrls: ['./player-data.component.css']
})
export class PlayerDataComponent implements OnInit {
  @Output() selected = new EventEmitter();
  constructor() {}

  ngOnInit() {}
}
