export type InitFunction = (cms) => void;
export type RenderFunction = (id, propertiesMap) => void;

declare const window: {
  SPA?: { init: InitFunction, renderComponent: RenderFunction },
};

export function _initializeCmsIntegration(init: InitFunction, renderComponent: RenderFunction) {
  if (typeof window !== 'undefined') {
    window.SPA = { init, renderComponent };
  }
}
