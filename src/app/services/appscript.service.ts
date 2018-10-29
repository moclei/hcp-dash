import { Injectable } from '@angular/core';
import {GoogleHttpService} from './google-http.service';
import {Observable} from 'rxjs';
import {MakeReady} from '../makeready-dash/makeready.model';
import {SpeedyApp} from '../speedy-apps/speedyapp.model';
import {AuthService} from './auth.service';
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export class AppscriptService {
  private readonly SCRIPT_ID: string = 'McRmOlA2uXzSNon1JghvzDmEdFEUJsEaZ';
  private readonly SCRIPT_URL = 'https://script.googleapis.com/v1/scripts/' + this.SCRIPT_ID + ':run';

  auth: AuthService;
  constructor(private httpService: GoogleHttpService,
              auth: AuthService) {
    this.auth = auth;
  }

  executeGoogleAppsScript(): Subscription {
    const testString = 'Any test string';
    console.log('Testing apps script API');
      // let httpRequest: Observable<any> = null;
      const requestBody = {
      'function': 'testFunction',
      'parameters': [
          testString
      ]
    };
    return this.auth.user.subscribe(
        user => {
          console.log('Testing apps script API: subscribed to user. getting httpRequest');
          this.httpService.post(this.SCRIPT_URL, user.accessToken, requestBody).subscribe(result => {
            console.log('result of httpService.post subscription');
          });
        }, error => {
          console.log('error: ' + error);
          }, () => {
            console.log('completed auth.user subscription');
        }
    );
    // return httpRequest;
  }
    executeNewMakeReadyBuilder(mr: MakeReady, accessToken: string): Observable<any> {
        const data = mr.getAsJSON();
        const requestBody = {
            'function': 'processMakeReadyBuilder',
            'parameters': [
                data
            ]
        };
        return this.httpService.post(this.SCRIPT_URL, accessToken, requestBody)
    }
    resendMakeReadyBuilder(mr: MakeReady, accessToken: string): Observable<any> {
        const data = JSON.stringify(mr);
        const requestBody = {
            'function': 'processMakeReadyBuilder',
            'parameters': [
                data
            ]
        };
        return this.httpService.post(this.SCRIPT_URL, accessToken, requestBody)
    }
    executeNewSpeedyApproval(speedyApp: SpeedyApp, accessToken: string): Observable<any> {
        const requestBody = {
            'function': 'processSpeedyApproval',
            'parameters': [
                speedyApp
            ]
        };
        return this.httpService.post(this.SCRIPT_URL, accessToken, requestBody);
    }
  executeGApps_TYVisit(visit: {}): Observable<any> {
    const requestBody = {
      'function': 'processTYVisit',
      'parameters': [
        visit
      ]
    };
    let httpRequest: Observable<any> = null;
    this.auth.user.subscribe( user => {
        httpRequest = this.httpService.post(this.SCRIPT_URL, user.accessToken, requestBody);
    });
    return httpRequest;
  }
  /*executeNewSpeedyApproval(speedyApp: SpeedyApp): Observable<any> {
    let httpRequest: Observable<any> = null;
    const requestBody = {
      'function': 'processSpeedyApproval',
      'parameters': [
        speedyApp
      ]
    };
    this.auth.user.subscribe( user => {
      httpRequest = this.httpService.post(this.SCRIPT_URL, user.accessToken, requestBody);
    });
    return httpRequest;
  }*/
}
