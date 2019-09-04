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

import { ApiUrlsService } from './api-urls.service';
import { PageModelService } from './page-model.service';
import { RequestContextService } from './request-context.service';

import { _getImageUrl, _getImageUrlByPath } from '../common-sdk/utils/image-url';

@Injectable({ providedIn: 'root' })
export class ImageUrlService {
  constructor(private apiUrlsService: ApiUrlsService, private requestContextService: RequestContextService,
              private pageModelService: PageModelService) {}

  getImageUrl(imageRef): string {
    const pageModel = this.pageModelService.getPageModel();
    const apiUrls = this.apiUrlsService.getApiUrls();
    const preview = this.requestContextService.isPreviewRequest();

    return _getImageUrl(imageRef, pageModel, preview, apiUrls);
  }

  getImageUrlByPath(imagePath: string, variant: string): string {
    const preview = this.requestContextService.isPreviewRequest();
    const apiUrls = this.apiUrlsService.getApiUrls();
    return _getImageUrlByPath(imagePath, variant, preview, apiUrls);
  }
}
