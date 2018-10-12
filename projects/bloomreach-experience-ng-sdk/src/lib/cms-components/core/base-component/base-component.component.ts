import { Component, ComponentFactoryResolver, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { BaseComponent } from './base-component.interface';
import { BaseComponentDirective } from './base-component.directive';
import { CmsMetaDataComponent } from '../cms-meta-data/cms-meta-data.component';
import { UndefinedComponent } from '../undefined/undefined.component';
import { ComponentMappingsService } from '../../../services/component-mappings.service';
import getNestedObject from '../../../utils/get-nested-object';

@Component({
  selector: 'bre-base-component',
  templateUrl: './base-component.component.html',
  styleUrls: ['./base-component.component.css']
})
export class BaseComponentComponent extends CmsMetaDataComponent implements OnInit {
  @Input() configuration: any;
  @ViewChild(BaseComponentDirective) baseComponent: BaseComponentDirective;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private componentMappingsService: ComponentMappingsService,
    elementRef: ElementRef) {
      super(elementRef);
  }

  ngOnInit() {
    this.createComponent();
  }

  createComponent() {
    if (this.configuration && this.configuration.label) {
      let cmsComponent = this.componentMappingsService.getComponent(this.configuration.label);
      if (!cmsComponent) {
        cmsComponent = UndefinedComponent;
      }

      this.addComments();

      // create component
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(cmsComponent);
      const viewContainerRef = this.baseComponent.viewContainerRef;
      const componentRef = viewContainerRef.createComponent(componentFactory);
      (<BaseComponent>componentRef.instance).configuration = this.configuration;
    }
  }

  addComments() {
    // CMS meta-data
    const beginNodeSpan = getNestedObject(this.configuration, ['_meta', 'beginNodeSpan', 0, 'data']);
    if (beginNodeSpan) {
      super.addComment(beginNodeSpan, 'beforebegin');
    }
    const endNodeSpan = getNestedObject(this.configuration, ['_meta', 'endNodeSpan', 0, 'data']);
    if (endNodeSpan) {
      super.addComment(endNodeSpan, 'afterend');
    }
  }
}
