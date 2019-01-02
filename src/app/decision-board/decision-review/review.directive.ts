import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appReview]'
})
export class ReviewDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
