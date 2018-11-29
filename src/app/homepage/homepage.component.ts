import {Component, OnInit} from '@angular/core';
import {AppscriptService} from '../services/appscript.service';
import {BonusService} from '../bonus-dash/bonus.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  // TODO make the button in the template
  // TODO emit an event to the sidenav in the app-body to toggle for small screens
  constructor(public appsScript: AppscriptService,
              private bonusService: BonusService) {
    // console.log('homepage.component constructer -> passing authenticationService');
  }
  ngOnInit() {
/*
      this.bonusService.updateGPRs();
      this.bonusService.updateIncomes();
      */
  }
}
