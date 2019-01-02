import * as firebase from 'firebase';
import FieldValue = firebase.firestore.FieldValue;
import {Unit} from '../makeready-dash/makeready.model';


export interface Contractor {
    name: string;
    firstName: string;
    lastName: string;
    firstNameSoundex: string;
    lastNameSoundex: string;
    phoneNumber: string;
    status: string;
    numReviews: number;
    totalScore: number;
    createdBy: string;
    updatedAt?: FieldValue;
    createdAt?: FieldValue;
}

/*
export interface Job {
    contractor: Contractor;
    contractorName: string;
    property: string;
    unit: Unit;
    jobType: Array<string>;
    startDate: Date;
    endDate: Date;
    comments: string;
    rating: number;
    createdBy: string;
    updatedAt?: FieldValue;
    createdAt?: FieldValue;
}*/

export interface ContractorId extends Contractor {
    id: string;
}

