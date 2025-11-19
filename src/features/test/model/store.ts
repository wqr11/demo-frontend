import { itemModel } from '@/entities/items'
import { createStore, createEvent, createEffect, sample, combine } from 'effector'

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
        itemModel.getItemsFx()
        count++
      } else {
        stop()
      }
    }, delayMs)

    return intervalId
  },
)

export const $interval = createStore<number | null>(null)
  .on(runFx.doneData, (_, data) => data)
  .on(stopFx.doneData, (state, stopped) => (stopped ? null : state))

export const setRequestCount = createEvent<number>()
export const $requestsCount = createStore(0).on(setRequestCount, (_, data) => data)

export const setDelayMs = createEvent<number>()
export const $delayMs = createStore(0).on(setDelayMs, (_, data) => data)

export const $isRunning = combine(
  $interval,
  (interval) => typeof interval === 'number' && Number.isFinite(interval),
)

export const $remaining = createStore<number>(0)
  .on(runFx, (_, { requestsCount }) => requestsCount)
  .on(itemModel.getItemsFx.done, (state) => state - 1)
  .reset(stopFx.doneData)

export const $sentRequests = createStore(0).on(itemModel.getItemsFx, (state) => state + 1)
export const $successRequests = createStore(0).on(
  itemModel.getItemsFx.doneData,
  (state) => state + 1,
)
export const $failRequests = createStore(0).on(itemModel.getItemsFx.fail, (state) => state + 1)

sample({
  clock: toggle,
  source: $isRunning,
  target: toggleFx,
})

sample({
  clock: stop,
  source: $interval,
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

sample({
  clock: $remaining,
  source: $isRunning,
  filter: (isRunning, remaining) => remaining === 0 && isRunning,
  target: stop,
})
