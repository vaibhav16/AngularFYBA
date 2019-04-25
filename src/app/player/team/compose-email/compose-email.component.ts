import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UploadAdapter } from './uploadAdapter';
import { PlayerService } from '../../player.service';

@Component({
  selector: 'app-compose-email',
  templateUrl: './compose-email.component.html',
  styleUrls: ['./compose-email.component.css']
})
export class ComposeEmailComponent implements OnInit {
  recepient;
  public Editor = ClassicEditor;
  emailForm: FormGroup;
  constructor(private fb: FormBuilder,
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

  onSubmit() {
    console.log(this.emailForm.value);
  }

  cancel() {
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
