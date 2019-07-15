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

import { Component, OnInit } from '@angular/core';

import { BaseComponent, ImageUrlService, PageModelService, SingleContentComponent } from 'bloomreach-experience-ng-sdk';

@Component({
  selector: 'app-essentials-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent extends SingleContentComponent implements BaseComponent, OnInit {
  imageUrl: string;

  constructor(imageUrlService: ImageUrlService,
              pageModelService: PageModelService) {
    super(imageUrlService, pageModelService);
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.content && this.content.image) {
      this.imageUrl = super.getImageUrl(this.content.image);
    }
  }
}
