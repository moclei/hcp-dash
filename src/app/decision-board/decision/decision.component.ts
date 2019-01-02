import {Component, OnInit, Input, Inject, ViewChild} from '@angular/core';
import {Decision, DecisionId} from '../decision.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {DecisionService} from '../decision.service';
import {ClickEvent, HoverRatingChangeEvent, RatingChangeEvent} from 'angular-star-rating';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import {AuthService} from '../../services/auth.service';


@Component({
  selector: 'app-decision',
  templateUrl: './decision.component.html',
  styleUrls: ['./decision.component.css']
})
export class DecisionComponent implements OnInit {
  @Input() decision: DecisionId;
  @ViewChild('contentCtrl') autosize: CdkTextareaAutosize;
  mouseEnter = false;
  createdAt: Date;
  updatedAt: Date;
  decisionService: DecisionService;
  auth: AuthService;

  constructor(
    public dialog: MatDialog,
    decisionService: DecisionService,
    auth: AuthService) {
    this.auth = auth;
    this.decisionService = decisionService;
  }
/*
  openDialog(decision): void {
    if (!this.decisionService.reviewing) {
      console.log('openDialog(decision), decision title: ' + decision.title);
      const dialogPos = {top: '10em'};
      const dialogRef = this.dialog.open(DecisionDialogComponent, {
        // width: '50em',
        width: '550px',
        data: decision,
        // position: dialogPos,
        // panelClass: 'custom-dialog-container'
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
  }
*/
  ngOnInit() {
    if(this.decision.createdAt) {
        this.createdAt = (this.decision.createdAt as Timestamp).toDate();
    }
    else {
      this.createdAt = new Date();
    }
    if (this.decision.updatedAt) {
      this.updatedAt = (this.decision.updatedAt as Timestamp).toDate();
    }
  }
  onMouseEnter() {
    this.mouseEnter = true;
  }
  onMouseLeave() {
    this.mouseEnter = false;
  }
  figureTextSize(numChars: number) {
    let myStyle = {
        'font-size': '3em',
        'font-weight': 'lighter'
      };
    if (numChars < 10) {
      myStyle = {
        'font-size': '3em',
        'font-weight': 'lighter'};
    } else if (numChars < 40) {
      myStyle = {
        'font-size': '2em',
        'font-weight': 'lighter'};
    } else {
      myStyle = {
        'font-size': '1em',
        'font-weight': 'lighter'};
    }
    return myStyle;
  }
}
