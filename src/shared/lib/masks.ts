export const phoneMask = '+7 (###) ###-##-##'

export function cleanPhone(phone: string): string {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.startsWith('8') ? '7' + cleaned.slice(1) : cleaned
}

export function normalizePhone(phone: string | undefined | null): string | undefined {
  if (!phone || !phone.trim()) return undefined
  const cleaned = cleanPhone(phone)
  if (cleaned.length < 11) return undefined
  return '+' + cleaned
}

