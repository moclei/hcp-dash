import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedyAppsComponent } from './speedy-apps.component';

describe('SpeedyAppsComponent', () => {
  let component: SpeedyAppsComponent;
  let fixture: ComponentFixture<SpeedyAppsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedyAppsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedyAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
