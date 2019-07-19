import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerCalendarComponent } from './player-calendar.component';

describe('PlayerCalendarComponent', () => {
  let component: PlayerCalendarComponent;
  let fixture: ComponentFixture<PlayerCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
