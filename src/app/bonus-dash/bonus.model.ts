import * as firebase from 'firebase';
import FieldValue = firebase.firestore.FieldValue;

export interface Bonus {
  propertyName: string;
  grossPotential: number;
  collectedMTD: number;
  outstandingMTD: number;
  collectedPercent: number;
  percentLeftToBonus: number;
  updatedAt?: FieldValue;
}

export interface BonusId extends Bonus {
  id: string;
}
