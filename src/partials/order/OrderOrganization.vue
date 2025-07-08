<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useOrderStore } from '@/stores/order'
import type { Organization } from '@/types/order'
import AppCard from '@/components/AppCard.vue'
import AppInput from '@/components/AppInput.vue'
import AppTextarea from '@/components/AppTextarea.vue'

const orderStore = useOrderStore()

const localData = ref<Organization>({
  name: '',
  address: '',
  phone: '',
  email: '',
})

const currentData = computed(() => orderStore.currentOrderData)

watch(
  currentData,
  (newData) => {
    if (newData) {
      localData.value = { ...newData.organization }
    }
  },
  { immediate: true },
)

watch(
  () => orderStore.isEditMode,
  (isEdit) => {
    if (isEdit && currentData.value) {
      localData.value = { ...currentData.value.organization }
    }
  },
)

const updateField = <K extends keyof Organization>(field: K, value: Organization[K]) => {
  orderStore.updateOrganization(field, value)
}
</script>

<template>
  <AppCard>
    <template #header>
      <h3>{{ $t('orderForm.organization.title') }}</h3>
    </template>
    <AppInput
      v-model="localData.name"
      :label="$t('orderForm.organization.name')"
      :placeholder="$t('orderForm.organization.name')"
      :readonly="!orderStore.isEditMode"
      @update:model-value="updateField('name', String($event))"
    >
      <template #readonly>
        {{ currentData?.organization.name || '-' }}
      </template>
    </AppInput>
    <AppTextarea
      v-model="localData.address"
      :label="$t('orderForm.organization.address')"
      :placeholder="$t('orderForm.organization.address')"
      :readonly="!orderStore.isEditMode"
      :rows="3"
      @update:model-value="updateField('address', String($event))"
    >
      <template #readonly>
        {{ currentData?.organization.address || '-' }}
      </template>
    </AppTextarea>
    <AppInput
      v-model="localData.phone"
      type="tel"
      :label="$t('orderForm.organization.phone')"
      :placeholder="$t('orderForm.organization.phone')"
      :readonly="!orderStore.isEditMode"
      @update:model-value="updateField('phone', String($event))"
    >
      <template #readonly>
        <a v-if="currentData?.organization.phone" :href="`tel:${currentData.organization.phone}`">
          {{ currentData.organization.phone }}
        </a>
        <span v-else>-</span>
      </template>
    </AppInput>
    <AppInput
      v-model="localData.email"
      type="email"
      :label="$t('orderForm.organization.email')"
      :placeholder="$t('orderForm.organization.email')"
      :readonly="!orderStore.isEditMode"
      @update:model-value="updateField('email', String($event))"
    >
      <template #readonly>
        <a
          v-if="currentData?.organization.email"
          :href="`mailto:${currentData.organization.email}`"
        >
          {{ currentData.organization.email }}
        </a>
        <span v-else>-</span>
      </template>
    </AppInput>
  </AppCard>
</template>
