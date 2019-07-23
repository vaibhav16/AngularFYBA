import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { UploadAdapter } from './../../player/team/compose-email/uploadAdapter';
import { CoachService } from '../coach.service';
import { RequestedData } from './../models/blastemail.model';
//import { ValidationModalComponent } from './../../../official/report-game/validation-modal/validation-modal.component';
//import { ValidationModalComponent } from './../validation-modal/validation-modal.component';
//import { RequestStatusPopupComponent } from './../../../common/request-status-popup/request-status-popup.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { RequestStatusPopupComponent } from 'src/app/common/request-status-popup/request-status-popup.component';

@Component({
  selector: 'app-blastemail',
  templateUrl: './blastemail.component.html',
  styleUrls: ['./blastemail.component.css']
})
export class BlastemailComponent {
  recepient;
  blastemail:RequestedData;
  blastemailtext:string;
  blastemailtype:boolean;
  blasttext:string;
  public Editor = ClassicEditor;
  emailForm: FormGroup;
  //postEmailBody: RequestedData;
  constructor(private fb: FormBuilder,
    public modalService: BsModalService,
    private router: Router,private route:ActivatedRoute,
    private CoachService: CoachService) {
    this.emailForm = this.fb.group({
      recepient: this.fb.control(this.CoachService.recepient),
      from: this.fb.control(this.CoachService.from),
      subject:'',
      body: this.fb.control([]),
    })
  }

  ngOnInit() {
    this.blastemailtext=this.route.snapshot.paramMap.get('blasttype');
    if(this.blastemailtext=='blast_email'){
        this.blastemailtype=true;
        this.blasttext='EMAIL'; 
    }else{
      this.blastemailtype=false;
      this.blasttext='TEXT';
    }
    console.log(this.blastemail);

  }
  modalRef: BsModalRef;
  request: boolean;
  onSubmit() {
    this.request = true;
    var responseBody;
    this.CoachService.sendEmail(this.emailForm.get('subject').value, this.emailForm.get('body').value)
      .subscribe(
        (res) => {
          this.request = false;
          responseBody = JSON.parse(res["_body"]);
          //this.playerService.emailFlag = false;
          this.modalRef = this.modalService.show(RequestStatusPopupComponent);
          this.modalRef.content.status = responseBody.Status;
          this.modalRef.content.popupTitle = responseBody.Message.PopupHeading;
          this.modalRef.content.popupMsg = responseBody.Message.PopupMessage;
          //this.playerService.indicator.next(true);
          this.modalRef.content.route = "/coach/teaminfo";
          
          
        }
      )
  }
  
  cancel() {
    //this.playerService.emailFlag = false;
    //this.playerService.indicator.next(true);
    this.router.navigate(["coach/teaminfo"]);
  }

  onReady(eventData) {
    //console.log(eventData);
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader) {
      //console.log(btoa(loader.file));
      return new UploadAdapter(loader);
    };
  }
}
