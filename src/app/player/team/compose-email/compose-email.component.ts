import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UploadAdapter } from './uploadAdapter';
import { PlayerService } from '../../player.service';
import { RequestedData } from './../../models/Iemail.model';
import { ValidationModalComponent } from './../../../official/report-game/validation-modal/validation-modal.component';
//import { ValidationModalComponent } from './../validation-modal/validation-modal.component';
import { RequestStatusPopupComponent } from './../../../common/request-status-popup/request-status-popup.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-compose-email',
  templateUrl: './compose-email.component.html',
  styleUrls: ['./compose-email.component.css']
})
export class ComposeEmailComponent implements OnInit {
  recepient;
  public Editor = ClassicEditor;
  emailForm: FormGroup;
  postEmailBody: RequestedData;
  constructor(private fb: FormBuilder,
    public modalService: BsModalService,
    private router: Router,
    private playerService: PlayerService) {
    this.emailForm = this.fb.group({
      recepient: this.fb.control(this.playerService.recepient),
      subject: this.fb.control([]),
      body: this.fb.control([]),
    })
  }

  ngOnInit() {
  }


  modalRef: BsModalRef;
  request: boolean;
  onSubmit() {
    this.request = true;
    var responseBody;
    console.log(this.emailForm.get('body').value);
    this.playerService.sendEmail(this.emailForm.get('subject').value, this.emailForm.get('body').value)
      .subscribe(
        (res) => {
          this.request = false;
          console.log(res);
          responseBody = JSON.parse(res["_body"]);
          console.log(responseBody);
          this.playerService.emailFlag = false;
          this.modalRef = this.modalService.show(RequestStatusPopupComponent);
          this.modalRef.content.status = responseBody.Status;
          this.modalRef.content.popupTitle = responseBody.Message.PopupHeading;
          this.modalRef.content.popupMsg = responseBody.Message.PopupMessage;
          this.modalRef.content.route = "/player/team";
          
        }
      )
  }


  cancel() {
    this.playerService.emailFlag = false;
    this.router.navigate(["/player/team"]);
  }


  onReady(eventData) {
    console.log(eventData);
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader) {
      console.log(btoa(loader.file));
      return new UploadAdapter(loader);
    };
  }


}
