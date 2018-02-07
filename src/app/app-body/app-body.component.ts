import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {ObservableMedia} from '@angular/flex-layout';

@Component({
  selector: 'app-body',
  templateUrl: './app-body.component.html',
  styleUrls: ['./app-body.component.css']
})
export class AppBodyComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(public media: ObservableMedia) {
  }

  ngOnInit() {
  }

  close() {
    this.sidenav.close();
  }

}
