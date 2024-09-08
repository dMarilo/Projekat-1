import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import Dropzone, { DropzoneFile } from "dropzone"

@Component({
  selector: 'app-image-dropzone',
  standalone: true,
  imports: [],
  templateUrl: './image-dropzone.component.html',
  styleUrl: './image-dropzone.component.scss'
})

 export class ImageDropzoneComponent implements AfterViewInit {
   ngAfterViewInit(): void {
     const dropzone = new Dropzone('#dropzone', {
       url: 'http://localhost:8000/api/update-info',
       method: 'POST',
       acceptedFiles: 'image/*',
       headers: {
         'Authorization': `Bearer ${localStorage.getItem('token')}`
       },
       init: function() {
        this.on("sending", function(file, xhr, formData) {
          formData.append('profile_pic', file);
        });
 
        this.on('success', (file: DropzoneFile, res: any) => {
          console.log('success', res);
        });
 
        this.on('error', (file: DropzoneFile, res: any) => {
          console.log('error', res);
        })
       },
     });
   }
 }

       