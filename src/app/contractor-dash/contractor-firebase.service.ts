import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs';
import * as firebase from 'firebase/app';
import {map} from 'rxjs/operators';
import {Contractor, ContractorId} from './contractor.model';
import {MakeReady, Review} from '../makeready-dash/makeready.model';
import {AuthService} from '../services/auth.service';
import {MatTableDataSource} from '@angular/material';

@Injectable({
    providedIn: 'root'
})
export class ContractorFirebaseService {

    private contractorCollection: AngularFirestoreCollection<Contractor>;
    private jobsCollection: AngularFirestoreCollection<MakeReady>;
    contractors: Observable<ContractorId[]>;
    contractorsAsArray: Array<ContractorId> = [];
    private auth: AuthService;

    constructor(private readonly afs: AngularFirestore,
                auth: AuthService) {
        this.auth = auth;
        this.contractorCollection = afs.collection<Contractor>('contractors');
        this.jobsCollection = afs.collection<MakeReady>('makereadies');
    }

    addContractor(contractor: Contractor) {
        contractor.createdAt = this.timestamp;
        contractor.updatedAt = this.timestamp;
        this.auth.user.subscribe(user => {
            contractor.createdBy = user.email;
            this.contractorCollection.add(contractor)
                .then((docRef) => {
                    console.log('ContractorService-> addContractor -> contractor added');
                    const id = docRef.id;
                    this.contractorsAsArray.push({id, ...contractor});
                })
                .catch(function (error) {
                    console.error('Error adding document: ', error);
                });
        });
    }

    setContractor(contractor: ContractorId) {
        console.log('contractor: ' + contractor);
        const timestamp = this.timestamp;
        contractor.updatedAt = timestamp;
        const contractorArray = this.contractorsAsArray;
        return this.contractorCollection.doc(contractor.id).update(contractor)
            .then(function () {
                console.log('Document successfully updated!');
                for (let i = 0; i < contractorArray.length; i++) {
                    const existingCont = contractorArray[i];
                    if (existingCont.id === contractor.id) {
                        contractorArray[i] = contractor;
                    }
                }
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error('Error updating document: ', error);
            });
    }

