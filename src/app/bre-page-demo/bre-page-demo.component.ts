import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CmsUrlsService, ComponentMappingsService, InitializeSdkService, RequestContextService } from 'bloomreach-experience-ng-sdk';

import { ContentComponent } from '../essentials-components/content/content.component';
import { BannerComponent } from '../essentials-components/banner/banner.component';
import { NewsListComponent } from '../essentials-components/news-list/news-list.component';

@Component({
  selector: 'app-bre-page-demo',
  templateUrl: './bre-page-demo.component.html',
  styleUrls: ['./bre-page-demo.component.css']
})
export class BrePageDemoComponent implements OnInit {
  componentMappings = {
    'Banner': BannerComponent,
    'Content': ContentComponent,
    'News List': NewsListComponent,
  };

  cmsUrls = {};

  constructor(private router: Router,
    private cmsUrlsService: CmsUrlsService,
    private componentMappingsService: ComponentMappingsService,
    private initializeSdkService: InitializeSdkService,
    private requestContextService: RequestContextService) { }

  ngOnInit() {
    this.cmsUrlsService.setCmsUrls(this.cmsUrls);
    this.componentMappingsService.setComponentMappings(this.componentMappings);
    this.requestContextService.parseUrlPath(this.router.url);
    this.initializeSdkService.initialize();
  }
}
