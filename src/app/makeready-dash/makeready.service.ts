import {Injectable} from '@angular/core';
import {MakeReady} from './makeready.model';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs';
import * as firebase from 'firebase/app';
import {map} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';
import {CloudFunctionsService} from '../services/cloud-functions.service';
import Timestamp = firebase.firestore.Timestamp;
import FieldValue = firebase.firestore.FieldValue;

@Injectable({
    providedIn: 'root'
})
export class MakeReadyService {

    private makeReadyCollection: AngularFirestoreCollection<MakeReady>;
    private propertyCollection: AngularFirestoreCollection;
    makeReadys: Observable<MakeReady[]>;
    mr$: Observable<any>;
    propertyMr$: Observable<any>;
    moveouts$: Observable<any>;
    auth: AuthService;
    nowDate: Date;

    constructor(private readonly afs: AngularFirestore,
                auth: AuthService,
                private functionsService: CloudFunctionsService) {
        this.auth = auth;
        this.nowDate = new Date();
        this.makeReadyCollection = afs.collection<MakeReady>('makereadies',
                ref => ref
                    .orderBy('createdAt', 'desc'));
    }

    getMakeReadiesStream(): Observable<MakeReady[]> {
        this.mr$ = this.makeReadyCollection.snapshotChanges();
        return this.mr$.pipe(
            map(mrs => {
                    return mrs.map(mr => {
                        const data = mr.payload.doc.data() as MakeReady;
                        const id = mr.payload.doc.id;
                        const mrObj = {id, ...data} as MakeReady;
                        this.setNumDays(mrObj);
                        return mrObj;
                    });
                })
        );
    }
    getMakeReadiesForProperty(propertyName): Observable<MakeReady[]> {
        const now = new Date();
        const lastMonth = new Date();
        lastMonth.setDate(now.getDate() - 60);
        if (propertyName !== '') {
            this.propertyCollection = this.afs.collection<MakeReady>('makereadies',
                ref => ref
                    .where('propertyName', '==', propertyName)
                    .where('createdAt', '>', firebase.firestore.Timestamp.fromDate(lastMonth)));
            this.propertyMr$ = this.propertyCollection.snapshotChanges();
            return this.propertyMr$.pipe(
                map(mrs => {
                    return mrs.map(mr => {
                        const data = mr.payload.doc.data() as MakeReady;
                        const id = mr.payload.doc.id;
                        return {id, ...data} as MakeReady;
                    });
                })
            );
        } else {
            return null;
        }
    }
    getMoveOutsForProperty(propertyName): Observable<any> {
        if (propertyName !== '') {
            this.propertyCollection = this.afs.collection<any>('moveouts',
                ref => ref
                    .where('property', '==', propertyName)
                    .orderBy('date'));
            this.moveouts$ = this.propertyCollection.snapshotChanges();
            return this.moveouts$.pipe(
                map(results => {


                    console.log('getMoveOutsForProperty results.length: ' + results.length);
                    const unsortedResults = [];
                    for (let i = 0; i < results.length; i++) {
                        const data = results[i].payload.doc.data();
                        if (data.property === propertyName) {
                            const id = results[i].payload.doc.id;
                            console.log('getMoveOutsForProperty data: ' + data);
                            unsortedResults.push({id, ...data});
                        }
                    }
                    unsortedResults.sort(function(a, b) {
                        const aDate = a.date as Timestamp;
                        const bDate = b.date as Timestamp;
                        if (aDate.toDate() > bDate.toDate()) {
                            return 1;
                        } else if (aDate.toDate() < bDate.toDate()) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });
                    // console.log('unsortedResults: ');
                    // console.table(unsortedResults);
                    return unsortedResults[unsortedResults.length - 1];

                })
            );
        } else {
            return null;
        }
    }
    /*
    getAppfolioObservable(propertyName): Observable<any> {
        return this.functionsService.get('https://us-central1-hcpdash-frontend.cloudfunctions.net/expressTest/moveOuts', propertyName);
    }*/
    addMakeReady(makeReady: MakeReady) {
        const jsonMR = JSON.parse(JSON.stringify(makeReady));
        jsonMR.createdAt = this.date_created;
        jsonMR.removed = false;
        jsonMR.updatedAt = null;
        this.makeReadyCollection.add(jsonMR )// makeReady)
            .then((docRef) => {
                console.log('MakeReadyService-> addMakeReady -> makeReady added: ' + docRef.id);
            })
            .catch(function (error) {
                console.error('Error adding document: ', error);
            });
    }
    /*
    printTimestamps() {
        this.makeReadyCollection.snapshotChanges().pipe(
            map(mrs => {
                    return mrs.map(mr => {
                        const data = mr.payload.doc.data() as MakeReady;
                        const id = mr.payload.doc.id;
                        const timestamp = data.timestamp;
                        if (timestamp) {
                           const dateStr = timestamp.split(',')[0];
                            const dateObj = new Date(dateStr);
                           // console.log('timestamp-dateObj: ' + dateObj);
                            if (data.hasOwnProperty('createdAt')) {
                               // console.log('HAS-createdAt: ' + data.createdAt);
                            } else {
                                console.log('NOT-createdAt');
                                data.createdAt = firebase.firestore.Timestamp.fromDate(dateObj);
                                this.makeReadyCollection.doc(id).update(data).then(() =>
                                {
                                    console.log('updated');
                                });
                            }
                        } else {
                            console.log('timestamp-no');
                        }
                    });
                }
            )
        ).subscribe(value => {});
    }
*/
    setMakeReady(makeReady: MakeReady, id?: string) {
        // console.log('makeReady: ' + makeReady );
        makeReady.updatedAt = this.date_created;
        const updateId = id ?  id : makeReady.id;
        return this.makeReadyCollection.doc(updateId).update(makeReady)
            .then(function () {
                console.log('Makeready Service, setMakeReady() => Document successfully updated!');
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error('Makeready Service, setMakeReady() => Error updating document: ', error);
            });
    }
    getMakeReadys(): Observable<MakeReady[]> {
        return this.makeReadys;
    }
    get date_created() {
        return firebase.firestore.FieldValue.serverTimestamp();
    }
    getMakeReady(id: string): Observable<MakeReady> {
        const itemDoc = this.makeReadyCollection.doc<MakeReady>('' + id);
        return itemDoc.valueChanges();
    }
    daysBetween(startDate, endDate) {
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        return Math.round((this.treatAsUTC(endDate) - this.treatAsUTC(startDate)) / millisecondsPerDay);
    }

    setNumDays(mr) {
        let date;
        if (mr.moveOutDate) {
            date = mr.moveOutDate.toDate();
        } else {
            date = (mr.createdAt as Timestamp).toDate();
        }
        const now = new Date();
        let days = 0;
        if (mr.checklist && mr.checklist.contractorFinished) {
            // console.log('contractor finished');
            days = this.daysBetween(date, this.fieldValueAsDate(mr.checklist.contractorFinishedDate));
        } else {
            days = this.daysBetween(date, now);
        }
        mr.numDays = days;
    }

    treatAsUTC(date): any {
        const result = new Date(date);
        result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
        return result;
    }

    fieldValueAsDate(val: FieldValue): Date {
        // console.log('val: ' + val + ', val type: ' + typeof val);
        if (val) {
            const tval = val as Timestamp;
            return tval.toDate();
        } else {
            return new Date();
        }
    }
}
