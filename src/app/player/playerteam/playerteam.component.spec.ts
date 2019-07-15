import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerteamComponent } from './playerteam.component';

describe('PlayerteamComponent', () => {
  let component: PlayerteamComponent;
  let fixture: ComponentFixture<PlayerteamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerteamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
