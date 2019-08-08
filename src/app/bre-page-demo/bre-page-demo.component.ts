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
import { Router } from '@angular/router';

import { ApiUrlsService, ComponentMappingsService, InitializeSdkService, RequestContextService } from 'bloomreach-experience-ng-sdk';

import { ContentComponent } from '../cms-components/content/content.component';
import { BannerComponent } from '../cms-components/banner/banner.component';
import { MenuComponent } from '../cms-components/menu/menu.component';
import { NewsListComponent } from '../cms-components/news-list/news-list.component';

@Component({
  selector: 'app-bre-page-demo',
  templateUrl: './bre-page-demo.component.html',
  styleUrls: ['./bre-page-demo.component.css']
})
export class BrePageDemoComponent implements OnInit {
  componentMappings = {
    'Banner': BannerComponent,
    'Content': ContentComponent,
    'News List': NewsListComponent,
  };

  apiUrls = {
    live: {
    },
    preview: {
    }
  };

  menuComponent = MenuComponent;

  constructor(
    private router: Router,
    private apiUrlsService: ApiUrlsService,
    private componentMappingsService: ComponentMappingsService,
    private initializeSdkService: InitializeSdkService,
    private requestContextService: RequestContextService
  ) {}

  ngOnInit() {
    this.apiUrlsService.setApiUrls(this.apiUrls);
    this.componentMappingsService.setComponentMappings(this.componentMappings);
    this.requestContextService.parseUrlPath(this.router.url);
    this.initializeSdkService.initialize();
  }
}
