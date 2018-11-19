import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UploaderService } from '../services/Uploader.service';

@Component({
  selector: 'app-uploader-panel',
  templateUrl: './uploader-panel.component.html',
  styleUrls: [
    // '../../../node_modules/carbon-components/css/carbon-components.min.css',
    './uploader-panel.component.scss'
  ]
})
export class UploaderPanelComponent {
  @Input() uploadPath: string;
  @Output() onClose: EventEmitter<null> = new EventEmitter<null>();

  encodings = [
    {
        content: 'BINARY',
        selected: true
    },
    {
        content: 'IBM-1047',
        selected: false,
    },
    {
        content: 'UTF-8',
        selected: false
    }
  ];

  files: Set<File>;

  constructor(private uploader: UploaderService) { }

  ngOnInit(): void {
    this.uploadHandlerSetup();
    this.files = new Set<File>();
  }

  close(): void {
    this.onClose.emit();
  }

  onFilesAdded(event: any): void {
    for (let file of event.target.files) {
      if (!this.files.has(file)) {
        this.files.add(file);
      }
    }
    console.log(this.files);
  }

  uploadHandlerSetup(): void {
      const form = <HTMLFormElement> document.getElementById('file-form');
      const fileSelect = <HTMLInputElement> document.getElementById('file-upload');
      const uploadButton = <HTMLButtonElement> document.getElementById('upload-button');

      form.onsubmit = (event) => {
          event.preventDefault();
          console.log('Submit Event Triggered');

          uploadButton.innerHTML = 'Uploading...'; // prevents browser from submitting form
          const files = <FileList> fileSelect.files;

          for (let i = 0; i < files.length; i++) {
              const file = files[i];

              this.uploader.chunkAndSendFile(file, this.uploadPath);
          }
      };
  }
}
