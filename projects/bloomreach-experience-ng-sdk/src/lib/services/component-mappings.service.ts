import { Injectable } from '@angular/core';

export interface ComponentMappings {
  [propName: string]: any;
}

@Injectable()
export class ComponentMappingsService {
  componentMappings: ComponentMappings;

  constructor() {
    this.componentMappings = {};
  }

  getComponentMappings(): ComponentMappings {
    return this.componentMappings;
  }

  setComponentMappings(componentMappings: ComponentMappings) {
    this.componentMappings = componentMappings;
  }

  getComponent(type: string) {
    if (type in this.componentMappings) {
      return this.componentMappings[type];
    }
    return false;
  }
}
