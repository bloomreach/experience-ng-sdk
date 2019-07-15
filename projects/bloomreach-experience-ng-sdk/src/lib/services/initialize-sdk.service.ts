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

import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { RequestContextService } from './request-context.service';
import { PageModelService } from './page-model.service';

import { _initializeCmsIntegration } from '../common-sdk/utils/initialize-cms-integration';
import { logCmsCreateOverlay } from '../common-sdk/utils/page-model';

@Injectable()
export class InitializeSdkService {
  constructor(
    private pageModelService: PageModelService,
    private requestContextService: RequestContextService,
    private router: Router
  ) {}

  initialize(): void {
    this.initializeCmsIntegration();
    this.fetchPageModel();

    // // fetch Page Model API when navigated to a PageComponent
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.requestContextService.parseUrlPath(event.url);
        this.fetchPageModel();
      }
    });
  }

  private fetchPageModel(): void {
    this.pageModelService.fetchPageModel().subscribe();
  }

  // using arrow function so that scope (this) is preserved on callback
  private updateComponent = (id: string, propertiesMap): void => {
    this.pageModelService.updateComponent(id, propertiesMap).subscribe();
  }

  private initializeCmsIntegration(): void {
    _initializeCmsIntegration(this.onCmsInitialization, this.updateComponent);
  }

  // using arrow function so that scope (this) is preserved on callback
  private onCmsInitialization = (cms: any): void => {
    const debugging: boolean = this.requestContextService.getDebugging();
    this.pageModelService.setChannelManagerApi(cms);
    if (this.pageModelService.getPageModel()) {
      cms.createOverlay();
      logCmsCreateOverlay(debugging);
    }
  }
}
