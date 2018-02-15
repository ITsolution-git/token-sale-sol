import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingItemComponent } from './waiting-item.component';

describe('WaitingItemComponent', () => {
  let component: WaitingItemComponent;
  let fixture: ComponentFixture<WaitingItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
