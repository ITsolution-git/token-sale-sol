import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LockedMetaComponent } from './locked-meta.component';

describe('LockedMetaComponent', () => {
  let component: LockedMetaComponent;
  let fixture: ComponentFixture<LockedMetaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LockedMetaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LockedMetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
