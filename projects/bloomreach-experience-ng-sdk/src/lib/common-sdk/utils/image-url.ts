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
import getNestedObject from '../utils/get-nested-object';

const FULLY_QUALIFIED_LINK = /\w+:\/\//;

export interface ImageReference {
  $ref: string;
}

export function _getImageUrl(imageRef: ImageReference, pageModel: any, preview: boolean, apiUrls: ApiUrls): string {
  // get image reference
  const imageUuid: string = imageRef.$ref ? imageRef.$ref : undefined;

  // get serialized image via reference
  const image: any = imageUuid ? jsonpointer.get(pageModel, imageUuid) : undefined;

  // build URL
  let imageUrl = getNestedObject(image, ['_links', 'site', 'href']);
  if (imageUrl && !imageUrl.match(FULLY_QUALIFIED_LINK)) {
    const baseUrl: string = preview ? apiUrls.preview.baseUrl : apiUrls.live.baseUrl;
    imageUrl = baseUrl + imageUrl;
  }

  return imageUrl;
}

export function _getImageUrlByPath(imagePath: string, variant: string, preview: boolean, apiUrls: ApiUrls): string {
  const envApiUrls: EnvironmentApiUrls = preview ? apiUrls.preview : apiUrls.live;

  let imageUrl: string = envApiUrls.baseUrl;

  if (envApiUrls.contextPath) {
    imageUrl += '/' + envApiUrls.contextPath;
  }

  imageUrl += '/binaries';

  if (variant) {
    imageUrl += '/' + variant;
  }

  imageUrl += imagePath;

  return imageUrl;
}
