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
