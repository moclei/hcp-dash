import { Component, OnInit } from '@angular/core';
import {DashService} from '../services/dash-service.service';

@Component({
  selector: 'app-makeready-dash',
  templateUrl: './makeready-dash.component.html',
  styleUrls: ['./makeready-dash.component.scss']
})
export class MakereadyDashComponent implements OnInit {


  constructor(private dashService: DashService) { }

  ngOnInit() {
    this.closeSidebar();
  }

  closeSidebar() {
    this.dashService.closeSidebar.emit();
  }

}


