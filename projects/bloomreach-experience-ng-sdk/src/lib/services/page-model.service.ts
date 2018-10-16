import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable, of, Subject} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import jsonpointer from 'jsonpointer';

import { CmsUrls, CmsUrlsService } from './cms-urls.service';
import { RequestContextService } from './request-context.service';
import findChildById from '../utils/find-child-by-id';

@Injectable()
export class PageModelService {
  channelManagerApi: any;
  pageModel: any;
  pageModelSubject: Subject<any> = new BehaviorSubject<any>(this.pageModel);

  private getOptions = {
    withCredentials: true
  };

  private postOptions = {
    withCredentials: true,
    headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
  };

  constructor(
    private http: HttpClient,
    private cmsUrlsService: CmsUrlsService,
    private requestContextService: RequestContextService) { }

  fetchPageModel() {
    const apiUrl: string = this.buildApiUrl();
    return this.http.get<any>(apiUrl, this.getOptions)
      .pipe(
        tap(
        response => {
            this.pageModel = response;
            this.setPageModelSubject(response);
          },
        ),
        catchError(this.handleError('fetchPageModel', undefined))
      );
  }

  // no subject is needed for some classes that get the page-model after the initial fetch, such as the ImageUrlService
  getPageModel(): any {
    return this.pageModel;
  }

  getPageModelSubject(): Subject<any> {
    return this.pageModelSubject;
  }

  setPageModelSubject(pageModel: any): void {
    this.pageModelSubject.next(pageModel);
  }

  setChannelManagerApi(channelManagerApi: any): void {
    this.channelManagerApi = channelManagerApi;
  }

  updateComponent(componentId: string, propertiesMap: any) {
    // TODO: add debugging to requestContextService
    const debugging = true;
    return this._updateComponent(componentId, propertiesMap, this.pageModel, debugging);
  }

  _updateComponent(componentId: string, propertiesMap: any, pageModel: any, debugging: boolean) {
    if (debugging) {
      console.log(`### React SDK debugging ### component update triggered for '%s' with properties:`, componentId);
      console.dir(propertiesMap);
    }
    // find the component that needs to be updated in the page structure object using its ID
    const componentToUpdate = findChildById(pageModel, componentId);
    if (componentToUpdate !== undefined) {
      const body = this.toUrlEncodedFormData(propertiesMap);
      const url: string = this.buildApiUrl(componentId);
      return this.http.post<any>(url, body, this.postOptions)
        .pipe(
          tap(response => {
              // update configuration of changed component in existing page model
              if (response.page) {
                componentToUpdate.parent[componentToUpdate.idx] = response.page;
              }
              // update documents by merging with original documents map
              if (response.content) {
                // if page has no associated content there is no content map, create it
                if (!this.pageModel.content) {
                  this.pageModel.content = {};
                }
                Object.assign(this.pageModel.content, response.content);
              }
              this.setPageModelSubject(this.pageModel);
            }
          ),
          catchError(this.handleError('updateComponent', undefined))
        );
    }
  }

  getContentViaReference(contentRef: string): any {
    if (contentRef) {
      return jsonpointer.get(this.pageModel, contentRef);
    }
    return null;
  }

  // from rendering.service.js
  private toUrlEncodedFormData(json) {
    return Object.keys(json)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`)
      .join('&');
  }

  private buildApiUrl(componentId?: string): string {
    const cmsUrls: CmsUrls = this.cmsUrlsService.getCmsUrls();
    let url: string = cmsUrls.baseUrl;
    // add api path to URL, and prefix with contextPath and preview-prefix if used
    if (cmsUrls.contextPath !== '') {
      url += '/' + cmsUrls.contextPath;
    }
    if (this.requestContextService.isPreviewRequest()) {
      url += '/' + cmsUrls.previewPrefix;
    }
    if (cmsUrls.channelPath  !== '') {
      url += '/' + cmsUrls.channelPath;
    }
    url += '/' + cmsUrls.apiPath;
    if (this.requestContextService.getPath()) {
      url += '/' + this.requestContextService.getPath();
    }
    // if component ID is supplied, URL should be a component rendering URL
    if (componentId) {
      url += cmsUrls.apiComponentRenderingUrlSuffix + componentId;
    }
    return url;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(`${operation} failed: ${error.message}`);
      console.log(error);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
