import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs';
import * as firebase from 'firebase/app';
import {count, map} from 'rxjs/operators';
import {Contractor, ContractorId} from './contractor.model';

@Injectable({
  providedIn: 'root'
})
export class ContractorFirebaseService {

  private contractorCollection: AngularFirestoreCollection<Contractor>;
  contractors: Observable<ContractorId[]>;
  contractorsAsArray: Array<ContractorId> = [];
  constructor(private readonly afs: AngularFirestore) {
    this.contractorCollection = afs.collection<Contractor>('contractors');
    this.contractors = this.contractorCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Contractor;
        const id = a.payload.doc.id;
        const obj = {id, ...data};
        this.contractorsAsArray.push(obj);
        return {id, ...data};
      })),
    );
  }
  addContractor(contractor: Contractor) {
    const timestamp = this.timestamp;
    contractor.createdAt = timestamp;
    contractor.updatedAt = timestamp;
    this.contractorCollection.add(contractor)
      .then((docRef) => {
        // contractor.setDocumentId(docRef.id);
        console.log('ContractorService-> addContractor -> contractor added');
        const id = docRef.id;
        this.contractorsAsArray.push({id, ...contractor});
      })
      .catch(function(error) {
        console.error('Error adding document: ', error);
      });
  }
  setContractor(contractor: ContractorId) {
    console.log('contractor: ' + contractor );
    const timestamp = this.timestamp;
    contractor.updatedAt = timestamp;
    let contractorArray = this.contractorsAsArray;
    return this.contractorCollection.doc(contractor.id).update(contractor)
      .then(function() {
        console.log('Document successfully updated!');
        for (let i = 0; i < contractorArray.length; i++) {
          const existingCont = contractorArray[i];
          if (existingCont.id === contractor.id) {
            contractorArray[i] = contractor;
          }
        }
      })
      .catch(function(error) {
        // The document probably doesn't exist.
        console.error('Error updating document: ', error);
      });
  }

  getContractors(): Observable<Contractor[]> {
    return this.contractors;
  }

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  deleteContractor(contractor: ContractorId) {
    // this.contractors.splice(this.contractors.indexOf(contractor), 1);
    return this.contractorCollection.doc(contractor.id).delete()
      .then(function() {
        console.log('Document successfully deleted!');
      })
      .catch(function(error) {
        // The document probably doesn't exist.
        console.error('Error deleting document: ', error);
      });
  }
}
