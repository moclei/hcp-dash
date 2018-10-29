import {Injectable} from '@angular/core';
import {Decision, DecisionId} from './decision.model';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs';
import * as firebase from 'firebase/app';
import {map} from 'rxjs/operators';
import Timestamp = firebase.firestore.Timestamp;
import {Bonus, BonusId} from '../bonus-dash/bonus.model';

@Injectable({
    providedIn: 'root',
})
export class DecisionService {

    private decisionCollection: AngularFirestoreCollection<Decision>;
    decisions: Observable<DecisionId[]>;
    private _reviewing: boolean;
    now: Date;
    cutoff3M: Date;
    cutoff6M: Date;
    _hasReviews: boolean;

    constructor(private readonly afs: AngularFirestore) {
        this.decisionCollection = this.afs.collection<Decision>('decisions', ref => ref.orderBy('createdAt', 'desc'));
        this.hasReviews = false;
        this.now = new Date();
        this.cutoff3M = new Date(this.now.getTime() - (30 * 24 * 60 * 60 * 1000));
        this.cutoff6M = new Date(this.now.getTime() - (90 * 24 * 60 * 60 * 1000));
    }

    getDecisionStream(): Observable<DecisionId[]> {
        return this.decisionCollection.snapshotChanges().pipe(
            map(mrs => {
                return mrs.map(a => {
                    const data = a.payload.doc.data() as Decision;
                    const id = a.payload.doc.id;
                    if (this.now < this.cutoff3M && !data.threeMonthResult) {
                        this.hasReviews = true;
                    } else if ( this.now < this.cutoff6M && !data.sixMonthResult) {
                        this.hasReviews = true;
                    }
                    return {id, ...data} as DecisionId;
                });
            })
        );
    }

    getReviewsStream(): Observable<DecisionId[]> {
        return this.decisionCollection.snapshotChanges().pipe(
            map(mrs => {
                return mrs.map(a => {
                    const data = a.payload.doc.data() as Decision;
                    const id = a.payload.doc.id;
                    if (this.now < this.cutoff3M && !data.threeMonthResult) {
                        return {id, ...data} as DecisionId;
                    } else if ( this.now < this.cutoff6M && !data.sixMonthResult) {
                        return {id, ...data} as DecisionId;
                    }
                });
            })
        );
    }

    addDecision(decision: Decision) {
        // decision.createdAt = this.timestamp;
        // decision.updatedAt = this.timestamp;
        this.decisionCollection.add(decision)
            .then((docRef) => {
                console.log('DecisionService-> addDecision -> decision added: ' + docRef.id);
            })
            .catch(function (error) {
                console.error('Error adding document: ', error);
            });
    }

    setDecision(decision: DecisionId) {
        console.log('DecisionService: SetDecision: ' + decision);
        decision.updatedAt = this.timestamp;
        return this.decisionCollection.doc(decision.id).update(decision)
            .then(function () {
                // console.log('DecisionService: SetDecision, Document successfully set!');
            })
            .catch(function (error) {
                console.error('DecisionService: SetDecision, Error updating document: ', error);
            });
    }

    getDecisions(): Observable<DecisionId[]> {
        return this.decisions;
    }
    set reviewing(isOpen: boolean) {
        this._reviewing = isOpen;
    }
    get reviewing(): boolean {
        return this._reviewing;
    }
    get hasReviews(): boolean {
        return this._hasReviews;
    }
    set hasReviews(hasR: boolean) {
        this._hasReviews = hasR;
    }
    get timestamp() {
        return firebase.firestore.FieldValue.serverTimestamp();
    }

    deleteDecision(decision: DecisionId) {
        // this.decisions.splice(this.decisions.indexOf(decision), 1);
        return this.decisionCollection.doc(decision.id).delete()
            .then(function () {
                console.log('Document successfully deleted!');
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error('Error deleting document: ', error);
            });
    }
}
