import { ErrorCode } from '../types/enums'

export type ErrorContext =
    | 'login'
    | 'register'
    | 'createOrder'
    | 'updateOrder'
    | 'createService'
    | 'updateService'
    | 'deleteService'
    | 'createStatus'
    | 'updateStatus'
    | 'deleteStatus'
    | 'createUser'
    | 'updateUser'
    | 'deleteUser'
    | 'uploadFile'
    | 'deleteFile'
    | 'updateProfile'
    | 'changePassword'
    | 'createAdmin'
    | 'updateStatus'
    | 'createComment'
    | 'general'

/**
 * Преобразует ошибку в понятное сообщение на русском языке в зависимости от контекста
 */
export function getErrorMessage(error: unknown, context: ErrorContext = 'general'): string {
    // Если это строка - возвращаем как есть
    if (typeof error === 'string') {
        return error
    }

    interface ErrorWithResponse {
        response?: {
            status?: number
            data?: {
                error?: {
                    message?: string
                    details?: Record<string, unknown>
                }
                message?: string
            }
        }
        error?: {
            message?: string
            details?: Record<string, unknown>
        }
        code?: string
        message?: string
    }

    // Специфичные сообщения для разных контекстов
    const contextMessages: Record<ErrorContext, Record<number, string>> = {
        login: {
            400: 'Неверный email или пароль',
            401: 'Неверный email или пароль',
            403: 'Доступ запрещен',
            404: 'Пользователь не найден',
            422: 'Неверный формат email или пароля',
            500: 'Ошибка входа. Попробуйте позже',
        },
        register: {
            400: 'Ошибка регистрации. Проверьте данные',
            409: 'Пользователь с таким email уже существует',
            422: 'Неверный формат данных',
            500: 'Ошибка регистрации. Попробуйте позже',
        },
        createOrder: {
            400: 'Ошибка создания заказа. Проверьте данные',
            403: 'Недостаточно прав для создания заказа',
            422: 'Неверный формат данных заказа',
            500: 'Ошибка создания заказа. Попробуйте позже',
        },
        updateOrder: {
            400: 'Ошибка обновления заказа. Проверьте данные',
            403: 'Недостаточно прав для изменения заказа',
            404: 'Заказ не найден',
            422: 'Неверный формат данных заказа',
            500: 'Ошибка обновления заказа. Попробуйте позже',
        },
        createService: {
            400: 'Ошибка создания услуги. Проверьте данные',
            403: 'Недостаточно прав для создания услуги',
            409: 'Услуга с таким названием уже существует',
            422: 'Неверный формат данных услуги',
            500: 'Ошибка создания услуги. Попробуйте позже',
        },
        updateService: {
            400: 'Ошибка обновления услуги. Проверьте данные',
            403: 'Недостаточно прав для изменения услуги',
            404: 'Услуга не найдена',
            422: 'Неверный формат данных услуги',
            500: 'Ошибка обновления услуги. Попробуйте позже',
        },
        deleteService: {
            403: 'Недостаточно прав для удаления услуги',
            404: 'Услуга не найдена',
            409: 'Нельзя удалить услугу, используемую в заказах',
            500: 'Ошибка удаления услуги. Попробуйте позже',
        },
        createStatus: {
            400: 'Ошибка создания статуса. Проверьте данные',
            403: 'Недостаточно прав для создания статуса',
            409: 'Статус с таким названием уже существует',
            422: 'Неверный формат данных статуса',
            500: 'Ошибка создания статуса. Попробуйте позже',
        },
        updateStatus: {
            400: 'Ошибка обновления статуса. Проверьте данные',
            403: 'Недостаточно прав для изменения статуса',
            404: 'Статус не найден',
            422: 'Неверный формат данных статуса',
            500: 'Ошибка обновления статуса. Попробуйте позже',
        },
        deleteStatus: {
            403: 'Недостаточно прав для удаления статуса',
            404: 'Статус не найден',
            409: 'Нельзя удалить статус, используемый в заказах',
            500: 'Ошибка удаления статуса. Попробуйте позже',
        },
        createUser: {
            400: 'Ошибка создания пользователя. Проверьте данные',
            403: 'Недостаточно прав для создания пользователя',
            409: 'Пользователь с таким email уже существует',
            422: 'Неверный формат данных пользователя',
            500: 'Ошибка создания пользователя. Попробуйте позже',
        },
        updateUser: {
            400: 'Ошибка обновления пользователя. Проверьте данные',
            403: 'Недостаточно прав для изменения пользователя',
            404: 'Пользователь не найден',
            422: 'Неверный формат данных пользователя',
            500: 'Ошибка обновления пользователя. Попробуйте позже',
        },
        deleteUser: {
            403: 'Недостаточно прав для удаления пользователя',
            404: 'Пользователь не найден',
            409: 'Нельзя удалить пользователя с активными заказами',
            500: 'Ошибка удаления пользователя. Попробуйте позже',
        },
        uploadFile: {
            400: 'Ошибка загрузки файла. Проверьте формат',
            403: 'Недостаточно прав для загрузки файла',
            413: 'Файл слишком большой',
            415: 'Неподдерживаемый формат файла',
            500: 'Ошибка загрузки файла. Попробуйте позже',
        },
        deleteFile: {
            403: 'Недостаточно прав для удаления файла',
            404: 'Файл не найден',
            500: 'Ошибка удаления файла. Попробуйте позже',
        },
        updateProfile: {
            400: 'Ошибка обновления профиля. Проверьте данные',
            403: 'Недостаточно прав для изменения профиля',
            422: 'Неверный формат данных профиля',
            500: 'Ошибка обновления профиля. Попробуйте позже',
        },
        changePassword: {
            400: 'Ошибка смены пароля. Проверьте данные',
            401: 'Неверный текущий пароль',
            403: 'Недостаточно прав для смены пароля',
            422: 'Новый пароль не соответствует требованиям',
            500: 'Ошибка смены пароля. Попробуйте позже',
        },
        createAdmin: {
            400: 'Ошибка создания администратора. Проверьте данные',
            403: 'Недостаточно прав для создания администратора',
            409: 'Администратор с таким email уже существует',
            422: 'Неверный формат данных администратора',
            500: 'Ошибка создания администратора. Попробуйте позже',
        },
        createComment: {
            400: 'Ошибка добавления комментария. Проверьте данные',
            403: 'Недостаточно прав для добавления комментария',
            404: 'Заказ не найден',
            422: 'Неверный формат комментария',
            500: 'Ошибка добавления комментария. Попробуйте позже',
        },
        general: {
            400: 'Неверные данные запроса',
            401: 'Необходима авторизация',
            403: 'Доступ запрещен',
            404: 'Ресурс не найден',
            422: 'Ошибка валидации данных',
            500: 'Внутренняя ошибка сервера',
            502: 'Сервер недоступен',
            503: 'Сервис временно недоступен',
        },
    }

    // Обработка ошибок от бэка
    if (!error || typeof error !== 'object') {
        return contextMessages.general[500]
    }

    const errorObj: ErrorWithResponse = error
    const nestJsMessage = errorObj?.response?.data?.message || errorObj?.message
    const status = errorObj?.response?.status

    // Если есть статус и контекстное сообщение
    if (status && contextMessages[context]?.[status]) {
        return contextMessages[context][status]
    }

    // Обработка специфичных ошибок
    if (nestJsMessage && typeof nestJsMessage === 'string') {
        // Ошибки валидации полей
        if (nestJsMessage.includes('name') && nestJsMessage.includes('required')) {
            return 'Поле "Имя" обязательно для заполнения'
        }
        if (nestJsMessage.includes('email') && nestJsMessage.includes('required')) {
            return 'Поле "Email" обязательно для заполнения'
        }
        if (nestJsMessage.includes('password') && nestJsMessage.includes('required')) {
            return 'Поле "Пароль" обязательно для заполнения'
        }
        if (nestJsMessage.includes('phone') && nestJsMessage.includes('required')) {
            return 'Поле "Телефон" обязательно для заполнения'
        }

        // Ошибки формата
        if (nestJsMessage.includes('email') && nestJsMessage.includes('format')) {
            return 'Неверный формат email'
        }
        if (nestJsMessage.includes('phone') && nestJsMessage.includes('format')) {
            return 'Неверный формат телефона'
        }

        // Ошибки уникальности
        if (nestJsMessage.includes('email') && nestJsMessage.includes('unique')) {
            return 'Пользователь с таким email уже существует'
        }
        if (nestJsMessage.includes('username') && nestJsMessage.includes('unique')) {
            return 'Пользователь с таким именем уже существует'
        }

        // Ошибки авторизации
        if (nestJsMessage.includes('Invalid identifier or password')) {
            return 'Неверный email или пароль'
        }
        if (nestJsMessage.includes('Your account email is not confirmed')) {
            return 'Подтвердите email для входа в систему'
        }
        if (nestJsMessage.includes('Your account has been blocked')) {
            return 'Ваш аккаунт заблокирован'
        }

        // Возвращаем оригинальное сообщение, если оно понятное
        if (nestJsMessage.length < 100 && !nestJsMessage.includes('Error:')) {
            return nestJsMessage
        }
    }

    // Общие HTTP ошибки
    if (status) {
        const generalMessage = contextMessages.general[status]
        if (generalMessage) {
            return generalMessage
        }
    }

    // Ошибки сети
    if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === ErrorCode.NETWORK_ERROR
    ) {
        return 'Ошибка сети. Проверьте подключение к интернету'
    }
    if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof error.message === 'string' &&
        error.message.includes('Network Error')
    ) {
        return 'Ошибка сети. Проверьте подключение к интернету'
    }

    // Таймаут
    if (error && typeof error === 'object' && 'code' in error && error.code === ErrorCode.TIMEOUT) {
        return 'Превышено время ожидания. Попробуйте позже'
    }
    if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof error.message === 'string' &&
        error.message.includes('timeout')
    ) {
        return 'Превышено время ожидания. Попробуйте позже'
    }

    // Если есть сообщение от NestJS
    if (
        nestJsMessage &&
        typeof nestJsMessage === 'string' &&
        nestJsMessage.length < 100 &&
        !nestJsMessage.includes('Error:')
    ) {
        return nestJsMessage
    }

    // Если ничего не подошло, возвращаем общее сообщение
    return contextMessages.general[500]
}
