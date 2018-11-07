import {Component, OnInit} from '@angular/core';
import {UnitLoadService} from '../../services/unit-load.service';
import {AuthService, User} from '../../services/auth.service';
import {MatTableDataSource} from '@angular/material';
import {BonusService} from '../bonus.service';
import {Observable} from 'rxjs/Observable';
import {Bonus} from '../bonus.model';
import {CurrencyPipe} from '@angular/common';

@Component({
    selector: 'app-bonus',
    templateUrl: './bonus.component.html',
    styleUrls: ['./bonus.component.scss']
})
export class BonusComponent implements OnInit {

    properties: Array<any>;
    auth: AuthService;
    propertySelected: string;
    waterHeight: number;
    percentCurrent: number;
    percentLast: number;
    bonusService: BonusService;
    private bonusesArray: Bonus[];
    private filteredBonuses: Bonus[];
    selectedBonus: Bonus;
    lastMonthBonus: Bonus;
    monthSelected: number;
    yearSelected: number;
    private months: Array<string>;
    private years: Array<number>;

    user: User;
    constructor(auth: AuthService,
                private unitsService: UnitLoadService,
                bonusService: BonusService,
                private cp: CurrencyPipe) {
        this.auth = auth;
        this.bonusService = bonusService;
    }

    ngOnInit() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        this.months = this.bonusService.months;
        this.years = this.bonusService.years;
        this.monthSelected = currentMonth;
        this.yearSelected = currentYear;
        this.percentLast = 0;
        this.percentCurrent = 0;
        this.properties = [{name: 'All', sheetName: ''}, ...this.unitsService.properties];
        this.auth.user.subscribe(user => {
            console.log('user logged in: bonus dash');
            this.propertySelected = this.auth.getFilterName(user);
            this.bonusService.getBonusStream().subscribe(
                (bonuses) => {
                    // console.log('this.bonusService.getBonuses().subscribe: ' + bonuses);
                    this.bonusesArray = bonuses;
                    if (this.propertySelected === '') {
                        this.propertySelected = 'Alamo';
                    }
                    this.getCurrentBonus(this.propertySelected);
                    /*
                    this.filteredBonuses = this.bonusesArr.filter(bonus => {
                        return (bonus.forMonth === currentMonth && bonus.forYear === currentYear);
                    });
                    if (this.filteredBonuses.length === 0) {
                        this.addMonth(currentMonth, currentYear);
                    }*/
                });
            // this.bonusesArray = this.bonusService.getLoadedBonuses();
        });
    }
    getCurrentBonus(propertyName) {
        console.log('bonus component = subscribing to user');
        // console.log('UnFiltered Bonus length and value: ' + this.bonusesArray.length + ': ' + this.bonusesArray[0]);
        this.filteredBonuses = this.bonusesArray.filter(bonus => {
            // console.log('Bonus propertyName: ' + bonus.propertyName + ', filterName: ' + this.auth.getFilterName(user));
            return (
                bonus.propertyName === propertyName &&
                bonus.forMonth === this.monthSelected &&
                bonus.forYear === this.yearSelected
            );
        });
        const filteredLastMonthBonus = this.bonusesArray.filter(bonus => {
            // console.log('Bonus propertyName: ' + bonus.propertyName + ', filterName: ' + this.auth.getFilterName(user));
            let yearFilter = this.yearSelected;
            let monthFilter = this.monthSelected - 1;
            if (this.monthSelected === 0) {
                yearFilter = this.yearSelected - 1;
                monthFilter = 11;
            }
            return (
                bonus.propertyName === propertyName &&
                bonus.forMonth === monthFilter &&
                bonus.forYear === yearFilter
            );
        });
        this.lastMonthBonus = filteredLastMonthBonus[0];
        console.log('Filtered Bonus length and value: ' + this.filteredBonuses.length + ': ' + this.filteredBonuses[0]);
        this.selectedBonus = this.filteredBonuses[0];
        if (this.selectedBonus) {
            this.setWaterHeight(this.selectedBonus);
        }
        if (this.lastMonthBonus) {
            this.setLastMonthWaterHeight(this.lastMonthBonus);
        }
    }
    onSelectProperty(propertySheetName: string) {
        this.propertySelected = propertySheetName;
        this.getCurrentBonus(this.propertySelected);
    }
    setWaterHeight(bonus: Bonus) {
        const percent = (bonus.collectedMTD / bonus.grossPotential);
        console.log('setting water height: percent = ' + percent);
        // attempting to make percents less than 90 look smaller
        if (percent < 0.9) {
            this.percentCurrent = percent * 0.9;
        }
        this.percentCurrent = percent;
    }
    setLastMonthWaterHeight(bonus: Bonus) {
        const percent = (bonus.collectedMTD / bonus.grossPotential);
        console.log('setting water height: percent = ' + percent);
        this.percentLast = percent;
    }
    getCollectedHeight(b: Bonus) {
        return (202 - (200 / (b.grossPotential / b.collectedMTD)));
    }
    returnSentence(b: Bonus) {
        if (this.getBonusEstimate(b) > 0) {
            return 'Your bonus will be ' + this.cp.transform((this.getBonusEstimate(b)), 'USD', 'symbol', '1.0-0') + '*';
        } else {
            return this.cp.transform((this.leftToBonus(b)), 'USD', 'symbol', '1.0-0') + ' left until bonus*';
        }
    }
    getNinetyPercentHeight (b: Bonus) {
        const collectionPercent = (b.collectedMTD / b.grossPotential);
        // console.log('collection percent is: ' + collectionPercent);
        if (collectionPercent >= 0.9 && collectionPercent < 0.99) {
            return '0.0em';
        } else if (collectionPercent >= 0.99) {
            return '-0.4em';
        }  else {
            return '-0.9em';
        }
    }
    getHundredPercentHeight (b: Bonus) {
        const collectionPercent = (b.collectedMTD / b.grossPotential);
        // console.log('collection percent is: ' + collectionPercent);
        if (collectionPercent >= 0.99) {
            return '-0.4em';
        } else {
            return '-0.9em';
        }
    }
    getBonusEstimate(b: Bonus) {
        const threshold = b.grossPotential * (1 - b.thresholdPercent);
        let bonusEstimate = 0;
        if (b.collectedMTD > threshold) {
            bonusEstimate = (b.collectedMTD - threshold) * 0.1;
        }
        return bonusEstimate;
    }
    leftToBonus(b: Bonus) {
        const threshold = b.grossPotential * (1 - b.thresholdPercent);
        let bonusEstimate = 0;
        if (b.collectedMTD <= threshold) {
            bonusEstimate = threshold - b.collectedMTD;
        }
        return bonusEstimate;
    }
    onSelectMonth(month) {
        this.monthSelected = month;
        // this.matDataSource.filter = this.propertySelected + '' + this.toggleShowRemoved;
    }

    onSelectYear(year) {
        this.yearSelected = year;
    }

    createFilter() {
        return function (data, filter): boolean {
            // const accumulator = (currentTerm, key) => currentTerm + data[key];
            const dataStr = (data.propertyName + '' + data.removed).toLowerCase();
            const transformedFilter = filter.trim().toLowerCase();
            return dataStr.indexOf(transformedFilter) !== -1;
        };
        // return filterFunction;
    }

}
