import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidNetworkModalComponent } from './valid-network.component';

describe('ValidNetworkModalComponent', () => {
  let component: ValidNetworkModalComponent;
  let fixture: ComponentFixture<ValidNetworkModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidNetworkModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidNetworkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
