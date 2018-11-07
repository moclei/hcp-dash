import {Injectable} from '@angular/core';
import {MakeReady, MakeReadyId} from './makeready.model';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs';
import * as firebase from 'firebase/app';
import {map} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';
import {CloudFunctionsService} from '../services/cloud-functions.service';

@Injectable({
    providedIn: 'root'
})
export class MakeReadyService {

    private makeReadyCollection: AngularFirestoreCollection<MakeReady>;
    private propertyCollection: AngularFirestoreCollection;
    makeReadys: Observable<MakeReadyId[]>;
    mr$: Observable<any>;
    propertyMr$: Observable<any>;
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

    getMakeReadiesStream(): Observable<MakeReadyId[]> {
        this.mr$ = this.makeReadyCollection.snapshotChanges();
        return this.mr$.pipe(
            map(mrs => {
                    return mrs.map(mr => {
                        const data = mr.payload.doc.data() as MakeReady;
                        const id = mr.payload.doc.id;
                        return {id, ...data} as MakeReadyId;
                    });
                })
        );
    }
    getMakeReadiesForProperty(propertyName): Observable<MakeReadyId[]> {
        let now, lastMonth = now = new Date();
        lastMonth.setDate(now.getDate() - 30);
        if(propertyName !== '') {
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
                        return {id, ...data} as MakeReadyId;
                    });
                })
            );
        } else {
            return null
        }

    }
    getAppfolioObservable(propertyName): Observable<any> {
        return this.functionsService.get('https://us-central1-hcpdash-frontend.cloudfunctions.net/expressTest/moveOuts', propertyName);
    }
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
    setMakeReady(makeReady: MakeReadyId, id?: string) {
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
    getMakeReadys(): Observable<MakeReadyId[]> {
        return this.makeReadys;
    }
    get date_created() {
        return firebase.firestore.FieldValue.serverTimestamp();
    }
    getMakeReady(id: string): Observable<MakeReadyId> {
        const itemDoc = this.makeReadyCollection.doc<MakeReadyId>('' + id);
        return itemDoc.valueChanges();
    }
}
