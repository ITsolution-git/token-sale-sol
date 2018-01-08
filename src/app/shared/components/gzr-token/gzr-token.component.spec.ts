import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GzrTokenComponent } from './gzr-token.component';

describe('GzrTokenComponent', () => {
  let component: GzrTokenComponent;
  let fixture: ComponentFixture<GzrTokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GzrTokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GzrTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
