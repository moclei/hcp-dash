import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

import {DecisionComponent} from './decision/decision.component';
import {DecisionsRoutingModule} from './decisions-routing.module';
import {DecisionService} from './decision.service';
import {DecisionListComponent, DecisionDialogComponent} from './decision-list/decision-list.component';
import {DecisionInputComponent} from './decision-input/decision-input.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule,
  MatProgressSpinnerModule,
  MatSelectModule, MatSidenavModule,
  MatToolbarModule, MatGridListModule, MAT_DIALOG_DEFAULT_OPTIONS
} from '@angular/material';
import {ElasticModule} from 'angular2-elastic';
import {
  DecisionAnniversaryDialogComponent,
  DecisionBoardComponent} from './decision-board.component';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireModule} from 'angularfire2';
import {environment} from '../../environments/environment';
import {StarRatingModule} from 'angular-star-rating';
import { NgxMasonryModule } from 'ngx-masonry';
import {TimestampPipe} from '../pipes/timestamp.pipe';

@NgModule({
  imports: [
    CommonModule,
    NgxMasonryModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatGridListModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    StarRatingModule.forRoot(),
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
    DecisionAnniversaryDialogComponent,
    DecisionDialogComponent,
    TimestampPipe
  ],
  providers: [
    DecisionService,
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ],
  entryComponents: [
    DecisionAnniversaryDialogComponent,
    DecisionDialogComponent
  ]
})
export class DecisionBoardModule {}
