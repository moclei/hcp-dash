import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppscriptService} from '../../services/appscript.service';
import {AuthService, User} from '../../services/auth.service';
import {UnitLoadService} from '../../services/unit-load.service';
import {PapaParseService} from 'ngx-papaparse';
import {MatCheckbox, MatHorizontalStepper, MatStep, MatStepper, MatStepperModule} from '@angular/material';
import {SlideInOutAnimation} from '../../animations';
import {CdkStepperModule, CdkStep} from '@angular/cdk/stepper';
import {positiveNumberValidator} from '../../positive-number.directive';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Observable, Subscription} from 'rxjs';
import {Contract, Extras, Flooring, MakeReady, Scope} from '../makeready.model';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import {Router} from '@angular/router';
import {MakeReadyService} from '../makeready.service';

/**
 * @title Stepper overview
 */
@Component({
    selector: 'app-makeready-builder',
    templateUrl: './makeready-builder.component.html',
    styleUrls: ['./makeready-builder.component.scss'],
    animations: [SlideInOutAnimation]
})

export class MakereadyBuilderComponent implements OnInit {
    userProfile: Observable<User>;
    user: User;
    processed = false;
    paintType = ['Light touch up', 'Touch up paint', 'Full paint'];
    textureType = ['Light texture coverups', 'Patch texture', 'Full texture'];
    sheetrockType = ['Small sheetrock hole repair(s) (if any)', 'Patch sheetrock hole(s)', 'Repair all sheetrock'];
    tubType = ['', 'Resurface tub, ', ''];
    showerTileType = ['', 'Repair shower tile, ', ''];
    kitchenCounterType = ['', 'Resurface kitchen counter, ', ''];
    properties: Array<any>;
    showerTileScope = 'Remove tile in shower and replace with new tile, ' +
        'grouted and finished to a high standard. Caulked and sealed where needed.' +
        'Remove trash and clean area.  ';
    showerTileTotalPrice = 150;
    graniteInstallBathroomScope = 'Install granite countertops in bathrooms.';
    graniteInstallKitchenScope = 'Install granite countertops in kitchen.';
    granitePrepareScope = 'Prepare countertops for granite, remove existing and clean area.';
    granitePickupScope = 'Pickup granite.';
    graniteTotalScope = '';
    graniteFinalScope = '';
    microwavePrepareScope = 'Demo existing cabinet above stove, make space for shelf, install new shelf with finish to match surrounding cabinets.';
    microwaveInstallScope = 'Install new microwave.';
    microwaveTotalScope = this.microwaveInstallScope;
    microwaveTotalPrice = 50;

    makeReady: MakeReady;
    contract: Contract;
    graniteContract: Contract;
    showerTileContract: Contract;
    microwaveContract: Contract;
    scope: Scope;
    flooring: Flooring;

    GRANITE_INDEX = 1;
    SHOWERTILE_INDEX = 2;
    MICROWAVE_INDEX = 3;

    animationState = 'out';
    carpetReplaceState = 'out';
    carpetShampooState = 'out';
    tileInstallState = 'out';
    tileRepairState = 'out';
    plankInstallState = 'out';
    plankRepairState = 'out';

    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    fourthFormGroup: FormGroup;
    sixthFormGroup: FormGroup;
    lastFormGroup: FormGroup;

    values: Array<any>;
    units: string;
    parsedUnits;
    unitSelected = null;
    propertySelected = null;

    customPriceSelected = false;
    customGraniteSelected = false;
    granitePrep = false;
    granitePick = false;
    customShowerSelected = false;

    processing = false;

    auth: AuthService;
    mrService: MakeReadyService;

    private currencyMask = createNumberMask({
        suffix: '',
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: ',',
        allowDecimal: true,
        decimalSymbol: '.',
        decimalLimit: 2,
        integerLimit: null,
        requireDecimal: false,
        allowNegative: false,
        allowLeadingZeroes: false
    });

    @ViewChild('checkelement') checkList: ElementRef;
    @ViewChild('stepper') myStepper: MatStepper;
    @ViewChild('step1') myStep1: CdkStep;
    @ViewChild('step2') myStep2: CdkStep;
    @ViewChild('step3') myStep3: CdkStep;
    @ViewChild('step4') myStep4: CdkStep;
    @ViewChild('step6') myStep6: CdkStep;
    @ViewChild('stepLAst') myStepLast: CdkStep;
    @ViewChild('scopeOfWorkCtrl') autosize: CdkTextareaAutosize;
    private userAuthorized: boolean;
    private userSubscription: Subscription;

    constructor(private _formBuilder: FormBuilder,
                private appsScriptService: AppscriptService,
                auth: AuthService,
                private unitsService: UnitLoadService,
                private papa: PapaParseService,
                private ngZone: NgZone,
                private router: Router,
                afs: AngularFirestore,
                mrService: MakeReadyService) {
        this.auth = auth;
        this.userProfile = auth.user;
        this.mrService = mrService;
        this.properties = [...unitsService.properties];
    }

    processMrType() {
        this.makeReady = new MakeReady(
            new Date(Date.now()).toLocaleString(),
            this.user.email,
            this.firstFormGroup.value.propertyCtrl,
            this.firstFormGroup.value.nameCtrl,
            this.unitSelected);
        this.scope = this.createScopeOfWork();
        this.contract = this.createContract(this.scope);
        if (this.scope.granite) {
        }
        this.makeReady.setScope(this.scope);
        if (this.scope.granite) {
            this.graniteContract = this.createGraniteContract();
            this.scope.costOfUpgrades += this.graniteContract.price;
        }
        if (this.scope.showerTile) {
            this.showerTileContract = this.createShowerTileContract();
            this.scope.costOfUpgrades += this.showerTileContract.price;
        }
        if (this.scope.microwave) {
            this.microwaveContract = this.createMicrowaveContract();
            this.scope.costOfUpgrades += this.microwaveContract.price;
        }
        this.makeReady.setContracts([this.contract, this.graniteContract, this.showerTileContract, this.microwaveContract]);
        this.processed = true;
    }

