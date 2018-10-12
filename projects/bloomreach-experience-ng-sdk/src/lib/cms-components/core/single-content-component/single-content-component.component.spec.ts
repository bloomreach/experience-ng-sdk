import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleContentComponent } from './single-content-component.component';

describe('SingleContentComponent', () => {
  let component: SingleContentComponent;
  let fixture: ComponentFixture<SingleContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
