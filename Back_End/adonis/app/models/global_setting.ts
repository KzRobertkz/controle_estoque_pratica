import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class GlobalSetting extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare defaultMinStock: number

  @column()
  declare daysBeforeExpiryNotification: number

  @column()
  declare notifyLowStock: boolean

  @column()
  declare notifyBeforeExpiry: boolean

  @column()
  declare enableEmailNotifications: boolean

  @column()
  declare enableStockAlerts: boolean

  @column()
  declare enableExpiryAlerts: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}