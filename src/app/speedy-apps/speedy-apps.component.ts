import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppscriptService} from '../services/appscript.service';
import {AuthService, User} from '../services/auth.service';
import {UnitLoadService} from '../services/unit-load.service';
import {PapaParseService} from 'ngx-papaparse';
import {MatStepper} from '@angular/material';
import {SlideInOutAnimation} from '../animations';
import {CdkStep} from '@angular/cdk/stepper';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable} from 'rxjs';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {SpeedyApp, Unit} from './speedyapp.model';

/**
 * @title Stepper overview
 */
@Component({
    selector: 'app-speedy-apps',
    templateUrl: './speedy-apps.component.html',
    styleUrls: ['./speedy-apps.component.scss'],
    animations: [SlideInOutAnimation]
})

export class SpeedyAppsComponent implements OnInit {
    @ViewChild('stepper') myStepper: MatStepper;
    @ViewChild('basicsStep') basicsStep: CdkStep;
    @ViewChild('incomeStep') incomeStep: CdkStep;
    @ViewChild('employmentStep') employmentStep: CdkStep;
    @ViewChild('rentalStep') rentalStep: CdkStep;
    @ViewChild('legalStep') legalStep: CdkStep;
    @ViewChild('resultStep') resultStep: CdkStep;
    @ViewChild('scopeOfWorkCtrl') autosize: CdkTextareaAutosize;
    auth: AuthService;
    $user: Observable<User>;
    user: User;
    private itemsCollection: AngularFirestoreCollection<SpeedyApp>;
    items: Observable<SpeedyApp[]>;
    properties: Array<any>;
    speedyApp: SpeedyApp;
    basicsFormGroup: FormGroup;
    incomeFormGroup: FormGroup;
    employmentFormGroup: FormGroup;
    rentalFormGroup: FormGroup;
    legalFormGroup: FormGroup;
    resultFormGroup: FormGroup;
    values: Array<any>;
    units: string;
    parsedUnits;
    unitSelected = null;
    propertySelected = null;
    processing = false;
    submitted = false;
    approved = false;
    isAppeal = false;
    fullDeposit = false;
    incomeRatio = -1;
    fullDepositState = 'out';
    appealState = 'out';

