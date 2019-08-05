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

import { ApiUrls, CompiledPathRegexp, Request, RequestContext } from '../common-sdk/types';
import { _parseRequest } from '../common-sdk/utils/request-context';
@Injectable({ providedIn: 'root' })
export class RequestContextService {
  private requestContext: RequestContext;
  private debugging = false;

  constructor(private apiUrlsService: ApiUrlsService) {
  }

  getDebugging(): boolean {
    return this.debugging;
  }

  setDebugging(debugging: boolean): void {
    this.debugging = debugging;
  }

  isPreviewRequest(): boolean {
    return this.requestContext.preview;
  }

  getPath(): string {
    return this.requestContext.path;
  }

  parseUrlPath(urlPath: string): void {
    this.parseRequest({
      hostname: (typeof window === 'undefined') ? undefined : window.location.hostname,
      path: urlPath,
    });
  }

  parseRequest(request: Request): void {
    const apiUrls: ApiUrls = this.apiUrlsService.getApiUrls();
    const compiledPathRegexp: CompiledPathRegexp = this.apiUrlsService.getCompiledPathRegexp();
    this.requestContext = _parseRequest(request, compiledPathRegexp, apiUrls, this.debugging);
  }
}
