import * as firebase from 'firebase';
import FieldValue = firebase.firestore.FieldValue;

export interface VacancyList {
    property: string;
    createdAt: FieldValue;
    city: string;
    propertyNameFull: string;
    vacancies: Array<Vacancy>;
}


export interface Vacancy {
    property: string;
    city: string;
    unit: string;
    tags: string;
    type: string;
    size: string;
    status: string;
    ready: boolean;
    daysVacant: number;
    lastRent: string;
    scheduledRent: string;
    newRent: string;
    lastMoveIn: string;
    lastMoveOut: string;
    availableOn: string;
    nextMoveIn: string;
    description: string;
}
