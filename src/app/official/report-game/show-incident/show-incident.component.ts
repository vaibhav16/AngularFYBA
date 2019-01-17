import { Component, OnInit, Input,TemplateRef,Output,EventEmitter  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { IncidentReports } from './../../classes/reportgame/Incident.model';
import { OfficialService } from './../../official.service';
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-show-incident',
  templateUrl: './show-incident.component.html',
  styleUrls: ['./show-incident.component.css']
})
export class ShowIncidentComponent implements OnInit {
  public incident;
  public name: string;
  constructor(public fb: FormBuilder,
    public bsModalRef: BsModalRef,
    public cookieService: CookieService
  ) { }

  editIncidentForm: FormGroup;
  ngOnInit() {
    console.log(this.incident);
    this.name= this.cookieService.get("name");
    this.editIncidentForm = this.fb.group({
      incidentType: ["",Validators.required],
      incidentSubDropDown: [{value:"" , disabled: true},Validators.required],
      note: [{value:"" , disabled: true},Validators.required]
    });
  }

}
