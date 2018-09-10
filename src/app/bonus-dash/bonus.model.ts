import * as firebase from 'firebase';
import FieldValue = firebase.firestore.FieldValue;

export interface Bonus {
    propertyName: string;
    grossPotential: number;
    collectedMTD: number;
    outstandingMTD: number;
    collectedPercent: number;
    percentLeftToBonus: number;
    forMonth: number;
    forYear: number;
    thresholdPercent: number;
    updatedAt?: FieldValue;
    createdAt: FieldValue;
}

export interface BonusId extends Bonus {
    id: string;
}
