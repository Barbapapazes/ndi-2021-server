import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import EventsComment from 'App/Models/EventsComment'

export default class EventsCommentsController {
  public async index({ request, params }: HttpContextContract) {
    // eslint-disable-next-line
    const { event_id } = params
    const page = request.input('page', 1)

    const comments = await EventsComment.query()
      .where('event_id', event_id)
      .preload('profile')
      .paginate(page)

    return comments.serialize({
      fields: ['id', 'text', 'created_at', 'updated_at'],
      relations: {
        user: {
          fields: ['pseudo'],
        },
      },
    })
  }

  public async store({ request, auth, params }: HttpContextContract) {
    const { user } = auth
    // eslint-disable-next-line
    const { event_id } = params

    const { text } = request.only(['text'])

    const comment = await EventsComment.create({
      userId: user!.id,
      eventId: event_id,
      text,
    })

    await comment.load('profile')

    return comment.serialize({
      fields: ['id', 'text', 'created_at', 'updated_at'],
      relations: {
        profile: {
          fields: ['pseudo'],
        },
      },
    })
  }

  public async show({ params }: HttpContextContract) {
    // eslint-disable-next-line
    const { id, event_id } = params

    const comment = await EventsComment.query()
      .where('id', id)
      .where('event_id', event_id)
      .preload('profile')
      .firstOrFail()

    return comment.serialize({
      fields: ['id', 'text', 'created_at', 'updated_at'],
      relations: {
        profile: {
          fields: ['id', 'pseudo'],
        },
      },
    })
  }

  public async update({ params, request }: HttpContextContract) {
    // eslint-disable-next-line
    const { id, event_id } = params

    const comment = await EventsComment.query()
      .where('id', id)
      .where('event_id', event_id)
      .firstOrFail()

    const { text } = request.only(['text'])

    comment.text = text

    await comment.save()

    await comment.load('profile')

    return comment.serialize({
      fields: ['id', 'text', 'created_at', 'updated_at'],
      relations: {
        profile: {
          fields: ['pseudo'],
        },
      },
    })
  }

  public async destroy() {
    // TODO: Implement delete using soft delete
  }
}
