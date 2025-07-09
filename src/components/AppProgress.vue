<template>
  <div class="progress" :style="{ '--steps-count': steps.length }">
    <div
      v-for="(step, index) in steps"
      :key="step.key"
      class="progress__step"
      :class="{
        'progress__step--active': step.key === currentStatus,
        'progress__step--completed': isStepCompleted(step.key),
      }"
    >
      <div class="progress__circle">
        <span v-if="isStepCompleted(step.key)">✓</span>
        <span v-else>{{ index + 1 }}</span>
      </div>
      <div class="progress__label">{{ step.label }}</div>
    </div>
    <div
      v-for="(step, index) in steps.slice(0, -1)"
      :key="`connector-${index}`"
      class="progress__connector"
      :class="{
        'progress__connector--completed': isStepCompleted(steps[index + 1].key),
      }"
      :style="getConnectorStyle(index)"
    ></div>
  </div>
</template>

<script setup lang="ts">
interface Step {
  key: string
  label: string
}

interface Props {
  steps: Step[]
  currentStatus: string
  statusOrder?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  statusOrder: () => ['draft', 'published', 'inProgress', 'completed'],
})

const isStepCompleted = (stepStatus: string): boolean => {
  const currentIndex = props.statusOrder.indexOf(props.currentStatus)
  const stepIndex = props.statusOrder.indexOf(stepStatus)

  return stepIndex < currentIndex
}

const getConnectorStyle = (index: number) => {
  const stepsCount = props.steps.length
  const stepWidth = 100 / stepsCount
  const left = stepWidth * (index + 1) - stepWidth / 2 + 10
  const right = 100 - (stepWidth * (index + 2) - stepWidth / 2 - 10)

  return {
    left: `${left}%`,
    right: `${right}%`,
  }
}
</script>

<style lang="scss" scoped>
.progress {
  display: grid;
  grid-template-columns: repeat(var(--steps-count, 4), 1fr);
  grid-template-rows: auto auto;
  gap: var(--spacing-sm);
  position: relative;
  margin: var(--spacing-lg) 0;

  &__step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    z-index: 2;

    &--active {
      color: var(--primary-color);

      .progress__circle {
        background-color: var(--primary-color);
        color: var(--color-white);
        border: 2px solid var(--primary-color);
      }
    }

    &--completed {
      color: var(--success-color);

      .progress__circle {
        background-color: var(--success-color);
        color: var(--color-white);
        border: 2px solid var(--success-color);
      }
    }
  }

  &__circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--border-color);
    color: var(--text-secondary);
    border: 2px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  &__label {
    font-size: 0.75rem;
    text-align: center;
    font-weight: 500;
    max-width: 80px;
    line-height: 1.2;
  }

  &__connector {
    position: absolute;
    top: 20px;
    height: 2px;
    background-color: var(--border-color);
    transition: background-color 0.3s ease;
    z-index: 1;

    &--completed {
      background-color: var(--success-color);
    }
  }
}

@media (max-width: 768px) {
  .progress {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, auto);

    &__connector {
      display: none;
    }
  }
}
</style>
