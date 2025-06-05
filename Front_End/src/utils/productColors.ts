export const getStockColor = (currentStock: number, minStock: number, notifyLowStock: boolean) => {
  if (!notifyLowStock) return 'text-green-500'
  
  const stock = Number(currentStock)
  const minimum = Number(minStock)

  if (stock === 0) return 'text-red-500'
  if (stock <= minimum) return 'text-yellow-500'
  return 'text-green-500'
}

export const getValidityColor = (validateDate: string | null, notifyBeforeExpiry: boolean, daysNotification: number) => {
  if (!validateDate || !notifyBeforeExpiry) return 'text-green-500'

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const validityDate = new Date(validateDate)
  validityDate.setHours(0, 0, 0, 0)

  const diffDays = Math.ceil((validityDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return 'text-red-500'
  if (diffDays <= Number(daysNotification)) return 'text-yellow-500'
  return 'text-green-500'
}

export const getValidityMessage = (validateDate: string | null, daysNotification: number) => {
  if (!validateDate) return 'Sem data de validade'

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const validityDate = new Date(validateDate)
  validityDate.setHours(0, 0, 0, 0)

  const diffDays = Math.ceil((validityDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return 'Produto vencido!'
  if (diffDays <= Number(daysNotification)) return `Atenção! Vence em ${diffDays} dias`
  return 'Validade normal'
}

export const formatDate = (date: string | null): string => {
  if (!date) return '-'
  
  const [year, month, day] = date.split('T')[0].split('-')
  return `${day}/${month}/${year}`
}

export const formatDateForAPI = (date: string): string => {
  if (!date) return ''
  const [year, month, day] = date.split('-')
  return `${year}-${month}-${day}T00:00:00.000Z`
}