    onSubmit() {
        this.contract.price = this.sixthFormGroup.value.priceCtrl;
        this.contract.contractor = this.sixthFormGroup.value.contractorCtrl;
        this.contract.startDate = this.sixthFormGroup.value.startDateCtrl;
        if (this.scope.granite) {
            console.log('Finalizing granite contract');
            console.log('this.graniteContract.price: ' + this.graniteContract.price);
            this.finalizeGraniteContract();
            this.scope.costOfUpgrades += this.graniteContract.price;
        }
        if (this.scope.showerTile) {
            console.log('Finalizing tile contract');
            this.finalizeShowerTileContract();
            this.scope.costOfUpgrades += this.showerTileContract.price;
        }
        if (this.scope.microwave) {
            console.log('Finalizing microwave contract');
            this.finalizeMicrowaveContract();
            this.scope.costOfUpgrades += this.microwaveContract.price;
        }
        this.processing = true;
        const expirationTime = this.user.expirationTime;
        const nowTime = new Date().getTime();
        if (nowTime >= expirationTime) {
            this.auth.googleLogin(null).then(result => {
                this.auth.user.subscribe(user => {
                    this.user = user;
                    this.sendMakeReadyBuilder(user.accessToken);
                });
            });
        } else {
            this.sendMakeReadyBuilder(this.user.accessToken);
        }
    }

    sendMakeReadyBuilder(accessToken: string) {
        this.appsScriptService.executeNewMakeReadyBuilder(this.makeReady, accessToken).subscribe(result => {
            this.processing = false;
            this.mrService.addMakeReady(this.makeReady);
        }, error => {
            {
                this.processing = false;
            }
        });
    }

    createScopeOfWork(): Scope {
        let mrType = 'Light';
        let fullTexture = false;
        let tile = false;
        let baseMReadyRate = 0;
        let finalMReadyRate = 0;
        let suggestedMRPrice = '';
        let baseMRPrice = 0;
        let baseMRPriceStr = '';
        let costOfExtras = 0;

        const granite = (this.thirdFormGroup.value.graniteBathCtrl || this.fourthFormGroup.value.ktCounterCtrl === '3');
        if (this.thirdFormGroup.value.graniteBathCtrl && this.fourthFormGroup.value.ktCounterCtrl === '3') {
            this.graniteTotalScope = this.graniteInstallBathroomScope + ', and ' + this.graniteInstallKitchenScope;
        } else if (this.thirdFormGroup.value.graniteBathCtrl) {
            this.graniteTotalScope = this.graniteInstallBathroomScope;
        } else if (this.fourthFormGroup.value.ktCounterCtrl) {
            this.graniteTotalScope = this.graniteInstallKitchenScope;
        }
        this.graniteFinalScope = this.graniteTotalScope;
        const upgradeShowerTile = (this.thirdFormGroup.value.showerTileCtrl === '3');
        const sheetrockNumber = Number(this.secondFormGroup.value.sheetrockCtrl);
        const textureNumber = Number(this.secondFormGroup.value.textureCtrl);
        const paintNumber = Number(this.secondFormGroup.value.paintCtrl);
        const size = this.unitSelected.size ? this.unitSelected.size : 1;
        const microwave = this.fourthFormGroup.value.installMicrowaveCtrl;

        this.flooring = this.createFlooring();
        const extras = this.createExtras();
        const appliances = this.createApplianceList();

        let mrScore = sheetrockNumber + textureNumber + paintNumber;
        if (mrScore > 4 && mrScore <= 6) {
            mrType = 'Medium';
            baseMReadyRate = 0.25;
        } else if (mrScore > 6) {
            mrType = 'Heavy';
            baseMReadyRate = 0.4;
        }
        finalMReadyRate += baseMReadyRate;
        if (textureNumber === 3) {
            fullTexture = true;
            finalMReadyRate += 0.25;
        }
        let totalPrice = ((baseMRPrice = finalMReadyRate * size) + extras.totalCost);
        totalPrice = Math.round(totalPrice * 100) / 100;
        baseMRPrice = Math.round(baseMRPrice * 100) / 100;
        if (mrScore <= 4) {
            totalPrice = ((baseMRPrice = 65) + extras.totalCost);
        }
        console.log('totalPrice: ' + totalPrice);

        let scopeOfWork = mrType + ' Make Ready, '
            + this.sheetrockType[sheetrockNumber - 1] + ', '
            + this.textureType[textureNumber - 1] + ', '
            + this.paintType[paintNumber - 1] + ', ';
        for (let i = 0; i < extras.extrasAsArray.length; i++) {
            scopeOfWork += extras.extrasAsArray[i].description;
            if (i <= extras.extrasAsArray.length - 1) {
                scopeOfWork += ', ';
            }
        }
        scopeOfWork += this.tubType[Number(this.thirdFormGroup.value.tubCtrl) - 1]
            + (this.thirdFormGroup.value.resurfaceBathCtrl ? 'Resurface bathroom counter, ' : '');
        if (!granite) {
            console.log('!granite');
            scopeOfWork += this.kitchenCounterType[Number(this.fourthFormGroup.value.ktCounterCtrl) - 1];
        }
        if (!upgradeShowerTile) {
            console.log('!upgradeShowerTile. ShowerTileType[' + (Number(this.thirdFormGroup.value.showerTileCtrl) - 1) + ']');
            scopeOfWork += this.showerTileType[Number(this.thirdFormGroup.value.showerTileCtrl) - 1];
        }
        scopeOfWork += 'All repairs needed and full clean.';

        //       + this.showerTileType[Number(this.thirdFormGroup.value.showerTileCtrl) - 1]

        const scope = {
            'scopeDescription': scopeOfWork,
            'flooring': this.flooring,
            'extras': extras,
            'appliances': (appliances.length > 0),
            'applianceList': appliances,
            'granite': granite,
            'graniteFinalPrice': 0,
            'graniteRate': 15,
            'showerTile': upgradeShowerTile,
            'microwave': microwave,
            'mrType': mrType,
            'totalPrice': totalPrice,
            'costOfExtras': extras.totalCost,
            'costOfUpgrades': 0,
            'basePrice': baseMRPrice,
            'baseMReadyRate': baseMReadyRate,
            'finalRate': finalMReadyRate,
            'isFullTexture': fullTexture
        };
        return scope;
    }

