import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenTreasureComponent } from './open-treasure.component';

describe('OpenTreasureComponent', () => {
  let component: OpenTreasureComponent;
  let fixture: ComponentFixture<OpenTreasureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenTreasureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenTreasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
