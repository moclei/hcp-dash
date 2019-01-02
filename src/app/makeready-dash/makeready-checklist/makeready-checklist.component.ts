import {Component, OnInit, Input, Inject} from '@angular/core';
import {Location} from '@angular/common';
import {Checklist, MakeReady} from '../makeready.model';
import {MakeReadyService} from '../makeready.service';
import {ActivatedRoute, Router} from '@angular/router';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import FieldValue = firebase.firestore.FieldValue;
import {Observable} from 'rxjs/Observable';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SlideInOutAnimation} from '../../animations';
import {MAT_DIALOG_DATA, MatDatepickerInputEvent, MatDialog, MatDialogRef} from '@angular/material';
import {AuthService} from '../../services/auth.service';
import {ClickEvent, HoverRatingChangeEvent, RatingChangeEvent} from 'angular-star-rating';
import {ContractorFirebaseService} from '../../contractor-dash/contractor-firebase.service';
import {Contractor, ContractorId} from '../../contractor-dash/contractor.model';

@Component({
    selector: 'app-makeready-checklist',
    templateUrl: './makeready-checklist.component.html',
    styleUrls: ['./makeready-checklist.component.scss'],
    animations: [SlideInOutAnimation]
})
export class MakereadyChecklistComponent implements OnInit {
    $mr: Observable<MakeReady>;
    mr: MakeReady;
    cl: Checklist;
    id: string;
    loneFormGroup: FormGroup;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    fourthFormGroup: FormGroup;
    fifthFormGroup: FormGroup;
    contractors: Observable<Contractor[]>;
    /*
    controlMaps = {
        'moveOutDate': [
                {'controlName': 'moveOutDateCtrl',
                    'groupName': 'loneFormGroup'}],
                'makeReadyRequested': [
                    {'controlName': 'requestedDateCtrl',
                    'groupName': 'firstFormGroup'}],
                'materialsSubmitted': [
                    {'controlName': 'submittedDateCtrl',
                        'groupName': 'firstFormGroup'}],
                'makeReadyApproved': [
                    {'controlName': 'approvedDateCtrl',
                    'groupName': 'secondFormGroup'}],
                'materialsOrdered': [
                    {'controlName': 'orderedDateCtrl',
                        'groupName': 'secondFormGroup'}],
                'contractorScheduled': [
                    {'controlName': 'scheduledDateCtrl',
                        'groupName': 'thirdFormGroup'},
                    {'controlName': 'contractorNameCtrl',
                        'groupName': 'thirdFormGroup'}],
                'materialsDelivered': [
                    {'controlName': 'deliveredDateCtrl',
                        'groupName': 'fourthFormGroup'}],
                'contractorStarted': [
                    {'controlName': 'startedDateCtrl',
                        'groupName': 'fourthFormGroup'}],
                'contractorFinished': [
                    {'controlName': 'finishedDateCtrl',
                        'groupName': 'fifthFormGroup'}],
                'invoiceSubmitted': [
                    {'controlName': 'approvedDateCtrl',
                        'groupName': 'fifthFormGroup'}],
                'invoicePaid': [
                    {'controlName': 'approvedDateCtrl',
                        'groupName': 'fifthFormGroup'}]
            };
    */
    constructor(private route: ActivatedRoute,
                private makereadyService: MakeReadyService,
                private location: Location,
                private contractorService: ContractorFirebaseService,
                private _formBuilder: FormBuilder,
                private router: Router,
                public dialog: MatDialog) {
    }
    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');
        this.$mr = this.makereadyService.getMakeReady(this.id);
        this.contractors = this.contractorService.getContractors();
        this.loneFormGroup = this._formBuilder.group({
            moveOutDateCtrl: ['', Validators.required],
        });
        this.firstFormGroup = this._formBuilder.group({
            requestedCtrl: ['', Validators.required],
            submittedCtrl: ['' , Validators.required],
            requestedDateCtrl: ['' , Validators.required],
        });
        this.secondFormGroup = this._formBuilder.group({
            approvedCtrl: ['' , Validators.required],
            orderedCtrl: ['' , Validators.required],
            orderedDateCtrl: ['' , Validators.required]
        });
        this.thirdFormGroup = this._formBuilder.group({
            scheduledCtrl: ['', Validators.required],
            scheduledDateCtrl: ['' , Validators.required],
            contractorNameCtrl: ['' , Validators.required]
        });
        this.fourthFormGroup = this._formBuilder.group({
            deliveredCtrl: ['', Validators.required],
            startedCtrl: ['' , Validators.required],
            startedDateCtrl: ['' , Validators.required],
        });
        this.fifthFormGroup = this._formBuilder.group({
            finishedCtrl: ['', Validators.required],
            invoiceSubmittedCtrl: ['' , Validators.required],
            invoicePaidCtrl: ['' , Validators.required],
            finishedDateCtrl: ['', Validators.required],
        });
        this.$mr.subscribe(mr => {
            this.mr = mr;
            this.cl = mr.checklist;
            if (this.cl) {
                if (this.mr.moveOutDate) {
                    const mOutDate = (this.mr.moveOutDate as Timestamp).toDate();
                    this.loneFormGroup.get('moveOutDateCtrl').patchValue(mOutDate);
                }
                this.firstFormGroup.get('requestedCtrl').patchValue(this.cl.makeReadyRequested);
                if (this.cl.makeReadyRequestedDate) {
                    const mrReqDate = (this.cl.makeReadyRequestedDate as Timestamp).toDate();
                    // console.log('setting requestedDate to: ' + this.cl.makeReadyRequestedDate);
                    this.firstFormGroup.get('requestedDateCtrl').patchValue(mrReqDate);
                }
                this.firstFormGroup.get('submittedCtrl').patchValue(this.cl.materialsSubmitted);
                this.secondFormGroup.get('approvedCtrl').patchValue(this.cl.makeReadyApproved);
                this.secondFormGroup.get('orderedCtrl').patchValue(this.cl.materialsOrdered);
                if (this.cl.materialsOrderedDate) {
                    const thisDate = (this.cl.materialsOrderedDate as Timestamp).toDate();
                    this.secondFormGroup.get('orderedDateCtrl').patchValue(thisDate);
                }
                this.thirdFormGroup.get('scheduledCtrl').patchValue(this.cl.contractorScheduled);
                if (this.cl.contractorScheduledDate) {
                    const thisDate = (this.cl.contractorScheduledDate as Timestamp).toDate();
                    this.thirdFormGroup.get('scheduledDateCtrl').patchValue(thisDate);
                }
                if (this.cl.contractorName) {
                    this.contractorService.getContractorByName(this.cl.contractorName).subscribe( c => {
                        if (c[0]) {
                            console.log('patching contractor name to: ' + c[0].name);
                            this.thirdFormGroup.get('contractorNameCtrl').patchValue(c[0].name);
                        }
                    });
                }
                this.fourthFormGroup.get('deliveredCtrl').patchValue(this.cl.materialsDelivered);
                this.fourthFormGroup.get('startedCtrl').patchValue(this.cl.contractorStarted);
                if (this.cl.contractorStartedDate) {
                    const thisDate = (this.cl.contractorStartedDate as Timestamp).toDate();
                    this.fourthFormGroup.get('startedDateCtrl').patchValue(thisDate);
                }
                this.fifthFormGroup.get('finishedCtrl').patchValue(this.cl.contractorFinished);
                if (this.cl.contractorFinishedDate) {
                    const thisDate = (this.cl.contractorFinishedDate as Timestamp).toDate();
                    this.fifthFormGroup.get('finishedDateCtrl').patchValue(thisDate);
                }
                this.fifthFormGroup.get('invoiceSubmittedCtrl').patchValue(this.cl.invoiceSubmitted);
                this.fifthFormGroup.get('invoicePaidCtrl').patchValue(this.cl.invoicePaid);
            }
        });
    }
    onCheckboxChange(isChecked: boolean, which: string) {
        console.log('makeready-table. ' + this.mr.unit.unitName + ' ' + which + ': ' + isChecked);
        if (!this.mr.checklist) {
            console.log('No checklist. Creating one: ');
            this.mr.checklist = {
                'makeReadyRequested': false,
                'materialsSubmitted': false,
                'makeReadyApproved': false,
                'materialsOrdered': false,
                'contractorScheduled': false,
                'contractorName': '',
                'materialsDelivered': false,
                'contractorStarted': false,
                'contractorFinished': false,
                'invoiceSubmitted': false,
                'invoicePaid': false,
            };
        }
        this.mr.checklist[which] = isChecked;
        // this.mr.checklist[which + 'Date'] = this.makereadyService.timestamp;
        this.makereadyService.setMakeReady(this.mr, this.id).then(msg => {
            console.log('onCheckboxChange, make ready saved ');
        });
    }
    onDateInput(which: string, event: MatDatepickerInputEvent<Date>) {
        console.log('makeready-checklist date-input: '  + which + ', date: ' + event.value);
        if (which === 'moveOutDate') {
            // @ts-ignore
            this.mr.moveOutDate = new Timestamp.fromDate(event.value);
        } else {
            this.mr.checklist[which] = event.value;
        }
        this.makereadyService.setMakeReady(this.mr, this.id).then(msg => {
            console.log('onStepChange, saving mr: ' + msg);
        });
    }
    onNameInput(event) {
        // console.log('contractorNameChange: event.source' + event.source.value.name);
        const name = event.source.value;
        this.mr.checklist.contractorName = name;
        this.mr.contracts[0].contractor = name;
        this.makereadyService.setMakeReady(this.mr, this.id).then(msg => {
            console.log('onNameInput, saving mr: ' + msg);
        });
    }
    goBack(): void {
        this.location.back();
    }
    asTimeStamp(val: FieldValue): Timestamp {
        if (val) {
            return val as Timestamp;
        } else {
            return null;
        }
    }
    reviewDialog(mr): void {
        // console.log('open removeDialog(element) ');
        const dialogPos = {top: '10vh'};
        const dialogRef = this.dialog.open(MakeReadyChecklistDialogComponent, {
            width: '450px',
            data: {'mr': mr, 'id': this.id, 'contractors': this.contractors},
            position: dialogPos
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.goBack();
            }
            // console.log('The dialog was closed, result: ' + result);
        });
    }
    newContractorDialog(): void {
            this.router.navigate(['./contractor-add/']);
            /*// console.log('open removeDialog(element) ');
        const dialogPos = {top: '10vh'};
        const dialogRef = this.dialog.open(NewContractorDialogComponent, {
            width: '450px',
            // data: mr,
            position: dialogPos
        });
        dialogRef.afterClosed().subscribe(result => {
            // this.goBack();
            // console.log('The dialog was closed, result: ' + result);
        });
    */
    }
}


