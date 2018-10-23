import { Component, ComponentFactoryResolver, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import { BaseComponent } from './base-component.interface';
import { BaseComponentDirective } from './base-component.directive';
import { ComponentMappingsService } from '../../../services/component-mappings.service';
import { RequestContextService } from '../../../services/request-context.service';
import { UndefinedComponent } from '../undefined/undefined.component';

import { ComponentMappings } from '../../../common-sdk/types';
import { addComponentMetaData } from '../../../common-sdk/utils/cms-meta-data';
import { getMappedComponent } from '../../../common-sdk/utils/render-cms-component';

@Component({
  selector: 'bre-base-component',
  templateUrl: './base-component.component.html',
  styleUrls: ['./base-component.component.css']
})
export class BaseComponentComponent implements OnChanges {
  @Input() configuration: any;
  @Input() renderComponent?: any;
  @ViewChild(BaseComponentDirective) baseComponent: BaseComponentDirective;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private componentMappingsService: ComponentMappingsService,
    private elementRef: ElementRef,
    private requestContextService: RequestContextService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    // Static components that need to subscribe to PageModelService to get the Page Model,
    // will get their configuration after ngOnInit, so we have to use ngOnChanges.
    // Doing an additional check to ensure that components are not created more than once.
    if (changes.configuration.currentValue && !changes.configuration.previousValue) {
      this.createComponent();
    }
  }

  createComponent(): void {
    const componentMappings: ComponentMappings = this.componentMappingsService.getComponentMappings();
    let cmsComponent = getMappedComponent(this.configuration, this.renderComponent, componentMappings);
    if (!cmsComponent) {
      cmsComponent = UndefinedComponent;
    }

    this.addCmsMetaData();

    // create component
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(cmsComponent);
    const viewContainerRef = this.baseComponent.viewContainerRef;
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<BaseComponent>componentRef.instance).configuration = this.configuration;
  }

  addCmsMetaData(): void {
    const preview: boolean = this.requestContextService.isPreviewRequest();
    addComponentMetaData(preview, this.elementRef.nativeElement, this.configuration);
  }
}
