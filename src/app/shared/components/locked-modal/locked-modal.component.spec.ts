import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LockedModalComponent } from './locked-modal.component';

describe('LockedModalComponent', () => {
  let component: LockedModalComponent;
  let fixture: ComponentFixture<LockedModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LockedModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LockedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