    createContract(scope): Contract {
        let contract = <Contract>{};
        contract.contractor = this.sixthFormGroup.value.contractorCtrl;
        contract.startDate = this.sixthFormGroup.value.startDateCtrl ?
            this.sixthFormGroup.value.startDateCtrl.toLocaleDateString() : '';
        let timeToComplete = '5 Days';
        if (scope.mrType === 'Light') {
            timeToComplete = '1 Day';
        } else if (scope.mrType === 'Medium') {
            timeToComplete = '2 Days';
        }
        contract.timeToComplete = timeToComplete;
        contract.poNumber = '                       ';
        contract.scope = scope.scopeDescription;
        contract.type = 'Make Ready';
        contract.price = scope.totalPrice;
        return contract;
    }
    createMicrowaveContract(): Contract {
        let contract = <Contract>{};
        contract.contractor = this.sixthFormGroup.value.microwaveContractorNameCtrl;
        contract.startDate = this.sixthFormGroup.value.microwaveDatePickerCtrl ?
            this.sixthFormGroup.value.microwaveDatePickerCtrl.toLocaleDateString() : '                            ';
        contract.timeToComplete = '1 Day';
        contract.poNumber = '                       ';
        contract.scope = this.microwaveTotalScope;
        contract.type = 'Microwave';
        contract.price = 50;
        return contract;
    }
    finalizeMicrowaveContract() {
        this.microwaveContract.contractor = this.sixthFormGroup.value.microwaveContractorNameCtrl
        this.microwaveContract.startDate = this.sixthFormGroup.value.microwaveDatePickerCtrl ?
            this.sixthFormGroup.value.microwaveDatePickerCtrl.toLocaleDateString() : '                            ';
        this.microwaveContract.scope = this.microwaveTotalScope;
        this.microwaveContract.price = this.sixthFormGroup.value.microwavePriceCtrl;
    }
    createGraniteContract(): Contract {
        const contract = <Contract>{};
        contract.contractor = '';
        contract.startDate = '';
        contract.timeToComplete = '1 Day';
        contract.poNumber = '                       ';
        contract.scope = this.graniteFinalScope;
        contract.price = 0;
        contract.type = 'Granite';
        contract.quantity = 0;
        return contract;
    }
    finalizeGraniteContract() {
        this.graniteContract.contractor = this.sixthFormGroup.value.graniteContractorNameCtrl;
        this.graniteContract.startDate = this.sixthFormGroup.value.graniteDatePickerCtrl ?
            this.sixthFormGroup.value.graniteDatePickerCtrl.toLocaleDateString() : '                            ';
        this.graniteContract.scope = this.graniteFinalScope;
        // this.graniteContract.price = this.sixthFormGroup.value.granitePriceCtrl;
    }
    createShowerTileContract(): Contract {
        let contract = <Contract>{};
        contract.contractor = '';
        contract.startDate = '';
        contract.timeToComplete = '1 Day';
        contract.poNumber = '                       ';
        contract.scope = this.showerTileScope;
        contract.type = 'Shower Tile';
        contract.price = 150;
        return contract;
    }
    finalizeShowerTileContract() {
        this.showerTileContract.contractor = this.sixthFormGroup.value.showerTileContractorNameCtrl;
        this.showerTileContract.startDate = this.sixthFormGroup.value.showerTileDatePickerCtrl ?
            this.sixthFormGroup.value.showerTileDatePickerCtrl.toLocaleDateString() : '                            ';
        this.showerTileContract.scope = this.showerTileScope;
        this.showerTileContract.price = this.sixthFormGroup.value.showerTilePriceCtrl;
    }
    createExtras() {
        const switchesQty = (!this.secondFormGroup.value.switchesQuantityCtrl ? 0 : this.secondFormGroup.value.switchesQuantityCtrl);
        const ceilingFansQty = (!this.secondFormGroup.value.ceilingFansQuantityCtrl?
            0 : this.secondFormGroup.value.ceilingFansQuantityCtrl);
        const blindsQty = (!this.secondFormGroup.value.blindsQuantityCtrl ? 0 : this.secondFormGroup.value.blindsQuantityCtrl);
        const faucetsQty = (!this.secondFormGroup.value.faucetsQuantityCtrl ? 0 : this.secondFormGroup.value.faucetsQuantityCtrl);
        const lightFixturesQty = (!this.secondFormGroup.value.lightFixturesQuantityCtrl ?
            0 : this.secondFormGroup.value.lightFixturesQuantityCtrl);
        const intDoorQty = (!this.secondFormGroup.value.intDoorsQtyCtrl ? 0 : this.secondFormGroup.value.intDoorsQtyCtrl);
        const intDoorJambQty = (!this.secondFormGroup.value.intDoorsJambQtyCtrl ? 0 : this.secondFormGroup.value.intDoorsJambQtyCtrl);
        const extDoorQty = (!this.secondFormGroup.value.extDoorsQuantityCtrl ? 0 : this.secondFormGroup.value.extDoorsQuantityCtrl);
        const extDoorsJambQty = (!this.secondFormGroup.value.extDoorsJambQuantityCtrl ?
            0 : this.secondFormGroup.value.extDoorsJambQuantityCtrl);
        const mirrorDoorsQty = 0;

        const extrasObj = {
            'switches': this.secondFormGroup.value.switchesCtrl,
            'switchesQty': switchesQty,
            'switchesPrice': 2,
            'ceilingFans': this.secondFormGroup.value.ceilingFansCtrl,
            'ceilingFansQty': ceilingFansQty,
            'ceilingFansPrice': 10,
            'blinds': this.secondFormGroup.value.blindsCtrl,
            'blindsQty': blindsQty,
            'blindsPrice': 0,
            'faucets': this.secondFormGroup.value.faucetsCtrl,
            'faucetsQty': faucetsQty,
            'faucetsPrice': 10,
            'lightFixtures': this.secondFormGroup.value.lightFixturesCtrl,
            'lightFixturesQty': lightFixturesQty,
            'lightFixturesPrice': 5,
            'tubReplace': (this.thirdFormGroup.value.tubCtrl === '3'),
            'tubReplacePrice': 100,
            'showerTileReplace': (this.thirdFormGroup.value.showerTileCtrl === '3'),
            'showerTilePrice': 150,
            'mirror': this.thirdFormGroup.value.newMirrorCtrl,
            'mirrorPrice': 0,
            'graniteBathroom': this.thirdFormGroup.value.graniteBathCtrl,
            'graniteKitchen': (this.fourthFormGroup.value.ktCounterCtrl === '3'),
            'granitePickupPrice': 25,
            'granitePrepPrice': 60,
            'graniteRate': 15,
            'vanity': this.thirdFormGroup.value.newVanityCtrl,
            'vanityPrice': 25,
            'kitchenSink': this.fourthFormGroup.value.installKitchLightCtrl,
            'kitchenSinkPrice': 15,
            'microwave': this.fourthFormGroup.value.installMicrowaveCtrl,
            'microwavePrice': 50,
            'microwaveShelf': this.sixthFormGroup.value.microwaveShelfCtrl,
            'microwaveShelfPrice': 25,
            'interiorDoors': this.secondFormGroup.value.intDoorsCtrl,
            'interiorDoorsQty': intDoorQty,
            'interiorDoorsJamb': this.secondFormGroup.value.intDoorsJambCtrl,
            'interiorDoorsJambQty': intDoorJambQty,
            'interiorDoorsJambPrice': 50,
            'exteriorDoors': this.secondFormGroup.value.extDoorsCtrl,
            'exteriorDoorsQty': extDoorQty,
            'exteriorDoorsPrice': 50,
            'exteriorDoorsJamb': this.secondFormGroup.value.extDoorsJambCtrl,
            'exteriorDoorsJambQty': extDoorsJambQty,
            'exteriorDoorsJambPrice': 150,
            'stove': this.fourthFormGroup.value.stoveCtrl,
            'fridge': this.fourthFormGroup.value.fridgeCtrl,
            'dishwasher': this.fourthFormGroup.value.washingCtrl,
            'mirrorDoors': false,
            'mirrorDoorsQty': mirrorDoorsQty,
            'mirrorDoorsPrice': 10,
            'extrasAsArray': [],
            'totalCost': 0
        };

        let costOfExtras = 0;
        const extrasAsArray = [];
        if (extrasObj.switches) {
            extrasAsArray.push({
                'description': 'Rocker switches x ' + switchesQty,
                'basicDescription': 'Rocker switches',
                'quantity': switchesQty,
                'price': extrasObj.switchesPrice,
                'totalPrice': (switchesQty * extrasObj.switchesPrice)
            });
            costOfExtras += switchesQty * extrasObj.switchesPrice;
        }
        if (extrasObj.ceilingFans) {
            extrasAsArray.push({
                'description': 'Ceiling Fans x ' + ceilingFansQty,
                'basicDescription': 'Ceiling Fans',
                'quantity': ceilingFansQty,
                'price': extrasObj.ceilingFansPrice,
                'totalPrice': (ceilingFansQty * extrasObj.ceilingFansPrice)
            });
            costOfExtras += ceilingFansQty * extrasObj.ceilingFansPrice;
        }
        if (extrasObj.blinds) {
            extrasAsArray.push({
                'description': 'Blinds (Faux Wood) x ' + blindsQty,
                'basicDescription': 'Blinds (Faux Wood)',
                'quantity': blindsQty,
                'price': extrasObj.blindsPrice,
                'totalPrice': (blindsQty * extrasObj.blindsPrice)
            });
            costOfExtras += blindsQty * extrasObj.blindsPrice;
        }
        if (extrasObj.faucets) {
            extrasAsArray.push({
                'description': 'Faucets x ' + faucetsQty,
                'basicDescription': 'Replace Faucet(s)',
                'quantity': faucetsQty,
                'price': extrasObj.faucetsPrice,
                'totalPrice': (faucetsQty * extrasObj.faucetsPrice)
            });
            costOfExtras += faucetsQty * extrasObj.faucetsPrice;
        }
        if (extrasObj.lightFixtures) {
            extrasAsArray.push({
                'description': 'Light Fixtures x ' + lightFixturesQty,
                'basicDescription': 'Install Light Fixture(s)',
                'quantity': lightFixturesQty,
                'price': extrasObj.lightFixturesPrice,
                'totalPrice': (lightFixturesQty * extrasObj.lightFixturesPrice)
            });
            costOfExtras += lightFixturesQty * extrasObj.lightFixturesPrice;
        }
        if (extrasObj.tubReplace) {
            extrasAsArray.push({
                'description': 'Tub Replace',
                'basicDescription': 'Tub Replace',
                'quantity': 1,
                'price': extrasObj.tubReplacePrice,
                'totalPrice': (extrasObj.tubReplacePrice)
            });
            costOfExtras += extrasObj.tubReplacePrice;
        }
        /*if (extrasObj.showerTileReplace) {
          extrasAsArray.push({
            'description': 'Shower Tile Remove and Replace',
            'basicDescription': 'Shower Tile Remove and Replace',
            'quantity': 1,
            'price': extrasObj.showerTilePrice,
            'totalPrice': (extrasObj.showerTilePrice)
          });
          costOfExtras += extrasObj.showerTilePrice;
        }*/
        if (extrasObj.mirror) {
            extrasAsArray.push({
                'description': 'Mirror',
                'basicDescription': 'Install Mirror',
                'quantity': 1,
                'price': extrasObj.mirrorPrice,
                'totalPrice': (extrasObj.mirrorPrice)
            });
            costOfExtras += extrasObj.mirrorPrice;
        }
        /*if (extrasObj.graniteBathroom) {
          extrasAsArray.push({
            'description': 'Granite replace bathroom countertop',
            'basicDescription': 'Granite replace bathroom countertop',
            'quantity': 1,
            'price': 0,
            'totalPrice': 0
          });
          costOfExtras += 0;
        }
        if (extrasObj.graniteKitchen) {
          extrasAsArray.push({
            'description': 'Granite replace kitchen countertop',
            'basicDescription': 'Granite replace kitchen countertop',
            'quantity': 1,
            'price': 0,
            'totalPrice': 0
          });
          costOfExtras += 0;
        }*/
        if (extrasObj.vanity) {
            extrasAsArray.push({
                'description': 'Install Bathroom vanity',
                'basicDescription': 'Install Bathroom vanity',
                'quantity': 1,
                'price': extrasObj.vanityPrice,
                'totalPrice': extrasObj.vanityPrice
            });
            costOfExtras += extrasObj.vanityPrice;
        }
        if (extrasObj.kitchenSink) {
            extrasAsArray.push({
                'description': 'Install Kitchen Sink',
                'basicDescription': 'Install Kitchen Sink',
                'quantity': 1,
                'price': extrasObj.kitchenSinkPrice,
                'totalPrice': extrasObj.kitchenSinkPrice
            });
            costOfExtras += extrasObj.kitchenSinkPrice;
        }
        /*
            if (extrasObj.microwave) {
              extrasAsArray.push({
                'description': 'Microwave',
                'basicDescription': 'Microwave',
                'quantity': 1,
                'price': extrasObj.microwavePrice,
                'totalPrice': extrasObj.microwavePrice
              });
              costOfExtras += extrasObj.microwavePrice;
            }*/
        if (extrasObj.interiorDoors) {
            extrasAsArray.push({
                'description': 'Interior Door Replace x ' + intDoorQty,
                'basicDescription': 'Interior Door Replace',
                'quantity': intDoorQty,
                'price': 0,
                'totalPrice': 0
            });
            costOfExtras += 0;
        }
        if (extrasObj.interiorDoorsJamb) {
            extrasAsArray.push({
                'description': 'Interior Door Replace w/ Jamb x ' + intDoorJambQty,
                'basicDescription': 'Interior Door Replace w/ Jamb',
                'quantity': intDoorJambQty,
                'price': extrasObj.interiorDoorsJambPrice,
                'totalPrice': (intDoorJambQty * extrasObj.interiorDoorsJambPrice)
            });
            costOfExtras += intDoorJambQty * extrasObj.interiorDoorsJambPrice;
        }
        if (extrasObj.exteriorDoors) {
            extrasAsArray.push({
                'description': 'Exterior Door Replace x ' + extDoorQty,
                'basicDescription': 'Exterior Door Replace',
                'quantity': extDoorQty,
                'price': extrasObj.exteriorDoorsPrice,
                'totalPrice': (extDoorQty * extrasObj.exteriorDoorsPrice)
            });
            costOfExtras += extDoorQty * extrasObj.exteriorDoorsPrice;
        }
        if (extrasObj.exteriorDoorsJamb) {
            extrasAsArray.push({
                'description': 'Exterior Door Replace w/ Jamb x ' + extDoorsJambQty,
                'basicDescription': 'Exterior Door Replace w/ Jamb',
                'quantity': extDoorsJambQty,
                'price': extrasObj.exteriorDoorsJambPrice,
                'totalPrice': (extDoorsJambQty * extrasObj.exteriorDoorsJambPrice)
            });
            costOfExtras += extDoorsJambQty * extrasObj.exteriorDoorsJambPrice;
        }
        if (extrasObj.mirrorDoors) {
            extrasAsArray.push({
                'description': 'Install Mirror Doors x ' + mirrorDoorsQty,
                'basicDescription': 'Install Mirror Doors',
                'quantity': mirrorDoorsQty,
                'price': extrasObj.mirrorDoorsPrice,
                'totalPrice': (mirrorDoorsQty * extrasObj.mirrorDoorsPrice)
            });
            costOfExtras += mirrorDoorsQty * extrasObj.mirrorDoorsPrice;
        }
        extrasObj.extrasAsArray = extrasAsArray;
        extrasObj.totalCost = costOfExtras;
        return extrasObj;
    }
    createFlooring() {
        const flooring: Flooring = {
            flooringNeeded: this.secondFormGroup.value.flooringCtrl,
            carpetReplace: this.secondFormGroup.value.carpetReplace,
            carpetReplaceQty: this.secondFormGroup.value.carpetReplaceQty,
            carpetReplaceDescription: this.secondFormGroup.value.carpetReplaceDescription,
            carpetShampoo: this.secondFormGroup.value.carpetShampoo,
            carpetShampooQty: this.secondFormGroup.value.carpetShampooQty,
            carpetShampooDescription: this.secondFormGroup.value.carpetShampooDescription,
            installTile: this.secondFormGroup.value.installTile,
            installTileQty: this.secondFormGroup.value.installTileQty,
            installTileDescription: this.secondFormGroup.value.installTileDescription,
            repairTile: this.secondFormGroup.value.repairTile,
            repairTileQty: this.secondFormGroup.value.repairTileQty,
            repairTileDescription: this.secondFormGroup.value.repairTileDescription,
            installPlank: this.secondFormGroup.value.installPlank,
            installPlankQty: this.secondFormGroup.value.installPlankQty,
            installPlankDescription: this.secondFormGroup.value.installPlankDescription,
            repairPlank: this.secondFormGroup.value.repairPlank,
            repairPlankQty: this.secondFormGroup.value.repairPlankQty,
            repairPlankDescription: this.secondFormGroup.value.repairPlankDescription,
            plankingRate: 1.67,
            carpetShampooRate: 35,
            carpetReplaceRate: 1,
            installTileRate: 1.2,
            repairTileRate: 1.5,
            repairTileFlatFee: 35,
            flooringList: []
        };
        flooring.flooringList = this.createFlooringList(flooring);
        return flooring;
    }
    createApplianceList(): Array<any> {
        const applianceList = [];
        if (this.fourthFormGroup.value.stoveCtrl) {
            applianceList.push('New Stove');
        }
        if (this.fourthFormGroup.value.fridgeCtrl) {
            applianceList.push('New Fridge');
        }
        if (this.fourthFormGroup.value.washingCtrl) {
            applianceList.push('New Dishwasher');
        }
        if (this.fourthFormGroup.value.microwaveCtrl) {
            applianceList.push('Replacement Microwave');
        }
        return applianceList;
    }

