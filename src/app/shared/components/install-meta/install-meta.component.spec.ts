import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallMetaComponent } from './install-meta.component';

describe('InstallMetaComponent', () => {
  let component: InstallMetaComponent;
  let fixture: ComponentFixture<InstallMetaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstallMetaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallMetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
