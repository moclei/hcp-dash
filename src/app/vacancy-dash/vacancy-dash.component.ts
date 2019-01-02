import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AuthService} from '../services/auth.service';
import {Vacancy, VacancyList} from './vacancy.model';
import {Observable} from 'rxjs';
import {VacancyService} from './vacancy.service';
import {UnitLoadService} from '../services/unit-load.service';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

@Component({
    selector: 'app-vacancy-dash',
    templateUrl: './vacancy-dash.component.html',
    styleUrls: ['./vacancy-dash.component.scss'],

})
export class VacancyDashComponent implements OnInit, AfterViewInit {
    properties: Array<any>;
    dispColumnsActive = [
        'property',
        'unit',
        'type',
        'size',
        'status',
        'ready',
        'scheduledRent'
    ];
    statuses = [
        {filterName: 'Vacant-Rented', displayName: 'Pre-Leased'},
        {filterName: 'Vacant-Unrented', displayName: 'Available'},
        {filterName: 'Notice-Unrented', displayName: 'Notice - Not Moved Out'},
        {filterName: 'Notice-Rented', displayName: 'Notice - Pre-Leased'}
    ];
    types = [
        {filterName: '0', displayName: 'Efficiency'},
        {filterName: '1', displayName: '1 Bedroom'},
        {filterName: '2', displayName: '2 Bedrooms'},
        {filterName: '3', displayName: '3 Bedrooms'},
        {filterName: '4', displayName: '4 Bedrooms'},
    ];
    cities = [
        {name: 'San Antonio'},
        {name: 'Houston'},
        {name: 'Fort Worth'}];
    /*
    property,
    unit,
    tags,
    type,
    size,
    status,
    ready,
    daysVacant,
    lastRent,
    scheduledRent,
    newRent,
    lastMoveIn,
    lastMoveOut,
    availableOn,
    nextMoveIn,
    description,
    */
    vacancies: Observable<VacancyList[]>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    private auth: AuthService;
    matDataSource: MatTableDataSource<Vacancy>;
    propertySelected: string;
    vacanciesArray = [];
    statusSelected = '';
    citySelected = 'San Antonio';
    typeSelected = '';
    housesSelected = '';
    loading = false;
    private vacanciesListArray = [];

    constructor(private vacancyService: VacancyService,
                public dialog: MatDialog,
                auth: AuthService,
                private unitsService: UnitLoadService) {
        this.properties = [{name: 'All', sheetName: ''}, ...unitsService.properties];
        this.auth = auth;
        this.loading = true;
        this.setDataSource();
    }
    setDataSource() {
        this.vacancies = this.vacancyService.getVacancyStream(); // this.vacancyService.getVacancies();
        this.vacancies.subscribe(
            (vacancies) => {
                const n = vacancies[0].createdAt as Timestamp;
                const newest = n.toDate();
                const vacancyListForProperty = vacancies[0].property;
                for (let x = 1; x < vacancies.length; x++) {
                    if (vacancies[x].property === vacancyListForProperty) {
                        // we've started repeating, stop collecting vacancy lists
                        break;
                    }
                    this.vacanciesListArray.push(vacancies[x]);
                }
                // console.log('vacanciesListArray number of properties: ' + this.vacanciesListArray.length);
                for (let i = 0; i < this.vacanciesListArray.length; i++) {
                    if (this.vacanciesListArray[i].vacancies) {
                        for (let j = 0; j < this.vacanciesListArray[i].vacancies.length; j++) {
                            const vacant = this.vacanciesListArray[i].vacancies[j];
                            vacant.property = this.vacanciesListArray[i].property;
                            vacant.city = this.vacanciesListArray[i].city;
                        }
                    }
                    this.vacanciesArray.push(...this.vacanciesListArray[i].vacancies);
                }
                // console.log('Vacancies: ' + this.vacanciesArray.length);
                // console.log('Got vacancies: ' + JSON.stringify(vacancies));
                this.matDataSource = new MatTableDataSource(this.vacanciesArray);
                this.loading = false;
                this.matDataSource.filterPredicate = this.createFilter();
                this.matDataSource.filter = ';San Antonio;;';
                this.matDataSource.paginator = this.paginator;
                this.matDataSource.sort = this.sort;
            });
    }
    createFilter() {
        return function(data, filter): boolean {
            // const accumulator = (currentTerm, key) => currentTerm + data[key];
            const transformedFilter = filter.trim().toLowerCase();
            const splitTerms = transformedFilter.split(';');
            const statusTerm = splitTerms[0];
            const cityTerm = splitTerms[1];
            const typeTerm = splitTerms[2];
            const housesTerm = splitTerms[3];
            // console.log('matching ' + data.property + ', unit#' + data.unit);
            let matched = true;
            if (statusTerm) {
                matched = data.status.toLowerCase().indexOf(statusTerm) !== -1;
                // console.log('status term matched: ' + matched);
            }
            if (matched && cityTerm) {
                matched = data.city.toLowerCase().indexOf(cityTerm) !== -1;
                // console.log('city term matched: ' + matched);
            }
            if (matched && typeTerm) {
                matched = data.type.toLowerCase().indexOf(typeTerm + '/') !== -1;
                // console.log('type term matched: ' + matched);
            }
            if (matched && housesTerm) {
                // console.log('matched && housesterm');
                matched = data.property.toLowerCase().indexOf(housesTerm) !== -1;
            } else if (matched && !housesTerm){
                matched = data.property.toLowerCase().indexOf('houses') === -1;
                // console.log('matched && !housesterm');
            }
            return matched;
        };
    }
    openDialog(vacancy): void {
        console.log('openDialog(element), property and unit: ' + vacancy.property + ': ' + vacancy.unit);
        const dialogPos = {top: '10vh'};
        const dialogRef = this.dialog.open(VacancyDashComponent, {
            width: '550px',
            height: '550px',
            data: vacancy,
            position: dialogPos
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed, result: ' + result);
        });
    }
    applyFilter() {
        console.log('applyFilter, status: ' + this.statusSelected
            + ', city: ' + this.citySelected
            + ', type: ' + this.typeSelected + ', house or apt: ' + this.housesSelected);
        this.matDataSource.filter = this.statusSelected + ';' + this.citySelected + ';' + this.typeSelected + ';' + this.housesSelected;
        if (this.matDataSource.paginator) {
            this.matDataSource.paginator.firstPage();
        }
    }
    setPropertySelected(property) {
        this.propertySelected = property;
    }
    getStatus(vacant) {
        if (vacant.status === 'Vacant-Unrented') {
            return 'Available';
        } else if (vacant.status === 'Vacant-Rented') {
            return 'Pre-leased';
        } else if (vacant.status === 'Notice-Unrented') {
            return 'Coming up - available';
        } else if (vacant.status === 'Notice-Rented') {
            return 'Coming up - preleased';
        }
    }
    ngOnInit() {
    }
    ngAfterViewInit() {

    }
}

// @ts-ignore
@Component({
    selector: 'app-vacancy-dialog',
    templateUrl: 'vacancy-dialog.component.html',
    styleUrls: ['vacancy-dialog.component.scss']
})
export class VacancyDialogComponent implements OnInit {
    auth: AuthService;
    constructor(
        public dialogRef: MatDialogRef<VacancyDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        auth: AuthService) {
        this.auth = auth;
    }
    ngOnInit() {
        console.log('Vacancy Object: ' + JSON.stringify(this.data));
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}

