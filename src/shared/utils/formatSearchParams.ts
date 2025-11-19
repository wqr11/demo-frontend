export function formatSearchParams(params?: Record<string, unknown>): string {
  if (!params || Object.keys(params).length === 0) return ''

  const searchParams = [...new Set(Object.entries(params).map(([key, value]) => `${key}=${value}`))]

  return `?${searchParams.join('&')}`
}
