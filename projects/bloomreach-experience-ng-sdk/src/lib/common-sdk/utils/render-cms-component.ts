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
