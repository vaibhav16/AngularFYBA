import { Component, OnInit } from '@angular/core';
import {ImageServiceService} from './image-service.service';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}


@Component({
  selector: 'app-imgupload',
  templateUrl: './imgupload.component.html',
  styleUrls: ['./imgupload.component.css']
})
export class ImguploadComponent {

  selectedFile: ImageSnippet;

  constructor(private imageService: ImageServiceService){}

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);

      this.imageService.uploadImage(this.selectedFile.file)
    });

    reader.readAsDataURL(file);
  }
}