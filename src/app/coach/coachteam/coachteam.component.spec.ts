import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachteamComponent } from './coachteam.component';

describe('CoachteamComponent', () => {
  let component: CoachteamComponent;
  let fixture: ComponentFixture<CoachteamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachteamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
