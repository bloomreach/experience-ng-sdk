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

import { PageModelService } from 'bloomreach-experience-ng-sdk';

@Component({
  selector: 'app-essentials-news-item',
  templateUrl: './news-item.component.html',
  styleUrls: ['./news-item.component.css']
})
export class NewsItemComponent implements OnInit {
  @Input() contentRef: any;
  content: any;

  constructor(private pageModelService: PageModelService) {}

  ngOnInit() {
    this.getContent(this.contentRef);
  }

  getContent(contentRef) {
    if (contentRef && contentRef.$ref) {
      this.content = this.pageModelService.getContentViaReference(contentRef.$ref);
    }
  }
}
