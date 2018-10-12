# BloomReach Experience SDK for Angular

SDK for powering content and components in Angular applications by [BloomReach Experience](https://www.bloomreach.com/en/products/experience). 
This library makes integrating a Angular app with BloomReach Experience a breeze. It supports both 
client-side- and server-side rendered/universal Angular apps. 

BloomReach Experience allows you to use an external front-end such as Angular for rendering while still 
providing a native-like authoring experience, such as integrated preview, in-context editing, drag & 
drop, server-side personalization. For more information on this approach, see [A new approach to 
integrating SPA's with WCM: Fixing what's wrong with headless integrations](https://www.bloomreach.com/en/blog/2018/03/a-new-approach-to-integrating-spas-with-wcm-fixing-what%E2%80%99s-wrong-with-headless-integrations.html).

## Install

```bash
npm install bloomreach-experience-ng-sdk jsonpointer path-to-regexp --save
```

Please note that since it's not a best practice to include 3rd party libraries with an Angular library, 
the 3rd party libraries have to be installed manually as done by the above command.

## Usage

Add the SDK to your NgModule's imports:
```typescript
import { BloomreachExperienceNgSdkModule } from 'bloomreach-experience-ng-sdk';

@NgModule({
  imports: [
    // ... other imports
    BloomreachExperienceNgSdkModule
    ],
    ...
```

Then, add the following to an Angular component where you want BloomReach to (partly) determine what to 
render:
- Import `ComponentMappingsService`, `InitializeSdkService`, and `RequestContextService`;
- Add these services to the constructor of the component;
- Set component mappings through `ComponentMappingsService`;
- Set current URL-path via `RequestContextService`;
- Call `initialize()` method of `InitializeSdkService`;
- And add `<bre-render-cms-component></bre-render-cms-component>` to the component template.

See the next paragraph for a description and explanation of each of the services and the components. 
There's also an API section below with even more details.

```typescript
import { Component, OnInit } from '@angular/core';
import { ComponentMappingsService, InitializeSdkService, RequestContextService } from 'bloomreach-experience-ng-sdk';

@Component({
  template: `<bre-render-cms-component></bre-render-cms-component>`,
})
export class MyAppClass implements OnInit {
  componentMappings = {
    "MyCustomComponent": MyCustomComponent
  };
  
  constructor(private componentMappingsService: ComponentMappingsService,
              private initializeSdkService: InitializeSdkService,
              private requestContextService: RequestContextService) {}

  ngOnInit() {
    this.componentMappingsService.setComponentMappings(this.componentMappings);
    this.requestContextService.parseUrlPath(window.location.pathname);
    this.initializeSdkService.initialize();
  }
}
```

The component mappings tell the Angular app what Angular components to use for rendering components from 
the Page Model API response, by mapping these to the *hst:label* of a CMS catalog component. These mappings are set through the `ComponentMappingsService`.

The `RequestContextService` is used to pass the current URL so that it can fetch the Page Model for the 
page that is active; and to detect whether preview is active so that meta-data for CMS' Channel Manager 
functionality (e.g. in-context editing) is included in the HTML, and consequently Channel Manager 
functionality is enabled.

`InitializeSdkService` fetches the Page Model for the current URL that is set through 
`RequestContextService`; it fetches updates on component changes in the CMS; and it initializes the CMS' 
Channel Manager integration.

Finally, `<bre-render-cms-component>` renders the components and any content referenced from the 
components in the Page Model API response. The component should be placed in the Angular app at the 
exact location where you want BloomReach Experience to render its components.

### More component examples

For more detailed examples, see the components included in the [demo application](https://github.com/bloomreach/experience-ng-sdk/tree/master/demo/src/components). 

## Creating custom components

Custom components that are rendered through `<bre-render-cms-component>` can be created just 
as any other regular Angular component. However, it should implement the `BaseComponent` interface that 
is provided by the SDK.

Additionally, all components that are rendered through `<bre-render-cms-component>` should be added to 
the `@NgModule()`'s `entryComponents` array, as the components are created using the componentFactory. 
Otherwise you will get an error during component rendering.

### Properties

The following properties are passed to the component, provided it's rendered by `<RenderCmsComponent>`:
- `configuration` - `Object` component configuration. Contains the contributed models, raw parameters 
 and resolved parameters. Content included in the component's model is not serialized as part of the 
 component's configuration but in a separate content object, and a JSON Pointer reference is used to 
 link to the actual content object. This is done to prevent content from being included multiple times 
 in the API response when referenced multiple times on a page. 

### Example

```typescript
import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent, getNestedObject } from 'bloomreach-experience-ng-sdk';

@Component({
  selector: 'app-news-list',
  templateUrl: `
    <div class="row" *ngIf="items; else configureComponentBlock">
      <div class="col-sm-12 news-list">
        <app-news-item *ngFor="let item of items" [contentRef]="item"></app-news-item>
      </div>
      <nav class="blog-pagination">
        <span class="btn btn-outline-primary disabled">Older</span>
        <span class="btn btn-outline-secondary disabled">Newer</span>
      </nav>
    </div>
    <ng-template #configureComponentBlock>Click to configure {{configuration.label}}</ng-template>`,
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements BaseComponent, OnInit {
  @Input() configuration: any;
  items: any;

  constructor() { }

  ngOnInit() {
    this.createList();
  }

  createList() {
    this.items = getNestedObject(this.configuration, ['models', 'pageable', 'items']);
  }
}
```

### Content components

Components that reference a single content-item (e.g. the Banner component) can use a superclass that 
provides a convenient method for retrieving the corresponding content-item based on the reference found 
in the component's configuration.

To use the superclass, a content component has to extend `SingleContentComponent`, which is 
provided by the SDK. Just as a regular custom component, the component will need to implement the 
`BaseComponent` interface.

The `SingleContentComponent` provides two methods: `getContent()` and `getImageUrl(imageRef)`. See more 
details below.

Finally, content components can use the `<bre-edit-content>` component for rendering the [Manage Content Button](https://www.onehippo.org/library/concepts/component-development/render-manage-content-button.html) 
in preview mode in the CMS.

#### Properties

- `content` - `Object` raw content object that contains the content-item's fields and field-values. Any 
 references to other content-items (e.g. images) are serialized as JSON Pointers.

#### Methods

- `getContent` - `Object` retrieves the component's referenced content-item using the JSONPointer that 
 is found in the component's configuration. Stores the content-item object in the `content` property.
- `getImageUrl(imageRef: string)` - `String` generates fully qualified URL to an image using the 
 JSONPointer reference to the image.

#### Example

```typescript
import { Component, OnInit } from '@angular/core';
import { BaseComponent, ImageUrlService, PageModelService, SingleContentComponent } from 'bloomreach-experience-ng-sdk';

@Component({
  selector: 'app-banner',
  templateUrl: `
    <div class="jumbotron has-edit-button" *ngIf="content; else configureComponentBlock">
      <bre-edit-content *ngIf="content._meta" [metaData]="content._meta"></bre-edit-content>
      <h1>{{content.title}}</h1>
      <figure>
        <img src={{imageUrl}} alt={{content.title}}/>
      </figure>
      <p [innerHTML]="content.content.value"></p>
    </div>
    <ng-template #configureComponentBlock>Click to configure {{configuration.label}}</ng-template>`,
  styleUrls: ['./banner.component.css']
})
export class BannerComponent extends SingleContentComponent implements BaseComponent, OnInit {
  imageUrl: string;
  link: any;

  constructor(imageUrlService: ImageUrlService, pageModelService: PageModelService) {
    super(imageUrlService, pageModelService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.getImage();
  }

  getImage() {
    if (this.content && this.content.image) {
      this.imageUrl = super.getImageUrl(this.content.image);
    }
  }
}
```

## API

More information soon to follow...

## FAQ / Troubleshooting

Nothing here yet :)

## Author

Robbert Kauffman - BloomReach
