# Bloomreach Experience SDK for Angular ![angular](https://angular.io/assets/images/favicons/favicon.ico)

SDK for powering content and components in Angular applications by [BloomReach Experience](https://www.bloomreach.com/en/products/experience). 
This library makes integrating an Angular app with BloomReach Experience a breeze. It 
supports both client-side- and server-side rendered/universal Angular apps. 

BloomReach Experience allows you to use an external front-end such as Angular for 
rendering while still providing a native-like authoring experience, such as integrated 
preview, in-context editing, drag & drop, server-side personalization. For more 
information on this approach, see [A new approach to integrating SPA's with WCM: Fixing 
what's wrong with headless integrations](https://www.bloomreach.com/en/blog/2018/03/a-new-approach-to-integrating-spas-with-wcm-fixing-what%E2%80%99s-wrong-with-headless-integrations.html).

## Install

```bash
npm install bloomreach-experience-ng-sdk jsonpointer path-to-regexp --save
```

Please note that since it's not a best practice to include 3rd party libraries with an 
Angular library, the 3rd party libraries have to be installed manually as done with the 
above command.

## Usage

Add the SDK to the app's NgModule imports:
```typescript
import { BloomreachExperienceNgSdkModule } from 'bloomreach-experience-ng-sdk';

@NgModule({
  imports: [
    // ... other imports
    BloomreachExperienceNgSdkModule
    ],
    ...
```

Then, add the following to an Angular component where you want BloomReach to (partly) 
determine what to render:
- Import `ApiUrlsService`, `ComponentMappingsService`, `InitializeSdkService`, and `RequestContextService`;
- Add these services to the constructor of the component;
- Override default API Urls using `ApiUrlsService`;
- Set component mappings through `ComponentMappingsService`;
- Set current URL-path via `RequestContextService`;
- Call `initialize()` method of `InitializeSdkService`;
- And add `<bre-render-cms-component></bre-render-cms-component>` to the component template.

See the next paragraph for a description and explanation of each of the services and the 
components. There's also an API section below that includes more details.

```typescript
import { Component, OnInit } from '@angular/core';
import { ApiUrlsService, ComponentMappingsService, InitializeSdkService, RequestContextService } from 'bloomreach-experience-ng-sdk';

@Component({
  template: `<bre-render-cms-component></bre-render-cms-component>`,
})
export class MyAppClass implements OnInit {
  componentMappings = {
    "MyCustomComponent": MyCustomComponent
  };

  apiUrls = {
    live: {
      // override live API URL here
    },
    preview: {
      // override preview API URL here
    }
  }
  
  constructor(private apiUrlsService: ApiUrlsService,
              private componentMappingsService: ComponentMappingsService,
              private initializeSdkService: InitializeSdkService,
              private requestContextService: RequestContextService) {}

  ngOnInit() {
    this.apiUrlsService.setApiUrls(this.apiUrls);
    this.componentMappingsService.setComponentMappings(this.componentMappings);
    this.requestContextService.parseUrlPath(window.location.pathname);
    this.initializeSdkService.initialize();
  }
}
```

The component mappings tell the Angular app what Angular components to use for rendering 
components from the Page Model API response, by mapping these to the *hst:label* of a CMS 
catalog component. These mappings are set through the `ComponentMappingsService`.

The `RequestContextService` is used to pass the current URL so that it can fetch the Page 
Model for the page that is active; and to detect whether preview is active so that 
meta-data for CMS' Channel Manager functionality (e.g. in-context editing) is included in 
the HTML, and consequently Channel Manager functionality is enabled.

`InitializeSdkService` fetches the Page Model for the current URL that is set through 
`RequestContextService`. and it initializes the CMS' Channel Manager integration.

Finally, `<bre-render-cms-component>` renders the components and any content referenced 
from the components in the Page Model API response. This tag/component should be placed in 
the Angular app at the exact location where you want the CMS components to be outputted.

## Demo

A demo project is available at [Github](https://github.com/onehippo/hippo-demo-spa-integration).
Please note that in order to use the [Channel Manager Integration](https://www.onehippo.org/library/concepts/spa-plus/channel-manager-spa-api/introduction.html),
you need to have an Enterprise Maven account, which is only available toBloomReach's 
Enterprise customers.

The demo project can be used in combination with the Angular example app. To build and 
run the example app, do the following:

```bash
npm install
npm run start
```

The demo project is configured for React by default, so you will have to update the CORS
headers from http://localhost:3000 to http://localhost:4200 in 
[/hst:hst/hst:hosts/dev-localhost/localhost/hst:root[@hst:responseheaders]](http://localhost:8080/cms/console/?1&path=/hst:hst/hst:hosts/dev-localhost/localhost/hst:root).
Also, make sure to change the Channel Settings in the Channel Manager, and select Angular
from the front-end renderer dropdown menu.

## Creating custom components

Custom components that are rendered through `<bre-render-cms-component>` can be created 
just as any other regular Angular component, with the requirement that it should implement 
the `BaseComponent` interface that is provided by the SDK.

Additionally, all components that are rendered through `<bre-render-cms-component>` should 
be added to the `@NgModule()`'s `entryComponents` array, as the components are created 
using the componentFactory. Otherwise you will get an error during component rendering.

### Properties

The following properties are passed to the component, provided it's rendered by 
`<RenderCmsComponent>`:
- `configuration` - `Object` component configuration. Contains the contributed models, raw 
 parameters and resolved parameters. Content included in the component's model is not 
 serialized as part of the component's configuration but in a separate content object, and 
 a JSON Pointer reference is used to link to the actual content object. This is done to 
 prevent content from being included multiple times in the API response when referenced 
 multiple times on a page. 

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

Components that reference a single content-item (e.g. the Banner component) can use a 
superclass that provides a convenient method for retrieving the corresponding content-item 
based on the reference found in the component's configuration.

To use the superclass, a content component has to extend `SingleContentComponent`, which 
is provided by the SDK. Just as a regular custom component, the component will need to 
implement the `BaseComponent` interface.

The `SingleContentComponent` provides two methods: `getContent()` and 
`getImageUrl(imageRef)`. See more details below.

Finally, content components can use the `<bre-cms-edit-button>` component for rendering 
the [Manage Content 
Button](https://www.onehippo.org/library/concepts/component-development/render-manage-content-button.html) 
in preview mode in the CMS.

#### Properties

- `content` - `Object` raw content object that contains the content-item's fields and 
 field-values. Any references to other content-items (e.g. images) are serialized as JSON 
 Pointers.

#### Methods

- `getContent` - `Object` retrieves the component's referenced content-item using the 
 JSONPointer that is found in the component's configuration. Stores the content-item 
 object in the `content` property.
- `getImageUrl(imageRef: string)` - `String` generates fully qualified URL to an image 
 using the JSONPointer reference to the image.

#### Example

```typescript
import { Component, OnInit } from '@angular/core';
import { BaseComponent, ImageUrlService, PageModelService, SingleContentComponent } from 'bloomreach-experience-ng-sdk';

@Component({
  selector: 'app-banner',
  templateUrl: `
    <div class="jumbotron has-edit-button" *ngIf="content; else configureComponentBlock">
      <bre-cms-edit-button *ngIf="content" [configuration]="content"></bre-cms-edit-button>
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

### Static CMS components

Static CMS components are components that are defined by developers / administrators and 
cannot be modified by users in the CMS. However, any content or site menus these 
components reference can be changed by users in the CMS.

Since `<RenderCmsComponent>` only renders container components (drag-and-drop components) 
by default, you have to specify two additional properties in order to render a static CMS 
component: 
- `path` property to point to the relative path of the component;
- `renderComponent` property to specify which Angular component to use for rendering the 
 component. See the example below.

```typescript
import { Component } from '@angular/core';
import { MenuComponent } from '../cms-components/menu/menu.component';

@Component({
  selector: 'app-static-component-example',
  templateUrl: `<bre-render-cms-component [path]="'menu'" [renderComponent]="menuComponent"></bre-render-cms-component>`,
  styleUrls: ['./static-component-example.css']
})
export class StaticComponentExample {
  menuComponent = MenuComponent;
}
```

### More component examples

For more detailed examples, see the components included in the [demo application](https://github.com/bloomreach/experience-ng-sdk/tree/master/demo/src/app/cms-components). 

## Building the SDK

You can build the SDK using the following command:

```bash
ng build --prod bloomreach-experience-ng-sdk
```

To test out builds locally, you can use the example application that you can build and run from the root:

```bash
npm install
npm run start
```

## API

### `ApiUrlsService`

Service for overriding the default API URLs, which are used for fetching the Page Model 
API. Uses both a live and preview URL for the API URL.

#### Methods

- `setApiUrls(newApiUrls: ApiUrls = {})` - `None` allows you to override the default URLs. 
 Typically you will only have to define `scheme`, `hostname`, `port`, and `contextPath`. 
 See `ApiUrls` type below for format of the `newApiUrls` parameter.

#### `ApiUrls` type

- `live`:
  - `scheme`: `String` scheme (default: *http*)
  - `hostname`: `String` hostname (default: *localhost*)
  - `port`: `number` port number (default: *8080*)
  - `contextPath`: `String` site context-path (default: *site*)
  - `channelPath`: `String` path to the used channel, if channel is accessed through a 
   subpath
  - `previewPrefix`: `String` preview-prefix used by CMS (default: *_cmsinternal*)
  - `apiPath`: `String` path to Page Model API as subpath (default: *resourceapi*)
  - `apiComponentRenderingUrlSuffix`: `String` (default: *_hn:type=component-rendering&_hn:ref=*)
- `preview`: same as live (see above)

### `ComponentMappingsService`

The component mapping maps CMS catalog components to Angular components, so that Angular 
knows what components to use for rendering the components in the Page Model API response.

#### Methods

- `setComponentMappings(componentMappings: ComponentMappings)` - `None` sets the component 
 mappings. Expects as input an object with the `hst:label` of the CMS components as keys 
 and as value the Angular component used for rendering the component.

#### Example

```typescript
import { Component, OnInit } from '@angular/core';
import { ComponentMappingsService } from 'bloomreach-experience-ng-sdk';

export class ComponentMappingExampleComponent implements OnInit {
  constructor(private componentMappingsService: ComponentMappingsService) {}

  ngOnInit() {
    const componentMappings = {
      'Banner': BannerComponent
    }
    this.componentMappingsService.setComponentMappings(this.componentMappings);
  }
}
```

### `ImageUrlService`

Generates URLs to images for any images that are served directly from BloomReach 
Experience.

#### Methods

- `getImageUrl(imageRef)` - `String` returns URL of image using `imageRef`, the JSON 
 Pointer that references the image.
- `getImageUrlByPath(imagePath: string, variant: string)` - `String` returns URL of image 
 using its relative-path and the name of the image-variant.

### `InitializeSdkService`

Service that handles initialization of the SDK, including:
- Fetching initial Page Model via `PageModelService`, and updates to the Page Model on 
 navigation changes or component updates in the CMS.
- Initializating the Channel Manager integration.

#### Methods

- `initialize()` - `None` initializes the SDK by fetching the Page Model and initializing 
 the Channel manager integration.

### `PageModelService`

Fetches the Page Model API and manages state.

#### Methods

- `getPageModel()` - `Object` return the Page Model. Please note that this is a 
 synchronous call, so if this is called during initialization, the Page Model might not
 have been set yet. Use `getPageModelSubject()` in these cases.
- `getPageModelSubject()` `Subject<Object>` return a subject of the Page Model that can be 
 subscribed to for asynchronous access to the Page Model.
- `getContentViaReference(contentRef: string)` - `Object` returns content item from Page 
 Model using the `contentRef` JSON Pointer.

### `RequestContextService`

The `RequestContextService` is used to get the current URL for fetching the Page Model for 
the current page; and to detect whether  preview mode is active so that meta-data for 
Channel Manager functionality (e.g. in-context editing) is included in the HTML, and 
consequently Channel Manager functionality is enabled.

#### Methods

- `parseUrlPath(urlPath: string): void` - parses the current URL-path for detecting the
 current URL and preview detection.
- `parseRequest(request: Request): void` - parses the current request for detecting the
 current URL and preview detection. See `Request` type below for format of the `request`
 parameter.
- `isPreviewRequest(): boolean` - returns if preview mode is active/detected.
- `getDebugging(): boolean` - returns if debugging mode is enabled or not
- `setDebugging(debugging: boolean): void` - sets debugging mode which enables detailed
 logging on request parsing, Channel Manager integration, and component updates.

#### `Request` type

- `hostname: string` - should contain the hostname for the current request:
  - `window.location.hostname` for client-side rendering (Browser Platform);
  - `self.location.hostname` for Web Workers (Worker Platform);
  - `request.hostname` for server-side rendering (Server Platform/Angular Universal).
    For server-side rendering, the SDK expects the request to be injected as `REQUEST` token:
    ```javascript
    import { REQUEST } from 'bloomreach-experience-ng-sdk';

    // ...
    providers: [
      { provide: REQUEST, useValue: request },
    ],
    // ...
    ```

- `path: string` - should contain the URL-path for the current request (client-side this is window.location.pathname).

### `<bre-render-cms-component>`

Renders a CMS component and all of its children using the Page Model supplied by 
`PageModelService`. Will render the entire Page Model by default.

#### Properties

- `path` - `String` path to a component (static CMS component), container or 
 container-item in the Page Model to render only that component and its children. If no 
 path is supplied, entire Page Model will be rendered. 
- `renderComponent` - `Angular.Component` render a static CMS component using specified 
 Angular component. Only works in combination with `path` property, which should specify 
 path to the static CMS component. Site menus that are rendered this way can leverage the 
 `<bre-cms-edit-button>` component for rendering edit buttons in the CMS.

#### Example

```typescript
import { Component } from '@angular/core';
import { MenuComponent } from '../cms-components/menu/menu.component';

@Component({
  selector: 'app-static-component-example',
  templateUrl: `<bre-render-cms-component [path]="'menu'" [renderComponent]="menuComponent"></bre-render-cms-component>`,
  styleUrls: ['./static-component-example.css']
})
export class StaticComponentExample {
  menuComponent = MenuComponent;
}
```

### `<bre-cms-edit-button>`

Inserts meta-data for either a content-item or site menu for placing an edit button in 
preview mode in the CMS.

#### Properties

- `configuration` - `Object` configuration of the content-item or site-menu (not the 
 component configuration containing the content-item/site-menu), which has the `_meta` 
 object in its root.

#### Example

```html
<bre-cms-edit-button *ngIf="menuConfiguration" [configuration]="menuConfiguration"></bre-cms-edit-button>
```

### `getNestedObject(nestedObject, pathArray)`

Returns a nested object or value using a path array. Useful when you need to access deeply 
nested objects/values without having to string null checks together.

#### Arguments

- `nestedObject` - `Object` the object containing the nested object or value.
- `pathArray` - `Array` contains the path to the nested object as an array.

#### Return types

`Object|null` returns the nested object if found, otherwise returns null. 

## FAQ / Troubleshooting

Nothing here yet :)

## Author

Robbert Kauffman - BloomReach
