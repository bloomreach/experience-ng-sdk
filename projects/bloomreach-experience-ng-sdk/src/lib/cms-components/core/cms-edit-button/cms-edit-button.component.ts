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

import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { RequestContextService } from '../../../services/request-context.service';

import { addEditButtonMetaData } from '../../../common-sdk/utils/cms-meta-data';

@Component({
  selector: 'bre-cms-edit-button',
  templateUrl: './cms-edit-button.component.html',
  styleUrls: ['./cms-edit-button.component.css']
})
export class CmsEditButtonComponent implements OnInit {
  @Input() configuration: any;
  @ViewChild('buttonElm') buttonElm;

  constructor(private requestContextService: RequestContextService) {}

  ngOnInit() {
    this.addCmsMetaData();
  }

  addCmsMetaData(): void {
    const preview: boolean = this.requestContextService.isPreviewRequest();
    addEditButtonMetaData(preview, this.buttonElm.nativeElement, this.configuration);
  }
}
