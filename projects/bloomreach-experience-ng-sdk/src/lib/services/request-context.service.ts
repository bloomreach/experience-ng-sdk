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

import { Injectable, Inject, Optional, PLATFORM_ID, InjectionToken } from '@angular/core';
import { isPlatformBrowser, isPlatformServer, isPlatformWorkerApp, isPlatformWorkerUi } from '@angular/common';
import { ApiUrlsService } from './api-urls.service';
import { Request, RequestContext } from '../common-sdk/types';
import { _parseRequest } from '../common-sdk/utils/request-context';

export const REQUEST = new InjectionToken<string>('request');

@Injectable({ providedIn: 'root' })
export class RequestContextService {
  private requestContext: RequestContext;
  private debugging = false;

  constructor(
    private apiUrlsService: ApiUrlsService,
    @Inject(PLATFORM_ID) private platformId,
    @Optional() @Inject(REQUEST) private request,
  ) {}

  getDebugging() {
    return this.debugging;
  }

  setDebugging(debugging: boolean) {
    this.debugging = debugging;
  }

  isPreviewRequest() {
    return this.requestContext.preview;
  }

  getPath() {
    return this.requestContext.path;
  }

  parseUrlPath(path: string) {
    let hostname = '';

    if (isPlatformBrowser(this.platformId)) {
      ({ hostname = '' } = window && window.location || {});
    }
    if (isPlatformWorkerApp(this.platformId) || isPlatformWorkerUi(this.platformId)) {
      ({ hostname = '' } = self && self.location || {});
    }
    if (isPlatformServer(this.platformId)) {
      ({ hostname = '' } = this.request || {});
    }

    this.parseRequest({ hostname, path });
  }

  parseRequest(request: Request) {
    const apiUrls = this.apiUrlsService.getApiUrls();
    const compiledPathRegexp = this.apiUrlsService.getCompiledPathRegexp();
    this.requestContext = _parseRequest(request, compiledPathRegexp, apiUrls, this.debugging);
  }
}
