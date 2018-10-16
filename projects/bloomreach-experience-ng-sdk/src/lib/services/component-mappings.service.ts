import { Injectable } from '@angular/core';

export interface ComponentMappings {
  [propName: string]: any;
}

@Injectable()
export class ComponentMappingsService {
  constructor(public componentMappings: ComponentMappings) {
    this.componentMappings = {};
  }

  getComponent(type: string) {
    if (type in this.componentMappings) {
      return this.componentMappings[type];
    }
    return false;
  }
}
