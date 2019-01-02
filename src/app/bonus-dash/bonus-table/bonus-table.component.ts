import {AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AuthService} from '../../services/auth.service';
import {UnitLoadService} from '../../services/unit-load.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Bonus} from '../bonus.model';
import {BonusService} from '../bonus.service';

@Component({
    selector: 'app-bonus-table',
    templateUrl: './bonus-table.component.html',
    styleUrls: ['./bonus-table.component.scss']
})
export class BonusTableComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    auth: AuthService;
    properties: Array<any>;
    dispColumnsActive = [
        'propertyName',
        'grossPotential',
        'collectedMTD',
        'outstandingMTD',
        'collectedPercent',
        'percentLeftToBonus',
        'updatedAt'
    ];
    bonusesArray: Array<Bonus>;
    matDataSource: MatTableDataSource<Bonus>;
    monthSelected: number;
    yearSelected: number;
    months: Array<string>;
    years: Array<number>;

    constructor(private bonusService: BonusService,
                auth: AuthService,
                private unitsService: UnitLoadService,
                public dialog: MatDialog) {
        this.auth = auth;
        this.properties = [{name: 'All', sheetName: ''}, ...unitsService.properties];
        this.months = bonusService.months;
        this.years = bonusService.years;
    }
    ngOnInit() {
        const now = new Date();
        this.monthSelected = now.getMonth();
        this.yearSelected = now.getFullYear();

    }
    setDataSource() {
        this.matDataSource = new MatTableDataSource(this.bonusesArray);
        this.matDataSource.paginator = this.paginator;
        this.matDataSource.sort = this.sort;
        this.matDataSource.filterPredicate = this.createFilter();
        this.updateFilter();
    }
    updateFilter() {
        const filter = 'month' + this.monthSelected + 'year' + this.yearSelected;
        console.log('Updating filter with: '  + filter);
        this.matDataSource.filter = filter;
    }
    createFilter() {
        return function(bonus, filter): boolean {
            // const accumulator = (currentTerm, key) => currentTerm + data[key];
            const bonusStr = ('month' + bonus.forMonth + 'year' + bonus.forYear).toLowerCase();
            const transformedFilter = filter.trim().toLowerCase();
            return bonusStr.indexOf(transformedFilter) !== -1;
        };
    }

    openDialog(bonus): void {
        const dialogPos = {top: '10vh'};
        const dialogRef = this.dialog.open(BonusTableDialogComponent, {
            width: '550px',
            height: '650px',
            data: bonus,
            position: dialogPos
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed, result: ' + result);
        });
    }
    onSelectChange() {
        this.updateFilter();
    }
    dateOrTimestamp(bonus) {
        if (bonus.createdAt instanceof Date) {
            return bonus.updatedAt;
        } else {
            // console.log('bonus updatedAt: ' + bonus.updatedAt + ', typeof: ' + typeof bonus.updatedAt);
            return bonus.updatedAt.toDate();
        }
    }
    ngAfterViewInit() {
        this.bonusService.getBonusStream().subscribe(
            (bonuses) => {
                console.log('this.bonusService.getBonuses().subscribe: ' + bonuses);
                this.bonusesArray = bonuses;
                const now = new Date();
                const filteredBonuses = bonuses.filter( bonus => {
                   return bonus.forYear === now.getFullYear() && bonus.forMonth === now.getMonth();
                });
                if (filteredBonuses.length === 0) {
                    console.log('Moved to new month. Adding bonus entries');
                    this.bonusService.addMonth(now.getMonth(), now.getFullYear());
                }
                this.setDataSource();
            });
    }
    onAddClick() {
        const now = new Date();
        const augustBonuses = this.bonusesArray.filter( bonus => {
            return bonus.forMonth === 7;
        });
        if (augustBonuses.length === 0) {
            console.log('Found August bonuses, deleting');
            this.bonusService.addMonth(7, now.getFullYear());
        }
    }
    onDeleteClick() {
        const augustBonuses = this.bonusesArray.filter( bonus => {
            return  bonus.forMonth === 7;
        });
        if (augustBonuses.length !== 0) {
            console.log('Found August bonuses, deleting');
            this.bonusService.deleteBonuses(augustBonuses);
        }
    }
    ngOnDestroy() {
    }
}

@Component({
    selector: 'app-bonus-table-dialog',
    templateUrl: 'bonus-table-dialog.component.html',
    styleUrls: ['bonus-table.component.scss']
})
export class BonusTableDialogComponent implements OnInit {
    auth: AuthService;
    private bonusService: BonusService;
    editFormGroup: FormGroup;
    updatedAt: Date;

    constructor(
        public dialogRef: MatDialogRef<BonusTableDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        auth: AuthService,
        bonusService: BonusService,
        private _formBuilder: FormBuilder) {
        this.auth = auth;
        this.bonusService = bonusService;
        // this.updatedAt = new Date(this.data.updatedAt.seconds * 1000);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit() {
        this.editFormGroup = this._formBuilder.group({
            grossPotential: [this.data.grossPotential, Validators.required],
            collectedMTD: [this.data.collectedMTD, Validators.required],
        });
    }

    updateBonusHandler(): void {
        const updateBonus = { ...this.data};
        updateBonus.grossPotential = this.editFormGroup.value.grossPotential;
        updateBonus.collectedMTD = this.editFormGroup.value.collectedMTD;
        updateBonus.outstandingMTD = updateBonus.grossPotential - updateBonus.collectedMTD;
        updateBonus.collectedPercent = (updateBonus.collectedMTD / updateBonus.grossPotential);
        const bonusRemainder = 0.9 - updateBonus.collectedPercent;
        updateBonus.percentLeftToBonus = bonusRemainder <= 0 ? 0 : bonusRemainder;
        updateBonus.updatedAt = this.bonusService.timestamp;
        this.bonusService.setBonus(updateBonus);
        this.dialogRef.close();
    }

    cancelUpdateBonusHandler() {
        this.dialogRef.close();
    }

}


