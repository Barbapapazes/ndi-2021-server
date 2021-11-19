import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PostsComments extends BaseSchema {
  protected tableName = 'posts_comments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').notNullable()
      table.integer('post_id').notNullable()
      table.string('text', 2048).notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
