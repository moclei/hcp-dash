import { Component, Input, OnInit, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { ReviewDirective } from '../review.directive';
import { ReviewItem } from '../review-item';
import { ReviewComponent } from '../review.component';
import {ReviewItemComponent} from '../review-item/review-item.component';
import {DecisionId} from '../../decision.model';
import {DecisionService} from '../../decision.service';
@Component({
    selector: 'app-decision-review-slider',
    templateUrl: './decision-review-slider.component.html',
    styleUrls: ['./decision-review-slider.component.scss']
})
export class DecisionReviewSliderComponent implements OnInit, OnDestroy {
    @Input() decisions: DecisionId[];
    currentAdIndex = -1;
    @ViewChild(ReviewDirective) appReview: ReviewDirective;
    interval: any;
    constructor(private componentFactoryResolver: ComponentFactoryResolver,
                private decisionService: DecisionService) { }
    ngOnInit() {
        this.loadComponent();
       //  this.getAds();
    }
    ngOnDestroy() {
        clearInterval(this.interval);
    }

    loadComponent() {
        this.currentAdIndex = (this.currentAdIndex + 1) % this.decisions.length;
        const adItem = this.decisions[this.currentAdIndex];

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ReviewItemComponent);

        const viewContainerRef = this.appReview.viewContainerRef;
        viewContainerRef.clear();

        const componentRef = viewContainerRef.createComponent(componentFactory);
        console.log('adItem: ' + JSON.stringify(adItem));
        (<ReviewComponent>componentRef.instance).data = adItem;
    }

    nextReview() {
        this.loadComponent();
        /*this.interval = setInterval(() => {
            this.loadComponent();
        }, 3000);*/
    }
    /*
    saveReview() {
        const content = this.inputForm.value.content ? this.inputForm.value.content : '';
        if (content && !isWhitespace) {
            this.decisionService.addDecision(
                {
                    'name': userName,
                    'email': userEmail,
                    'title': title,
                    'content': content,
                    'result': '',
                    'expectedValue': -1,
                    'actualValue': -1,
                    'updatedAt': this.decisionService.timestamp,
                    'createdAt': this.decisionService.timestamp
                });
        }
        this.inputForm.reset();
    }*/
}

