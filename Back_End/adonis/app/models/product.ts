import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Category from '#models/category'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare price: number

  @column()
  declare stock: number

  // Campo category_id
  @column()
  declare categoryId: number | null

  // ADICIONADO: Campo validate_date
  @column.date({
    serialize: (value: DateTime | null) => value ? value.toISODate() : null,
    prepare: (value: string | null) => value ? DateTime.fromISO(value) : null,
  })
  declare validate_date: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relacionamento com Category
  @belongsTo(() => Category, {
    foreignKey: 'categoryId',
  })
  declare category: BelongsTo<typeof Category>
}