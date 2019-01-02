import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import FieldValue = firebase.firestore.FieldValue;
import {Observable} from 'rxjs/Observable';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// import {SlideInOutAnimation} from '../../animations';
import {MatDatepickerInputEvent, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Contractor} from '../contractor.model';
import {ContractorFirebaseService} from '../contractor-firebase.service';
import {MakeReady} from '../../makeready-dash/makeready.model';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-contractor-detail',
  templateUrl: './contractor-detail.component.html',
  styleUrls: ['./contractor-detail.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class ContractorDetailComponent implements OnInit {
    $contractor: Observable<Contractor>;
    $jobs: Observable<MakeReady[]>;
    jobs: Array<MakeReady>;
    expandedElement: MakeReady;
    contractor: Contractor;
    id: string;
    loading = false;
    currentJobFG: FormGroup;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    matDataSource: MatTableDataSource<MakeReady>;
    /*
contractor: Contractor;
                            contractorName: string;
                            property: string;
                            unit: Unit;
                            jobType: Array<string>;
                            startDate: Date;
                            endDate: Date;
                            comments: string;
                            rating: number;
                            createdBy: string;
                            updatedAt?: FieldValue;
                            createdAt?: FieldValue;
    * */
    dispColumnsActive = [
        'propertyUnit',
        'jobType',
        'createdAt',
        'startDate',
        'endDate',
        'comments',
        'rating',
        'createdBy'
    ];
    constructor(private route: ActivatedRoute,
                private contractorService: ContractorFirebaseService,
                private location: Location,
                private _formBuilder: FormBuilder) {
    }
    ngOnInit(): void {
        this.loading = true;
        this.id = this.route.snapshot.paramMap.get('id');
        this.$contractor = this.contractorService.getContractor(this.id);
        this.currentJobFG = this._formBuilder.group({
            property: ['', Validators.required],
            unit: ['', Validators.required],
            startDate: '',
            endDate: '',
            jobType: ['', Validators.required],
            rating: [''],
            comments: ['', Validators.required],
        });
        this.$contractor.subscribe(contractor => {
            this.contractor = contractor;
            this.setDataSource(contractor);
            // this.$jobs = this.contractorService.getJobs(contractor);
            /*
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
            */
        });
    }
    updateContractorIds() {
        this.contractorService.modifyMakeReadyContractors();
    }
    modifyContractorNames() {
        this.contractorService.modifyContractorNames();
    }
    setDataSource(contractor: Contractor) {
        this.contractorService.getJobs(contractor).subscribe( jobs => {
            console.log('Getting jobs and setting to table datasource');
            this.loading = false;
            this.jobs = jobs;
            this.matDataSource = new MatTableDataSource(jobs);
            this.matDataSource.paginator = this.paginator;
            this.matDataSource.sort = this.sort;
        });
    }
    onCheckboxChange(isChecked: boolean, which: string) {
        /*
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
        */
    }
    onDateInput(which: string, event: MatDatepickerInputEvent<Date>) {
        /*
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
        */
    }
    onNameInput(event) {
        /*
        this.mr.checklist.contractorName = event.target.value;
        this.mr.contracts[0].contractor = event.target.value;
        this.makereadyService.setMakeReady(this.mr, this.id).then(msg => {
            console.log('onNameInput, saving mr: ' + msg);
        });
        */
    }
    goBack(): void {
        this.location.back();
    }
    editRating(mr: MakeReady) {
    }
    reassignJob(mr: MakeReady) {
    }
    asTimeStamp(val: FieldValue): Timestamp {
        if (val) {
            return val as Timestamp;
        } else {
            return null;
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
