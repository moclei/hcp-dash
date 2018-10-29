import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs';
import * as firebase from 'firebase/app';
import {map} from 'rxjs/operators';
import {Bonus, BonusId} from './bonus.model';
import {UnitLoadService} from '../services/unit-load.service';
import {MakeReady, MakeReadyId} from '../makeready-dash/makeready.model';

@Injectable({
    providedIn: 'root'
})
export class BonusService {
    private bonusCollection: AngularFirestoreCollection<Bonus>;
    bonuses: Observable<any>;
    bonusesArr: Array<Bonus>;
    filteredBonuses: Array<Bonus>;
    unitService: UnitLoadService;
    months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    years = [
        2018,
        2019,
        2020,
        2021,
        2022,
        2023
    ];

    constructor(private readonly afs: AngularFirestore,
                unitService: UnitLoadService) {
        this.unitService = unitService;
        this.bonusCollection = afs.collection<Bonus>('bonuses');
        // this.initCurrentBonuses();
    }
    getBonusStream(): Observable<BonusId[]> {
        this.bonuses = this.bonusCollection.snapshotChanges();
        return this.bonuses.pipe(
            map(mrs => {
                return mrs.map(mr => {
                    const data = mr.payload.doc.data() as Bonus;
                    const id = mr.payload.doc.id;
                    return {id, ...data} as BonusId;
                });
            })
        );
    }

    initCurrentBonuses() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        this.bonuses.subscribe(
            (bonuses) => {
                this.bonusesArr = bonuses;
                if (this.filteredBonuses.length === 0) {
                    console.log('Moved to new month. Adding bonus entries');
                    this.addMonth(currentMonth, currentYear);
                }
            });
    }
    setBonus(bonus: BonusId) {
        console.log('bonus: ' + bonus);
        bonus.updatedAt = this.timestamp;
        return this.bonusCollection.doc(bonus.id).update(bonus)
            .then(function () {
                console.log('Document successfully updated!');
            })
            .catch(function (error) {
                console.error('Error updating document: ', error);
            });
    }

    getBonuses(): Observable<BonusId[]> {
        return this.bonuses;
    }
    getLoadedBonuses(): Array<Bonus> {
        return this.bonusesArr;
    }

    checkBonusMonth(bonus) {
        const now = new Date();
        if (bonus.forMonth === now.getMonth()) {
            // in current month
        } else if (bonus.forMonth < now.getMonth()) {
            // we're in a new month.
        }
    }

    deleteBonuses(bonuses) {
        const batch = this.afs.firestore.batch();
        for (let i = 0; i < bonuses.length; i++) {
            const bonusRef = this.bonusCollection.doc(bonuses[i].id);
            batch.delete(bonusRef.ref);
        }
        // Commit the batch
        batch.commit().then(function () {
            console.log('Committed delete batch');
        });
    }

    addMonth(month: number, year: number) {
        const properties = this.unitService.properties;
        const batch = firebase.firestore().batch();
        for (let i = 0; i < properties.length; i++) {
            const propertyName = properties[i].sheetName;
            const newId = this.bonusCollection.ref.doc();
            batch.set(newId, {
                propertyName: propertyName,
                grossPotential: 1000,
                collectedMTD: 0,
                outstandingMTD: 0,
                collectedPercent: 0,
                percentLeftToBonus: 0.9,
                forMonth: month,
                forYear: year,
                thresholdPercent: 0.1,
                updatedAt: null,
                createdAt: this.timestamp
            });

        }
        batch.commit().then(() => console.log('Succesfully created new month of bonuses'));
    }

    /*
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
     */
    createBonusesForMonth() {

    }

    get timestamp() {
        return firebase.firestore.FieldValue.serverTimestamp();
    }
}
