import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingTreasureModalComponent } from './waiting-treasure-modal.component';

describe('WaitingTreasureModalComponent', () => {
  let component: WaitingTreasureModalComponent;
  let fixture: ComponentFixture<WaitingTreasureModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingTreasureModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingTreasureModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
