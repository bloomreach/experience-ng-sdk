import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsEditButtonComponent } from './cms-edit-button.component';

describe('CmsEditButtonComponent', () => {
  let component: CmsEditButtonComponent;
  let fixture: ComponentFixture<CmsEditButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CmsEditButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsEditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
