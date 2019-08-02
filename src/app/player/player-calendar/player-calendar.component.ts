import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PlayerService } from './../player.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Form, FormArray, Validators, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ErrorModalComponent } from './../../common/error-modal/error-modal.component';
import { DataSharingService } from './../../data-sharing.service';

@Component({
  selector: 'app-player-calendar',
  templateUrl: './player-calendar.component.html',
  styleUrls: ['./player-calendar.component.css']
})
export class PlayerCalendarComponent implements OnInit {
  modalRef: BsModalRef;
  /**variable declaration start */

    dataRequest: boolean;
    initialFetchError = null;
    errorMsg: string;
  /**variable declaration end */
  constructor(public modalService: BsModalService,
    public playerService: PlayerService,
    public dss: DataSharingService,
    public router: Router, 
    private fb: FormBuilder) { }

  ngOnInit() {
  }

}
