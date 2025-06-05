import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'global_settings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('default_min_stock').defaultTo(5)
      table.integer('days_before_expiry_notification').defaultTo(30)
      table.boolean('notify_low_stock').defaultTo(true)
      table.boolean('notify_before_expiry').defaultTo(true)
      table.boolean('enable_email_notifications').defaultTo(false)
      table.boolean('enable_stock_alerts').defaultTo(true)
      table.boolean('enable_expiry_alerts').defaultTo(true)
      
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}