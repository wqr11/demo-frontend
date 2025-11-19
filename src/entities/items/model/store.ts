import { createEffect, createStore } from 'effector'
import { ItemsApi } from '..'
import type { GetItemsParams } from '../api'
import type { IItem } from '../types'

export const getItemsFx = createEffect(async (params?: GetItemsParams) => {
  const item = ItemsApi.getItems(params)
  return item
})

export const $items = createStore<IItem[]>([]).on(getItemsFx.doneData, (state, data) => [
  ...new Set([...state, ...data]),
])