    constructor(private _formBuilder: FormBuilder,
                private appsScriptService: AppscriptService,
                auth: AuthService,
                private unitsService: UnitLoadService,
                private papa: PapaParseService,
                private ngZone: NgZone,
                afs: AngularFirestore) {
        this.auth = auth;
        this.$user = auth.user;
        this.properties = [...unitsService.properties];
        this.itemsCollection = afs.collection<SpeedyApp>('speedyapps');
        this.items = this.itemsCollection.valueChanges();
    }
    ngOnInit() {
        this.$user.subscribe(user => {
            this.user = user;
            this.setPropertyDropdownInitial(this.user.email);
            if (this.user.email) {
                for (let i = 0; i < this.properties.length; i++) {
                    if (this.properties[i].email === this.user.email) {
                        this.basicsFormGroup.patchValue({
                            'propertyCtrl': this.properties[i].email
                        });
                        this.setPropertySelected({value: this.properties[i].name});
                    }
                }
            }
            this.speedyApp = {
                'timestamp': new Date(),
                'email': this.user.email,
                'approved': false
            };
        });
        this.basicsFormGroup = this._formBuilder.group({
            nameCtrl: ['', Validators.required],
            unitCtrl: [{value: '', disabled: true}, Validators.required],
            propertyCtrl: ['', Validators.required],
            customerNameCtrl: ['', Validators.required]
        });
        this.incomeFormGroup = this._formBuilder.group({
            rentCtrl: ['', Validators.required],
            incomeCtrl: ['', Validators.required]
        });
        this.employmentFormGroup = this._formBuilder.group({
            employmentCtrl: ['', Validators.required],
            fullDepositCtrl: [{value: '', disabled: true}, Validators.required]
        });
        this.rentalFormGroup = this._formBuilder.group({
            rentalCtrl: ['', Validators.required]
        });
        this.legalFormGroup = this._formBuilder.group({
            legalCtrl: ['', Validators.required],
            appealCtrl: [{value: '', disabled: true}, Validators.required]
        });
        this.resultFormGroup = this._formBuilder.group({});
    }
    setPropertyDropdownInitial(currentUser) {
        for (let i = 0; i < this.properties.length; i++) {
            if (this.properties[i].email === currentUser) {
                this.basicsFormGroup.patchValue({
                    'propertyCtrl': this.properties[i].sheetName
                });
                this.setPropertySelected({value: this.properties[i].sheetName});
            }
        }
    }
    setPropertySelected(property) {
        console.log('setProperty: ' + property.value);
        this.propertySelected = property.value;
        this.speedyApp.propertyName = this.propertySelected;
        this.unitsService.get(property.value).subscribe(res => {
                this.units = res;
                // console.log('received units: ' + res);
                this.papa.parse(this.units, {
                    header: true,
                    complete: (results, file) => {
                        console.log('Parsed: ', results.data);
                        this.parsedUnits = results.data;
                        this.basicsFormGroup.controls.unitCtrl.enable();
                    }
                });
            }, error => console.log('There was an error loading the units data: ' + error + ', JSON error: ' + JSON.stringify(error))
            , () => {
            });
    }
    setUnitSelected(event) {
        console.log('setting Unit Selected: ' + event.value);
        const selectedIndex = this.parsedUnits.findIndex(x => x.unitName === event.value);
        console.log('unitName ' + this.parsedUnits[selectedIndex].unitName + ', bedrooms: ' + this.parsedUnits[selectedIndex].Bedrooms);
        const unit = this.parsedUnits[selectedIndex];
        let legalName = '';
        let county = '';
        let businessName = '';
        for (let i = 0; i < this.properties.length; i++) {
            if (this.properties[i].name === this.propertySelected) {
                legalName = this.properties[i].legalName;
                county = this.properties[i].county;
                businessName = this.properties[i].businessName;
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
        this.speedyApp.unit = this.unitSelected;
    }
    processApproval() {
        if (this.incomeRatio > 2.5) {
            if (this.speedyApp.employment || this.fullDeposit) {
                if (this.speedyApp.rental) {
                    this.approved = this.speedyApp.legal || this.isAppeal;
                } else {
                    this.approved = false;
                }
            } else {
                this.approved = false;
            }
        }
        console.log('speedyApp: ' + JSON.stringify(this.speedyApp));
    }
    onSubmit() {
        this.processing = true;
        const expirationTime = this.user.expirationTime;
        const nowTime = new Date().getTime();
        this.speedyApp.isAppeal = this.isAppeal;
        this.speedyApp.approved = this.approved;
        this.speedyApp.fullDeposit = this.fullDeposit;
        if (nowTime >= expirationTime) {
            this.auth.googleLogin(null).then(result => {
                this.auth.user.subscribe(user => {
                    this.user = user;
                    this.sendSpeedyApproval(user.accessToken);
                });
            });
        } else {
            this.sendSpeedyApproval(this.user.accessToken);
        }
    }
    sendSpeedyApproval(accessToken) {
        this.appsScriptService.executeNewSpeedyApproval(this.speedyApp, accessToken).subscribe(result => {
            this.processing = false;
            this.submitted = true;
            this.addSpeedyApp(this.speedyApp);
        }, error => {
            console.log('speedy-approval.component.ts => Apps Script Execution API error: ' + error);
            this.processing = false;
        });
    }
    enableFollowOn(event, section) {
        let myCtrl = null;
        const checked = event.value === 'No';
        switch (section) {
            case 'fullDeposit': {
                this.fullDepositState = checked ? 'in' : 'out';
                myCtrl = this.employmentFormGroup.controls.fullDepositCtrl;
                this.speedyApp.employment = !checked;
                break;
            }
            case 'appeal': {
                this.appealState = checked ? 'in' : 'out';
                myCtrl = this.legalFormGroup.controls.appealCtrl;
                this.speedyApp.legal = !checked;
                if (event.value === 'Yes') {
                    this.isAppeal = false;
                }
                break;
            }
        }
        if (checked) {
            myCtrl.enable();
            myCtrl.setValidators([Validators.required]);
            myCtrl.updateValueAndValidity();
        } else {
            myCtrl.disable();
            myCtrl.setValue('');
            myCtrl.setValidators([]);
            myCtrl.updateValueAndValidity();
        }
    }
    reset() {
        this.myStepper.reset();
        this.unitSelected = null;
        this.propertySelected = null;
        this.processing = false;
        this.submitted = false;
        this.approved = false;
        this.isAppeal = false;
        this.fullDeposit = false;
        this.incomeRatio = -1;
        this.fullDepositState = 'out';
        this.appealState = 'out';
    }
    chooseBasics() {
        this.speedyApp.preparerName = this.basicsFormGroup.value.nameCtrl;
        this.speedyApp.customerName = this.basicsFormGroup.value.customerNameCtrl;
    }
    chooseFullDeposit(event) {
        console.log('chooseFullDeposit: ' + (event.value === 'Yes'));
        this.fullDeposit = event.value === 'Yes';
    }
    chooseRental(event) {
        this.speedyApp.rental = event.value === 'Yes';
    }
    chooseAppeal(event) {
        this.isAppeal = event.value === 'Yes';
    }
    incomeOrRentChangeHandler() {
        this.speedyApp.income = this.incomeFormGroup.value.incomeCtrl;
        this.speedyApp.rent = this.incomeFormGroup.value.rentCtrl;
        if (this.speedyApp.rent && this.speedyApp.income) {
            this.incomeRatio = this.speedyApp.income / this.speedyApp.rent;
        }
    }
    addSpeedyApp(speedyApp: SpeedyApp) {
        const docRef = this.itemsCollection.add(speedyApp);
    }
}
