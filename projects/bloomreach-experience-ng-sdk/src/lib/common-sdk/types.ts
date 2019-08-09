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
