import { Injectable } from '@angular/core';
import { Upload } from '../shared/model/upload';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';
import * as firebase from 'firebase/app';

@Injectable()
export class UploadService {
  static deleteFileStorage(arg0: any, arg1: any): any {
    throw new Error('Method not implemented.');
  }

  constructor(private firebaseApp: FirebaseApp, private db: AngularFireDatabase) {
  }

  pushUpload(type: string, path: string, upload: Upload) {
    const storageRef = this.firebaseApp.storage().ref();

    const metadata = {
      contentType: type,
    };

    return storageRef.child(path).put(upload.file, metadata);
  }

  deleteFile(photoPath: string) {
    const storageRef = this.firebaseApp.storage().ref();
    // Create a reference to the file to delete
    const desertRef = storageRef.child(photoPath);

    // Delete the file
    desertRef.delete().then(function () {
      // File deleted successfully
    }).catch(function (error) {
      // Uh-oh, an error occurred!
    });
  }

  pushUploadNotype(path: string, upload: Upload) {
    const storageRef = this.firebaseApp.storage().ref();
    return storageRef.child(path).put(upload.file);
  }

  // Writes the file details to the realtime db
  private saveFileData(path: string, upload: Upload) {
    this.db.list(`${path}/`).push(upload);
  }

  private deleteUpload(path: string, upload: Upload) {
    this.deleteFileData(path, upload.$key)
      .then(() => {
        UploadService.deleteFileStorage(path, upload.name);
      })
      .catch((error) => console.log(error));
  }

  // Deletes the file details from the realtime db

  private deleteFileData(path: string, key: string) {
    return this.db.list(`${path}/`).remove(key);
  }

  // Firebase files must have unique names in their respective storage dir
  // So the name serves as a unique key

  private deleteFileStorage(path: string, name: string) {
    const storageRef = firebase.storage().ref();
    return storageRef.child(`${path}/${name}`).delete();
  }
}
