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

// import pathToRegexp from 'path-to-regexp';

export interface ApiUrls {
  live?: EnvironmentApiUrls;
  preview?: EnvironmentApiUrls;
}

export interface EnvironmentApiUrls {
  scheme?: string;
  hostname?: string;
  port?: number;
  baseUrl?: string;
  contextPath?: string;
  channelPath?: string;
  previewPrefix?: string;
  apiPath?: string;
  apiComponentRenderingUrlSuffix?: string;
}

export interface CompiledPathRegexp {
  regexpKeys: any;
  regexp: any;
}

export interface Request {
  hostname: string;
  path: string;
}

export class RequestContext {
  constructor(public path: string, public preview: boolean, public query: string) {}
}

export interface ComponentMappings {
  [propName: string]: any;
}
