import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerDataComponent } from './player-data.component';

describe('PlayerDataComponent', () => {
  let component: PlayerDataComponent;
  let fixture: ComponentFixture<PlayerDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
