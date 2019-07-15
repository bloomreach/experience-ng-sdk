/*
 * Copyright 2019 Hippo B.V. (http://www.onehippo.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