    ngOnInit() {
        this.firstFormGroup = this._formBuilder.group({
            nameCtrl: ['', Validators.required],
            unitCtrl: [{value: '', disabled: true}, Validators.required],
            propertyCtrl: ['', Validators.required]
            // sizeCtrl: ['', Validators.required]
        });
        this.userProfile.subscribe(user => {
            this.user = user;
            const currentUser = this.user.email;
            const propertyGuess = '';
            this.setPropertyDropdownInitial(this.user.email);
            if (currentUser) {
                for (let i = 0; i < this.properties.length; i++) {
                    if (this.properties[i].email === currentUser) {
                        this.firstFormGroup.patchValue({
                            'propertyCtrl': this.properties[i].email
                        });
                        this.setPropertySelected({value: this.properties[i].name});
                    }
                }
            }

        });

        this.secondFormGroup = this._formBuilder.group({
            sheetrockCtrl: ['1'],
            textureCtrl: ['1'],
            paintCtrl: ['1'],
            intDoorsCtrl: [''],
            intDoorsQtyCtrl: [{value: '', disabled: true}],
            intDoorsJambCtrl: [''],
            intDoorsJambQtyCtrl: [{value: '', disabled: true}],
            extDoorsCtrl: [''],
            extDoorsQuantityCtrl: [{value: '', disabled: true}],
            extDoorsJambCtrl: [''],
            extDoorsJambQuantityCtrl: [{value: '', disabled: true}],
            switchesCtrl: [''],
            switchesQuantityCtrl: [{value: '', disabled: true}],
            ceilingFansCtrl: [''],
            ceilingFansQuantityCtrl: [{value: '', disabled: true}],
            blindsCtrl: [''],
            blindsQuantityCtrl: [{value: '', disabled: true}],
            faucetsCtrl: [''],
            faucetsQuantityCtrl: [{value: '', disabled: true}],
            lightFixturesCtrl: [''],
            lightFixturesQuantityCtrl: [{value: '', disabled: true}],
            flooringCtrl: ['1'],
            carpetReplace: [''],
            carpetReplaceQty: [{value: '', disabled: true}],
            carpetReplaceDescription: [''],
            carpetShampoo: [''],
            carpetShampooQty: [{value: '', disabled: true}],
            carpetShampooDescription: [''],
            installTile: [''],
            installTileQty: [{value: '', disabled: true}],
            installTileDescription: [''],
            repairTile: [''],
            repairTileQty: [{value: '', disabled: true}],
            repairTileDescription: [''],
            installPlank: [''],
            installPlankQty: [{value: '', disabled: true}],
            installPlankDescription: [''],
            repairPlank: [''],
            repairPlankQty: [{value: '', disabled: true}],
            repairPlankDescription: ['']
        });
        this.thirdFormGroup = this._formBuilder.group({
            newTileCtrl: [''],
            tubCtrl: ['1'],
            showerTileCtrl: ['1'],
            newMirrorCtrl: [''],
            graniteBathCtrl: [''],
            resurfaceBathCtrl: [''],
            newVanityCtrl: ['']
        });
        this.fourthFormGroup = this._formBuilder.group({
            stoveCtrl: [''],
            fridgeCtrl: [''],
            washingCtrl: [''],
            microwaveCtrl: [''],
            ktCounterCtrl: ['1'],
            installKitchenSinkCtrl: [''],
            installMicrowaveCtrl: ['']
        });
        this.sixthFormGroup = this._formBuilder.group({
            priceChoiceCtrl: ['1'],
            priceCtrl: [''],
            contractorCtrl: [''],
            startDateCtrl: [new Date()],
            showerTileContractorNameCtrl: [''],
            showerTilePriceCtrl: [''],
            showerTileScopeCtrl: [''],
            showerTileDatePickerCtrl: [new Date()],

            microwaveContractorNameCtrl: [''],
            microwaveShelfCtrl: [''],
            microwavePriceCtrl: [''],
            microwaveScopeCtrl: [''],
            microwaveDatePickerCtrl: [new Date()],
            graniteContractorNameCtrl: [''],
            granitePrepareCtrl: [''],
            granitePickupCtrl: [''],
            granitePriceCtrl: [''],
            graniteLengthCtrl: [''],
            graniteScopeCtrl: [''],
            graniteDatePickerCtrl: [new Date()],

        });
        this.lastFormGroup = this._formBuilder.group({});
    }

