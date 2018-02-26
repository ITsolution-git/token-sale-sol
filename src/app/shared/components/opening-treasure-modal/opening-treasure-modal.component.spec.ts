import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningTreasureModalComponent } from './opening-treasure-modal.component';

describe('TreasureModalComponent', () => {
  let component: OpeningTreasureModalComponent;
  let fixture: ComponentFixture<OpeningTreasureModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpeningTreasureModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpeningTreasureModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
