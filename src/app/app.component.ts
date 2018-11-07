import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy, ViewChild} from '@angular/core';
import {DashService} from './services/dash-service.service';
import {MatSidenav} from '@angular/material';
import {AuthService, User} from './services/auth.service';
import {Observable} from 'rxjs/Observable';
import {CloudFunctionsService} from './services/cloud-functions.service';
import {BonusService} from './bonus-dash/bonus.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnDestroy {
  title = 'HCP Dashboard';
  mobileQuery: MediaQueryList;
  @ViewChild('snav') sidenav: MatSidenav;
  private readonly _mobileQueryListener: () => void;
  auth: AuthService;
  userProfile: Observable<User>;
  functionsSercice: CloudFunctionsService;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              auth: AuthService,
              private dashService: DashService) {
        this.auth = auth;
        this.userProfile = auth.user;
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
        this.dashService.toggleSidebar.subscribe(() => {
          if (this.sidenav.opened) {
            this.sidenav.close();
          } else {
            this.sidenav.open();
          }
        });
        this.dashService.closeSidebar.subscribe(() => {
          this.sidenav.close();
        });

        // Moved to Homepage component to run less frequently.
        // this.bonusService.updateGPRs();
        // this.bonusService.updateIncomes();
  }
  close() {
    this.sidenav.close();
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  /*
    executeCloudFunction(propertyName: string) {
      console.log('Trying to fetch property income data');
        let $fetchIncome =  this.functionsService.get('https://us-central1-hcpdash-frontend.cloudfunctions.net/dailyIncome', 'ALA')
        $fetchIncome.subscribe(result => {
            console.log('executeCloudFunction: '  + result);
            this.bonusService.getBonusByProperty('Alamo').subscribe(
                (bonuses) => {
                    console.log('this.bonusService.getBonuses().subscribe: ' + JSON.stringify(bonuses[0]));
                    let myBonus = bonuses[0];
                    if(myBonus.collectedMTD !== result) {
                        myBonus.collectedMTD = result;
                        this.bonusService.setBonus(myBonus);
                    } else {
                        console.log('Bonus was already set to correct amount');
                    }

                });
        }, error => {
                console.log('executeCloudFunction error: '  + JSON.stringify(error));
        });
  }

  pullBonuses() {
      this.bonusService.getBonusByProperty('Alamo').subscribe(
          (bonuses) => {
              console.log('this.bonusService.getBonuses().subscribe: ' + JSON.stringify(bonuses[0]));
          });
  }
  */
}

/**  Copyright 2018 Marc O Cleirigh. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license */
