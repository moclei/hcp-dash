import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCheckboxModule, MatSidenavModule, MatToolbarModule,
  MatIconModule, MatMenuModule, MatTabsModule, MatCardModule, MatListModule,
  MatDividerModule, MatInputModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatStepperModule, MatSelectModule, MatOptionModule, MatRadioModule
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
import { SheetsModel} from './services/sheetmodel.service';
import { SheetsService} from './services/sheets.service';
import { MakereadyBuilderComponent } from './makeready-builder/makeready-builder.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MakereadyResultsComponent } from './makeready-builder/makeready-results/makeready-results.component';
import {CoreModule} from './core/core.module';
import { LoginPageComponent } from './login-page/login-page.component';

const gapiClientConfig: NgGapiClientConfig = {
  client_id: '603056598967-i65l4teqm0kk7k18steg7i0vt9k2253i.apps.googleusercontent.com',
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  scope: [
    'https://www.googleapis.com/auth/spreadsheets.readonly'
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
    MakereadyResultsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    GoogleApiModule.forRoot({
      provide: NG_GAPI_CONFIG,
      useValue: gapiClientConfig
    }),
    HttpClientModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatMenuModule,
    MatTabsModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
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
    AppRoutingModule,
    CoreModule
  ],
  providers: [GoogleHttpService, SheetsService, SheetsModel],
  bootstrap: [AppComponent]
})
export class AppModule { }
