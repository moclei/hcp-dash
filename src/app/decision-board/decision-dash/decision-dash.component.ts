import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Masonry, MasonryInstance, MasonryOptions} from '@thisissoon/angular-masonry';
import {DecisionService} from '../decision.service';
import {DecisionId} from '../decision.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {DashService} from '../../services/dash-service.service';
import {AuthService, User} from '../../services/auth.service';
import {UnitLoadService} from '../../services/unit-load.service';
import {Observable} from 'rxjs/Observable';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import {ClickEvent, HoverRatingChangeEvent, RatingChangeEvent} from 'angular-star-rating';
import {Router} from '@angular/router';

@Component({
    selector: 'app-decision-dash',
    templateUrl: './decision-dash.component.html',
    styleUrls: ['./decision-dash.component.scss']
})
export class DecisionDashComponent implements AfterViewInit, OnInit, OnDestroy {
    @ViewChild('grid') public grid: ElementRef;
    public masonryInstance: MasonryInstance;
    decisionService: DecisionService;
    anniDecisions: DecisionId[];
    decisions: DecisionId[];
    filteredDecisions: DecisionId[];
    auth: AuthService;
    $user: Observable<User>;
    cutoff3M: Date;
    cutoff6M: Date;
    properties: Array<any>;
    user: User;
    propertySelected: string;
    unitsService: UnitLoadService;
    private id: number;
    masonryOptions: MasonryOptions = {
        itemSelector: '.card',
        columnWidth: '.card',
        gutter: 20,
        fitWidth: true
    };

    constructor(@Inject(Masonry) public masonry,
                private dashService: DashService,
                decisionService: DecisionService,
                auth: AuthService,
                unitsService: UnitLoadService,
                public dialog: MatDialog,
                private router: Router) {
        this.auth = auth;
        this.$user = auth.user;
        this.unitsService = unitsService;
        this.decisionService = decisionService;
    }

    ngOnInit() {
        this.closeSidebar();
        this.properties = [{name: 'All', sheetName: ''}, ...this.unitsService.properties];
        this.$user.subscribe(user => {
            this.user = user;
            const now = new Date().getTime();
            this.cutoff3M = new Date(now - (30 * 24 * 60 * 60 * 1000));
            this.cutoff6M = new Date(now - (90 * 24 * 60 * 60 * 1000));
            this.decisionService.getDecisionStream().subscribe(
                result => {
                    this.decisions = result;
                    this.anniDecisions = this.decisions.filter(d => {
                        // console.log('Decision - ' + d.content + ': createdAt - ' + d.createdAt);
                        let dDate = new Date();
                        if (d.createdAt) {
                            dDate = (d.createdAt as Timestamp).toDate();
                        }
                        if (dDate < this.cutoff3M && !d.threeMonthResult) {
                            return true;
                        } else {
                            return dDate < this.cutoff6M && !d.sixMonthResult;
                        }
                    });
                    this.filteredDecisions = this.filterByUser(user);
                    this.initMasonryLayout();
                    if (!this.decisionService.reviewing && this.decisionService.hasReviews) {
                        this.router.navigate(['decisions/decision-review']);
                    }
                });
        });
    }
    ngAfterViewInit() {
    }
    showAnniversaries() {
        this.router.navigate(['decisions/decision-review']);
    }
    initMasonryLayout() {
        setTimeout(() => {
            this.masonryInstance = new this.masonry(this.grid.nativeElement, this.masonryOptions);
        }, 700);
    }
    layout() {
        console.log('Layout');
        this.masonryInstance.layout();
    }

    ngOnDestroy() {
        this.masonryInstance.destroy();
    }

    closeSidebar() {
        this.dashService.closeSidebar.emit();
    }

    onSelectProperty(propertySheetName: string) {
        this.propertySelected = propertySheetName;
        this.filteredDecisions = this.filterDecisions(propertySheetName);
        this.initMasonryLayout();
        console.log('this.filteredDecisions' + this.filteredDecisions);
    }

    filterDecisions(propertySheetName) {
        console.log('filterDecisions: propertySheetName: ' + propertySheetName);
        if (propertySheetName === '') {
            return this.decisions;
        } else {
            for (let i = 0; i < this.properties.length; i++) {
                console.log('filterDecisions: , match for properties[i].sheetName: '
                    + this.properties[i].sheetName + ' -> sheetName: ' + propertySheetName);
                console.log('is it a match?  ' + (this.properties[i].sheetName === propertySheetName));
                if (this.properties[i].sheetName === propertySheetName) {
                    console.log('filterDecisions:found matching sheetName, matching results for email: ' + this.properties[i].email);
                    return this.decisions.filter(d => d.email === this.properties[i].email);
                }
            }
        }
    }

