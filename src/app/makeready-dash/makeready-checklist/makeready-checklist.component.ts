import {Component, OnInit, Input} from '@angular/core';
import {Location} from '@angular/common';
import {Checklist, MakeReadyId} from '../makeready.model';
import {MakeReadyService} from '../makeready.service';
import {ActivatedRoute} from '@angular/router';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import FieldValue = firebase.firestore.FieldValue;
import {Observable} from 'rxjs/Observable';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SlideInOutAnimation} from '../../animations';
import {MatDatepickerInputEvent} from '@angular/material';

@Component({
    selector: 'app-makeready-checklist',
    templateUrl: './makeready-checklist.component.html',
    styleUrls: ['./makeready-checklist.component.scss'],
    animations: [SlideInOutAnimation]
})
export class MakereadyChecklistComponent implements OnInit {
    $mr: Observable<MakeReadyId>;
    mr: MakeReadyId;
    cl: Checklist;
    id: string;
    loneFormGroup: FormGroup;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    fourthFormGroup: FormGroup;
    fifthFormGroup: FormGroup;
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
    constructor(private route: ActivatedRoute,
                private makereadyService: MakeReadyService,
                private location: Location,
                private _formBuilder: FormBuilder) {
    }
    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');
        this.$mr = this.makereadyService.getMakeReady(this.id);
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
                    this.thirdFormGroup.get('contractorNameCtrl').patchValue(this.cl.contractorName);
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
        this.mr.checklist.contractorName = event.target.value;
        this.mr.contracts[0].contractor = event.target.value;
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
}
