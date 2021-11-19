import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import User from './User'

export default class Profile extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public userId: number

  @column()
  public pseudo: string

  @hasOne(() => User, {
    foreignKey: 'id',
  })
  public user: HasOne<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