    getContractors(): Observable<ContractorId[]> {
        return this.contractorCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Contractor;
                const id = a.payload.doc.id;
                const obj = {id, ...data};
                this.contractorsAsArray.push(obj);
                return {id, ...data};
            })),
        );
    }

    getContractor(id: string): Observable<Contractor> {
        const itemDoc = this.contractorCollection.doc<Contractor>('' + id);
        return itemDoc.valueChanges();
    }
    getContractorByName(name: string): Observable<ContractorId[]> {
        const byNameCollection = this.afs.collection<Contractor>('contractors',
            ref => ref
                .where('name', '==', name)).snapshotChanges();
        return byNameCollection.pipe(
            map(cs => {
                return cs.map(c => {
                    const data = c.payload.doc.data() as ContractorId;
                    const id = c.payload.doc.id;
                    return {id, ...data};
                });
            })
        );
    }

    getJobs(contractor: Contractor): Observable<MakeReady[]> {
        console.log('contractorService: getJobs()');
        const jobCollection = this.afs.collection<MakeReady>('makereadies',
            ref => ref
                .where('checklist.contractorName', '==', contractor.name)).snapshotChanges();
        return jobCollection.pipe(
            map(jobs => {
                return jobs.map(job => {
                    const data = job.payload.doc.data() as MakeReady;
                    const id = job.payload.doc.id;
                    return {id, ...data} as MakeReady;
                });
            })
        );
    }
    modifyMakeReadyContractors() {
        console.log('Calling modifyMakeReadyContractors');
        const batch = this.afs.firestore.batch();
        this.afs.collection<MakeReady>('makereadies').snapshotChanges().pipe(
            map(jobs => {
                return jobs.map(job => {
                    const data = job.payload.doc.data() as MakeReady;
                    const id = job.payload.doc.id;
                    return {'doc': job.payload.doc.ref, ...data};
                });
            })
        ).subscribe( jobs => {
            console.log('jobs.length: ' + jobs.length);
            this.afs.collection<Contractor>('contractors').snapshotChanges().pipe(
                map(cs => {
                    return cs.map(c => {
                        const data = c.payload.doc.data() as Contractor;
                        const id = c.payload.doc.id;
                        this.contractorsAsArray.push({id, ...data});
                        return {id, ...data};
                    });
                })
            ).subscribe(conts => {
                if (conts.length > 1) {
                    console.log('conts.length: ' + conts.length);
                    for (let i = 0; i < jobs.length; i++) {
                        const job = jobs[i];
                        let contractor = '';
                        if (job.checklist) {
                            contractor = job.checklist.contractorName;
                        } else if (job.contracts && job.contracts[0].contractor) {
                            contractor = job.contracts[0].contractor;
                        }
                        for (let j = 0; j < conts.length; j++) {
                            const c = conts[j];
                            if (contractor === c.name) {
                                console.log('Found matching contractor, updating id on mr. mr.name = '
                                    + contractor + ', contractor.name = ' + c.name);
                                const review = {'contractorId': c.id,
                                    'rating': 0,
                                    'reviewComment': 'initial',
                                    'includeInTotal': false};
                                batch.update(job.doc, {'review': review as Review});
                            }
                        }
                    }
                    // Commit the batch
                    batch.commit().then(() => {
                        console.log('batch updated!');
                    });
                }
            });
        });
    }
    modifyContractorNames() {
        console.log('Calling modifyMakeReadyContractors');
        const batch = this.afs.firestore.batch();
        this.afs.collection<Contractor>('contractors').snapshotChanges().pipe(
                map(cs => {
                    return cs.map(c => {
                        const data = c.payload.doc.data() as Contractor;
                        const id = c.payload.doc.id;
                        // this.contractorsAsArray.push({id, ...data});
                        return {'doc': c.payload.doc.ref, ...data};
                    });
                })
            ).subscribe(conts => {
                if (conts.length > 1) {
                    for (let j = 0; j < conts.length; j++) {
                        const c = conts[j];
                        const cNames = c.name.split(' ');
                        const fName = cNames[0];
                        const lName = cNames[cNames.length - 1];
                        const fNameSndx = this.convertToSoundex(fName);
                        const lNameSndx = this.convertToSoundex(lName);
                        console.log('Splitting contractor name into first (' + fName
                            + ') and last (' + lName
                            + '). performing soundex (' + fNameSndx + ' ' + lNameSndx
                            + ')');
                        batch.update(c.doc, {
                            'createdAt': c.createdAt,
                            'updatedAt': c.updatedAt,
                            'phoneNumber': c.phoneNumber,
                            'name': c.name,
                            'status': c.status,
                            'createdBy': 'marcocleirigh@hcptexas.com',
                            'numReviews': 0,
                            'totalScore': 0,
                            'firstName': fName,
                            'lastName': lName,
                            'firstNameSoundex': fNameSndx,
                            'lastNameSoundex': lNameSndx
                        });
                    }
                    // Commit the batch
                    batch.commit().then(() => {
                        console.log('batch updated!');
                    });
                }
            });
    }
    checkContractorExists(firstName: string, lastName: string): Observable<any>{
        console.log('Calling checkContractorExists');
        return this.afs.collection<Contractor>('contractors').snapshotChanges().pipe(
            map(cs => {
                return cs.map(c => {
                    const data = c.payload.doc.data() as Contractor;
                    const id = c.payload.doc.id;
                    // this.contractorsAsArray.push({id, ...data});
                    return {id, ...data};
                });
            })
        );
    }
    get timestamp() {
        return firebase.firestore.FieldValue.serverTimestamp();
    }

    deleteContractor(contractor: ContractorId) {
        // this.contractors.splice(this.contractors.indexOf(contractor), 1);
        return this.contractorCollection.doc(contractor.id).delete()
            .then(function () {
                console.log('Document successfully deleted!');
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error('Error deleting document: ', error);
            });
    }
    convertToSoundex(s_src) {
        console.log('soundex');
        let s_rez = '0000' ;
        let new_code, prev, idx;
        let a_codes = { 'bfpv': 1, 'cgjkqsxz':2, 'dt': 3, 'l': 4, 'mn': 5, 'r': 6 };
        s_src = s_src.toLowerCase().replace(/ /g,'');
        if ( s_src.length < 1) {
            return(s_rez);
        }
        s_rez = s_src.substr(0,1);
        prev = '0';
        for ( idx = 1 ; idx < s_src.length ; idx++) {
            new_code = '0';
            const cur_char = s_src.substr(idx,1);
            for (let s_code in a_codes) {
                if (s_code.indexOf(cur_char) >= 0) {
                    new_code = a_codes[s_code];
                    break;
                }
            }
            if (new_code !== prev && new_code !== '0' )  {
                s_rez += new_code;
            }
            prev = new_code;
        }
        s_rez = s_rez + '0000';
        return s_rez.substr(0,4);
    }
}
