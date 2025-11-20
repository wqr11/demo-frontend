<script setup lang="ts">
import { useUnit } from 'effector-vue/composition'
import { testModel } from '@/features/test'
import InputField from '@/features/input/InputField.vue'

const [requestsCount, setRequestCount] = useUnit([
  testModel.$requestsCount,
  testModel.setRequestCount,
])
const [delayMs, setDelayMs] = useUnit([testModel.$delayMs, testModel.setDelayMs])

const [toggle, isRunning] = useUnit([testModel.toggle, testModel.$isRunning])

const [sentRequests, successRequests, failRequests, executionTime] = useUnit([
  testModel.$sentRequests,
  testModel.$successRequests,
  testModel.$failRequests,
  testModel.$executionTime,
])
</script>

<template>
  <main class="main">
    <div class="layout">
      <div class="sidebar" style="grid-area: controls">
        <h3>Нагрузочный тест</h3>
        <div class="inputs">
          <InputField
            label="requestsCount"
            :value="requestsCount"
            :on-input="(e) => setRequestCount(parseInt((e.target! as HTMLInputElement).value))"
          />
          <InputField
            label="delayMs"
            :value="delayMs"
            :on-input="(e) => setDelayMs(parseInt((e.target! as HTMLInputElement).value))"
          />
          <button @click="toggle">{{ !isRunning ? 'Старт нагрузочного теста' : 'Стоп' }}</button>
        </div>
      </div>
      <div class="sidebar" style="grid-area: metrics">
        <h3>Метрики</h3>
        <div class="metric-grid">
          <div class="metric-item">
            <span class="metric-label">Отправлено: </span>
            <span class="metric-value">{{ sentRequests }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Успешно: </span>
            <span class="metric-value success">{{ successRequests }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Ошибки: </span>
            <span class="metric-value error">{{ failRequests }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Время выполнения:</span>
            <span class="metric-value time">{{ (executionTime / 1_000).toFixed(1) }} с.</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
* {
  margin: 0;
  font-family: Roboto;
}

h3 {
  color: black;
  font-weight: 600;
  font-size: 24px;
  margin-bottom: 12px;
}
</style>

<style scoped>
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.layout {
  width: 60%;
  height: 60%;
  display: grid;
  gap: 20px;
  grid-template-areas: 'controls metrics';
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 1fr;
  @media (max-width: 1280px) {
    grid-template: 'controls' 'metrics';
  }
  @media (max-width: 540px) {
    width: 90%;
  }
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: cornsilk;
  border-radius: 20px;
  padding: 20px;
}

.inputs {
  max-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.metric-label {
  font-size: 14px;
  color: #666;
}

.metric-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}
</style>
