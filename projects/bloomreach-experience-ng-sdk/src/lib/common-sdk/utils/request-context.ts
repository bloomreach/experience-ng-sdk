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

import pathToRegexp from 'path-to-regexp';

import { ApiUrls, CompiledPathRegexp, Request, RequestContext } from '../types';

export function _parseRequest(request: Request, compiledPathRegexp: CompiledPathRegexp, apiUrls: ApiUrls, debug: boolean): RequestContext {
  const parsedUrlPath: string = compiledPathRegexp.regexp.exec(request.path);

  const path: string = getPathFromParsedUrl(parsedUrlPath, compiledPathRegexp.regexpKeys);
  const preview: boolean = detectPreview(request, apiUrls, parsedUrlPath, compiledPathRegexp.regexpKeys);

  if (debug) {
    console.log(`### SDK debugging ### parsing URL-path '%s'`, request.path);
    console.log(`### SDK debugging ### parsed path is '%s'`, path);
    console.log(`### SDK debugging ### preview mode is %s`, preview);
  }

  return new RequestContext(path, preview);
}

function getPathFromParsedUrl(parsedUrlPath: string, regexpKeys: pathToRegexp.Key[]): string {
  if (parsedUrlPath) {
    // find the index of path in regexpKeys, so we can look up the corresponding results in the parsedUrlPath array
    const pathIdx: number = regexpKeys.findIndex(function (obj) {
      return obj.name === 'pathInfo';
    });

    return parsedUrlPath[pathIdx + 1] !== undefined ? parsedUrlPath[pathIdx + 1] : '';
  }
  return '';
}

function detectPreview(request: Request, apiUrls: ApiUrls, parsedUrlPath: string, regexpKeys: pathToRegexp.Key[]) {
  return hasPreviewQueryParameter(request.path)
    || hasPreviewPathPrefix(parsedUrlPath, regexpKeys)
    || request.hostname && isMatchingPreviewHostname(getHostname(request.hostname), apiUrls);
}

// removes port number from hostname
function getHostname(hostname: string) {
  return hostname.split(':', 2)[0];
}

function hasPreviewQueryParameter(urlPath: string): boolean {
  const queryStringIdx: number = urlPath.indexOf('?');
  if (queryStringIdx !== -1) {
    const queryString: string = urlPath.substring(queryStringIdx);
    if (queryString.indexOf('?bloomreach-preview=true') !== -1 ||
      queryString.indexOf('&bloomreach-preview=true') !== -1) {
      return true;
    }
  }
  return false;
}

// if hostname is different for preview and live,
// then hostname can be used to detect if we're in preview mode
function isMatchingPreviewHostname(hostname: string, apiUrls: ApiUrls): boolean {
  if (apiUrls.live.hostname !== apiUrls.preview.hostname) {
    if (hostname === apiUrls.preview.hostname) {
      return true;
    }
  }
  return false;
}

  // use preview-prefix in URL-path to detect preview mode
function hasPreviewPathPrefix(parsedUrlPath: string, regexpKeys: pathToRegexp.Key[]): boolean {
  // find the index of preview in regexpKeys, so we can look up the corresponding results in the parsedUrlPath array
  const previewIdx = regexpKeys.findIndex(function(obj) {
    return obj.name === 'previewPrefix';
  });
  return parsedUrlPath[previewIdx + 1] !== undefined ? true : false;
}
