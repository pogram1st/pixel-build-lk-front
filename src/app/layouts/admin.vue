<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header
            class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
        >
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-8">
                        <NuxtLink
                            :to="RoutePaths[RouteNames.ADMIN_DASHBOARD] as string"
                            class="flex items-center space-x-2"
                        >
                            <div
                                class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center"
                            >
                                <span class="text-white font-bold text-lg">PB</span>
                            </div>
                            <span class="text-xl font-bold text-gray-900 dark:text-white"
                                >Pixel Build Admin</span
                            >
                        </NuxtLink>
                        <nav class="hidden md:flex items-center space-x-1">
                            <NuxtLink
                                :to="RoutePaths[RouteNames.ADMIN_DASHBOARD] as string"
                                class="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                            >
                                Дашборд
                            </NuxtLink>
                            <NuxtLink
                                :to="RoutePaths[RouteNames.ADMIN_ORDERS] as string"
                                class="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                            >
                                Заказы
                            </NuxtLink>
                            <NuxtLink
                                :to="RoutePaths[RouteNames.ADMIN_USERS] as string"
                                class="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                            >
                                Пользователи
                            </NuxtLink>
                            <NuxtLink
                                :to="RoutePaths[RouteNames.ADMIN_SERVICES] as string"
                                class="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                            >
                                Услуги
                            </NuxtLink>
                            <NuxtLink
                                :to="RoutePaths[RouteNames.ADMIN_STATUSES] as string"
                                class="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                            >
                                Статусы
                            </NuxtLink>
                        </nav>
                        <!-- Мобильное меню -->
                        <button
                            @click="mobileMenuOpen = !mobileMenuOpen"
                            class="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <svg
                                class="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    v-if="!mobileMenuOpen"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                                <path
                                    v-else
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div v-if="authStore.user" class="flex items-center space-x-3">
                            <div class="text-right hidden sm:block">
                                <div class="text-sm font-medium text-gray-900 dark:text-white">
                                    {{ authStore.user.username }}
                                </div>
                                <div class="text-xs text-gray-500 dark:text-gray-400">
                                    {{ authStore.user.email }}
                                </div>
                            </div>
                            <div
                                class="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center"
                            >
                                <span
                                    class="text-primary-600 dark:text-primary-400 font-semibold text-sm"
                                >
                                    {{ authStore.user.username.charAt(0).toUpperCase() }}
                                </span>
                            </div>
                        </div>
                        <button
                            @click="handleLogout"
                            class="px-4 py-2 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            Выход
                        </button>
                    </div>
                </div>
            </div>
            <!-- Мобильное меню -->
            <div
                v-if="mobileMenuOpen"
                class="md:hidden border-t border-gray-200 dark:border-gray-700 py-2"
            >
                <NuxtLink
                    :to="RoutePaths[RouteNames.ADMIN_DASHBOARD] as string"
                    class="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    @click="mobileMenuOpen = false"
                >
                    Дашборд
                </NuxtLink>
                <NuxtLink
                    :to="RoutePaths[RouteNames.ADMIN_ORDERS] as string"
                    class="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    @click="mobileMenuOpen = false"
                >
                    Заказы
                </NuxtLink>
                <NuxtLink
                    :to="RoutePaths[RouteNames.ADMIN_USERS] as string"
                    class="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    @click="mobileMenuOpen = false"
                >
                    Пользователи
                </NuxtLink>
                <NuxtLink
                    :to="RoutePaths[RouteNames.ADMIN_SERVICES] as string"
                    class="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    @click="mobileMenuOpen = false"
                >
                    Услуги
                </NuxtLink>
                <NuxtLink
                    :to="RoutePaths[RouteNames.ADMIN_STATUSES] as string"
                    class="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    @click="mobileMenuOpen = false"
                >
                    Статусы
                </NuxtLink>
            </div>
        </header>
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
    import { useAuthStore } from '@features/auth/model/useAuthStore'
    import { RouteNames } from '@shared/config/RouteNames'
    import { RoutePaths } from '@shared/config/RoutePaths'
    import { useToast } from '@shared/lib/useToast'

    const router = useRouter()
    const authStore = useAuthStore()
    const toast = useToast()
    const mobileMenuOpen = ref(false)

    const handleLogout = async () => {
        clearToken()
        toast.showSuccess('Вы вышли из системы')
        await router.push(RoutePaths[RouteNames.AUTH_LOGIN] as string)
    }
</script>
