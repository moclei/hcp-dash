import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {GoogleHttpService} from './google-http.service';
import {AuthService} from './auth.service';

@Injectable()
export class SheetsService {
    private readonly SS_ID_DIRECTORY: string = '1-9JIZxh1ou5UKMajLRdYVkql1hskN1kRXJz2pRLUFgo';
    private readonly SS_ID_CONTRACTORS: string = '18GnT7_tDqSlbELg-az89xRdZAn2S4Msp_DITO9L8HLg';
    private readonly RANGE_ID: string = 'CurrentContractors!A1:F';
    private readonly RANGE_ID_INACT: string = 'Inactive!A1:D';
    private readonly RANGE_ID_CONT: string = 'Contractors!A1:M';
    private readonly RANGE_ID_REV: string = 'Reviews!A1:G';
    private readonly SHEETS_ROOT_URL = 'https://sheets.googleapis.com/v4/spreadsheets/';
    private readonly ENDPOINT_URL_DIR: string = this.SHEETS_ROOT_URL + this.SS_ID_DIRECTORY + '/values/Sheet1!A1:D';
    private readonly ENDPOINT_URL_CONT: string = this.SHEETS_ROOT_URL + this.SS_ID_CONTRACTORS + '/values/' + this.RANGE_ID;
    private readonly ENDPOINT_URL_INACT: string = this.SHEETS_ROOT_URL + this.SS_ID_CONTRACTORS + '/values/' + this.RANGE_ID_INACT;
    private readonly URL_CONTRACTORS: string = this.SHEETS_ROOT_URL + this.SS_ID_CONTRACTORS + '/values/' + this.RANGE_ID_CONT;
    private readonly URL_REVIEWS: string = this.SHEETS_ROOT_URL + this.SS_ID_CONTRACTORS + '/values/' + this.RANGE_ID_REV;

    auth: AuthService;
    accessToken: string;
    constructor(private httpService: GoogleHttpService,
                auth: AuthService) {
        this.auth = auth;
        this.auth.user.subscribe(user => {
            this.accessToken = user.accessToken;
        });
    }

    findAllListings(): Observable<any> {
        return this.httpService.get(this.ENDPOINT_URL_DIR, this.accessToken);
    }

    findAllContractors(): Observable<any> {
        // console.log('SheetsService -> findAll() => ENDPOINT_URL: ' + this.ENDPOINT_URL);
        return this.httpService.get(this.ENDPOINT_URL_CONT, this.accessToken);
    }

    findInactiveContractors(): Observable<any> {
        return this.httpService.get(this.ENDPOINT_URL_INACT, this.accessToken);
    }

    findContractors(): Observable<any> {
        // console.log('SheetsService -> findAll() => ENDPOINT_URL: ' + this.ENDPOINT_URL);
        return this.httpService.get(this.URL_CONTRACTORS, this.accessToken);
    }

    findReviews(): Observable<any> {
        return this.httpService.get(this.URL_REVIEWS, this.accessToken);
    }
}
