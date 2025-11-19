import { $httpHost } from '@/shared/http'

export class ItemsApi {
  static async getItem() {
    const { data } = await $httpHost.get('/items')
    return data
  }
}
