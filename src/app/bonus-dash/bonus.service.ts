import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable, from, of} from 'rxjs';
import * as firebase from 'firebase/app';
import {map, concatAll, concat, mergeMap} from 'rxjs/operators';
import {Bonus, BonusId} from './bonus.model';
import {UnitLoadService} from '../services/unit-load.service';
import {MakeReady, MakeReadyId} from '../makeready-dash/makeready.model';
import {CloudFunctionsService} from '../services/cloud-functions.service';

@Injectable({
    providedIn: 'root'
})
export class BonusService {
    private bonusCollection: AngularFirestoreCollection<Bonus>;
    bonuses: Observable<any>;
    bonusesArr: Array<BonusId>;
    filteredBonuses: Array<Bonus>;
    unitService: UnitLoadService;
    incomes = [];
    grosses = [];
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
                unitService: UnitLoadService,
                private functionsService: CloudFunctionsService,) {
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
    getIncomeObservables(): Observable<any> {
        return from(['a', 'b', 'c']).pipe(
            mergeMap(id => <Observable<any>> this.functionsService.get('https://us-central1-hcpdash-frontend.cloudfunctions.net/expressTest/dailyIncomev2', id))
        );
    }
    getGPRObservables(): Observable<any> {
        return from(['a', 'b', 'c']).pipe(
            mergeMap(id => <Observable<any>> this.functionsService.get('https://us-central1-hcpdash-frontend.cloudfunctions.net/expressTest/grossPotentialsv2', id))
        );
    }

    updateIncomes(){
        let now = new Date();
        let thisMonth = now.getMonth();
        this.getBonusesForUpdating().then(
            (bonuses: BonusId[]) => {
                this.getIncomeObservables().subscribe( results => {
                    // console.log('getTestTests subscribe. Results: ' + JSON.stringify(results));
                    for (let i = 0; i < results.length; i++) {
                        let result = results[i];
                        for (let j = 0; j < bonuses.length; j++){
                            let bonus = bonuses[j];
                            if (bonus.propertyName === result.propertyName
                                && bonus.forMonth === thisMonth
                                && bonus.collectedMTD !== result.collectedMTD) {
                                console.log('Found matching bonus - ' + result.propertyName + ', collectedMTD amount was: ' + result.collectedMTD);

                                bonus.collectedMTD = result.collectedMTD;
                                bonus.outstandingMTD = bonus.grossPotential - bonus.collectedMTD;
                                bonus.collectedPercent = (bonus.collectedMTD / bonus.grossPotential);
                                const bonusRemainder = 0.9 - bonus.collectedPercent;
                                bonus.percentLeftToBonus = bonusRemainder <= 0 ? 0 : bonusRemainder;

                                this.setBonus(bonus);
                            }
                        }
                    }
                })
            });

    }

    updateGPRs(){
        let now = new Date();
        let thisMonth = now.getMonth();
        this.getBonusesForUpdating().then(
            (bonuses: BonusId[]) => {
                this.getGPRObservables().subscribe( results => {
                    console.log('getGPRTests subscribe. Results: ' + JSON.stringify(results));
                    for (let i = 0; i < results.length; i++) {
                        let result = results[i];
                        for (let j = 0; j < bonuses.length; j++){
                            let bonus = bonuses[j];
                            if (bonus.propertyName === result.propertyName
                                && bonus.forMonth === thisMonth
                                && bonus.grossPotential !== result.grossPotential) {
                                console.log('Found matching bonus - ' + result.propertyName + ', gpr amount was: ' + result.grossPotential);
                                bonus.grossPotential = result.grossPotential;
                                bonus.outstandingMTD = bonus.grossPotential - bonus.collectedMTD;
                                bonus.collectedPercent = (bonus.collectedMTD / bonus.grossPotential);
                                const bonusRemainder = 0.9 - bonus.collectedPercent;
                                bonus.percentLeftToBonus = bonusRemainder <= 0 ? 0 : bonusRemainder;
                                this.setBonus(bonus);
                            }
                        }
                    }
                })
            });
    }

    getBonusesForUpdating() {
        return new Promise(resolve=>{
            this.getBonusStream().subscribe(
                    (bonuses: BonusId[]) => {
                        resolve(bonuses);
                    })
        } );
    }
    getBonusByProperty(propertyName: string): Observable<BonusId[]>{
         const currMonth = new Date().getMonth();
        let queryRef = this.afs.collection('bonuses', ref => ref.where("propertyName", "==", propertyName)
            .where("forMonth", "==", currMonth));
        let propertyDoc = queryRef.snapshotChanges();
        let foundProperty;
        return propertyDoc.pipe(
            map(bonusForProp => {
                return bonusForProp.map(bonus => {
                    const data = bonus.payload.doc.data() as Bonus;
                    // console.log('getBonusesProprty: data: ' + JSON.stringify(data));
                    const id = bonus.payload.doc.id;
                    return {id, ...data} as BonusId;
                });
            })
        );
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
