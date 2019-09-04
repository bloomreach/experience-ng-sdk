/*
 * Copyright 2019 Hippo B.V. (http://www.onehippo.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ComponentMappings } from '../types';

export function getComponentConfiguration(path: string, pageModel: any): any {
  if (pageModel && pageModel.page) {
    if (!path) {
      // use entire page model if no path has been specified
      return pageModel.page;
    } else {
      // or lookup component configuration using supplied path
      return getConfigurationForPath(path, pageModel);
    }
  } else {
    return null;
  }
}

export function getMappedComponent(configuration: any, renderComponent: any, componentMappings: ComponentMappings): any {
  if (renderComponent) {
    return renderComponent;
  } else if (configuration && configuration.label) {
    return _getComponent(configuration.label, componentMappings);
  }
  return null;
}

function _getComponent(type: string, componentMappings: ComponentMappings): any {
  if (type in componentMappings) {
    return componentMappings[type];
  }
  return null;
}

function getConfigurationForPath(path: string, pageModel: any): any {
  const pathSegments: string[] = path.split('/');
  let currPath: string;

  let configuration: any = pageModel.page;
  while (configuration && configuration.components && configuration.components.length > 0) {
    // match the next path segment
    currPath = pathSegments.shift();

    configuration = getConfigurationForPathSegment(currPath, configuration);

    if (configuration && pathSegments.length === 0) {
      // this was the last path segment and we retrieved configuration, so we can return the configuration
      return configuration;
    }
  }
  return null;
}

function getConfigurationForPathSegment(pathSegment: string, configuration: any): any {
  for (const componentIdx of Object.keys(configuration.components)) {
    const component: any = configuration.components[componentIdx];
    // asterisk serves as a wildcard
    if (pathSegment === component.name || pathSegment === '*') {
      return component;
    }
  }
  return null;
}