    filterByUser(user) {
        if (user.isEditor) {
            return this.decisions;
        } else {
            return this.decisions.filter(d => d.email === user.email);
        }
    }
    openDialog(decision): void {
        const dialogRef = this.dialog.open(DecisionDialogComponent, {
            width: '450px',
            data: decision
        });

        dialogRef.afterClosed().subscribe(d => {
            console.log('The dialog was closed');
            if (d) {
                this.decisionService.setDecision(d)
                    .then(function () {
                        console.log('Updated decision success');
                    }).catch(function (error) {
                    console.log('Updating decision error: ', error);
                });
            }
        });
    }
    openAnniversaryDialog(): void {
        const dialogRef = this.dialog.open(DecisionAnniversaryDialogComponent, {
            width: '85vw',
            data: this.anniDecisions
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.decisionService.reviewing = false;
        });
    }
}

@Component({
    selector: 'app-decision-anniversary-dialog',
    templateUrl: './app-decision-anniversary-dialog.html',
    styleUrls: ['./decision-dash.component.scss']
})
export class DecisionAnniversaryDialogComponent implements OnInit {
    decisionService: DecisionService;
    decisionsToSave: DecisionId[];
    totalDecisions = 0;
    currentCount = 0;
    lastDecision = false;
    saving = false;
    editDecisionGroup: FormGroup;
    time = new Date().getTime();

    @ViewChild('contentCtrl') autosize: CdkTextareaAutosize;

    constructor(
        public dialogRef: MatDialogRef<DecisionAnniversaryDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        decisionService: DecisionService,
        private _formBuilder: FormBuilder) {
        console.log('Dialog: ' + data);
        this.decisionService = decisionService;
        this.decisionsToSave = data;
        this.totalDecisions = this.decisionsToSave.length;
        console.log('Dialog: TotalDecisions: ' + this.totalDecisions);
    }

    ngOnInit() {
        this.editDecisionGroup = this._formBuilder.group({
            updatedDecisionCtrl: ['', Validators.required]
        });
        this.decisionService.reviewing = true;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onNextClick(): void {
        this.saving = true;
        const decision = this.decisionsToSave[this.currentCount];

        const cutoff3M = new Date(this.time - (6 * 24 * 60 * 60 * 1000));
        const decisionDate = (decision.createdAt as Timestamp).toDate();
        if (decisionDate < cutoff3M && !decision.threeMonthResult) {
            decision.threeMonthResult = this.editDecisionGroup.value.updatedDecisionCtrl;
        } else {
            decision.sixMonthResult = this.editDecisionGroup.value.updatedDecisionCtrl;
        }
        this.saveDecision(decision);
        this.currentCount++;
        if (this.currentCount === this.decisionsToSave.length - 1) {
            this.lastDecision = true;
        }
        this.editDecisionGroup.reset();
        this.saving = false;
    }

    onBackClick(): void {
        this.currentCount--;
        this.lastDecision = false;
    }

    onOkClick(): void {
        this.dialogRef.close();
    }

    saveDecision(decision) {
        console.log('Saving Decision: threeMonthResults = ' + decision.threeMonthResults);
        const self = this;
        this.decisionService.setDecision(decision)
            .then(function () {
                console.log('Updated decision success');
                self.saving = false;
                if (self.lastDecision) {
                    self.dialogRef.close();
                }
            }).catch(function (error) {
            console.log('Updating decision error: ', error);
            self.saving = false;
        });
    }
}


@Component({
    selector: 'app-decision-dialog',
    templateUrl: 'decision-dialog.component.html',
    styleUrls: ['./decision-dash.component.scss']
})
export class DecisionDialogComponent implements OnInit {
    onRatingClickResult: ClickEvent;
    onHoverRatingChangeResult: HoverRatingChangeEvent;
    onRatingChangeResult: RatingChangeEvent;
    changeMade = false;
    decisionService: DecisionService;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        public dialogRef: MatDialogRef<DecisionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        decisionService: DecisionService) {
        this.decisionService = decisionService;
        dialogRef.disableClose = false;
    }
    ngOnInit() {
        if (this.data.createdAt) {
            this.createdAt = (this.data.createdAt as Timestamp).toDate();
        } else {
            this.createdAt = new Date();
        }
        if (this.data.updatedAt) {
            this.updatedAt = (this.data.updatedAt as Timestamp).toDate();
        }
    }

    onDoneClick(): void {
        if (this.changeMade) {
            console.log('Change was made, saving');
            this.dialogRef.close(this.data);
        } else {
            console.log('No change was made, saving');
            this.dialogRef.close();
        }
    }
    onNoClick(): void {
        this.dialogRef.close();
    }

    onRatingClick($event: ClickEvent) {
        console.log('onClick $event: ', $event);
        this.onRatingClickResult = $event;
        this.data.rating = $event.rating;
        this.changeMade = true;
    }

    onRatingChange($event: RatingChangeEvent) {
        // console.log('onRatingUpdated $event: ', $event);
        this.onRatingChangeResult = $event;
    }

    onHoverRatingChange($event: HoverRatingChangeEvent) {
        // console.log('onHoverRatingChange $event: ', $event);
        this.onHoverRatingChangeResult = $event;
    }

    onDecisionChange() {
        this.changeMade = true;
    }

    onDeleteClick(): void {
        this.decisionService
            .deleteDecision(this.data)
            .then(function () {
                console.log('decision deleted');
            });
        this.dialogRef.close();
    }
}

