import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppscriptService } from '../services/appscript.service';
import { AuthService } from '../services/auth.service';
import { UnitLoadService } from '../services/unit-load.service';
import { PapaParseService } from 'ngx-papaparse';
import { MatStepper } from '@angular/material';
import { SlideInOutAnimation } from '../animations';
import { CdkStep } from '@angular/cdk/stepper';

@Component({
  selector: 'app-thank-you-visits',
  templateUrl: './thank-you-visits.component.html',
  styleUrls: ['./thank-you-visits.component.scss'],
  animations: [SlideInOutAnimation]
})
export class ThankYouVisitsComponent implements OnInit {
  animationState = 'out';
  properties: Array<any>;
  units: string;
  parsedUnits;
  unitSelected = null;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  sixthFormGroup: FormGroup;
  seventhFormGroup: FormGroup;
  someoneHome = false;
  weEntered = false;
  fireExtinguisherPresent = false;
  fireExtinguisherUnderSink = false;
  hasLeaks = false;
  doorSecure = false;
  smokeAlarmMissing = false;
  hasAirFilter = false;
  hasAirFilterDate = false;
  someoneHomeState  = 'out';
  weEnteredState = 'out';
  fireExtinguisherState = 'out';
  extinguisherLocationState = 'out';
  leaksLocationState = 'out';
  doorSecurityState = 'out';
  smokeAlarmMissingState = 'out';
  airFilterState = 'out';
  airFilterDateState = 'out';
  visit: Visit = {
    someoneHome: false,
    weEntered: false,
    fireExtinguisherPresent: false,
    fireExtinguisherUnderSink: false,
    hasLeaks: false, doorSecure: false,
    smokeAlarmMissing: false,
    hasAirFilter: false,
    hasAirFilterDate: false,
    extinguisherFull: false,
    hasSticker: false,
    inspectorName: '',
    unit: {},
    property: '',
    customerName: '',
    customerContact: '',
    noEntryReason: '',
    extinguisherLocation: '',
    leakLocations: '',
    doorSecureMissing: '',
    smokeAlarmMissingLocations: '',
    airFilterDate: ''
  };

