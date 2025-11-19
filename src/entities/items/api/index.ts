import { $httpHost } from '@/shared/http'
import { formatSearchParams } from '@/shared/utils'
import type { GetItemsParams, GetItemsResult } from '.'

export class ItemsApi {
  static async getItems(params?: GetItemsParams) {
    const searchParams = formatSearchParams(params)

    const { data } = await $httpHost.get<GetItemsResult>(`/items${searchParams}`)
    return data
  }
}

export * from './types'
