import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasureItemModalComponent } from './treasure-item.component';

describe('TreasureItemModalComponent', () => {
  let component: TreasureItemModalComponent;
  let fixture: ComponentFixture<TreasureItemModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasureItemModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasureItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
