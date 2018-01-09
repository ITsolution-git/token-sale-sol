import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyGzrComponent } from './buy-gzr.component';

describe('BuyGzrComponent', () => {
  let component: BuyGzrComponent;
  let fixture: ComponentFixture<BuyGzrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyGzrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyGzrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