@Component({
    selector: 'app-makeready-checklist-dialog',
    templateUrl: 'makeready-checklist-dialog.component.html',
    styleUrls: ['makeready-checklist-dialog.component.scss'],
    animations: [SlideInOutAnimation]
})
export class MakeReadyChecklistDialogComponent implements OnInit {
    private makereadyService: MakeReadyService;
    auth: AuthService;
    reviewComment: string;
    ratingMessages = ['This was a very poor quality job, unfinished and definitely will not use this contractor again.',
        'Work was done but I had to come back multiple times and in the end the apartment does not look nice. Do not use contractor again.',
        'Work was done but I had to come back multiple times. I might use the contractor again but will be careful with checking them',
        'The apartment looks nice and the contractor was good to work with',
        'The apartment was excellent. Contractor went above and beyond. I want to keep this contractor!'];
    hoverRating: number;
    onRatingClickResult: ClickEvent;
    onHoverRatingChangeResult: HoverRatingChangeEvent;
    onRatingChangeResult: RatingChangeEvent;
    contractors: Observable<ContractorId[]>;
    formGroup: FormGroup;
    selectedContractor: ContractorId;
    isRated = false;
    constructor(
        public dialogRef: MatDialogRef<MakeReadyChecklistDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        makereadyService: MakeReadyService,
        private contractorService: ContractorFirebaseService,
        auth: AuthService) {
        this.makereadyService = makereadyService;
        this.auth = auth;
        this.reviewComment = '';
        // this.contractors = this.contractorService.getContractors();
    }
    onRemoveHandler() {
        // this.data.mr.removedAt = this.makereadyService.date_created;
        // this.data.mr.removed = true;
        this.data.mr.review.reviewComment = this.ratingMessages[this.data.mr.review.rating - 1] + ' --- ' + this.reviewComment;
        // console.log('[RemoveHandler] removing mr: ' + JSON.stringify(this.data.mr));
        this.selectedContractor.numReviews = this.selectedContractor.numReviews + 1;
        this.selectedContractor.totalScore = this.selectedContractor.totalScore + this.data.mr.review.rating;
        if (this.data.mr.review.rating  < 2){
            this.selectedContractor.status = 'Bad';
        } else {
            this.selectedContractor.status = 'Active';
        }
        this.contractorService.setContractor(this.selectedContractor).then(() => {
            console.log('[RemoveHandler]: set contractor success');
            this.makereadyService.setMakeReady(this.data.mr, this.data.id).then(() => {
                // console.log('removedReason: ' + this.removedReason);
                this.dialogRef.close(true);
            });
        });
    }
    onRatingClick($event: ClickEvent) {
        console.log('onClick $event: ', $event);
        this.onRatingClickResult = $event;
        // this.data.mr.rating = $event.rating;
        this.data.mr.review = {
            'rating': $event.rating,
            'reviewComment': this.ratingMessages[$event.rating - 1] + ' --- ' + this.reviewComment,
            'contractorId': this.selectedContractor.id,
            'includeInTotal': true
        };
        this.hoverRating = $event.rating;
        this.isRated = true;
    }

