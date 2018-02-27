import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  // TODO make the button in the template
  // TODO emit an event to the sidenav in the app-body to toggle for small screens
  // userService: UserService;


  constructor(/*userService: UserService*/) {
    // this.userService = userService;
    // console.log('homepage.component constructer -> passing authenticationService');
  }

  ngOnInit() {
  }

}
