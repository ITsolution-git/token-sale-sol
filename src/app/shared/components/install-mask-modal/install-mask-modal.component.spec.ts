import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallMaskModalComponent } from './install-mask-modal.component';

describe('InstallMaskModalComponent', () => {
  let component: InstallMaskModalComponent;
  let fixture: ComponentFixture<InstallMaskModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstallMaskModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallMaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
