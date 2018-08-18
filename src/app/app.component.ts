import {MediaMatcher} from '@angular/cdk/layout';
import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild} from '@angular/core';
import {DashService} from './services/dash-service.service';
import {UserProfile, UserService} from './services/user.service';
import {Subscription} from 'rxjs/Subscription';
import {MatSidenav} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'HCP Dashboard';
  mobileQuery: MediaQueryList;
  @ViewChild('snav') sidenav: MatSidenav;
  private _mobileQueryListener: () => void;
  private currentEmail: string;
  userService: UserService;
  isExecutive = false;
  userAuthorized = false;
  userProfile: UserProfile;
  profileImg = '';
  userEmail = '';
  userName = '';
  subscription: Subscription;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              userService: UserService,
              private dashService: DashService) {
    this.userService = userService;
    try {
      this.currentEmail = userService.getCurrentUserEmail();
    } catch (error) {
      console.log('error: ' + error);
    }
    this.isExecutive = userService.isAdmin();
    if (!this.userService.hasToken()) {
      this.subscription = this.userService.isUserSignedIn().subscribe(userAuthorized => {
        // console.log('app-body whenSignedIn');
        this.setAuthState(userAuthorized);
        // console.log('userAuthorized: ' + userAuthorized);
      });
    } else {
      this.userAuthorized = false;
    }
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
  }
  ngAfterViewInit() {
    this.userService.isUserSignedIn().subscribe(userAuthorized => {
      // console.log('app-body.component -> afterViewInit -> userService.isUserSignedIn=' + userAuthorized);
      this.userAuthorized = userAuthorized;
      this.changeDetectorRef.detectChanges();
    });
  }
  close() {
    this.sidenav.close();
  }
  signOut() {
    this.userService.signOut();
    this.userAuthorized = false;
  }
  setAuthState(isSignedIn: boolean) {
    this.userAuthorized = isSignedIn;
    if (isSignedIn) {
      this.userProfile = this.userService.getUserProfile();
      this.profileImg = this.userProfile.imgUrl;
      this.userName = this.userProfile.name;
      this.userEmail = this.userProfile.email;
      // console.log('AppHeaderComponent -> constructor -> user.profile: ' + JSON.stringify(this.userProfile));
    } else {
      this.userProfile = null;
      this.profileImg = '';
      this.userName = '';
      this.userEmail = '';
    }
  }
  openSidebar() {
    this.dashService.toggleSidebar.emit();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}


/**  Copyright 2018 Marc O Cleirigh. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license */
