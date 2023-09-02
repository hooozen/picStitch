import { createVNode, render, AppContext } from "vue";

import TipConstructor from "./Tip.vue";
import { tipDefaults } from "./tip";
import { instances } from "./instance";

import type { TipContext } from "./instance";
import type { TipFn } from "./tip";

const TIP_MAX = 30;
let seed: number = 0;

const createTip = ({ ...options }, context?: AppContext | null) => {
  const id = `tip_${seed++}`;
  const container = document.createElement("div");

  const props = {
    ...tipDefaults,
    ...options,
    id,
    onClose: () => {
      closeTip(instance);
    },
    onDestroy: () => {
      render(null, container); // remove node from body
    },
  };

  const vnode = createVNode(TipConstructor, props);
  vnode.appContext = context || tip._context;
  render(vnode, container);
  document.body.appendChild(container.firstElementChild!);

  const vm = vnode.component!;

  const handler = {
    close: () => {
      vm.exposed!.visible.value = false;
    },
  };

  const instance = {
    id,
    vnode,
    vm,
    handler,
    props: (vnode.component as any).props,
  };

  return instance;
};

const closeTip = (instance: TipContext) => {
  const idx = instances.indexOf(instance);
  if (idx === -1) return;

  instances.splice(idx, 1);
  const { handler } = instance;
  handler.close();
};

const tip: TipFn & { _context: AppContext | null } = (
  options = {},
  context?: AppContext
) => {
  if (instances.length >= TIP_MAX) {
    return { close: () => undefined };
  }

  const instance = createTip(options, context);

  instances.push(instance);

  return instance.handler;
};

tip._context = null;

export default tip;
