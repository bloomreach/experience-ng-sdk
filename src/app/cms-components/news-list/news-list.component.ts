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

import { BaseComponent, getNestedObject } from 'bloomreach-experience-ng-sdk';

@Component({
  selector: 'app-essentials-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements BaseComponent, OnInit {
  @Input() configuration: any;
  @Input() content: any;
  items: any;
  pageable: any;

  constructor() { }

  ngOnInit() {
    this.createList();
    this.createPagination();
  }

  createList() {
    this.items = getNestedObject(this.configuration, ['models', 'pageable', 'items']);
  }

  createPagination() {
    this.pageable = getNestedObject(this.configuration, ['models', 'pageable']);
  }
}
