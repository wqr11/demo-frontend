import type { IItem } from '../types'

export type GetItemsParams = {
  limit?: number
  offset?: number
}

export type GetItemsResult = IItem[]
