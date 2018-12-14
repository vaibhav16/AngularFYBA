import { Component, OnInit, Output, Input } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-popup-error-modal',
  templateUrl: './popup-error-modal.component.html',
  styleUrls: ['./popup-error-modal.component.css'],
  providers: [BsModalService]
})
//@Input
export class PopupErrorModalComponent{

  // @Input() title: string = 'Modal with component';
  // @Input() message: string = 'Message here...';

  constructor(public bsModalRef: BsModalRef) { }

  public clickOk() {
    console.log("Click ok...");
  }

}
