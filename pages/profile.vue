<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
      Профиль
    </h1>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
      <div>
        <h2 class="text-xl font-semibold mb-4">Личная информация</h2>
        <div class="space-y-4">
          <AppInput
            v-model="userData.name"
            label="Имя"
            placeholder="Ваше имя"
          />
          <AppInput
            v-model="userData.email"
            type="email"
            label="Email"
            placeholder="email@example.com"
            disabled
          />
          <AppInput
            v-model="userData.phone"
            label="Телефон"
            placeholder="+7 (999) 123-45-67"
          />
        </div>
        <div class="mt-4">
          <AppButton @click="updateProfile">
            Сохранить изменения
          </AppButton>
        </div>
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h2 class="text-xl font-semibold mb-4">Смена пароля</h2>
        <div class="space-y-4">
          <AppInput
            v-model="passwordData.currentPassword"
            type="password"
            label="Текущий пароль"
            placeholder="Введите текущий пароль"
          />
          <AppInput
            v-model="passwordData.newPassword"
            type="password"
            label="Новый пароль"
            placeholder="Введите новый пароль"
          />
          <AppInput
            v-model="passwordData.confirmPassword"
            type="password"
            label="Подтвердите пароль"
            placeholder="Повторите новый пароль"
          />
        </div>
        <div class="mt-4">
          <AppButton @click="changePassword">
            Изменить пароль
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const api = await import('~/shared/api/api')
const authStore = useAuthStore()

const { data: user } = await useLazyAsyncData('user-me', async () => {
  const { data } = await api.default.get('/user/me')
  return data
})

const userData = ref({
  name: user.value?.name || '',
  email: user.value?.email || '',
  phone: user.value?.phone || ''
})

const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

watch(user, (newUser) => {
  if (newUser) {
    userData.value = {
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone || ''
    }
  }
}, { immediate: true })

const updateProfile = async () => {
  try {
    await api.default.put('/user/update', userData.value)
    alert('Профиль обновлен')
  } catch (error: any) {
    alert(error.response?.data?.message || 'Ошибка обновления профиля')
  }
}

const changePassword = async () => {
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    alert('Пароли не совпадают')
    return
  }
  try {
    await api.default.put('/user/update', {
      currentPassword: passwordData.value.currentPassword,
      newPassword: passwordData.value.newPassword
    })
    alert('Пароль изменен')
    passwordData.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error: any) {
    alert(error.response?.data?.message || 'Ошибка смены пароля')
  }
}
</script>

