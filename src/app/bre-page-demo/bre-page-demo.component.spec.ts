import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrePageDemoComponent } from './bre-page-demo.component';

describe('BrePageDemoComponent', () => {
  let component: BrePageDemoComponent;
  let fixture: ComponentFixture<BrePageDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BrePageDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrePageDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