    onRatingChange($event: RatingChangeEvent) {
        console.log('onRatingUpdated $event: ', $event);
        this.onRatingChangeResult = $event;
    }

    onHoverRatingChange($event: HoverRatingChangeEvent) {
        console.log('onHoverRatingChange $event: ', $event);
        this.onHoverRatingChangeResult = $event;
        if ($event.hoverRating !== 0) {
            this.hoverRating = $event.hoverRating;
        }
    }
    onNoClick(): void {
        console.log('On Cancel Click');
        this.dialogRef.close();
    }
    ngOnInit() {
        this.formGroup = this._formBuilder.group({
            contractorNameCtrl: ['', Validators.required],
        });
        this.contractors = this.contractorService.getContractors();
        console.log('[CHECKLIST-DIALOG] this.data.mr.checklist? ' + JSON.stringify(this.data.mr.checklist));
        if (this.data.mr.checklist && this.data.mr.checklist.contractorName) {
            this.contractorService.getContractorByName(this.data.mr.checklist.contractorName).subscribe( c => {
                if (c[0]) {
                    this.selectedContractor = c[0];
                    console.log('[CHECKLIST-DIALOG] Patching contractor name to: ' + c[0].name);
                    this.formGroup.get('contractorNameCtrl').patchValue(c[0].name);
                }
            });
        }
    }
}

