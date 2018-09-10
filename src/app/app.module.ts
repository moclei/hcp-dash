import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PapaParseModule} from 'ngx-papaparse';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatTabsModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatStepperModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatSnackBarModule
} from '@angular/material';
import {AppComponent} from './app.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HomepageComponent} from './homepage/homepage.component';
import {ResourcesComponent} from './resources/resources.component';
import {DirectoryComponent} from './directory/directory.component';
import {AppRoutingModule} from './app-routing.module';
import {CalendarComponent} from './calendar/calendar.component';
import {MapComponent} from './map/map.component';
// import {GoogleApiModule, NG_GAPI_CONFIG, NgGapiClientConfig} from 'ng-gapi';
import {HttpClientModule} from '@angular/common/http';
import {GoogleHttpService} from './services/google-http.service';
import {SheetsModel} from './services/directory.service';
import {SheetsService} from './services/sheets.service';
import {MakereadyBuilderComponent} from './makeready-dash/makeready-builder/makeready-builder.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CoreModule} from './core/core.module';
import {LoginPageComponent} from './login-page/login-page.component';
import {DashService} from './services/dash-service.service';
import {ContractorDashComponent, ContractorDialogComponent} from './contractor-dash/contractor-dash.component';
import {AppscriptService} from './services/appscript.service';
import {FullnameValidatorDirective} from './fullname-validator.directive';
import {UnitLoadService} from './services/unit-load.service';
import {PositiveNumberDirective} from './positive-number.directive';
import {ThankYouVisitsComponent} from './thank-you-visits/thank-you-visits.component';
import {AngularFireModule} from 'angularfire2';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {TextMaskModule} from 'angular2-text-mask';
import {SpeedyAppsComponent} from './speedy-apps/speedy-apps.component';
import {PhonePipe} from './pipes/phone.pipe';
import {MakereadyDashComponent} from './makeready-dash/makeready-dash.component';
import {
    MakeReadyDialogComponent,
    MakereadyTableComponent
} from './makeready-dash/makeready-table/makeready-table.component';
import {BonusDashComponent} from './bonus-dash/bonus-dash.component';
import {BonusTableComponent, BonusTableDialogComponent} from './bonus-dash/bonus-table/bonus-table.component';
import {BonusComponent} from './bonus-dash/bonus/bonus.component';
import {MakereadyChecklistComponent} from './makeready-dash/makeready-checklist/makeready-checklist.component';

/*
const gapiClientConfig: NgGapiClientConfig = {
    client_id: '603056598967-i65l4teqm0kk7k18steg7i0vt9k2253i.apps.googleusercontent.com',
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    cookie_policy: 'none',
    scope: [
        'https://mail.google.com/',
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/spreadsheets'
    ].join(' '),
    hosted_domain: 'hcptexas.com'
};
*/
@NgModule({
    declarations: [
        AppComponent,
        LoginPageComponent,
        HomepageComponent,
        ResourcesComponent,
        DirectoryComponent,
        CalendarComponent,
        MapComponent,
        MakereadyBuilderComponent,
        ContractorDashComponent,
        ContractorDialogComponent,
        FullnameValidatorDirective,
        PositiveNumberDirective,
        ThankYouVisitsComponent,
        SpeedyAppsComponent,
        PhonePipe,
        MakeReadyDialogComponent,
        BonusTableDialogComponent,
        MakereadyDashComponent,
        MakereadyTableComponent,
        BonusDashComponent,
        BonusTableComponent,
        BonusComponent,
        MakereadyChecklistComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        /*GoogleApiModule.forRoot({
            provide: NG_GAPI_CONFIG,
            useValue: gapiClientConfig
        }),*/
        HttpClientModule,
        FlexLayoutModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatToolbarModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatIconModule,
        MatMenuModule,
        MatTabsModule,
        MatCardModule,
        MatListModule,
        MatDividerModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatExpansionModule,
        MatBadgeModule,
        MatChipsModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatRadioModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatSnackBarModule,
        MatStepperModule,
        MatSelectModule,
        MatOptionModule,
        PapaParseModule,
        AppRoutingModule,
        TextMaskModule,
        CoreModule
    ],
    providers: [
        GoogleHttpService,
        SheetsModel,
        SheetsService,
        DashService,
        AppscriptService,
        UnitLoadService
    ],
    entryComponents: [
        ContractorDialogComponent,
        MakeReadyDialogComponent,
        BonusTableDialogComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
