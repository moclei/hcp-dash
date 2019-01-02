import {
    AfterViewInit,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    MAT_DIALOG_DATA, MatDatepickerInputEvent,
    MatDialog,
    MatDialogRef,
    MatPaginator, MatSnackBar,
    MatSort,
    MatTableDataSource
} from '@angular/material';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {PapaParseService} from 'ngx-papaparse';
import {AuthService, User} from '../../services/auth.service';
import {MakeReady, Unit} from '../makeready.model';
import {MakeReadyService} from '../makeready.service';
import {UnitLoadService} from '../../services/unit-load.service';
import {Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import FieldValue = firebase.firestore.FieldValue;
import {SlideInOutAnimation} from '../../animations';
import {AppscriptService} from '../../services/appscript.service';
import {differenceBy, intersectionBy} from 'lodash';

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
    expandedElement: MakeReady;
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
    makereadies: Observable<MakeReady[]>;
    moveouts: Observable<any>;
    moveouts$: Subscription;
    matDataSource: MatTableDataSource<MakeReady>;
    unitSelected: Unit;
    parsedUnits: Array<any>;
    loading: boolean;
    makereadyService: MakeReadyService;
    mrData: MakeReady[];
    toggleShowRemoved = false;
    propertySelected: string;
    user: User;
    missingMRs: Array<any>;
    searchingAppfolio = false;

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
        this.changeMoveoutsObservable('');
    }
    changeMRStream() {
        this.toggleShowRemoved = !this.toggleShowRemoved;
        this.matDataSource.filter = this.propertySelected + ';' + this.toggleShowRemoved;
    }
    changeMoveoutsObservable(propertyName) {
        const makereadies = this.makereadyService.getMakeReadiesForProperty(propertyName);
        if (makereadies != null) {
            makereadies.subscribe(data => {
                if (this.moveouts$) {
                    this.moveouts$.unsubscribe();
                }
                this.searchingAppfolio = true;
                this.moveouts$ = this.makereadyService.getMoveOutsForProperty(propertyName).subscribe(result => {
                    // this.appfolioData = results;
                    // console.log('result; ' + JSON.stringify(result));
                    const appfolio = [];
                    const mrbuilders = [];
                    const moveOuts = result.moveOuts;
                    for (let j = 0; j < moveOuts.length; j++) {
                        if (moveOuts[j]['Unit'] !== '') {
                            appfolio.push({
                                'unit': moveOuts[j]['Unit'],
                                'date': moveOuts[j]['Date'],
                                'type': moveOuts[j]['Event'],
                                'data:': moveOuts[j]
                            });
                        }
                    }
                    for (let i = 0; i < data.length; i++) {
                        const mrDate = this.fieldValueAsDate(data[i].createdAt);
                        mrbuilders.push({'unit': data[i].unit.unitName, 'date': mrDate, 'data': data[i]});
                    }

                    /*
                    this.mr.moveOutDate = new Timestamp.fromDate(event.value);
                    this.makereadyService.setMakeReady(this.mr, this.id).then(msg => {
                        console.log('onStepChange, saving mr: ' + msg);
                    });*/

                    const unmatched = differenceBy(appfolio, mrbuilders, 'unit');
                    const matched = intersectionBy(mrbuilders, appfolio, 'unit');
                    // let matched = differenceBy(unmatched, appfolio, 'unit')
                    // console.log('appfolio:');
                    // console.table(appfolio);
                    // console.log('mrbuilders:');
                    // console.table(mrbuilders);

                    // console.log('unmatched:');
                    // console.table(unmatched);
                    // console.log('matched:');
                    // console.table(matched);
                    for (let x = 0; x < matched.length; x++) {
                        const mr = matched[x];
                       //  console.log('matched unit ' + mr.unit.unitName + ', id:' + mr.id + ', moveOutDate: ' + mr.moveOutDate);
                        if (!mr.data.moveOutDate) {
                            const moDate = new Date(mr.date);
                            console.log('moDate: ' + moDate);
                            mr.data.moveOutDate = Timestamp.fromDate(moDate);
                            this.makereadyService.setMakeReady(mr.data, mr.data.id).then(msg => {
                                console.log('Updated mr, saving mr: ' + msg);
                            });
                        }
                    }
                    this.missingMRs = unmatched;
                    this.searchingAppfolio = false;
                    /*console.log('matched:');
                    console.table(matched);*/
                    // console.log('Unmatched from cloud function: ' + JSON.stringify(unmatched));
                });
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
        // this.changeAppfolioObservable(this.propertySelected);
        this.changeMoveoutsObservable(this.propertySelected);
    }

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
            /*if(this.propertySelected !== '') {
                this.changeAppfolioObservable(this.propertySelected);
            }*/
        });
    }
    onNewMakeReadyHandler() {
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
    daysBetween(startD, endD) {
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        // console.log('startDate: ' + startD + ', endDate: ' + endD);
        let numDays = Math.round((this.treatAsUTC(endD) - this.treatAsUTC(startD)) / millisecondsPerDay);
        if (numDays === -1) {
            numDays = 0;
        }
        return numDays;
    }
    isOverTime(mr) {
        if (mr.numDays > 4) {
            return !mr.paid || mr.paid === false;
        } else {
            return false;
        }
    }
    treatAsUTC(date): any {
        const result = new Date(date);
        result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
        return result;
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
/*
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
*/
