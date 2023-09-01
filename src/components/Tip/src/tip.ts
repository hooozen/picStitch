import { AppContext } from "vue"

export interface TipPropsType {
  id: string,
  text: string
  duration: number
  offset?: number
}

export const tipDefaults = {
  duration: 3000,
  id: '',
  text: '',
  offset: 16,
}

export interface TipHandler {
  close: () => void
}

export type TipFn = {
  (options?: any, context?: null | AppContext): TipHandler
}
