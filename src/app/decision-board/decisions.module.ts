import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

import {DecisionComponent, DecisionDialogComponent} from './decision/decision.component';
import {DecisionsRoutingModule} from './decisions-routing.module';
import {DecisionService} from './decision.service';
import {DecisionListComponent} from './decision-list/decision-list.component';
import {DecisionInputComponent} from './decision-input/decision-input.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {BrowserModule} from '@angular/platform-browser';
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule,
  MatProgressSpinnerModule,
  MatSelectModule, MatSidenavModule,
  MatToolbarModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ElasticModule} from 'angular2-elastic';
import {DecisionBoardComponent} from './decision-board.component';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireModule} from 'angularfire2';
import {environment} from '../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    ElasticModule,
    AngularFireModule.initializeApp(environment.firebase), // imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    DecisionsRoutingModule
  ],
  declarations: [
    DecisionComponent,
    DecisionBoardComponent,
    DecisionListComponent,
    DecisionInputComponent,
    DecisionDialogComponent,
  ],
  providers: [
    DecisionService
  ],
  entryComponents: [
    DecisionDialogComponent
  ]
})
export class DecisionBoardModule {}
