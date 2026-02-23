// Improved type definition for GrapesJS editor
export interface GrapesJSEditor {
  getHtml: () => string;
  getCss: () => string | undefined;
  getJs?: () => string;
  setJs?: (js: string) => void;
  setComponents: (components: string | object) => any;
  addComponents: (components: string | object) => any;
  setStyle: (style: string | object) => any;
  UndoManager: {
    undo: () => void;
    redo: () => void;
  };
  select: (component: any) => void;
  getSelected: () => any;
  refresh: () => void;
  setDevice: (device: string) => void;
  getDevice: () => string;
  Components: {
    getComponents: () => any[];
    getById: (id: string) => any;
    getWrapper: () => any;
  };
  BlockManager: {
    getAll: () => any;
  };
  DeviceManager: {
    getAll: () => any;
    get: (id: string) => any;
    add: (device: any) => void;
    remove: (id: string) => void;
  };
  Modal: {
    open: (options: any) => void;
    close: () => void;
  };
  StorageManager: {
    store: (data: Record<string, any>) => void;
    get: (key: string) => any;
  };
  Canvas: {
    getDocument: () => Document | null;
    getFrameEl?: () => HTMLIFrameElement | null;
  };
  on: (event: string, callback: Function) => void;
  off: (event?: string, callback?: Function) => void;
  destroy: () => void;
}