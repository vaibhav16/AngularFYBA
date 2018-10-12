import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportGameComponent } from './report-game.component';

describe('ReportGameComponent', () => {
  let component: ReportGameComponent;
  let fixture: ComponentFixture<ReportGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
