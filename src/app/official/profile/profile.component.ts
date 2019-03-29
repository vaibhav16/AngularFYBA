import { Component, ElementRef, OnInit, Renderer2, TemplateRef } from '@angular/core';
import { OfficialService } from './../official.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ErrorModalComponent } from './../../common/error-modal/error-modal.component';
import { IProfileSection } from './../classes/profile/IProfile.model';
import { CookieService } from 'ngx-cookie-service';
import { DataSharingService } from './../../data-sharing.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public profileSection: IProfileSection = null;
  profileRequest: boolean = null;
  initialFetchError: boolean = null;
  errorMsg: string;
  imgUrl: string = '';
  modalRef: BsModalRef;
  template: TemplateRef<any>;
  constructor(
    public officialService: OfficialService,
    public elRef: ElementRef,
    private modalService: BsModalService,
    public renderer: Renderer2,
    private cookieService: CookieService,
    public dss: DataSharingService,
    public router: Router
  ) {}

  ngOnInit() {
    this.profileRequest = true;
    this.officialService.fetchProfileData().subscribe(
      (data) => {
        if (data['Status']) {
          this.profileSection = data;
          console.log(this.profileSection);
        } else {
          this.profileRequest = false;
          this.initialFetchError = true;
          this.modalRef = this.modalService.show(ErrorModalComponent);
          this.modalRef.content.closeBtnName = 'Close';
        }
      },
      (err) => {
        this.profileRequest = false;
        this.initialFetchError = true;
        this.errorMsg = err;
        console.log(err);
        this.modalRef = this.modalService.show(ErrorModalComponent);
        this.modalRef.content.closeBtnName = 'Close';
        this.modalRef.content.errorMsg = err;
      },
      () => {
        if (this.profileSection.Value[0].PersonalInfo.profilePhotos.length > 0) {
          this.imgUrl = this.profileSection.Value[0].PersonalInfo.profilePhotos[0].Link;
          this.imgThumbnail = this.profileSection.Value[0].PersonalInfo.profilePhotos[0].Thumbnail;
        }
        this.profileRequest = false;
      }
    );
  }

  //uploadTempImage:boolean;
  async processFile(imageInput: any, template: TemplateRef<any>) {
    this.profileRequest = true;
    if (imageInput) {
      this.template = template;
      //console.log(imageInput.files[0]);
      var reader = await new FileReader();
      reader.onload = await this._handleReaderLoaded.bind(this);
      await reader.readAsBinaryString(imageInput.files[0]);
    }
  }

  newImgByteCode;
  source_code;
  imgThumbnail: string = '';

  async _handleReaderLoaded(readerEvt) {
    var binaryString = null;
    binaryString = await readerEvt.target.result;
    this.newImgByteCode = await btoa(binaryString);

    await this.officialService.uploadProfileImage(this.newImgByteCode).subscribe(
      (data) => {
        console.log(data);
        if (data['Status']) {
          this.cookieService.set('roundThumbnail', data['Value'].RoundThumbnail);
          this.dss.roundThumbnail = data['Value'].RoundThumbnail;
          this.imgThumbnail = data['Value'].Thumbnail;
          this.imgUrl = data['Value'].Link;
        } else {
          this.modalRef = this.modalService.show(ErrorModalComponent);
          this.modalRef.content.closeBtnName = 'Close';
          this.profileRequest = false;
        }
      },
      (err) => {
        this.profileRequest = false;
        console.log(err);
        this.modalRef = this.modalService.show(ErrorModalComponent);
        this.modalRef.content.closeBtnName = 'Close';
      },
      () => {
        this.profileRequest = false;
      }
    );
  }

  // showModal() {
  //   if (this.officialService.uploadError) {
  //     this.modalRef = this.modalService.show(this.template, {
  //       class: 'modal-sm'
  //     });
  //   }
  // }

  deleteProfileImage(fileName) {
    this.profileRequest = true;
    console.log(this.imgUrl);

    this.officialService.deleteProfileImage(this.imgUrl).subscribe(
      (data) => {
        console.log(data);
        if (data['Status']) {
          this.dss.roundThumbnail = data['Value'];
          this.cookieService.set('roundThumbnail', data['Value']);
        } else {
          this.profileRequest = false;
          this.modalRef = this.modalService.show(ErrorModalComponent);
          this.modalRef.content.closeBtnName = 'Close';
        }
      },
      (err) => {
        this.profileRequest = false;
        console.log(err);
        this.modalRef = this.modalService.show(ErrorModalComponent);
        this.modalRef.content.closeBtnName = 'Close';
      },
      () => {
        this.profileRequest = false;
        this.imgUrl = '';
        this.imgThumbnail = '';
      }
    );
    // this.officialService.deleteProfileImage(this.imgUrl).then((res) => {
    //   this.profileRequest = false;
    //   this.imgUrl = '';
    //   this.imgThumbnail = '';
    // });
  }

  // closeModal() {
  //   this.modalRef.hide();
  //   this.officialService.uploadError = false;
  // }
}
