import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { PapaParseModule } from 'ngx-papaparse';
import {
  MatButtonModule, MatCheckboxModule, MatSidenavModule, MatToolbarModule,
  MatIconModule, MatMenuModule, MatTabsModule, MatCardModule, MatListModule,
  MatDividerModule, MatInputModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatStepperModule, MatSelectModule, MatOptionModule, MatRadioModule, MatDialogModule, MatDatepickerModule, MatNativeDateModule,
  MatExpansionModule, MatProgressSpinnerModule
} from '@angular/material';
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppBodyComponent } from './app-body/app-body.component';
import { FlexLayoutModule} from '@angular/flex-layout';
import { HomepageComponent } from './homepage/homepage.component';
import { ResourcesComponent } from './resources/resources.component';
import { DirectoryComponent } from './directory/directory.component';
import { AppRoutingModule} from './app-routing.module';
import { CalendarComponent } from './calendar/calendar.component';
import { MapComponent } from './map/map.component';
import { GoogleApiModule, NG_GAPI_CONFIG, NgGapiClientConfig} from 'ng-gapi';
import { HttpClientModule} from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { GoogleHttpService} from './services/google-http.service';
import { SheetsModel} from './services/directory.service';
import { SheetsService} from './services/sheets.service';
import { MakereadyBuilderComponent } from './makeready-builder/makeready-builder.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MakereadyResultsComponent } from './makeready-builder/makeready-results/makeready-results.component';
import {CoreModule} from './core/core.module';
import { LoginPageComponent } from './login-page/login-page.component';
import {DecisionBoardModule} from './decision-board/decisions.module';
import {DashService} from './services/dash-service.service';
import { ContractorsComponent } from './contractors/contractors.component';
import {ContractorsModel} from './services/contractor.service';
import {ContractorDashComponent, ContractorDialogComponent} from './contractor-dash/contractor-dash.component';
import {Contractors2Model} from './services/contractors2.service';
import {AppscriptService} from './services/appscript.service';
import { FullnameValidatorDirective } from './fullname-validator.directive';
import {UnitLoadService} from './services/unit-load.service';
import { PositiveNumberDirective } from './positive-number.directive';
import { ThankYouVisitsComponent } from './thank-you-visits/thank-you-visits.component';
import {AngularFireModule} from 'angularfire2';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import { DynaformTestComponent } from './test/dynaform-test/dynaform-test.component';
import { TextMaskModule } from 'angular2-text-mask';
import { SpeedyAppsComponent } from './speedy-apps/speedy-apps.component';


const gapiClientConfig: NgGapiClientConfig = {
  client_id: '603056598967-i65l4teqm0kk7k18steg7i0vt9k2253i.apps.googleusercontent.com',
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  scope: [
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/spreadsheets'
  ].join(' '),
  hosted_domain: 'hcptexas.com'
};

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppBodyComponent,
    LoginPageComponent,
    HomepageComponent,
    ResourcesComponent,
    DirectoryComponent,
    CalendarComponent,
    MapComponent,
    LoginComponent,
    MakereadyBuilderComponent,
    MakereadyResultsComponent,
    ContractorsComponent,
    ContractorDashComponent,
    ContractorDialogComponent,
    FullnameValidatorDirective,
    PositiveNumberDirective,
    ThankYouVisitsComponent,
    DynaformTestComponent,
    SpeedyAppsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    GoogleApiModule.forRoot({
      provide: NG_GAPI_CONFIG,
      useValue: gapiClientConfig
    }),

    HttpClientModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatMenuModule,
    MatTabsModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatStepperModule,
    MatSelectModule,
    MatOptionModule,
    PapaParseModule,
    DecisionBoardModule,
    AppRoutingModule,
    TextMaskModule,
    CoreModule
  ],
  providers: [
    GoogleHttpService,
    SheetsService,
    SheetsModel,
    DashService,
    ContractorsModel,
    Contractors2Model,
    AppscriptService,
    UnitLoadService
  ],
  entryComponents: [
    ContractorDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