  values: Array<any>;
  private auth: AuthService;
  @ViewChild('checkelement') checkList: ElementRef;
  @ViewChild('stepper') myStepper: MatStepper;
  @ViewChild('step1') myStep1: CdkStep;
  @ViewChild('step2') myStep2: CdkStep;
  @ViewChild('step3') myStep3: CdkStep;
  @ViewChild('step4') myStep4: CdkStep;
  @ViewChild('step5') myStep5: CdkStep;
  @ViewChild('step6') myStep6: CdkStep;
  @ViewChild('step7') myStep7: CdkStep;
  constructor( private _formBuilder: FormBuilder,
               private appsScriptService: AppscriptService, auth: AuthService,
               private unitsService: UnitLoadService,
               private papa: PapaParseService) {
    this.auth = auth;
    this.properties = [...this.unitsService.properties];
  }
  processTYVisit() {
    this.visit = {
      'someoneHome': this.someoneHome,
      'weEntered': this.weEntered,
      'fireExtinguisherPresent': this.fireExtinguisherPresent,
      'fireExtinguisherUnderSink': this.fireExtinguisherUnderSink,
      'hasLeaks': this.hasLeaks,
      'doorSecure': this.doorSecure,
      'smokeAlarmMissing': this.smokeAlarmMissing,
      'hasAirFilter': this.hasAirFilter,
      'hasAirFilterDate': this.hasAirFilterDate,
      'extinguisherFull': (this.thirdFormGroup.value.extinguisherFullCtrl === 1),
      'hasSticker': (this.thirdFormGroup.value.stickerPresentCtrl === 1),
      'inspectorName': this.firstFormGroup.value.nameCtrl,
      'unit': this.unitSelected,
      'property': this.firstFormGroup.value.propertyCtrl,
      'customerName': this.secondFormGroup.value.customerNameCtrl,
      'customerContact': this.secondFormGroup.value.customerContactCtrl,
      'noEntryReason': this.secondFormGroup.value.noEntryReasonCtrl,
      'extinguisherLocation': this.thirdFormGroup.value.extinguisherLocationCtrl,
      'leakLocations': this.thirdFormGroup.value.leaksLocationCtrl,
      'doorSecureMissing': this.thirdFormGroup.value.doorSecureMissingCtrl,
      'smokeAlarmMissingLocations': this.thirdFormGroup.value.smokeAlarmMissingCtrl,
      'airFilterDate': this.fourthFormGroup.value.airFilterDateCtrl
    };
  }
  onSubmit() {
    this.appsScriptService.executeGApps_TYVisit(this.visit).subscribe(result => {
      console.log('directory.component.ts => Apps Script Execution API success, result:' + result);
    }, error => console.log('directory.component.ts => Apps Script Execution API error: ' + error));
  }
  setPropertySelected(property) {
    this.unitsService.get(property.value).subscribe(res => {
        this.units = res;
        this.papa.parse(this.units, {
          header: true,
          complete: (results, file) => {
            this.parsedUnits = results.data;
            this.firstFormGroup.controls.unitCtrl.enable();
          }
        });
      }, error => console.log('There was an error loading the units data: ' + error +  ', JSON error: ' + JSON.stringify(error))
      , () => {
      });
  }
  setUnitSelected(event) {
    const selectedIndex = this.parsedUnits.findIndex(x => x.unitName === event.value);
    this.unitSelected = this.parsedUnits[selectedIndex];
  }
  someoneHomeCtrlChange(event) {
    console.log('someoneHomeCtrlChange, event.value = ' + event.value);
    if (event.value === '1') {
      this.someoneHome = true;
      this.someoneHomeState = 'in';
      this.enableSubControl(this.secondFormGroup.controls.customerNameCtrl, true);
      this.enableSubControl(this.secondFormGroup.controls.customerContactCtrl, true);
    } else {
      this.someoneHome = false;
      this.someoneHomeState = 'out';
      this.enableSubControl(this.secondFormGroup.controls.customerNameCtrl, false);
      this.enableSubControl(this.secondFormGroup.controls.customerContactCtrl, false);
    }

  }
  weEnteredCtrlChange(event) {
    if (event.value === '2') {
      this.weEntered = true;
      this.weEnteredState = 'in';
      this.enableSubControl(this.secondFormGroup.controls.noEntryReasonCtrl, true);
    } else {
      this.weEntered = false;
      this.weEnteredState = 'out';
      this.enableSubControl(this.secondFormGroup.controls.noEntryReasonCtrl, false);
    }
  }
  fireExtCtrlChange(event) {
    if (event.value === '1') {
      this.fireExtinguisherState = 'in';
      this.fireExtinguisherPresent = true;
      this.enableSubControl(this.thirdFormGroup.controls.extinguisherUnderSinkCtrl, true);
      this.enableSubControl(this.thirdFormGroup.controls.extinguisherFullCtrl, true);
    } else {
      this.fireExtinguisherState = 'out';
      this.fireExtinguisherPresent = false;
      this.enableSubControl(this.thirdFormGroup.controls.extinguisherUnderSinkCtrl, false);
      this.enableSubControl(this.thirdFormGroup.controls.extinguisherFullCtrl, false);
    }
  }
  fireExtLocationCtrlChange(event) {
    if (event.value === '2') {
      this.extinguisherLocationState = 'in';
      this.fireExtinguisherUnderSink = false;
      this.enableSubControl(this.thirdFormGroup.controls.extinguisherLocationCtrl, true);
    } else {
      this.extinguisherLocationState = 'out';
      this.fireExtinguisherUnderSink = true;
      this.enableSubControl(this.thirdFormGroup.controls.extinguisherLocationCtrl, false);
    }
  }
  leaksCtrlChange(event) {
    if (event.value === '1') {
      this.leaksLocationState = 'in';
      this.hasLeaks = true;
      this.enableSubControl(this.thirdFormGroup.controls.leaksLocationCtrl, true);
    } else {
      this.leaksLocationState = 'out';
      this.hasLeaks = false;
      this.enableSubControl(this.thirdFormGroup.controls.leaksLocationCtrl, false);
    }
  }
  doorSecurityCtrlChange(event) {
    if (event.value === '2') {
      this.doorSecurityState = 'in';
      this.doorSecure = false;
      this.enableSubControl(this.thirdFormGroup.controls.doorSecureMissingCtrl, true);
    } else {
      this.doorSecurityState = 'out';
      this.doorSecure = true;
      this.enableSubControl(this.thirdFormGroup.controls.doorSecureMissingCtrl, false);
    }
  }
  smokeAlarmCtrlChange(event) {
    if (event.value === '2') {
      this.smokeAlarmMissingState = 'in';
      this.smokeAlarmMissing = true;
      this.enableSubControl(this.thirdFormGroup.controls.smokeAlarmMissingCtrl, true);
    } else {
      this.smokeAlarmMissingState = 'out';
      this.smokeAlarmMissing = false;
      this.enableSubControl(this.thirdFormGroup.controls.smokeAlarmMissingCtrl, false);
    }
  }
  airFilterCtrlChange(event) {
    if (event.value === '1') {
      this.airFilterState = 'in';
      this.hasAirFilter = true;
      this.enableSubControl(this.fourthFormGroup.controls.airFilterHasDateCtrl, true);
    } else {
      this.airFilterState = 'out';
      this.hasAirFilter = false;
      this.enableSubControl(this.fourthFormGroup.controls.airFilterHasDateCtrl, false);
    }
  }
  airFilterDateCtrlChange(event) {
    if (event.value === '1') {
      this.airFilterDateState = 'in';
      this.hasAirFilterDate = true;
      this.enableSubControl(this.fourthFormGroup.controls.airFilterDateCtrl, true);
    } else {
      this.airFilterDateState = 'out';
      this.hasAirFilterDate = false;
      this.enableSubControl(this.fourthFormGroup.controls.airFilterDateCtrl, false);
    }
  }

