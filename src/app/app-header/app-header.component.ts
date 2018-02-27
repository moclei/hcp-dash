import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {Subscription} from 'rxjs/Subscription';
import {UserProfile} from '../services/user.service';

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

  constructor(userService: UserService) {
    this.userService = userService;
    if (this.userService.isUserSignedIn()) {
      this.setAuthState(true);
    }
    this.subscription = this.userService.whenSignedIn().subscribe(userAuthorized => {
      this.setAuthState(userAuthorized);
    });
  }

  ngOnInit() {
    /*
    if(this.userService.isUserSignedIn()){
      this.userSignedIn = true;
    }*/
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  signOut() {
    this.userService.signOut();
    this.userSignedIn = false;
  }

  setAuthState(isSignedIn: boolean) {
    console.log('userAuthorized: ' + isSignedIn);
    if (isSignedIn) {
      this.userSignedIn = isSignedIn;
      this.userProfile = this.userService.getUserProfile();
      this.profileImg = this.userProfile.imgUrl;
      this.userName = this.userProfile.name;
      this.userEmail = this.userProfile.email;
      console.log('AppHeaderComponent -> constructor -> user.profile: ' + JSON.stringify(this.userProfile));
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
