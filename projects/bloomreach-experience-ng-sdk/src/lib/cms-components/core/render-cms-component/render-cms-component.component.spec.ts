import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderCmsComponent } from './render-cms-component.component';

describe('RenderCmsComponent', () => {
  let component: RenderCmsComponent;
  let fixture: ComponentFixture<RenderCmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenderCmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderCmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
