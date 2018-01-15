import {Component, Inject} from '@angular/core';
import {Language} from 'angular-l10n';
import {MAT_DIALOG_DATA} from '@angular/material';
import 'firebase/storage';
import {Upload} from '../../shared/model/upload';
import {UploadService} from '../../services/upload.service';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
  providers: [UploadService]
})
export class UploadImageComponent {
  @Language() lang: any;
  processing = false;
  link: string;

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: any,
              private upSvc: UploadService) {
    if (this.md_data) {
      this.link = this.md_data.link;
    }
  }

  upload(event) {
    if (this.md_data) {
      this.processing = true;
      const file = event.target.files.item(0);
      this.upSvc.pushUpload(this.md_data.type, this.md_data.path, new Upload(file)).then((result) => {
        this.link = result.downloadURL;
        this.processing = false;
      }).catch((err) => {
        console.log('err : ' + err.message);
        this.processing = false;
      });
    }
  }
}
