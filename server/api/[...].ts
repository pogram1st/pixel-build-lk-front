import { HttpMethod } from "../types/enums"

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const backendUrl = config.backendUrl || 'http://localhost:4000'
  const apiBase = config.public.apiBase || '/api'
  
  // Получаем путь из URL, убирая префикс apiBase
  const urlPath = event.path.replace(new RegExp(`^${apiBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), '')
  const path = urlPath || ''
  
  // Получаем query параметры
  const query = getQuery(event)
  const queryParams: Record<string, string> = {}
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === 'string') {
      queryParams[key] = value
    } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
      queryParams[key] = value[0]
    }
  }
  const queryString = new URLSearchParams(queryParams).toString()
  const url = queryString ? `${backendUrl}/${path}?${queryString}` : `${backendUrl}/${path}`
  
  // Получаем тело запроса если есть
  let body: unknown = undefined
  if (event.method !== HttpMethod.GET && event.method !== HttpMethod.HEAD) {
    try {
      body = await readBody(event)
    } catch {
      // Игнорируем ошибки чтения тела
    }
  }
  
  // Получаем заголовки
  const headers: Record<string, string> = {}
  event.headers.forEach((value, key) => {
    // Исключаем некоторые заголовки, которые не должны проксироваться
    if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
      headers[key] = value
    }
  })
  
  // Проксируем запрос
  try {
    let fetchBody: BodyInit | undefined = undefined
    if (body !== undefined) {
      if (typeof body === 'string' || body instanceof FormData || body instanceof Blob || body instanceof ArrayBuffer) {
        fetchBody = body
      } else if (ArrayBuffer.isView(body)) {
        const view = body as { buffer: ArrayBuffer; byteOffset: number; byteLength: number }
        fetchBody = new Uint8Array(view.buffer, view.byteOffset, view.byteLength)
      }
    }
    const response = await $fetch(url, {
      method: event.method,
      headers,
      body: fetchBody,
    })
    return response
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      const statusCode = typeof error.statusCode === 'number' ? error.statusCode : 500
      const statusMessage = 'statusMessage' in error && typeof error.statusMessage === 'string' ? error.statusMessage : 'Proxy error'
      throw createError({
        statusCode,
        statusMessage,
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Proxy error',
    })
  }
})

