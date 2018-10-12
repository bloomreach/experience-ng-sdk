import { Injectable } from '@angular/core';

import pathToRegexp from 'path-to-regexp';

import { CmsUrls } from './cms-urls.service';

export interface RequestContext {
  path: string;
  preview: boolean;
}

@Injectable()
export class RequestContextService {
  private requestContext: RequestContext;
  private regexpKeys: pathToRegexp.Key[];
  private regexp: any;

  constructor() { }

  compilePathRegExps(cmsUrls: CmsUrls): void {
    // construct full URL-path using cmsUrls
    const pathRegExp = (cmsUrls.contextPath !== '' ? `/:contextPath(${cmsUrls.contextPath})?` : '') +
      `/:previewPrefix(${cmsUrls.previewPrefix})?` +
      (cmsUrls.channelPath !== '' ? `/:channelPath(${cmsUrls.channelPath})?` : '') +
      '/:pathInfo*';

    this.regexpKeys = [];
    this.regexp = pathToRegexp(pathRegExp, this.regexpKeys);
  }

  parseUrlPath(urlPath: string = '/'): void {
    const results = this.regexp.exec(urlPath);
    if (results) {
      // find the index of preview and path in keys, so we can look up the corresponding results in the results array
      const pathIdx = this.regexpKeys.findIndex(function (obj) {
        return obj.name === 'pathInfo';
      });
      const previewIdx = this.regexpKeys.findIndex(function (obj) {
        return obj.name === 'previewPrefix';
      });

      const path = results[pathIdx + 1] !== undefined ? results[pathIdx + 1] : '';
      const preview = results[previewIdx + 1] !== undefined;

      this.requestContext = { path: path, preview: preview };
    } else {
      console.log(`Warning! Url ${urlPath} couldn't be parsed, so using defaults for request context`);
      this.requestContext = { path: '', preview: false };
    }
  }

  isPreviewRequest(): boolean {
    return this.requestContext.preview;
  }

  getPath(): string {
    return this.requestContext.path;
  }
}
