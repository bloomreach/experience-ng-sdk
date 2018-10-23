import pathToRegexp from 'path-to-regexp';

import { ApiUrls, CompiledPathRegexp, EnvironmentApiUrls } from '../types';

export function initializeDefaultApiUrls(): ApiUrls {
  const apiUrls: ApiUrls = {};
  const defaultScheme = 'http';
  const defaultHostname = 'localhost';
  const defaultPort = 8080;
  const defaultBaseUrl = `${defaultScheme}://${defaultHostname}:${defaultPort}`;
  apiUrls.live = {
    scheme: defaultScheme,
    hostname: defaultHostname,
    port: defaultPort,
    baseUrl: defaultBaseUrl,
    contextPath: 'site',
    channelPath: '',
    previewPrefix: '_cmsinternal',
    apiPath: 'resourceapi',
    apiComponentRenderingUrlSuffix: '_hn:type=component-rendering&_hn:ref='
  };
  apiUrls.preview = Object.assign({}, apiUrls.live);
  return apiUrls;
}

export function _setApiUrls(apiUrls: ApiUrls, newApiUrls: ApiUrls): ApiUrls {
  // merge input URLs with defaults
  if (newApiUrls && newApiUrls.preview) {
    apiUrls.preview = { ...apiUrls.preview, ...newApiUrls.preview };
  }
  if (newApiUrls && newApiUrls.live) {
    apiUrls.live = { ...apiUrls.live, ...newApiUrls.live };
  }

  apiUrls.preview.baseUrl = setBaseUrl(apiUrls.preview);
  apiUrls.live.baseUrl = setBaseUrl(apiUrls.live);
  return apiUrls;
}

function setBaseUrl(apiUrls: EnvironmentApiUrls): string {
  return `${apiUrls.scheme}://${apiUrls.hostname}:${apiUrls.port}`;
}

// pathRegExps are used for preview detection and URL-path extraction
export function _compilePathRegexp(apiUrls: ApiUrls): CompiledPathRegexp {
  const pathRegExp: string =
    (apiUrls.live.contextPath !== '' ? `/:contextPath(${apiUrls.live.contextPath})?` : '') +
    `/:previewPrefix(${apiUrls.live.previewPrefix})?` +
    (apiUrls.live.channelPath !== '' ? `/:channelPath(${apiUrls.live.channelPath})?` : '') +
    '/:pathInfo*';

  const regexpKeys = [];
  const regexp = pathToRegexp(pathRegExp, regexpKeys);
  return { regexpKeys: regexpKeys, regexp: regexp };
}
