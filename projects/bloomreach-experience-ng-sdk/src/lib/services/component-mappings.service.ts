import { Injectable } from '@angular/core';

import { ComponentMappings } from '../common-sdk/types';

@Injectable({ providedIn: 'root' })
export class ComponentMappingsService {
  private componentMappings: ComponentMappings;

  constructor() {
    this.componentMappings = {};
  }

  getComponentMappings(): ComponentMappings {
    return this.componentMappings;
  }

  setComponentMappings(componentMappings: ComponentMappings): void {
    this.componentMappings = componentMappings;
  }
}
