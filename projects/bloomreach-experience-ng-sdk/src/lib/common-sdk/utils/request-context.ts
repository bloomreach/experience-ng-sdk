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

function detectPreview(request: Request, apiUrls: ApiUrls, parsedUrlPath: string, regexpKeys: pathToRegexp.Key[]): boolean {
  const hostname: string = getHostname(request.hostname);

  // detect CMS/preview mode using query parameter
  let preview: boolean = hasPreviewQueryParameter(request.path);
  if (!preview) {
    // otherwise use hostname
    preview = isMatchingPreviewHostname(hostname, apiUrls);
  }
  if (!preview) {
    // or use preview prefix for preview detection
    preview = hasPreviewPathPrefix(parsedUrlPath, regexpKeys);
  }

  return preview;
}

// removes port number from hostname
function getHostname(hostname: string): string {
  if (hostname.indexOf(':') !== -1) {
    return hostname.substring(0, hostname.indexOf(':'));
  }
  return hostname;
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
