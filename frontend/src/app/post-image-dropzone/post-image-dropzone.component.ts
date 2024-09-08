import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import Dropzone, { DropzoneFile } from 'dropzone';


@Component({
  selector: 'app-post-image-dropzone',
  standalone: true,
  imports: [],
  templateUrl: './post-image-dropzone.component.html',
  styleUrl: './post-image-dropzone.component.scss',
})
export class PostImageDropzoneComponent implements AfterViewInit {
  @Output() imageUrl = new EventEmitter<string>();
  saveUrl: string = "";
  ngAfterViewInit(): void {
    const dropzone = new Dropzone('#post-dropzone', {
      url: 'http://localhost:8000/api/upload-post-image',
      method: 'POST',
      acceptedFiles: 'image/*',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      init: function () {
        this.on('sending', function (file, xhr, formData) {
          formData.append('image', file);
          console.log('Uploading file:', file);
          console.log('AAAAAAAAA');
        });
        this.on('success', function (file, response) {
          console.log('File uploaded successfully:', response);
          let imagePath: string;

          if (typeof response === 'string') {
            // If response is a string, use it directly as the path
            imagePath = response;
          } else if (typeof response === 'object' && response !== null && 'path' in response) {
            // If response is an object and contains the 'path' property, use it
            imagePath = (response as { path: string }).path;
          } else {
            console.error('Unexpected response format:', response);
            return;
          }

          console.log("Image Path: " + imagePath);

          // Construct the full URL based on your server configuration
          const imageUrl = `${imagePath}`;

          // Save the image URL to localStorage
          localStorage.setItem('uploadedImageUrl', imageUrl);
        });

        this.on('error', function (file, errorMessage) {
          console.error('Error uploading file:', errorMessage);
        });
      },
    });
  }
}
