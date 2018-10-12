import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { CmsUrlsService } from './services/cms-urls.service';
import { ComponentMappingsService } from './services/component-mappings.service';
import { ImageUrlService } from './services/image-url.service';
import { PageModelService } from './services/page-model.service';
import { RequestContextService } from './services/request-context.service';

import { CmsComponentComponent } from './cms-components/core/cms-component/cms-component.component';
import { ContainerComponent } from './cms-components/core/container/container.component';
import { BaseComponentComponent } from './cms-components/core/base-component/base-component.component';
import { BaseComponentDirective } from './cms-components/core/base-component/base-component.directive';
import { SingleContentComponent } from './cms-components/core/single-content-component/single-content-component.component';
import { UndefinedComponent } from './cms-components/core/undefined/undefined.component';
import { EditContentComponent } from './cms-components/core/edit-content/edit-content.component';
import { MenuComponent } from './cms-components/core/menu/menu.component';
import { RenderCmsComponent } from './cms-components/core/render-cms-component/render-cms-component.component';
import { InitializeSdkService } from './services/initialize-sdk.service';

@NgModule({
  declarations: [
    CmsComponentComponent,
    ContainerComponent,
    BaseComponentComponent,
    BaseComponentDirective,
    SingleContentComponent,
    UndefinedComponent,
    EditContentComponent,
    MenuComponent,
    RenderCmsComponent,
  ],
  entryComponents: [ UndefinedComponent ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
  ],
  providers: [CmsUrlsService, ComponentMappingsService, ImageUrlService, InitializeSdkService, PageModelService, RequestContextService],
  exports: [EditContentComponent, RenderCmsComponent]
})
export class BloomreachExperienceNgSdkModule { }
