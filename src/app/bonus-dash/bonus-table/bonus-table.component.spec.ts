import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusTableComponent } from './bonus-table.component';

describe('BonusTableComponent', () => {
  let component: BonusTableComponent;
  let fixture: ComponentFixture<BonusTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BonusTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonusTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
