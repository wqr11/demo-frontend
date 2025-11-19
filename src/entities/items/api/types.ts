export interface GetItemsParams {
  limit?: number
  offset?: number
}

export interface GetItemsResult {
  id: string
  name: string
  created_at: string
}
