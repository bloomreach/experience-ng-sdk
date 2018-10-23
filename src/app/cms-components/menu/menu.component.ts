import { Component, Input, OnInit } from '@angular/core';

import { getNestedObject } from 'bloomreach-experience-ng-sdk';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() configuration: any;
  @Input() path: any;
  menuItems: any;
  menuConfiguration: any;

  constructor() {
  }

  ngOnInit() {
    this.getSiteMenuItems(this.configuration);
    this.getMenuConfiguration();
  }

  getSiteMenuItems(configuration): void {
    this.menuItems = getNestedObject(configuration, ['models', 'menu', 'siteMenuItems']);
  }

  getMenuConfiguration(): void {
    this.menuConfiguration = getNestedObject(this.configuration, ['models', 'menu']);
  }
}
