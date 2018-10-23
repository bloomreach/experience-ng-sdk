export function _initializeCmsIntegration(onCmsInitialization: Function, renderComponent: Function): void {
  if (typeof window !== 'undefined') {
    (<any>window).SPA = {
      init: (cms) => {
        onCmsInitialization(cms);
      },
      renderComponent: (id, propertiesMap) => {
        renderComponent(id, propertiesMap);
      }
    };
  }
}
