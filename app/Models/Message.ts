import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public fromId: number

  @column()
  public toId: number

  @column()
  public text: string

  @belongsTo(() => Profile, {
    foreignKey: 'fromId',
    localKey: 'userId',
  })
  public from: BelongsTo<typeof Profile>

  @belongsTo(() => Profile, {
    foreignKey: 'toId',
    localKey: 'userId',
  })
  public to: BelongsTo<typeof Profile>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
