<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppButton from '@/components/AppButton.vue'

const router = useRouter()

const goToOrder = () => {
  router.push('/order')
}
</script>

<template>
  <div class="home-view">
    <div class="container">
      <div class="home-content">
        <h1 class="home-title">{{ $t('home.title') }}</h1>
        <p class="home-description">{{ $t('home.description') }}</p>
        <AppButton variant="primary" size="lg" @click="goToOrder">
          {{ $t('home.goToOrder') }}
        </AppButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) 0;
}

.home-content {
  text-align: center;
  max-width: 600px;
}

.home-title {
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
}

.home-description {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  line-height: 1.6;
}
</style>
