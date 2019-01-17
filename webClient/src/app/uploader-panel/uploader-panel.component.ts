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
  encodings = [
    {
        name: 'BINARY',
        value: 'BINARY',
        selected: true
    },
    {
        name: 'UTF-8',
        value: 'UTF-8',
        selected: false
    },
    {
        name: 'ISO-8859-1',
        value: 'ISO-8859-1',
        selected: false
    },
    {
        name: 'International EBCDIC 1047',
        value: 'IBM-1047',
        selected: false
    },
    {
        name: 'German/Austrian EBCDIC 273',
        value: 'IBM-273',
        selected: false
    },
    {
        name: 'Danish/Norwegian EBCDIC 277',
        value: 'IBM-277',
        selected: false
    },
    {
        name: 'Finnish/Swedish EBCDIC 278',
        value: 'IBM-278',
        selected: false
    },
    {
        name: 'Italian EBCDIC 278',
        value: 'IBM-278',
        selected: false
    },
    {
        name: 'Japanese Katakana 290',
        value: 'IBM-290',
        selected: false
    },
    {
        name: 'French EBCDIC 297',
        value: 'IBM-297',
        selected: false
    },
    {
        name: 'Arabic (type 4) EBCDIC 420',
        value: 'IBM-420',
        selected: false
    },
    {
        name: 'Hebrew EBCDIC 424',
        value: 'IBM-424',
        selected: false
    },
    {
        name: 'International EBCDIC 500',
        value: 'IBM-500',
        selected: false
    },
    {
        name: 'Thai EBCDIC 838',
        value: 'IBM-838',
        selected: false
    },
    {
        name: 'Croat/Czech/Polish/Serbian/Slovak EBCDIC 870',
        value: 'IBM-870',
        selected: false
    },
    {
        name: 'Greek EBCDIC 875',
        value: 'IBM-875',
        selected: false
    },
    {
        name: 'Urdu EBCDIC 918',
        value: 'IBM-918',
        selected: false
    },
    {
        name: 'Cyrillic(Russian) EBCDIC 1025',
        value: 'IBM-1025',
        selected: false
    },
    {
        name: 'Turkish EBCDIC 1026',
        value: 'IBM-1026',
        selected: false
    },
    {
        name: 'Farsi Bilingual EBCDIC 1097',
        value: 'IBM-1097',
        selected: false
    },
    {
        name: 'Baltic Multilingual EBCDIC 1112',
        value: 'IBM-1112',
        selected: false
    },
    {
        name: 'Devanagari EBCDIC 1137',
        value: 'IBM-1137',
        selected: false
    },
    {
        name: 'Chinese Traditional EBCDIC 937',
        value: 'IBM-937',
        selected: false
    },
    {
        name: 'Chinese Simplified EBCDIC 935',
        value: 'IBM-935',
        selected: false
    },
    {
        name: 'Japanese EBCDIC 930',
        value: 'IBM-930',
        selected: false
    },
    {
        name: 'Japanese EBCDIC 931',
        value: 'IBM-931',
        selected: false
    },
    {
        name: 'Japanese EBCDIC 939',
        value: 'IBM-939',
        selected: false
    },
    {
        name: 'Japanese EBCDIC 1390',
        value: 'IBM-1390',
        selected: false
    },
    {
        name: 'Japanese EBCDIC 1399',
        value: 'IBM-1399',
        selected: false
    },
    {
        name: 'Korean EBCDIC 933',
        value: 'IBM-933',
        selected: false
    }
  ];

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
    const names = Array.from(this.files, file => file.name);
    for (let file of event.target.files) {
      if (!(names.includes(file.name))) {
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

      // We should make a queue that holds the list of files we wish to upload
      // That queue should likely be stored in a service (probably the uploader service that exists)

      const filesCopy = this.files;
      const fileEncodingsCopy = this.fileEncodings;
      let fileIdx = 0;
      const uploadFiles = () => {
        if (fileIdx < filesCopy.length) {
          const file = filesCopy[fileIdx];
          this.uploader.chunkAndSendFile(file, this.uploadPath, fileEncodingsCopy[fileIdx])
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
      this.close();
    };
  }
}
