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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BloomreachExperienceNgSdkModule } from 'bloomreach-experience-ng-sdk';

import { AppComponent } from './app.component';
import { BannerComponent } from './cms-components/banner/banner.component';
import { ContentComponent } from './cms-components/content/content.component';
import { MenuComponent } from './cms-components/menu/menu.component';
import { NewsItemComponent } from './cms-components/news-item/news-item.component';
import { NewsListComponent } from './cms-components/news-list/news-list.component';
import { AppRoutingModule } from './app-routing.module';
import { BrePageDemoComponent } from './bre-page-demo/bre-page-demo.component';

@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    ContentComponent,
    MenuComponent,
    NewsItemComponent,
    NewsListComponent,
    BrePageDemoComponent
  ],
  entryComponents: [
    BannerComponent,
    ContentComponent,
    MenuComponent,
    NewsItemComponent,
    NewsListComponent
  ],
  imports: [BrowserModule, BloomreachExperienceNgSdkModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
