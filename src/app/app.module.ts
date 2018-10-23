import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BloomreachExperienceNgSdkModule } from 'bloomreach-experience-ng-sdk';

import { AppComponent } from './app.component';
import { BannerComponent } from './cms-components/banner/banner.component';
import { ContentComponent } from './cms-components/content/content.component';
import { MenuComponent } from './cms-components/menu/menu.component';
import { NewsItemComponent } from './cms-components/news-item/news-item.component';
import { NewsListComponent } from './cms-components/news-list/news-list.component';
import { AppRoutingModule } from './app-routing.module';
import { BrePageDemoComponent } from './bre-page-demo/bre-page-demo.component';

@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    ContentComponent,
    MenuComponent,
    NewsItemComponent,
    NewsListComponent,
    BrePageDemoComponent
  ],
  entryComponents: [
    BannerComponent,
    ContentComponent,
    MenuComponent,
    NewsItemComponent,
    NewsListComponent
  ],
  imports: [BrowserModule, BloomreachExperienceNgSdkModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
