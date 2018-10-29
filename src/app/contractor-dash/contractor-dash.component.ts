import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AuthService} from '../services/auth.service';
import {Contractor} from './contractor.model';
import {Observable} from 'rxjs/index';
import {ContractorFirebaseService} from './contractor-firebase.service';
import {Unit} from '../makeready-dash/makeready.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UnitLoadService} from '../services/unit-load.service';
import {PapaParseService} from 'ngx-papaparse';

@Component({
    selector: 'app-contractor-dash',
    templateUrl: './contractor-dash.component.html',
    styleUrls: ['./contractor-dash.component.scss'],

})
export class ContractorDashComponent implements OnInit {
    properties: Array<any>;
    mrTypes = [
        {description: 'Heavy'},
        {description: 'Medium'},
        {description: 'Light'},
        {description: 'Clean Only'},
        {description: 'Rehab'},
        {description: 'Tree cutting'},
        {description: 'Yard work'},
        {description: 'Plumbing'},
        {description: 'Electrical'}
    ];
    statuses = [
        {displayName: 'Working', filterName: 'Active'},
        {displayName: 'Not Working', filterName: 'Inactive'},
        {displayName: 'Do Not Use', filterName: 'Bad'}
    ];
    dispColumnsActive = [
        'name',
        'phoneNumber',
        'status',
        'currentProperty',
        'unit',
        'makeReadyType',
        'scheduledStartDate',
        'scheduledFinishDate'
    ];
    contractors: Observable<Contractor[]>;
    addFormGroup: FormGroup;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    private auth: AuthService;
    matDataSource: MatTableDataSource<Contractor>;
    unitSelected: Unit;
    propertySelected: string;
    parsedUnits: Array<any>;
    addingContractor = false;
    contractorsArray: Array<Contractor>;
    loading: false;

    constructor(private contractorService: ContractorFirebaseService,
                public dialog: MatDialog,
                private _formBuilder: FormBuilder,
                auth: AuthService,
                private papa: PapaParseService,
                private unitsService: UnitLoadService) {
        this.properties = [{name: 'All', sheetName: ''}, ...unitsService.properties];
        this.auth = auth;
        this.setDataSource();
    }
    setDataSource() {
        this.contractors = this.contractorService.getContractors();
        this.contractors.subscribe(
            (x) => {
                this.contractorsArray = x;
                this.matDataSource = new MatTableDataSource(this.contractorsArray);
                this.matDataSource.paginator = this.paginator;
                this.matDataSource.sort = this.sort;
            });
    }
    openDialog(element): void {
        console.log('openDialog(element), element.contractorName: ' + element.contractorName);
        const dialogPos = {top: '10vh'};
        const dialogRef = this.dialog.open(ContractorDialogComponent, {
            width: '550px',
            height: '550px',
            data: element,
            position: dialogPos
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed, result: ' + result);
        });
    }
    onAddShowHandler() {
        this.addingContractor = true;
    }
    onAddClickHandler() {
        const name = this.addFormGroup.value.nameCtrl;
        const currentProperty = this.addFormGroup.value.propertyCtrl;
        const unit = this.unitSelected;
        const makeReadyType = this.addFormGroup.value.mrTypeCtrl;
        const phoneNumber = this.addFormGroup.value.phoneCtrl;
        const status = 'Active';
        const now = new Date();
        const contractor = {
            'name': name,
            'currentProperty': currentProperty,
            'unit': unit,
            'makeReadyType': makeReadyType,
            'scheduledStartDate': now,
            'scheduledFinishDate': now,
            'phoneNumber': phoneNumber,
            'status': status,
            'updatedAt': null,
            'createdAt': this.contractorService.timestamp
        };
        this.contractorService.addContractor(contractor);
        this.addFormGroup.reset();
        this.addingContractor = false;
    }
    onCancelAddClickHandler() {
        this.addFormGroup.reset();
        this.addingContractor = false;
    }
    applyFilter(filterValue: string) {
        console.log('filterValue: ' + filterValue);
        this.matDataSource.filter = filterValue;
        if (this.matDataSource.paginator) {
            this.matDataSource.paginator.firstPage();
        }
    }
    setPropertySelected(property) {
        this.propertySelected = property;
        this.unitsService.get(property).subscribe(res => {
                // console.log('received units: ' + res);
                this.papa.parse(res, {
                    header: true,
                    complete: (results) => {
                        console.log('Parsed: ', results.data);
                        this.parsedUnits = results.data;
                        this.addFormGroup.controls.unitCtrl.enable();
                    }
                });
            }, error => console.log('There was an error loading the units data: ' + error + ', JSON error: ' + JSON.stringify(error))
            , () => {
            });
    }
    setUnitSelected(event) {
        const selectedIndex = this.parsedUnits.findIndex(x => x.unitName === event.value);
        const unit = this.parsedUnits[selectedIndex];
        let legalName = '';
        let county = '';
        let businessName = '';
        for (let i = 0; i < this.unitsService.properties.length; i++) {
            const property = this.unitsService.properties[i];
            if (property.name === this.propertySelected) {
                legalName = property.legalName;
                county = property.county;
                businessName = property.businessName;
            } else {
                console.log('setUnitSelected: couldnt find selected property in list of properties');
            }
        }
        this.unitSelected = {
            'unitName': unit.unitName,
            'size': unit.Size,
            'bedrooms': unit.Bedrooms,
            'bathrooms': unit.Bathrooms,
            'floorplan': unit.Code,
            'streetAddress': unit.streetAddress,
            'legalName': legalName,
            'businessName': businessName,
            'county': county
        };
    }
    ngOnInit() {
        this.addFormGroup = this._formBuilder.group({
            nameCtrl: ['', Validators.required],
            phoneCtrl: ['', Validators.required],
            unitCtrl: [{value: '', disabled: true}],
            propertyCtrl: [''],
            mrTypeCtrl: ['']
            // sizeCtrl: ['', Validators.required]
        });
    }
}

