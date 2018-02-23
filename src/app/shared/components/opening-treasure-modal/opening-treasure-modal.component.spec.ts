import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasureModalComponent } from './opening-treasure-modal.component';

describe('TreasureModalComponent', () => {
  let component: TreasureModalComponent;
  let fixture: ComponentFixture<TreasureModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasureModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasureModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
