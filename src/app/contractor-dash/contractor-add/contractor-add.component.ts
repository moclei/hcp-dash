import {Component, OnInit} from '@angular/core';
import {SlideInOutAnimation} from '../../animations';
import {AuthService} from '../../services/auth.service';
import {Observable} from 'rxjs';
import {Contractor} from '../contractor.model';
import {MakeReadyService} from '../../makeready-dash/makeready.service';
import {ContractorFirebaseService} from '../contractor-firebase.service';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-contractor-add',
    templateUrl: './contractor-add.component.html',
    styleUrls: ['./contractor-add.component.scss'],
    animations: [SlideInOutAnimation]
})
export class ContractorAddComponent implements OnInit {
    auth: AuthService;
    contractors: Observable<Contractor[]>;
    formGroup: FormGroup;
    exactMatches = [];
    fuzzyMatches = [];
    name: string;
    searchDone = false;
    location: Location;
    constructor(makereadyService: MakeReadyService,
                private contractorService: ContractorFirebaseService,
                location: Location,
                private _formBuilder: FormBuilder) {
        this.location = location;
    }
    onSubmit() {
        const fName = this.formGroup.value.firstName.trim();
        const lName = this.formGroup.value.lastName.trim();
        const matches$ = this.contractorService.getContractors();
        this.exactMatches = [];
        this.fuzzyMatches = [];
        matches$.subscribe(conts => {
            if (conts.length > 1) {
                for (let j = 0; j < conts.length; j++) {
                    const c = conts[j];
                    const fullName = fName + ' ' + lName;
                    if (c.name.trim() === fullName) {
                        console.log('Found exact contractor match');
                        this.exactMatches.push(c);
                    } else if (c.firstNameSoundex === this.contractorService.convertToSoundex(fName) &&
                        c.lastNameSoundex === this.contractorService.convertToSoundex(lName)) {
                        console.log('Found fuzzy contractor match');
                        this.fuzzyMatches.push(c);
                    } else if (c.lastName === lName) {
                        console.log('Found contractor match by last name');
                        this.fuzzyMatches.push(c);
                    }
                }
            }
            this.searchDone = true;
        });
    }
    onAdd() {
        const fName = this.formGroup.value.firstName.trim();
        const lName = this.formGroup.value.lastName.trim();
        this.name = fName + ' ' + lName;
        const newContractor = {
            'name': this.name,
            'firstName': fName.toLowerCase(),
            'lastName': lName.toLowerCase(),
            'firstNameSoundex': this.contractorService.convertToSoundex(fName),
            'lastNameSoundex': this.contractorService.convertToSoundex(lName),
            'phoneNumber': this.formGroup.value.phoneNumber,
            'status': 'New',
            'numReviews': 0,
            'totalScore': 0,
        };
        this.contractorService.addContractor(newContractor as Contractor);
        this.location.back();
    }
    onCancel() {
        this.location.back();
    }
    ngOnInit() {
        this.contractors = this.contractorService.getContractors();
        this.formGroup = this._formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            isNewCheck: [false]
        });
    }
    capitalize(name: string) {
        return name.charAt(0).toUpperCase() + name.toLowerCase().slice(1);
    }
}