@Component({
    selector: 'app-contractor-dialog',
    templateUrl: 'contractor-dialog.component.html',
    styleUrls: ['contractor-dialog.component.scss']
})
export class ContractorDialogComponent implements OnInit {
    editFormGroup: FormGroup;
    parsedUnits: Array<any>;
    properties: Array<any>;
    auth: AuthService;
    createdAt: Date;
    updatedAt: Date;
    statuses = [
        {displayName: 'Working', filterName: 'Active'},
        {displayName: 'Not Working', filterName: 'Inactive'},
        {displayName: 'Do Not Use', filterName: 'Bad'}
    ];
    mrTypes = [
        {description: 'Heavy'},
        {description: 'Medium'},
        {description: 'Light'},
        {description: 'Clean Only'},
        {description: 'Rehab'},
        {description: 'Tree cutting'},
        {description: 'Yard work'},
        {description: 'Plumbing'},
        {description: 'Electrical'}
    ];
    constructor(
        public dialogRef: MatDialogRef<ContractorDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private unitsService: UnitLoadService,
        auth: AuthService,
        private papa: PapaParseService,
        private contractorService: ContractorFirebaseService) {
        this.auth = auth;
    }
    ngOnInit() {
        this.properties = [...this.unitsService.properties];
        this.editFormGroup = this._formBuilder.group({
            nameCtrl: [this.data.name, Validators.required],
            phoneCtrl: [this.data.phoneNumber, Validators.required],
            statusCtrl: [this.data.status, Validators.required],
            propertyCtrl: [this.data.currentProperty],
            unitCtrl: [this.data.unit.unitName],
            mrTypeCtrl: [this.data.makeReadyType]
        });
        console.log('Cotnractor Object: ' + JSON.stringify(this.data));
        this.createdAt = new Date(this.data.createdAt.seconds * 1000);
        this.updatedAt = new Date(this.data.updatedAt.seconds * 1000);
        this.loadInitialUnits(this.data.currentProperty, this.data.unit.unitName);
    }
    loadInitialUnits(currentProperty, unitName) {
        this.unitsService.get(currentProperty).subscribe(res => {
                this.papa.parse(res, {
                    header: true,
                    complete: (results) => {
                        this.parsedUnits = results.data;
                        this.setUnitSelected(unitName);
                    }
                });
            }, error => console.log('There was an error loading the units data: ' + error + ', JSON error: ' + JSON.stringify(error))
            , () => {
            });
    }
    setPropertySelected(property) {
        this.data.currentProperty = property;
        this.unitsService.get(property).subscribe(res => {
                this.papa.parse(res, {
                    header: true,
                    complete: (results) => {
                        this.parsedUnits = results.data;
                    }
                });
            }, error => console.log('There was an error loading the units data: ' + error + ', JSON error: ' + JSON.stringify(error))
            , () => {
            });
    }
    setUnitSelected(unitSelected) {
        console.log('setting Unit Selected: ' + JSON.stringify(unitSelected));
        const selectedIndex = this.parsedUnits.findIndex(x => x.unitName === unitSelected);
        const unit = this.parsedUnits[selectedIndex];
        let legalName = '';
        let county = '';
        let businessName = '';
        for (let i = 0; i < this.properties.length; i++) {
            if (this.properties[i].name === this.data.currentProperty) {
                console.log('setUnitSelected: found selected property ( ' + this.properties[i].name + ' ) in list of properties');
                legalName = this.properties[i].legalName;
                county = this.properties[i].county;
                businessName = this.properties[i].businessName;
            }
        }
        this.data.unit = {
            'unitName': unit.unitName,
            'size': unit.Size,
            'bedrooms': unit.Bedrooms,
            'bathrooms': unit.Bathrooms,
            'floorplan': unit.Code,
            'streetAddress': unit.streetAddress,
            'legalName': legalName,
            'businessName': businessName,
            'county': county
        };
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    onEditSaveClickHandler(): void {
        this.data.name = this.editFormGroup.value.nameCtrl;
        this.data.phoneNumber = this.editFormGroup.value.phoneCtrl;
        this.data.status = this.editFormGroup.value.statusCtrl;
        this.data.mrType = this.editFormGroup.value.mrTypeCtrl;
        this.contractorService.setContractor(this.data).then(() => {
            this.dialogRef.close();
        });
    }
    onEditCancelClickHandler() {
        this.dialogRef.close();
    }
}
