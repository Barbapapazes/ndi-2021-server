import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Message from 'App/Models/Message'

export default class MessagesController {
  public async index({ auth, request }: HttpContextContract) {
    const { user } = auth

    const id = request.input('userId', user!.id)

    const messages = await Message.query()
      .whereIn('id', (query) => query.where('from_id', user!.id).andWhere('to_id', id).select('id'))
      .orWhereIn('id', (query) =>
        query.where('to_id', user!.id).andWhere('from_id', id).select('id')
      )
      .preload('from')
      .preload('to')

    return messages
  }
}
