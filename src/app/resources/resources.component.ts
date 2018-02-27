import { Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {
  isExecutive = false;
  currentEmail: string;
  constructor(userService: UserService) {
    // this.currUser = userService.getCurrentUser().getBasicProfile().getEmail();
    this.currentEmail = userService.getCurrentUserEmail();
    console.log('ResourcesComponent -> currentUserEmail: ' + userService.getCurrentUserEmail());
    if(this.currentEmail === 'marcocleirigh@hcptexas.com'
      || this.currentEmail === 'mrust@hcptexas.com'
      || this.currentEmail === 'accountsrec4@hcptexas.com'
      || this.currentEmail === 'corky@hcptexas.com'
      || this.currentEmail === 'mhurley@hcptexas.com') {
      this.isExecutive = true;
    }
    // if userService.getCurrentUser() == 'Mar';
  }

  ngOnInit() {
  }

}