    resetAll() {
        this.myStep1.completed = false;
        this.myStep2.completed = false;
        this.myStep3.completed = false;
        this.myStep4.completed = false;
        this.myStep6.completed = false;
        this.myStepLast.completed = false;
        this.firstFormGroup.reset();
        this.secondFormGroup.reset();
        this.thirdFormGroup.reset();
        this.fourthFormGroup.reset();
        this.sixthFormGroup.reset();
        this.lastFormGroup.reset();
        this.myStepper.selectedIndex = 0;

        this.animationState = 'out';
        this.carpetReplaceState = 'out';
        this.carpetShampooState = 'out';
        this.tileInstallState = 'out';
        this.tileRepairState = 'out';
        this.plankInstallState = 'out';
        this.plankRepairState = 'out';

        this.units = null;
        this.unitSelected = null;
        this.propertySelected = null;
        this.customPriceSelected = false;
        this.scope = null;
        this.flooring = null;
        this.contract = null;
        this.graniteContract = null;
        this.showerTileContract = null;
        this.microwaveContract = null;
        this.makeReady = null;

        this.customGraniteSelected = false;
        this.granitePrep = false;
        this.granitePick = false;
        this.customShowerSelected = false;
        this.processing = false;
    }

    setPropertySelected(property) {
        console.log('setProperty: ' + property.value);
        this.propertySelected = property.value;
        this.unitsService.get(property.value).subscribe(res => {
                this.units = res;
                // console.log('received units: ' + res);
                this.papa.parse(this.units, {
                    header: true,
                    complete: (results, file) => {
                        console.log('Parsed: ', results.data);
                        this.parsedUnits = results.data;
                        this.firstFormGroup.controls.unitCtrl.enable();
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
        let unit = this.parsedUnits[selectedIndex];
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

    }

    enableFlooringType(event, section) {
        let myCtrl = null;
        console.log('enableFlooringType');
        switch (section) {
            case 'carpetReplace': {
                this.carpetReplaceState = event.checked ? 'in' : 'out';
                myCtrl = this.secondFormGroup.controls.carpetReplaceQty;
                break;
            }
            case 'carpetShampoo': {
                this.carpetShampooState = event.checked ? 'in' : 'out';
                myCtrl = this.secondFormGroup.controls.carpetShampooQty;
                break;
            }
            case 'installTile': {
                this.tileInstallState = event.checked ? 'in' : 'out';
                myCtrl = this.secondFormGroup.controls.installTileQty;
                break;
            }
            case 'repairTile': {
                this.tileRepairState = event.checked ? 'in' : 'out';
                myCtrl = this.secondFormGroup.controls.repairTileQty;
                break;
            }
            case 'installPlank': {
                this.plankInstallState = event.checked ? 'in' : 'out';
                myCtrl = this.secondFormGroup.controls.installPlankQty;
                break;
            }
            case 'repairPlank': {
                this.plankRepairState = event.checked ? 'in' : 'out';
                myCtrl = this.secondFormGroup.controls.repairPlankQty;
                break;
            }
        }
        if (event.checked) {
            myCtrl.enable();
            myCtrl.setValidators([Validators.required, positiveNumberValidator()]);
            myCtrl.updateValueAndValidity();
        } else {
            myCtrl.disable();
            myCtrl.setValue('');
            myCtrl.setValidators([]);
            myCtrl.updateValueAndValidity();
        }
    }

    triggerResize() {
        // Wait for changes to be applied, then trigger textarea resize.
        this.ngZone.onStable.pipe(take(1))
            .subscribe(() => this.autosize.resizeToFitContent(true));
    }
    priceCtrlChange(event) {
        console.log('custom price switch');
        this.customPriceSelected = event.value === '3';
    }
    graniteLengthChange(event) {
        let price = event * this.scope.graniteRate;
        if (this.sixthFormGroup.value.granitePrepareCtrl) {
            price += this.scope.extras.granitePrepPrice;
        }
        if (this.sixthFormGroup.value.granitePickupCtrl) {
            price += this.scope.extras.granitePickupPrice;
        }
        console.log('graniteLengthChange event: ' + event);
        this.makeReady.contracts[1].price = price;
    }
    craftGraniteScopes(event, section) {
        let contract = this.makeReady.contracts[1];
        let rate = this.scope.extras.graniteRate;
        let pickup = this.scope.extras.granitePickupPrice;
        let prep = this.scope.extras.granitePrepPrice;
        if (event.checked) {
            if (section === 'granitePrepareCtrl') {
                this.granitePrep = true;
                if (this.granitePick) {
                    console.log(' granitePrep and granitePick');
                    this.graniteFinalScope = this.granitePickupScope + ', ' + this.granitePrepareScope + ', ' + this.graniteTotalScope;
                    contract.price = (contract.quantity * rate) + pickup + prep;
                }
                else {
                    console.log(' granitePrep and !granitePick');
                    this.graniteFinalScope = this.granitePrepareScope + ', ' + this.graniteTotalScope;
                    contract.price = (contract.quantity * rate) + prep;
                }
            }
            else if (section === 'granitePickupCtrl') {
                this.granitePick = true;
                if (this.granitePrep) {
                    console.log(' granitePrep and granitePick');
                    this.graniteFinalScope = this.granitePickupScope + ', ' + this.granitePrepareScope + ', ' + this.graniteTotalScope;
                    contract.price = (contract.quantity * rate) + pickup + prep;
                }
                else {
                    console.log(' !granitePrep and granitePick');
                    this.graniteFinalScope = this.granitePickupScope + ', ' + this.graniteTotalScope;
                    contract.price = (contract.quantity * rate) + pickup;
                }
            }
        }
        else {
            if (section === 'granitePrepareCtrl') {
                this.granitePrep = false;
                if (this.granitePick) {
                    console.log(' !granitePrep and granitePick');
                    this.graniteFinalScope = this.granitePickupScope + ', ' + this.graniteTotalScope;
                    contract.price = (contract.quantity * rate) + pickup;
                }
                else {
                    console.log(' !granitePrep and !granitePick');
                    this.graniteFinalScope = this.graniteTotalScope;
                    contract.price = (contract.quantity * rate);
                }
            }
            else if (section === 'granitePickupCtrl') {
                this.granitePick = false;
                if (this.granitePrep) {
                    console.log(' granitePrep and !granitePick');
                    contract.price = (contract.quantity * rate) + prep;
                }
                else {
                    console.log(' !granitePrep and !granitePick');
                    contract.price = (contract.quantity * rate);
                }
            }
        }
    }
    microwaveShelfCheck(event) {
        if (event.checked) {
            this.microwaveTotalScope = this.microwavePrepareScope + ', ' + this.microwaveInstallScope;
            this.makeReady.contracts[3].price = this.scope.extras.microwavePrice + this.scope.extras.microwaveShelfPrice;
        } else {
            this.microwaveTotalScope = this.microwaveInstallScope;
            this.makeReady.contracts[3].price = this.scope.extras.microwavePrice;
        }
    }
    extraChecked(event) {
        // const elem = <MatCheckbox>event.source;
        let myCtrl = null;
        switch (event.source.id) {
            case 'switchesCtrl': {
                console.log('switchesCtrl');
                myCtrl = this.secondFormGroup.controls.switchesQuantityCtrl;
                break;
            }
            case 'ceilingFansCtrl': {
                console.log('ceilingFansCtrl');
                myCtrl = this.secondFormGroup.controls.ceilingFansQuantityCtrl;
                break;
            }
            case 'blindsCtrl': {
                console.log('blindsCtrl');
                myCtrl = this.secondFormGroup.controls.blindsQuantityCtrl;
                break;
            }
            case 'faucetsCtrl': {
                console.log('faucetsCtrl');
                myCtrl = this.secondFormGroup.controls.faucetsQuantityCtrl;
                break;
            }
            case 'lightFixturesCtrl': {
                console.log('lightFixturesCtrl');
                myCtrl = this.secondFormGroup.controls.lightFixturesQuantityCtrl;
                break;
            }
            case 'intDoorsCtrl': {
                console.log('intDoorsCtrl');
                myCtrl = this.secondFormGroup.controls.intDoorsQtyCtrl;
                break;
            }
            case 'intDoorsJambCtrl': {
                console.log('intDoorsJambCtrl');
                myCtrl = this.secondFormGroup.controls.intDoorsJambQtyCtrl;
                break;
            }
            case 'extDoorsCtrl': {
                console.log('extDoorsCtrl');
                myCtrl = this.secondFormGroup.controls.extDoorsQuantityCtrl;
                break;
            }
            case 'extDoorsJambCtrl': {
                console.log('extDoorsJambCtrl');
                myCtrl = this.secondFormGroup.controls.extDoorsJambQuantityCtrl;
                break;
            }
            default: {
            }
        }
        if (event.checked) {
            myCtrl.enable();
            myCtrl.setValidators([Validators.required, positiveNumberValidator()]);
            myCtrl.updateValueAndValidity();
        } else {
            myCtrl.disable();
            myCtrl.setValue('');
            myCtrl.setValidators([]);
            myCtrl.updateValueAndValidity();
        }
    }
    createFlooringList(flooring): Array<{}> {
        let flooringList = [];
        if (flooring.flooringNeeded) {
            if (flooring.carpetShampoo) {
                flooringList.push({
                    type: 'carpetShampoo',
                    description: 'Carpet Shampoo - ' + flooring.carpetShampooDescription,
                    qty: flooring.carpetShampooQty,
                    rate: flooring.carpetShampooRate
                });
            }
            if (flooring.carpetReplace) {
                flooringList.push({
                    type: 'carpetReplace',
                    description: 'Carpet Replace - ' + flooring.carpetReplaceDescription,
                    qty: flooring.carpetReplaceQty,
                    rate: flooring.carpetReplaceRate
                });
            }
            if (flooring.repairPlank) {
                flooringList.push({
                    type: 'repairPlank',
                    description: 'Repair Plank - ' + flooring.repairPlankDescription,
                    qty: flooring.repairPlankQty,
                    rate: flooring.plankingRate
                });
            }

            if (flooring.installPlank) {
                flooringList.push({
                    type: 'installPlank',
                    description: 'Install Plank - ' + flooring.installPlankDescription,
                    qty: flooring.installPlankQty,
                    rate: flooring.plankingRate
                });
            }
            if (flooring.repairTile) {
                flooringList.push({
                    type: 'repairTile',
                    description: 'Repair Tile - ' + flooring.repairTileDescription,
                    qty: flooring.repairTileQty,
                    rate: flooring.repairTileRate
                });
            }
            if (flooring.installTile) {
                flooringList.push({
                    type: 'installTile',
                    description: 'Install Tile - ' + flooring.installTileDescription,
                    qty: flooring.installTileQty,
                    rate: flooring.installTileRate
                });
            }
        } else {
            // don't add flooring
        }
        return flooringList;
    }
    setPropertyDropdownInitial(currentUser) {
        console.log('Setting initial property by user email');
        for (let i = 0; i < this.properties.length; i++) {
            if (this.properties[i].email === currentUser) {
                this.firstFormGroup.patchValue({
                    'propertyCtrl': this.properties[i].sheetName
                });
                this.setPropertySelected({value: this.properties[i].sheetName});
            }
        }
    }

    onBackToTableHandler() {
        this.router.navigate(['./mr-table']);
    }

}
