import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowNewIncidentComponent } from './show-new-incident.component';

describe('ShowNewIncidentComponent', () => {
  let component: ShowNewIncidentComponent;
  let fixture: ComponentFixture<ShowNewIncidentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowNewIncidentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowNewIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
