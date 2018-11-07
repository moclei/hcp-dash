import {
    AfterViewInit,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
    MatPaginator, MatSnackBar,
    MatSort,
    MatTableDataSource
} from '@angular/material';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/index';
import {FormBuilder} from '@angular/forms';
import {PapaParseService} from 'ngx-papaparse';
import {AuthService, User} from '../../services/auth.service';
import {MakeReady, MakeReadyId, Unit} from '../makeready.model';
import {MakeReadyService} from '../makeready.service';
import {UnitLoadService} from '../../services/unit-load.service';
import {Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import FieldValue = firebase.firestore.FieldValue;
import {SlideInOutAnimation} from '../../animations';
import {AppscriptService} from '../../services/appscript.service';
import {differenceBy} from 'lodash';

@Component({
    selector: 'app-makeready-table',
    templateUrl: './makeready-table.component.html',
    styleUrls: ['./makeready-table.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class MakereadyTableComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    expandedElement: MakeReadyId;
    auth: AuthService;
    $user: Observable<User>;
    properties: Array<any>;
    dispColumnsActive = [
        'propertyName',
        'floorPlan',
        'mrType',
        'createdAt',
        'contractorName',
        'progress',
        'numDays'
    ];
    // 'scheduled','delivered','paid'
    makereadies: Observable<MakeReady[]>;
    matDataSource: MatTableDataSource<MakeReady>;
    unitSelected: Unit;
    parsedUnits: Array<any>;
    loading: boolean;
    makereadyService: MakeReadyService;
    mrData: MakeReadyId[];
    toggleShowRemoved = false;
    propertySelected: string;
    user: User;
    appfolioData$: Subscription;
    missingMRs: Array<any>;
    searchingAppfolio: boolean = false;

    constructor(makereadyService: MakeReadyService,
                auth: AuthService,
                private unitsService: UnitLoadService,
                public dialog: MatDialog,
                private _formBuilder: FormBuilder,
                private papa: PapaParseService,
                private appsScriptService: AppscriptService,
                public snackBar: MatSnackBar,
                private router: Router) {
        this.auth = auth;
        this.makereadyService = makereadyService;
        this.$user = auth.user;
        this.properties = [{name: 'All', sheetName: ''}, ...unitsService.properties];
        this.loading = true;
    }
    ngOnInit() {
        /*this.makereadyService.getAppfolioObservable().subscribe( results => {
            this.appfolioData = results;
            console.log('Results from cloud function: ' + JSON.stringify(results));
        })
*/
    }
    setDataSource(user) {
        this.makereadyService.getMakeReadiesStream().subscribe( data => {
            this.mrData = data;
            this.matDataSource = new MatTableDataSource(data);
            this.matDataSource.filterPredicate = this.createFilter();
            this.propertySelected = this.auth.getFilterName(user);
            console.log('setDataSource(' + user.email + ') ' + 'this.propertySelected: ' + this.propertySelected);
            this.matDataSource.filter = this.propertySelected + ';' + this.toggleShowRemoved;
            this.matDataSource.paginator = this.paginator;
            this.matDataSource.sort = this.sort;
            this.loading = false;
        });
        this.changeAppfolioObservable('');
    }
    changeMRStream() {
        this.toggleShowRemoved = !this.toggleShowRemoved;
        this.matDataSource.filter = this.propertySelected + ';' + this.toggleShowRemoved;
    }
    changeAppfolioObservable(propertyName) {
        let makereadies$ = this.makereadyService.getMakeReadiesForProperty(propertyName);
        if(makereadies$ != null) {
            this.makereadyService.getMakeReadiesForProperty(propertyName).subscribe(data => {
                if (this.appfolioData$) {
                    this.appfolioData$.unsubscribe();
                }
                this.searchingAppfolio = true;
                this.appfolioData$ = this.makereadyService.getAppfolioObservable(propertyName).subscribe(results => {
                    // this.appfolioData = results;
                    console.log('results.length; ' + results.length);
                    let appfolio = [];
                    let mrbuilders = [];
                    for (let i = 0; i < data.length; i++) {
                        let mrDate = this.fieldValueAsDate(data[i].createdAt);
                        mrbuilders.push({'unit': data[i].unit.unitName, 'date': mrDate, 'data:': {}});
                    }
                    for (let j = 0; j < results.length; j++) {
                        if (results[j]["Unit"] !== "") {
                            appfolio.push({
                                'unit': results[j]['Unit'],
                                'date': results[j]['Date'],
                                'data:': results[j]
                            });
                        }
                    }

                    let unmatched = differenceBy(appfolio, mrbuilders, 'unit');
                    // let matched = differenceBy(unmatched, appfolio, 'unit')
                    console.log('appfolio:');
                    console.table(appfolio);
                    console.log('mrbuilders:');
                    console.table(mrbuilders);

                    console.log('unmatched:');
                    console.table(unmatched);
                    this.missingMRs = unmatched;
                    this.searchingAppfolio = false;
                    /*console.log('matched:');
                    console.table(matched);*/
                    // console.log('Unmatched from cloud function: ' + JSON.stringify(unmatched));
                })
            });
        }
    }
    createFilter() {
        return function(data, filter): boolean {
                // const accumulator = (currentTerm, key) => currentTerm + data[key];
                const dataStr = (data.propertyName + '' + data.removed).toLowerCase();
                const transformedFilter = filter.trim().toLowerCase();
                const splitTerms = transformedFilter.split(';');
                const completeTerm = splitTerms[1];
                const searchItem1 = splitTerms[0];
            if (searchItem1.indexOf(':') !== -1) {
                const splitFilter = searchItem1.split(':');
                const property1 = splitFilter[0];
                const property2 = splitFilter[1];
                return (dataStr.indexOf(property1 + '' + completeTerm) !== -1 || dataStr.indexOf(property2 + '' + completeTerm) !== -1);
            } else {
                return dataStr.indexOf(searchItem1 + '' + completeTerm) !== -1;
            }
        };
        // return filterFunction;
    }
    onSelectProperty(propertySheetName: string) {
        this.propertySelected = propertySheetName;
        this.matDataSource.filter = this.propertySelected + ';' + this.toggleShowRemoved;
        if (this.matDataSource.paginator) {
            this.matDataSource.paginator.firstPage();
        }
        this.missingMRs = null;
        this.changeAppfolioObservable(this.propertySelected);
    }
    /*  setCreatedAt(data) {
        const timestamp = data.timestamp;
        if (timestamp) {
            const dateStr = timestamp.split(',')[0];
            const dateObj = new Date(dateStr);
            if (!data.hasOwnProperty('createdAt')) {
                // console.log('NOT-createdAt');
                data.createdAt = Timestamp.fromDate(dateObj);
                this.makereadyService.setMakeReady(data).then(() => {
                    // console.log('updated');
                });
            }
        } else {
            // console.log('timestamp-no');
        }
    }*/
    /*setRemoved(data) {
        data.removed = false;
        console.log('setRemoved');
        this.makereadyService.setMakeReady(data);
    }*/
    onRemoveHandler(data, removedReason: string) {
        data.removedAt = this.makereadyService.date_created;
        data.removed = true;
        data.removedReason = removedReason;
        this.makereadyService.setMakeReady(data).then(() => {
            // console.log('removedReason: ' + removedReason);
        });
    }
    ngAfterViewInit() {
        this.$user.subscribe(user => {
            this.user = user;
            this.propertySelected = user.propertyFilter;
            this.setDataSource(user);
            if(this.propertySelected !== '') {
                this.changeAppfolioObservable(this.propertySelected);
            }
        });
    }
    openDialog(makeready): void {
        // console.log('open removeDialog(element) ');
        const dialogPos = {top: '10vh'};
        const dialogRef = this.dialog.open(MakeReadyDialogComponent, {
            width: '450px',
            data: makeready,
            position: dialogPos
        });
        dialogRef.afterClosed().subscribe(result => {
            this.matDataSource.filter = this.propertySelected + 'false';
            // console.log('The dialog was closed, result: ' + result);
        });
    }
    onCheckboxChange(isChecked: boolean, which: string, element: any) {
        // console.log('makeready-table. ' + element.unitName + ' ' + which + ': ' + isChecked);
        const makeready = element.mr;
        makeready[which] = isChecked;
        makeready[which + 'Date'] = this.makereadyService.date_created;
        this.makereadyService.setMakeReady(makeready).then(msg => {
            console.log('onCheckboxChange, make ready saved ' + element.unitName + ' ' + which + ': ' + isChecked
                + ', save message: ' + msg);
        });
    }
    onNewMakeReadyHandler() {
        // TODO go to makereadybuilder
        this.router.navigate(['./mr-builder']);
    }
    onReSendHandler(mr) {
        // this.processing = true;
        const expirationTime = this.user.expirationTime;
        const nowTime = new Date().getTime();
        if (nowTime >= expirationTime) {
            this.auth.googleLogin(null).then(result => {
                this.auth.user.subscribe(user => {
                    this.user = user;
                    this.resendMakeReady(mr, user.accessToken);
                });
            });
        } else {
            this.resendMakeReady(mr, this.user.accessToken);
        }
        this.openSnackBar('Sending Make Ready Again', 'Ok');
    }
    resendMakeReady(mr, accessToken) {
        // console.log('mr: ' + JSON.stringify(mr));
        // console.log('mr: ' + JSON.stringify(mr));
        this.appsScriptService.resendMakeReadyBuilder(mr, accessToken).subscribe(result => {
            // this.processing = false;
            this.openSnackBar('Make Ready Sent Successfully', 'Ok');
        }, error => {
            // this.processing = false;
            this.openSnackBar('Make Ready Sending Failed', 'Ok');
        });
    }
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }
    ngOnDestroy() {
        // this.makereadies$.unsubscribe();
    }
    treatAsUTC(date): any {
        const result = new Date(date);
        result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
        return result;
    }
    numDays(mr) {
        const createdAt = this.fieldValueAsDate(mr.createdAt);
        const movedOutTS = mr.moveOutDate;
        if (movedOutTS) {
            const movedOut = mr.moveOutDate.toDate();
            const now = new Date();
            if (mr.checklist && mr.checklist.contractorFinished) {
                return this.daysBetween(movedOut, this.fieldValueAsDate(mr.checklist.contractorFinishedDate));
            } else {
                return this.daysBetween(movedOut, now);
            }
        } else {
            return 0;
        }
    }
    getMoveOutDotSpot(mr) {
        const moveOutDate = mr.moveOutDate;
        let location = '4px';
        if (mr.checklist) {
            const makeReadyRequestedDate = mr.checklist.makeReadyRequestedDate;
            const materialsOrderedDate = mr.checklist.materialsOrderedDate;
            const contractorScheduledDate = mr.checklist.contractorScheduledDate;
            const contractorStartedDate = mr.checklist.contractorStartedDate;
            const contractorFinishedDate = mr.checklist.contractorFinishedDate;

            if (contractorFinishedDate) {
                if (moveOutDate > contractorStartedDate) {
                    if (moveOutDate <= contractorFinishedDate) {
                        location = '270px';
                    } else {
                        location = '330px';
                    }
                }
            }
            if (contractorStartedDate) {
                if (moveOutDate > contractorScheduledDate) {
                    if (moveOutDate <= contractorStartedDate) {
                        location = '210px';
                    } else if (!contractorFinishedDate) {
                        location = '260px';
                    }
                }
            }
            if (contractorScheduledDate) {
                if (moveOutDate > materialsOrderedDate) {
                    if (moveOutDate <= contractorScheduledDate) {
                        location = '140px';
                    } else if (!contractorStartedDate) {
                        location = '200px';
                    }
                }
            }
            if (materialsOrderedDate) {
                if (moveOutDate > makeReadyRequestedDate) {
                    if (moveOutDate <= materialsOrderedDate) {
                        location = '70px';
                    } else if (!contractorScheduledDate) {
                        location = '130px';
                    }
                }
            }
            if (makeReadyRequestedDate) {
                if (moveOutDate <= makeReadyRequestedDate) {
                    location = '4px';
                } else if (!materialsOrderedDate) {
                    // console.log('makeReadyRequestedDate was before moveoutDate');
                    location = '60px';
                }
            }
        }
        return location;
    }
    daysBetween(startDate: Date, endDate: Date) {
        const millisecondsPerDay: number = 24 * 60 * 60 * 1000;
        return Math.round((this.treatAsUTC(endDate) - this.treatAsUTC(startDate)) / millisecondsPerDay);
    }
    isOverTime(numDays: number, makeready) {
        if (numDays > 4) {
            return !makeready.paid || makeready.paid === false;
        } else {
            return false;
        }
    }
    fieldValueAsDate(val: FieldValue): Date {
        // console.log('val: ' + val + ', val type: ' + typeof val);
        if (val) {
            const tval = val as Timestamp;
            return tval.toDate();
        } else {
            return new Date();
        }
    }
}

@Component({
    selector: 'app-makeready-dialog',
    templateUrl: 'makeready-table-dialog.component.html',
    styleUrls: ['makeready-table-dialog.component.scss'],
    animations: [SlideInOutAnimation]
})
export class MakeReadyDialogComponent implements OnInit {
    private makereadyService: MakeReadyService;
    auth: AuthService;
    removedReason: string;
    movedInDate: Date;
    reasonSelected: string;
    slideState = 'out';
    reasons = [
        'Moved In',
        'Duplicate',
        'Mistake',
        'Other - explain below'
    ];
    constructor(
        public dialogRef: MatDialogRef<MakeReadyDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        makereadyService: MakeReadyService,
        auth: AuthService) {
        this.makereadyService = makereadyService;
        this.auth = auth;
        this.reasonSelected = '';
    }
    onRemoveHandler() {
        this.data.removedAt = this.makereadyService.date_created;
        this.data.removed = true;
        this.data.removedReason = this.reasonSelected + ': ' + this.removedReason;
        if (this.movedInDate) {
            this.data.movedInDate = this.movedInDate;
        }
        this.makereadyService.setMakeReady(this.data).then(() => {
            // console.log('removedReason: ' + this.removedReason);
            this.dialogRef.close();
        });
    }
    changeReason(newReason) {
        this.reasonSelected = newReason;
        if (newReason === 'Moved In') {
            this.slideState = 'in';
        } else {
            this.slideState = 'out';
        }
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    ngOnInit() {
    }
}
