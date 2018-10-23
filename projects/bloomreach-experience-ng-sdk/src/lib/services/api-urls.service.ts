import { Injectable } from '@angular/core';

import { ApiUrls, CompiledPathRegexp } from '../common-sdk/types';
import { _compilePathRegexp, _setApiUrls, initializeDefaultApiUrls } from '../common-sdk/utils/api-urls';

@Injectable()
export class ApiUrlsService {
  private apiUrls: ApiUrls;
  private compiledPathRegexp: CompiledPathRegexp;

  constructor() {
    this.apiUrls = initializeDefaultApiUrls();
  }

  getApiUrls(): ApiUrls {
    return this.apiUrls;
  }

  setApiUrls(newApiUrls: ApiUrls = {}): void {
    this.apiUrls = _setApiUrls(this.apiUrls, newApiUrls);
    this.compilePathRegExp(this.apiUrls);
  }

  private compilePathRegExp(apiUrls: ApiUrls): void {
    this.compiledPathRegexp = _compilePathRegexp(apiUrls);
  }

  getCompiledPathRegexp(): CompiledPathRegexp {
    return this.compiledPathRegexp;
  }
}
