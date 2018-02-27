import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Subscription} from 'rxjs/Subscription';
import {MatButton} from '@angular/material';
import 'rxjs/add/observable/timer';
import {SheetsModel} from '../services/sheetmodel.service';
import { Listing } from '../services/google-http.service';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss']
})
export class DirectoryComponent implements OnInit, OnDestroy {

  displayedColumns = ['name', 'location', 'position', 'number'];
  dataSource = new MatTableDataSource();
  // authenticationService: AuthenticationService;
  // authService2: AuthenticationService2;
  subscription: Subscription;
  @Input() directorySource: Listing[] = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('signin') signin: MatButton;
  @ViewChild('signout') signout: MatButton;
  contacts: Listing[] = [];

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(private sheetsModel: SheetsModel) {
    // console.log('Directory.component -> constructing');
    sheetsModel.getAllContacts().subscribe(contacts => {
      this.contacts = contacts;
    }, error => console.log('There was an error loading the directory data: ' + JSON.stringify(error))
        , () => {
        this.dataSource.data = this.contacts;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        // console.log('loaded directory data: msg:' + JSON.stringify(this.contacts));
      });
  }

  ngOnInit() {
  }
  ngOnDestroy() {

  }
}
