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

import { Component, ElementRef, Input, OnInit } from '@angular/core';

import { RequestContextService } from '../../../services/request-context.service';

import { addContainerMetaData } from '../../../common-sdk/utils/cms-meta-data';

@Component({
  selector: 'bre-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {
  @Input() configuration;
  preview = false;

  constructor(private elementRef: ElementRef, private requestContextService: RequestContextService) {}

  ngOnInit(): void {
    this.preview = this.requestContextService.isPreviewRequest();
    this.addCmsMetaData(this.preview);
  }

  addCmsMetaData(preview: boolean): void {
    addContainerMetaData(preview, this.elementRef.nativeElement, this.configuration);
  }
}
