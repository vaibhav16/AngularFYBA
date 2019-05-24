import { Component, OnInit } from '@angular/core';
//import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PlayerService } from './../../player.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {

  constructor(private playerService: PlayerService, public modalRef: BsModalRef) { }

  
  playerId:number;
  details:JSON;


  ngOnInit() {
    console.log(this.details);
  }

  withdraw(){
    console.log(this.playerId);
    this.playerService.withdrawPlayer(this.playerId)
    .subscribe(
      (res)=>{
        console.log(JSON.parse(res["_body"]));
      }
    )
  }

  cancel(){
    this.modalRef.hide();
  }

}
