import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable, of, Subject} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ApiUrlsService } from './api-urls.service';
import { RequestContextService } from './request-context.service';

import { ApiUrls } from '../common-sdk/types';
import {
  _buildApiUrl,
  _getContentViaReference,
  _logUpdateComponent,
  _updateComponent,
  updatePageMetaData,
  toUrlEncodedFormData
} from '../common-sdk/utils/page-model';

@Injectable({ providedIn: 'root' })
export class PageModelService {
  channelManagerApi: any;
  pageModel: any;
  pageModelSubject: Subject<any> = new BehaviorSubject<any>(this.pageModel);

  private httpGetOptions = {
    withCredentials: true
  };

  private httpPostOptions = {
    withCredentials: true,
    headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
  };

  constructor(
    private apiUrlsService: ApiUrlsService,
    private requestContextService: RequestContextService,
    private http: HttpClient
  ) {}
  fetchPageModel() {
    const apiUrl: string = this.buildApiUrl();
    return this.http.get<any>(apiUrl, this.httpGetOptions).pipe(
      tap(response => {
        this.pageModel = response;
        this.setPageModelSubject(response);
        const preview: boolean = this.requestContextService.isPreviewRequest();
        const debugging: boolean = this.requestContextService.getDebugging();
        updatePageMetaData(this.pageModel.page, this.channelManagerApi, preview, debugging);
      }),
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

  private setPageModelSubject(pageModel: any): void {
    this.pageModelSubject.next(pageModel);
  }

  setChannelManagerApi(channelManagerApi: any): void {
    this.channelManagerApi = channelManagerApi;
  }

  updateComponent(componentId: string, propertiesMap: any): any {
    // TODO: add debugging to requestContextService
    const debugging: boolean = this.requestContextService.getDebugging();
    _logUpdateComponent(componentId, propertiesMap, debugging);

    const body: string = toUrlEncodedFormData(propertiesMap);
    const url: string = this.buildApiUrl(componentId);

    return this.http.post<any>(url, body, this.httpPostOptions).pipe(
      tap(response => {
        const preview: boolean = this.requestContextService.isPreviewRequest();
        this.pageModel = _updateComponent(response, componentId, this.pageModel, this.channelManagerApi, preview, debugging);
        this.setPageModelSubject(this.pageModel);
      }),
      catchError(this.handleError('updateComponent', undefined)));
  }

  getContentViaReference(contentRef: string): any {
    return _getContentViaReference(contentRef, this.pageModel);
  }

  private buildApiUrl(componentId?: string): string {
    const apiUrls = this.apiUrlsService.getApiUrls();
    const preview = this.requestContextService.isPreviewRequest();
    const urlPath = this.requestContextService.getPath();
    const query = this.requestContextService.getQuery();

    return _buildApiUrl(apiUrls, preview, urlPath, query, componentId);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(`${operation} failed: ${error.message}`);
      console.log(error);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
