import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachCalendarComponent } from './coach-calendar.component';

describe('CoachCalendarComponent', () => {
  let component: CoachCalendarComponent;
  let fixture: ComponentFixture<CoachCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
