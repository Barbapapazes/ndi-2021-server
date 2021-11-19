import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class EventsComments extends BaseSchema {
  protected tableName = 'events_comments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').notNullable()
      table.integer('event_id').notNullable()
      table.string('text', 2048).notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('deleted_at', { useTz: true })
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
