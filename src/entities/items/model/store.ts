import { attach, createEffect, createEvent, createStore, sample } from 'effector'
import { ItemsApi } from '..'
import type { GetItemsParams } from '../api'
import type { IItem } from '../types'

export const PAGE_SIZE = 20

export const incrementPage = createEvent<void>()
export const $page = createStore<number>(0).on(incrementPage, (state) => state + 1)

export const getItemsFx = createEffect(async (params: GetItemsParams) => {
  const item = ItemsApi.getItems(params)
  return item
})

export const getPagedItemsFx = attach({
  source: $page,
  mapParams: (_: void, page) => ({ limit: PAGE_SIZE, offset: PAGE_SIZE * page }),
  effect: getItemsFx,
})

export const $items = createStore<IItem[]>([]).on(getItemsFx.doneData, (state, data) => [
  ...new Set([...state, ...data.items]),
])

sample({
  /*
    Not ideal for production: it's better to use getItemsFx.doneData
    But for THIS use-case (sending a lot of parallel requests for testing) it's ok
  */
  clock: getPagedItemsFx,
  target: incrementPage,
})
