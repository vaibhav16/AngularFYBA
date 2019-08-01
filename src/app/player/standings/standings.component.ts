import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PlayerService } from './../player.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Form, FormArray, Validators, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ErrorModalComponent } from './../../common/error-modal/error-modal.component';
import { DataSharingService } from './../../data-sharing.service';


@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.css']
})
export class StandingsComponent implements OnInit {
  modalRef: BsModalRef;
  /**variable declaration start */

    dataRequest: boolean;
    initialFetchError = null;
    errorMsg: string;
  /**variable declaration end */
  constructor(
    public modalService: BsModalService,
    public playerService: PlayerService,
    public dss: DataSharingService,
    public router: Router, 
    private fb: FormBuilder) { }
   
  ngOnInit() {
    this.dataRequest=true;
    if(this.dss.DivisionId){
      this.getstandingsData();
    }
    
  }

  async getstandingsData() {
    await this.playerService.getstandingsData().subscribe((res) => {    
      this.dataRequest = false;      
      var response = JSON.parse(res["_body"]); 
      //console.log(response);          
      if (response.Status==true) {      
        this.playerService.standingsData =response.Value;  
      } else {
        this.modalRef = this.modalService.show(ErrorModalComponent);
        this.modalRef.content.closeBtnName = 'Close';
      }         
    }, (err) => {
      this.initialFetchError = true;
      this.errorMsg = err;
      this.modalRef = this.modalService.show(ErrorModalComponent);
      this.modalRef.content.closeBtnName = 'Close';
      this.modalRef.content.errorMsg = err;
    });
  }

  get standlings(){
    return this.playerService.standingsData;
  }
}
