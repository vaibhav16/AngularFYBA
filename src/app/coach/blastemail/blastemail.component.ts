import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UploadAdapter } from './../../player/team/compose-email/uploadAdapter';
//import { PlayerService } from '../../player.service';
//import { RequestedData } from './../../models/Iemail.model';
//import { ValidationModalComponent } from './../../../official/report-game/validation-modal/validation-modal.component';
//import { ValidationModalComponent } from './../validation-modal/validation-modal.component';
//import { RequestStatusPopupComponent } from './../../../common/request-status-popup/request-status-popup.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-blastemail',
  templateUrl: './blastemail.component.html',
  styleUrls: ['./blastemail.component.css']
})
export class BlastemailComponent {
  recepient;
  public Editor = ClassicEditor;
  emailForm: FormGroup;
  //postEmailBody: RequestedData;
  constructor(private fb: FormBuilder,
    public modalService: BsModalService,
    private router: Router) {
    this.emailForm = this.fb.group({
      recepient: this.fb.control([]),
      subject: this.fb.control([]),
      body: this.fb.control([]),
    })
  }

  ngOnInit() {
  }
  
  cancel() {
    //this.playerService.emailFlag = false;
    //this.playerService.indicator.next(true);
    this.router.navigate(["coach/teaminfo"]);
  }

  onReady(eventData) {
    console.log(eventData);
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader) {
      console.log(btoa(loader.file));
      return new UploadAdapter(loader);
    };
  }
}
