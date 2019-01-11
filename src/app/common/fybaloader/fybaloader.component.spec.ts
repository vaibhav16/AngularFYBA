import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FybaloaderComponent } from "./fybaloader.component";

describe("FybaloaderComponent", () => {
  let component: FybaloaderComponent;
  let fixture: ComponentFixture<FybaloaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FybaloaderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FybaloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
