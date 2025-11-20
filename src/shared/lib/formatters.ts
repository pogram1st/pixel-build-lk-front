/**
 * Форматирует дату в читаемый формат
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
    if (!date) return ''

    const dateObj = typeof date === 'string' ? new Date(date) : date

    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }

    return dateObj.toLocaleDateString('ru-RU', { ...defaultOptions, ...options })
}

/**
 * Форматирует дату в короткий формат
 */
export function formatDateShort(date: string | Date): string {
    return formatDate(date, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
}

/**
 * Форматирует время
 */
export function formatTime(date: string | Date): string {
    return formatDate(date, {
        hour: '2-digit',
        minute: '2-digit',
    })
}

/**
 * Форматирует сумму в рублях
 */
export function formatCurrency(amount: number | string): string {
    if (!amount) return '0 ₽'

    const num = typeof amount === 'string' ? parseFloat(amount) : amount

    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(num)
}

/**
 * Форматирует номер телефона
 */
export function formatPhone(phone: string): string {
    if (!phone) return ''

    // Убираем все кроме цифр
    const digits = phone.replace(/\D/g, '')

    // Если начинается с 8, заменяем на +7
    const normalizedDigits = digits.startsWith('8') ? '7' + digits.slice(1) : digits

    // Форматируем
    if (normalizedDigits.length === 11 && normalizedDigits.startsWith('7')) {
        return `+7 (${normalizedDigits.slice(1, 4)}) ${normalizedDigits.slice(4, 7)}-${normalizedDigits.slice(7, 9)}-${normalizedDigits.slice(9, 11)}`
    }

    return phone
}

/**
 * Обрезает текст до указанной длины
 */
export function truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) return text

    return text.slice(0, maxLength) + '...'
}

/**
 * Форматирует размер файла
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Б'

    const k = 1024
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Склоняет слова в зависимости от числа
 */
export function pluralize(count: number, words: [string, string, string]): string {
    const cases = [2, 0, 1, 1, 1, 2]
    const index = count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)]
    return words[index]
}

/**
 * Форматирует количество с правильным склонением
 */
export function formatCount(count: number, words: [string, string, string]): string {
    return `${count} ${pluralize(count, words)}`
}

/**
 * Извлекает инициалы из имени
 */
export function getInitials(name: string): string {
    if (!name) return ''

    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2)
}

/**
 * Генерирует случайный цвет для аватара
 */
export function getAvatarColor(name: string): string {
    const colors = [
        '#FF6B6B',
        '#4ECDC4',
        '#45B7D1',
        '#96CEB4',
        '#FFEAA7',
        '#DDA0DD',
        '#98D8C8',
        '#F7DC6F',
        '#BB8FCE',
        '#85C1E9',
    ]

    let hash = 0
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }

    return colors[Math.abs(hash) % colors.length]
}
