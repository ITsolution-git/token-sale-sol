import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideAccordionComponent } from './guide-accordion.component';

describe('GuideAccordionComponent', () => {
  let component: GuideAccordionComponent;
  let fixture: ComponentFixture<GuideAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideAccordionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
