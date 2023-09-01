import { shallowReactive } from 'vue'
import type { ComponentInternalInstance, VNode } from 'vue'
import type { TipHandler } from './tip'

export type TipContext = {
  id: string
  vnode: VNode
  handler: TipHandler
  vm: ComponentInternalInstance
  props: { [key: string]: any }
}

export const instances: TipContext[] = shallowReactive([])

export const getInstance = (id: string) => {
  const idx = instances.findIndex((instance) => instance.id === id)
  const current = instances[idx]
  let prev: TipContext | undefined
  if (idx > 0) {
    prev = instances[idx - 1]
  }
  return { current, prev }
}

export const getLastOffset = (id: string): number => {
  const { prev } = getInstance(id)
  if (!prev) return 0
  return prev.vm.exposed!.bottom.value
}

export const getOffsetOrSpace = (id: string, offset: number) => {
  const idx = instances.findIndex((instance) => instance.id === id)
  return idx > 0 ? 20 : offset
}
