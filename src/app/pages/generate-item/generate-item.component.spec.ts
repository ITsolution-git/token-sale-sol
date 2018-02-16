import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateItemComponent } from './generate-item.component';

describe('GenerateItemComponent', () => {
  let component: GenerateItemComponent;
  let fixture: ComponentFixture<GenerateItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
