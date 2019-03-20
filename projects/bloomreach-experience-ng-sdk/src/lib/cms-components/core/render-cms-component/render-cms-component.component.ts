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

import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { PageModelService } from '../../../services/page-model.service';
import { getComponentConfiguration } from '../../../common-sdk/utils/render-cms-component';

@Component({
  selector: 'bre-render-cms-component',
  templateUrl: './render-cms-component.component.html',
  styleUrls: ['./render-cms-component.component.css']
})
export class RenderCmsComponent implements OnInit {
  @Input() path?: string;
  @Input() renderComponent?: any;
  @Input() configuration?: any;

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private pageModelService: PageModelService) { }

  ngOnInit() {
    if (this.configuration) {
      // component configuration is already provided as input.
      this.detectChanges();
      return;
    }

    this.getPageModel();
  }

  getPageModel() {
    this.pageModelService.getPageModelSubject()
      .subscribe(pageModel => {
        if (pageModel) {
          this.configuration = getComponentConfiguration(this.path, pageModel);
          this.detectChanges();
        }
      });
  }

  detectChanges() {
    // force Angular to rerender
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }
}
