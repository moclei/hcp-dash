import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {Subscription} from 'rxjs/Subscription';
import {UserProfile} from '../services/user.service';
import {DashService} from '../services/dash-service.service';
import {Observable} from 'rxjs/index';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  userSignedIn = false;
  userService: UserService;
  subscription: Subscription;
  userAuthorized: boolean;
  userProfile: UserProfile;
  profileImg = '';
  userEmail = '';
  userName = '';
  isLoggedIn: Observable<boolean>;
  userSubscription: Subscription;

  constructor(userService: UserService,
              private dashService: DashService) {
    this.userService = userService;
    this.isLoggedIn = userService.isUserSignedIn();
/*
    if (!userService.hasToken()) {
      this.userSubscription = this.userService.isUserSignedIn().subscribe({
        next(signedIn) {
          if (signedIn) {
            this.setAuthState(true);
          }
        },
        error(msg) {
          console.log('Error Signing in: ', msg);
        }
      });
    } else {
      this.setAuthState(true);
    }
*/
    if (!userService.hasToken()) {
      this.userSubscription = this.userService.isUserSignedIn().subscribe((signedIn) => {
        if (signedIn) {
          console.log(true);
          this.setAuthState(true);
        }
      }, (errorMsg) => {
        console.warn('Error Signing in: ', errorMsg);
      });
    }
    else{
      this.setAuthState(true);
    }
  }

  ngOnInit() {
    /*
    if(this.userService.isUserSignedIn()){
      this.userSignedIn = true;
    }*/
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  public openSidebar() {
    this.dashService.toggleSidebar.emit();
  }

  signOut() {
    this.userService.signOut();
    this.userSignedIn = false;
  }


  setAuthState(isSignedIn: boolean) {
    // console.log('userAuthorized: ' + isSignedIn);
    if (isSignedIn) {
      this.userSignedIn = isSignedIn;
      this.userProfile = this.userService.getUserProfile();
      this.profileImg = this.userProfile.imgUrl;
      this.userName = this.userProfile.name;
      this.userEmail = this.userProfile.email;
      // console.log('AppHeaderComponent -> constructor -> user.profile: ' + JSON.stringify(this.userProfile));
    } else {
      this.userSignedIn = false;
      this.userProfile = null;
      this.profileImg = '';
      this.userName = '';
      this.userEmail = '';
    }
  }
  /*
  signIn() {
    this.userService.signIn();
    this.userSignedIn = true;
  }*/
}
