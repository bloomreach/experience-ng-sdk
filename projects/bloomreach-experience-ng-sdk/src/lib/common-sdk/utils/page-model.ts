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

import jsonpointer from 'jsonpointer';
import { ApiUrls, EnvironmentApiUrls } from '../types';
import { addPageMetaData } from './cms-meta-data';

const SSO_HANDSHAKE = /(?:^|&)(org.hippoecm.hst.container.render_host=.+?)(?:&|$)/;

export function updatePageMetaData(pageModel: any, channelManagerApi: any, preview: boolean, debugging: boolean): void {
  addPageMetaData(pageModel, preview);
  if (channelManagerApi) {
    channelManagerApi.createOverlay();
    logCmsCreateOverlay(debugging);
  }
}

export function _buildApiUrl(apiUrls: ApiUrls, preview: boolean, urlPath: string, query: string, componentId?: string): string {
  // use either preview or live URLs
  const envApiUrls: EnvironmentApiUrls = preview ? apiUrls.preview : apiUrls.live;

  let url: string = envApiUrls.baseUrl;
  // add api path to URL, and prefix with contextPath and preview-prefix if used
  if (envApiUrls.contextPath !== '') {
    url += '/' + envApiUrls.contextPath;
  }
  if (preview && envApiUrls.previewPrefix !== '') {
    url += '/' + envApiUrls.previewPrefix;
  }
  if (envApiUrls.channelPath !== '') {
    url += '/' + envApiUrls.channelPath;
  }
  url += '/' + envApiUrls.apiPath;
  if (urlPath) {
    url += '/' + urlPath;
  }
  // if component ID is supplied, URL should be a component rendering URL
  if (componentId) {
    url = addComponentRenderingURL(url, componentId, apiUrls);
  }

  const [, ssoHandshake = ''] = (query && query.match(SSO_HANDSHAKE)) || [];
  if (ssoHandshake) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + ssoHandshake;
  }

  return url;
}

function addComponentRenderingURL(url: string, componentId: string, apiUrls: ApiUrls): string {
  const queryStringIdx = url.indexOf('?');
  if (queryStringIdx !== -1) {
    return (url += '&' + apiUrls.preview.apiComponentRenderingUrlSuffix + componentId);
  }
  return (url += '?' + apiUrls.preview.apiComponentRenderingUrlSuffix + componentId);
}

export function _getContentViaReference(contentRef: string, pageModel): any {
  if (contentRef) {
    return jsonpointer.get(pageModel, contentRef);
  }
  return null;
}

export function logCmsCreateOverlay(debugging: boolean): void {
  if (debugging) {
    console.log(`### SDK debugging ### creating CMS overlay`);
  }
}

export function _logUpdateComponent(componentId: string, propertiesMap: any, debugging: boolean): void {
  if (debugging) {
    console.log(`### SDK debugging ### component update triggered for '%s' with properties:`, componentId);
    console.dir(propertiesMap);
  }
}

export function _updateComponent(
    response: any,
    componentId: string,
    pageModel: any,
    channelManagerApi: any,
    preview: boolean,
    debugging: boolean): any {
  const component: any = findChildById(pageModel, componentId);
  if (component !== undefined) {
    // update configuration of changed component in existing page model
    if (response.page) {
      component.parent[component.idx] = response.page;
    }
    // update documents by merging with original documents map
    if (response.content) {
      // if page has no associated content there is no content map, create it
      if (!pageModel.content) {
        pageModel.content = {};
      }
      Object.assign(pageModel.content, response.content);
    }
  }
  return pageModel;
}

interface ParentComponent {
  parent: any;
  idx: string;
}

// returns parent and index of child referenced by ID,
// so that we can easily replace the child
function findChildById(object: any, id: string): ParentComponent {
  return _findChildById(object, id, null, null);
}

function _findChildById(object: any, id: string, parent: any, idx: string): ParentComponent {
  let result: any;
  for (const prop in object) {
    if (object.hasOwnProperty(prop)) {
      if (typeof object[prop] === 'object') {
        result = _findChildById(object[prop], id, object, prop);
        if (typeof result !== 'undefined') {
          return result;
        }
      } else if (prop === 'id' && object.id === id) {
        return { parent: parent, idx: idx };
      }
    }
  }
}

// from rendering.service.js
export function toUrlEncodedFormData(json: any): string {
  return Object.keys(json)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`)
    .join('&');
}
