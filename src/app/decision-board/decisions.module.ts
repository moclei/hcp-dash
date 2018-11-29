import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Masonry, MasonryModule} from '@thisissoon/angular-masonry';
import {DecisionComponent} from './decision/decision.component';
import {DecisionsRoutingModule} from './decisions-routing.module';
import {DecisionService} from './decision.service';
import {DecisionInputComponent} from './decision-input/decision-input.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {
    MatButtonModule, MatCardModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule,
    MatProgressSpinnerModule,
    MatSelectModule, MatSidenavModule,
    MatToolbarModule, MatGridListModule, MAT_DIALOG_DEFAULT_OPTIONS, MatStepperModule
} from '@angular/material';
import {ElasticModule} from 'angular2-elastic';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireModule} from 'angularfire2';
import {environment} from '../../environments/environment';
import {StarRatingModule} from 'angular-star-rating';
import {TimestampPipe} from '../pipes/timestamp.pipe';
import {DecisionAnniversaryDialogComponent, DecisionDashComponent, DecisionDialogComponent} from './decision-dash/decision-dash.component';
import {DecisionReviewComponent} from './decision-review/decision-review.component';
import { DecisionReviewSliderComponent } from './decision-review/decision-review-slider/decision-review-slider.component';
import { ReviewDirective } from './decision-review/review.directive';
import { ReviewItemComponent } from './decision-review/review-item/review-item.component';

const masonryProviders = [
    {provide: Masonry, useFactory: () => window['Masonry']}
];

@NgModule({
    imports: [
        CommonModule,
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
        MatStepperModule,
        StarRatingModule.forRoot(),
        MasonryModule.forRoot(masonryProviders),
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
        DecisionInputComponent,
        DecisionAnniversaryDialogComponent,
        DecisionDialogComponent,
        TimestampPipe,
        DecisionDashComponent,
        DecisionReviewComponent,
        DecisionReviewSliderComponent,
        ReviewDirective,
        ReviewItemComponent
    ],
    providers: [
        DecisionService
    ],
    entryComponents: [
        DecisionAnniversaryDialogComponent,
        DecisionDialogComponent,
        ReviewItemComponent
    ]
})
export class DecisionBoardModule {
}
