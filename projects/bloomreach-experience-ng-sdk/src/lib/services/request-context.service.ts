import { Injectable } from '@angular/core';

import pathToRegexp from 'path-to-regexp';

import { ApiUrls, ApiUrlsService } from './api-urls.service';

export interface Request {
  hostname: string;
  path: string;
}

export class RequestContext {
  constructor(public path: string, public preview: boolean) { }
}

@Injectable()
export class RequestContextService {
  private requestContext: RequestContext;
  private regexpKeys: pathToRegexp.Key[];
  private regexp: any;

  constructor(private apiUrlsService: ApiUrlsService) {}

  isPreviewRequest(): boolean {
    return this.requestContext.preview;
  }

  getPath(): string {
    return this.requestContext.path;
  }

  // pathRegExps are used for preview detection and URL-path extraction
  compilePathRegExps(apiUrls: ApiUrls): void {
    const pathRegExp =
      (apiUrls.live.contextPath !== '' ? `/:contextPath(${apiUrls.live.contextPath})?` : '') +
      `/:previewPrefix(${apiUrls.live.previewPrefix})?` +
      (apiUrls.live.channelPath !== '' ? `/:channelPath(${apiUrls.live.channelPath})?` : '') +
      '/:pathInfo*';

    this.regexpKeys = [];
    this.regexp = pathToRegexp(pathRegExp, this.regexpKeys);
  }

  parseRequest(request: Request): RequestContext {
    // TODO: error handling
    const parsedUrlPath = this.regexp.exec(request.path);

    const path = this.getPathFromParsedUrl(parsedUrlPath);
    const preview = this.detectPreview(request, parsedUrlPath);

    this.requestContext = new RequestContext(path, preview);
    return this.requestContext;
  }

  private getPathFromParsedUrl(parsedUrlPath): string {
    if (parsedUrlPath) {
      // find the index of path in regexpKeys, so we can look up the corresponding results in the parsedUrlPath array
      const pathIdx = this.regexpKeys.findIndex(function(obj) {
        return obj.name === 'pathInfo';
      });

      return parsedUrlPath[pathIdx + 1] !== undefined ? parsedUrlPath[pathIdx + 1] : '';
    }
    return '';
  }

  private detectPreview(request: Request, parsedUrlPath): boolean {
    const hostname = this.getHostname(request.hostname);

    // detect CMS/preview mode using query parameter
    let preview = this.hasPreviewQueryParameter(request.path);
    if (!preview) {
      // otherwise use hostname
      preview = this.isMatchingPreviewHostname(hostname);
    }
    if (!preview) {
      // or use preview prefix for preview detection
      preview = this.hasPreviewPathPrefix(parsedUrlPath);
    }

    return preview;
  }

  // removes port number from hostname
  private getHostname(hostname: string): string {
    if (hostname.indexOf(':') !== -1) {
      return hostname.substring(0, hostname.indexOf(':'));
    }
    return hostname;
  }

  private hasPreviewQueryParameter(urlPath: string): boolean {
    const queryStringIdx = urlPath.indexOf('?');
    if (queryStringIdx !== -1) {
      const queryString = urlPath.substring(queryStringIdx);
      if (queryString.indexOf('?bloomreach-preview=true') !== -1 ||
          queryString.indexOf('&bloomreach-preview=true') !== -1) {
        return true;
      }
    }
    return false;
  }

  private isMatchingPreviewHostname(hostname: string): boolean {
    return this._isMatchingPreviewHostname(hostname, this.apiUrlsService.getApiUrls());
  }

  // if hostname is different for preview and live,
  // then hostname can be used to detect if we're in preview mode
  private _isMatchingPreviewHostname(hostname: string, apiUrls: ApiUrls): boolean {
    if (apiUrls.live.hostname !== apiUrls.preview.hostname) {
      if (hostname === apiUrls.preview.hostname) {
        return true;
      }
    }
    return false;
  }

  // use preview-prefix in URL-path to detect preview mode
  private hasPreviewPathPrefix(parsedUrlPath: string): boolean {
    // find the index of preview in regexpKeys, so we can look up the corresponding results in the parsedUrlPath array
    const previewIdx = this.regexpKeys.findIndex(function(obj) {
      return obj.name === 'previewPrefix';
    });
    return parsedUrlPath[previewIdx + 1] !== undefined ? true : false;
  }
}
