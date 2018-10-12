import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BloomreachExperienceNgSdkModule } from 'bloomreach-experience-ng-sdk';

import { AppComponent } from './app.component';
import { BannerComponent } from './essentials-components/banner/banner.component';
import { ContentComponent } from './essentials-components/content/content.component';
import { NewsItemComponent } from './essentials-components/news-item/news-item.component';
import { NewsListComponent } from './essentials-components/news-list/news-list.component';
import { AppRoutingModule } from './app-routing.module';
import { BrePageDemoComponent } from './bre-page-demo/bre-page-demo.component';

@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    ContentComponent,
    NewsItemComponent,
    NewsListComponent,
    BrePageDemoComponent
  ],
  entryComponents: [
    BannerComponent,
    ContentComponent,
    NewsItemComponent,
    NewsListComponent
  ],
  imports: [
    BrowserModule,
    BloomreachExperienceNgSdkModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
