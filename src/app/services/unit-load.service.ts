import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UnitLoadService {
  private hcpProperties = [
    {name: 'Alamo', sheetName: 'Alamo', businessName: 'Alamo Apartments',
      legalName: 'Water-Meadow Inc.', county: 'Bexar', email: 'alamo@hcptexas.com'},
    {name: 'Banyan Tree', sheetName: 'Banyan Tree', businessName: 'Banyan Tree Apartments',
      legalName: 'Ban T Limited Partnership', county: 'Bexar', email: 'banyantree@hcptexas.com'},
    {name: 'Cabana', sheetName: 'Cabana', businessName: 'Cabana Apartments',
      legalName: 'Highland Commercial Properties, Inc.', county: 'Bexar', email: 'cabana@hcptexas.com'},
    {name: 'Diplomat', sheetName: 'Diplomat', businessName: 'Diplomat Apartments',
      legalName: 'Highland Commercial Properties, Inc.', county: 'Bexar', email: 'diplomat@hcptexas.com'},
    {name: 'Hillside', sheetName: 'Hillside', businessName: 'Hillside Manor Apartments',
      legalName: 'Riverstown Properties, Inc.', county: 'Bexar', email: 'hillside@hcptexas.com'},
    {name: 'Houses - San Antonio', sheetName: 'Houses', businessName: 'San Antonio Houses',
      legalName: '', county: 'Bexar', email: 'frontdesk@hcptexas.com'},
    {name: 'Kennedy', sheetName: 'Kennedy', businessName: 'Kennedy Arms Apartments',
      legalName: 'Highland Commercial Properties, Inc.', county: 'Bexar', email: 'kennedy@hcptexas.com'},
    {name: 'La Hacienda', sheetName: 'La Hacienda', businessName: 'La Hacienda Apartments',
      legalName: 'FQFW Limited Partnership', county: 'Tarrant', email: 'lahacienda@hcptexas.com'},
    {name: 'Legacy', sheetName: 'Legacy', businessName: 'Legacy Apartments',
      legalName: '3905 Lockwood-Legacy LLC', county: 'Harris', email: 'legacy@hcptexas.com'},
    {name: 'Lockwood', sheetName: 'Lockwood', businessName: 'Lockwood Landing Apartments',
      legalName: 'Houston Rand Ltd.', county: 'Harris', email: 'lockwood@hcptexas.com'},
    {name: 'Marbach', sheetName: 'Marbach', businessName: 'Marbach Manor Apartments',
      legalName: 'Marbach Manor Apartments Ltd.', county: 'Bexar', email: 'marbachmanor@hcptexas.com'},
    {name: 'Mandalay', sheetName: 'Mandalay', businessName: 'Mandalay Villa Apartments',
      legalName: 'MMJ Mandalay L.L.C.', county: 'Bexar', email: 'mandalay@hcptexas.com'},
    {name: 'Riviera', sheetName: 'Riviera', businessName: 'Riviera Apartments',
      legalName: 'Point East Associates L.P.', county: 'Bexar', email: 'riviera@hcptexas.com'},
    {name: 'Sir John', sheetName: 'Sir John', businessName: 'Sir John Apartments',
      legalName: 'Sir John Inc.', county: 'Harris', email: 'sirjohn@hcptexas.com'},
    {name: 'Springvale', sheetName: 'Springvale', businessName: 'Springvale Apartments',
      legalName: 'Water-Meadow Inc.', county: 'Bexar', email: 'springvale@hcptexas.com'},
    {name: 'Sulphur', sheetName: 'Sulphur', businessName: 'Sulphur Springs Apartments',
      legalName: 'Highland Commercial Properties, Inc.', county: 'Bexar', email: 'sulphur@hcptexas.com'},
    {name: 'Westwinds', sheetName: 'Westwinds', businessName: 'Westwinds Apartments',
      legalName: 'Water-Meadow Inc.', county: 'Bexar', email: 'westwinds@hcptexas.com'},
    {name: 'Westbury', sheetName: 'Westbury', businessName: 'Westbury Manor Apartments',
      legalName: 'Westbury Manor Inc.', county: 'Harris', email: 'westbury@hcptexas.com'}
  ];

  constructor(private http: HttpClient) { }

  public get(property: string): Observable<string> {
    const propertyFileName = 'units' + property + '.csv';
    return this.http.get('assets/files/' + propertyFileName, {responseType: 'text'});
    /*.subscribe(
      data => {
        // console.log(data);
        return data;
      },
      error => {
        console.log(error);
        return error.toString();
      }
    );*/
  }
  public getPropertyByUserEmail(email: string) {
   for (let i = 0; i < this.hcpProperties.length; i++) {
     if (this.hcpProperties[i].email === email) {
       return this.hcpProperties[i].businessName;
     }
   }
   return 'admin';
  }
  public get properties(): Array<any> {
    return this.hcpProperties;
  }
}
