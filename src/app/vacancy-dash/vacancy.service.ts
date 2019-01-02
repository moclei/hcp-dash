import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable, of} from 'rxjs';
import * as firebase from 'firebase/app';
import {map} from 'rxjs/operators';
import {Vacancy, VacancyList} from './vacancy.model';

@Injectable({
    providedIn: 'root'
})
export class VacancyService {
    private vacancyCollection: AngularFirestoreCollection<VacancyList>;
    v$: Observable<any>;
    constructor(private readonly afs: AngularFirestore) {
        console.log('constructor for VacancyService, getting vacancies');
        this.vacancyCollection = this.afs.collection<VacancyList>('vacancies', ref => ref.orderBy('createdAt', 'desc'));
    }
    getVacancyStream(): Observable<VacancyList[]> {
        this.v$ = this.vacancyCollection.snapshotChanges();
        return this.v$.pipe(
            map(mrs => {
                return mrs.map(mr => {
                    const data = mr.payload.doc.data();
                    const id = mr.payload.doc.id;
                    const vObj = {id, ...data} as VacancyList;
                    return vObj;
                });
            })
        );
    }
    get timestamp() {
        return firebase.firestore.FieldValue.serverTimestamp();
    }
}
