import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  // TODO make the button in the template
  // TODO emit an event to the sidenav in the app-body to toggle for small screens
  constructor() { }

  ngOnInit() {
  }

}
