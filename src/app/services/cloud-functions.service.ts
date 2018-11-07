import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CloudFunctionsService {
    auth: AuthService;
    constructor(private http: HttpClient,
                auth: AuthService) {
        this.auth = auth;
    }
    public get(url: string, section: string): Observable<any> {
        console.log('Observable created for: ' + url + ': ' + section);
        return this.http.get(url, { params: new HttpParams().set('section', section) } ).pipe(
            retry(2),
            catchError(this.handleError) // then handle the error
        );
    }
    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.

            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.log('*HandleError* :' +  JSON.stringify(error));
            if (error.status === 200) {
                return of(error.error['text']);
            }
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${JSON.stringify(error.error)}`);
            if (error.status === 401) {
                // auth.googleLogin().then( result => {
                console.log('Error Code 401');
                // });
            }
        }
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.');
    };
}
