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

import { ImageUrlService } from '../../../services/image-url.service';
import { PageModelService } from '../../../services/page-model.service';

import getNestedObject from '../../../common-sdk/utils/get-nested-object';

@Component({
  selector: 'bre-single-content-component',
  templateUrl: './single-content-component.component.html',
  styleUrls: ['./single-content-component.component.css']
})
export class SingleContentComponent implements OnInit {
  @Input() configuration: any;
  content: any;

  constructor(protected imageUrlService: ImageUrlService,
              protected pageModelService: PageModelService) {}

  ngOnInit() {
    this.getContent();
  }

  getContent(): void {
    const contentRef = getNestedObject(this.configuration, ['models', 'document', '$ref']);
    if (contentRef) {
      this.content = this.pageModelService.getContentViaReference(contentRef);
    }
  }

  getImageUrl(imageRef): string {
    return this.imageUrlService.getImageUrl(imageRef);
  }
}
