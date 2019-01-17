import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowIncidentComponent } from './show-incident.component';

describe('ShowIncidentComponent', () => {
  let component: ShowIncidentComponent;
  let fixture: ComponentFixture<ShowIncidentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowIncidentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
