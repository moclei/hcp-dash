import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import {SheetsService} from './sheets.service';

@Injectable()
export class SheetsModel {
  private currentSheetId: string;
  private contacts: Listing[] = [];

  constructor(private resource: SheetsService) {
  }

  loadContacts() {
    // this.getAllContacts().subscribe(contacts => this.contacts = contacts);
  }

  getLoadedContacts(): Listing[] {
    return this.contacts;
  }

  setcurrentSheetId(ContactId: string) {
    this.currentSheetId = ContactId;
  }

  getCurrentSheetId(): string {
    return this.currentSheetId;
  }

  getAllContacts(): Observable<Listing[]> {
    return this.resource.findAllListings().pipe(
      map((res) => {
      for (let i = 1; i < res.values.length; i++) {
        this.contacts.push({ name: res.values[i][0], location: res.values[i][1], position: res.values[i][2], number: res.values[i][3] });
      }
      // console.log('sheetmodel -> contacts: ' + JSON.stringify(this.contacts));
      return this.contacts;
    }
  ));
  }

  /*
  getContact(id: string): Observable<Contact> {
    return this.resource.findById(id);
  }

  createContact(Contact: Contact): Subscription {
    return this.resource.create(Contact)
      .subscribe(() => this.contacts.push(Contact));
  }

  updateContact(Contact: Contact): Subscription {
    const observable: Observable<Contact> = this.resource.update(Contact);

    return observable.subscribe((Contact) => {
      this.contacts = _.map(this.contacts, (tl) => {
        if (tl.name === Contact.name) {
          return Contact;
        }
        return tl;
      });
    });
  }

  deleteCurrentContact(): void {
    this.resource.delete(this.currentSheetId).subscribe(() => {
      _.remove(this.contacts, (Contact) => Contact.id == this.currentSheetId);
      this.currentSheetId = undefined;
      this.router.navigateByUrl('');
    });
  }import { Listing } from '../services/directory.service';
  */
}

export interface Listing {
  name: string;
  location: string;
  position: string;
  number: string;
}
