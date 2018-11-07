import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {AuthService} from './auth.service';

@Injectable()
export class GoogleHttpService {

    auth: AuthService;

    constructor(private http: HttpClient,
            auth: AuthService) {
    this.auth = auth;
  }
  /*
  private static toJsonResponse(response: Response): JSON | number {
    try {
      return response.json();
    } catch (e) {
      return response.status;
    }DIR
  }*/

  public get(url: string, key: string): Observable<any> {
    // console.log('GoogleHttpService -> get() => url: ' + url + ', token: ' + key);
    return this.http.get(url, { params: new HttpParams().set('access_token', key) } );
    /*
      .map(GoogleHttpService.toJsonResponse)
      .catch(response => Observable.throw({message: response.status, code: response.status, error: response.json()} ));
    */
  }
  public post(url: string, key: string, requestBody: any, options?: HttpParams): Observable<any> {
    console.log('HttpRequest to Google API, post');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + key );
    return this.http.post(url, requestBody, {headers: headers})
        .pipe(
            catchError(this.handleError)
        );
  }
/*
  public put(url: string, requestBody: any, options?: HttpParams): Observable<any> {
    return this.http.put(url, requestBody, options)
      .map(GoogleHttpService.toJsonResponse)
      .catch(response => Observable.throw({message: response.status, code: response.status, error: response.json()} ));
  }

  public delete(url: string, options?: HttpParams): Observable<any> {
    return this.http.delete(url, options)
      .map(GoogleHttpService.toJsonResponse)
      .catch(response => Observable.throw({message: response.status, code: response.status, error: response.json()} ));
  }
  */
    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
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
