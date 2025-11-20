import { itemModel } from '@/entities/items'
import { createStore, createEvent, createEffect, sample, combine } from 'effector'
import { interval } from 'patronum'

export const TIME_UNIT_MS = 100 // Stopwatch time unit

export const toggle = createEvent<void>()
export const run = createEvent<void>()
export const stop = createEvent<void>()

export const toggleFx = createEffect((isRunning: boolean) => {
  if (isRunning) {
    stop()
    return
  }
  run()
})

export const stopFx = createEffect((id: number) => {
  if (!id) return false
  clearInterval(id)
  return true
})

export const runFx = createEffect(
  async ({ requestsCount, delayMs }: { requestsCount: number; delayMs: number }) => {
    if (!(typeof requestsCount === 'number' && Number.isFinite(requestsCount))) return

    let count = 0

    const intervalId = setInterval(() => {
      if (count < requestsCount) {
        itemModel.getPagedItemsFx()
        count++
      } else {
        stop()
      }
    }, delayMs)

    return intervalId
  },
)

export const $requestIntervalId = createStore<number | null>(null)
  .on(runFx.doneData, (_, data) => data)
  .on(stopFx.doneData, (state, stopped) => (stopped ? null : state))

export const setRequestCount = createEvent<number>()
export const $requestsCount = createStore(0).on(setRequestCount, (_, data) => data)

export const setDelayMs = createEvent<number>()
export const $delayMs = createStore(0).on(setDelayMs, (_, data) => data)

export const $isRunning = combine(
  $requestIntervalId,
  (interval) => typeof interval === 'number' && Number.isFinite(interval),
)

export const $sentRequests = createStore(0).on(itemModel.getItemsFx, (state) => state + 1)
export const $successRequests = createStore(0).on(
  itemModel.getItemsFx.doneData,
  (state) => state + 1,
)
export const $failRequests = createStore(0).on(itemModel.getItemsFx.fail, (state) => state + 1)

export const $stopwatch = interval({
  start: runFx.done,
  stop: stopFx.done,
  timeout: TIME_UNIT_MS,
})

// In milliseconds
export const $executionTime = createStore<number>(0)
  .on($stopwatch.tick, (state) => state + TIME_UNIT_MS)
  .reset(runFx)

sample({
  clock: toggle,
  source: $isRunning,
  target: toggleFx,
})

sample({
  clock: stop,
  source: $requestIntervalId,
  filter: (id) => !!id,
  fn: (id) => id!,
  target: [stopFx],
})

sample({
  clock: run,
  source: { requestsCount: $requestsCount, delayMs: $delayMs },
  filter: ({ requestsCount, delayMs }) => !!requestsCount && !!delayMs,
  target: runFx,
})