  enableSubControl (ctrlName, enabled) {
    if (enabled) {
      ctrlName.enable();
      ctrlName.setValidators([Validators.required]);
      ctrlName.updateValueAndValidity();
    } else {
      ctrlName.disable();
      ctrlName.setValue('');
      ctrlName.setValidators([]);
      ctrlName.updateValueAndValidity();
    }
  }

  resetAll() {
    this.myStep1.completed = false;
    this.myStep2.completed = false;
    this.myStep3.completed = false;
    this.myStep4.completed = false;
    this.myStep5.completed = false;
    this.myStep6.completed = false;
    this.myStep7.completed = false;
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
    this.fourthFormGroup.reset();
    this.fifthFormGroup.reset();
    this.sixthFormGroup.reset();
    this.seventhFormGroup.reset();
    this.myStepper.selectedIndex = 0;

    this.animationState = 'out';
    this.weEnteredState = 'out';
    this.someoneHomeState = 'out';
    this.units = null;
    this.unitSelected = null;
  }
  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      nameCtrl: ['', Validators.required],
      unitCtrl: [{value: '', disabled: true}, Validators.required],
      propertyCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      someoneHomeCtrl: ['', Validators.required],
      enteredCtrl: ['', Validators.required],
      customerNameCtrl: [{value: '', disabled: true}],
      customerContactCtrl: [{value: '', disabled: true}],
      noEntryReasonCtrl: [{value: '', disabled: true}]
    });
    this.thirdFormGroup = this._formBuilder.group({
      extinguisherPresentCtrl: ['', Validators.required],
      extinguisherUnderSinkCtrl: [{value: '', disabled: true}],
      extinguisherLocationCtrl: [{value: '', disabled: true}],
      extinguisherFullCtrl:  [{value: '', disabled: true}],
      leaksPresentCtrl: ['', Validators.required],
      leaksLocationCtrl:  [{value: '', disabled: true}],
      stickerPresentCtrl: ['', Validators.required],
      doorSecureCtrl: ['', Validators.required],
      doorSecureMissingCtrl:  [{value: '', disabled: true}],
      smokeAlarmCtrl: ['', Validators.required],
      smokeAlarmMissingCtrl:  [{value: '', disabled: true}]
    });
    this.fourthFormGroup = this._formBuilder.group({
      airFilterPresentCtrl: ['', Validators.required],
      airFilterHasDateCtrl: [{value: '', disabled: true}],
      airFilterDateCtrl: [{value: '', disabled: true}],
      extinguisherFullCtrl:  [{value: '', disabled: true}]
    });
    this.fifthFormGroup = this._formBuilder.group({
      additionalCtrl: ['']
    });
    this.sixthFormGroup = this._formBuilder.group({});
    this.seventhFormGroup = this._formBuilder.group( {});
  }
}

interface Visit {
  someoneHome: boolean;
  weEntered: boolean;
  fireExtinguisherPresent: boolean;
  fireExtinguisherUnderSink: boolean;
  hasLeaks: boolean;
  doorSecure: boolean;
  smokeAlarmMissing: boolean;
  hasAirFilter: boolean;
  hasAirFilterDate: boolean;
  extinguisherFull: boolean;
  hasSticker: boolean;
  inspectorName: string;
  unit: {};
  property: string;
  customerName: string;
  customerContact: string;
  noEntryReason: string;
  extinguisherLocation: string;
  leakLocations: string;
  doorSecureMissing: string;
  smokeAlarmMissingLocations: string;
  airFilterDate: string;
}
