import { Pipe, PipeTransform } from '@angular/core';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

@Pipe({
  name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {

  transform(tel: any, args?: any): any {
    const timestamp = tel as Timestamp ;
    return timestamp.toDate().toLocaleDateString();
  }

}
