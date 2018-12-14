import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UploaderService } from '../services/Uploader.service';

@Component({
  selector: 'app-uploader-panel',
  templateUrl: './uploader-panel.component.html',
  styleUrls: [
    // '../../../node_modules/carbon-components/css/carbon-components.min.css',
    './uploader-panel.component.scss',
    '../../styles.scss'
  ]
})
export class UploaderPanelComponent {
  @Input() uploadPath: string;
  @Output() onClose: EventEmitter<null> = new EventEmitter<null>();

  files: Array<File>;
  fileEncodings: Array<string>;

  constructor(private uploader: UploaderService) { }

  ngOnInit(): void {
    this.uploadHandlerSetup();
    this.files = new Array<File>();
    this.fileEncodings = new Array<string>();
  }

  close(): void {
    this.files = [];
    this.fileEncodings = [];
    this.onClose.emit();
  }

  onFilesAdded(event: any): void {
    for (let file of event.target.files) {
      if (!(file in this.files)) {
        this.files.push(file);
        this.fileEncodings.push('BINARY');
      }
    }
    console.log(this.files);
    console.log(this.fileEncodings);
  }

  changeFileEncoding(event: any): void {
    console.log(event);
    // this.fileEncodings.set(event.file, event.fileEncoding);
    console.log(this.fileEncodings);
  }

  uploadHandlerSetup(): void {
    const form = <HTMLFormElement> document.getElementById('file-form');

    form.onsubmit = (event) => {
      event.preventDefault();

      console.log(this.files);

      // This code will asynchronously trigger all the files to be uploaded at once.
      // Not sure if this is the way we want to go or if we want to do uploads one file at a time.

      // for (let i = 0; i < this.files.length; i++) {
      //   this.uploader.chunkAndSendFile(this.files[i], this.uploadPath, this.fileEncodings[i])
      //     .subscribe(
      //       value => console.log('Progress:', value),
      //       error => {},
      //       () => console.log('Finished uploading', this.files[i].name)
      //     );
      // }

      let fileIdx = 0;
      const uploadFiles = () => {
        if (fileIdx < this.files.length) {
          const file = this.files[fileIdx];
          this.uploader.chunkAndSendFile(file, this.uploadPath, this.fileEncodings[fileIdx])
          .subscribe(
            value => { console.log('Progress:', value) },
            error => {},
            () => {
              console.log('Finished with', file.name);
              fileIdx++;
              uploadFiles();
            }
          );
        }
      }

      uploadFiles();
    };
  }
}
