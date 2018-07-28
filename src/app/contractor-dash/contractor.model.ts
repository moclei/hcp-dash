import * as firebase from 'firebase';
import FieldValue = firebase.firestore.FieldValue;
import {Unit} from '../makeready-dash/makeready.model';


export interface Contractor {
  name: string;
  currentProperty: string;
  unit: Unit;
  makeReadyType: Array<string>;
  scheduledStartDate: Date;
  scheduledFinishDate: Date;
  phoneNumber: string;
  status: string;
  updatedAt?: FieldValue;
  createdAt?: FieldValue;
}

export interface ContractorId extends Contractor { id: string; }

