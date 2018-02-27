import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {ObservableMedia} from '@angular/flex-layout';
import {UserService} from '../services/user.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-body',
  templateUrl: './app-body.component.html',
  styleUrls: ['./app-body.component.scss']
})
export class AppBodyComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('sidenav') sidenav: MatSidenav;
  isExecutive = false;
  currentEmail: string;
  userAuthorized = false;
  subscription: Subscription;
  userService: UserService;

  constructor(public media: ObservableMedia,
              userService: UserService,
              private cdr: ChangeDetectorRef) {

    try {
      this.currentEmail = userService.getCurrentUserEmail();
    } catch (error) {
      console.log('error: ' + error);
    }
    this.userService = userService;
    if (this.currentEmail === 'marcocleirigh@hcptexas.com'
      || this.currentEmail === 'mrust@hcptexas.com'
      || this.currentEmail === 'accountsrec4@hcptexas.com'
      || this.currentEmail === 'corky@hcptexas.com'
      || this.currentEmail === 'mhurley@hcptexas.com') {
      this.isExecutive = true;
    }
    this.subscription = this.userService.whenSignedIn().subscribe(userAuthorized => {
      this.userAuthorized = userAuthorized;
      if(this.userAuthorized){
        this.sidenav.close();
        this.sidenav.open();
      } else {
        this.sidenav.close();
      }
      console.log('userAuthorized: ' + userAuthorized);
    });
  }
  ngOnInit() {
  }
  ngAfterViewInit(){
    if (this.userService.isUserSignedIn()){
      console.log('app-body.component -> afterViewInit -> userService.isUserSignedIn==true')
      this.userAuthorized = true;
      this.cdr.detectChanges();
    }
  }
  ngOnDestroy() {
      this.subscription.unsubscribe();
  }

  close() {
    this.sidenav.close();
  }

}
