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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { ApiUrlsService } from './services/api-urls.service';
import { ComponentMappingsService } from './services/component-mappings.service';
import { ImageUrlService } from './services/image-url.service';
import { PageModelService } from './services/page-model.service';
import { RequestContextService } from './services/request-context.service';

import { CmsComponentComponent } from './cms-components/core/cms-component/cms-component.component';
import { ContainerComponent } from './cms-components/core/container/container.component';
import { BaseComponentComponent } from './cms-components/core/base-component/base-component.component';
import { BaseComponentDirective } from './cms-components/core/base-component/base-component.directive';
import { SingleContentComponent } from './cms-components/core/single-content-component/single-content-component.component';
import { UndefinedComponent } from './cms-components/core/undefined/undefined.component';
import { CmsEditButtonComponent } from './cms-components/core/cms-edit-button/cms-edit-button.component';
import { RenderCmsComponent } from './cms-components/core/render-cms-component/render-cms-component.component';
import { InitializeSdkService } from './services/initialize-sdk.service';

@NgModule({
  declarations: [
    CmsComponentComponent,
    ContainerComponent,
    BaseComponentComponent,
    BaseComponentDirective,
    SingleContentComponent,
    UndefinedComponent,
    CmsEditButtonComponent,
    RenderCmsComponent,
  ],
  entryComponents: [ UndefinedComponent ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
  ],
  providers: [ApiUrlsService, ComponentMappingsService, ImageUrlService, InitializeSdkService, PageModelService, RequestContextService],
  exports: [CmsEditButtonComponent, RenderCmsComponent]
})
export class BloomreachExperienceNgSdkModule { }
