import {
  AppContext,
  ComponentInternalInstance,
  VNode,
  createVNode,
  render,
} from "vue";
import LoadingConstructor from "./Loading.vue";

export type LoadingHandler = {
  close: () => void;
};

type Instance = {
  vnode?: VNode;
  vm?: ComponentInternalInstance;
  props?: any;
  handler: LoadingHandler;
};

let instance: Instance | null = null;

const createLoading = (options: any, context?: AppContext) => {
  const container = document.createElement("div");

  const props = {
    ...options,
    onDestroy: () => {
      render(null, container);
      instance = null;
    },
  };

  const vnode = createVNode(LoadingConstructor, props);
  vnode.appContext = context || loading._context;

  render(vnode, container);
  document.body.appendChild(container.firstElementChild!);

  const vm = vnode.component!;

  const handler = {
    close: () => {
      vm.exposed!.visible.value = false;
    },
  };
  return { handler };
};

type LoadingFn = (options?: any, context?: AppContext) => LoadingHandler;

const loading: LoadingFn & { _context: AppContext | null } = (
  options: any = {},
  context?: AppContext
) => {
  if (instance) return instance.handler;
  instance = createLoading(options, context);

  return instance.handler;
};

loading._context = null;

export default loading;
