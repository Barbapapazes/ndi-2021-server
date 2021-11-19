import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from 'App/Models/Event'

export default class EventsController {
  public async index({ request }: HttpContextContract) {
    const page = request.input('page', 1)

    const events = await Event.query().preload('profile').paginate(page)

    return events.serialize({
      fields: ['id', 'title', 'text', 'createdAt', 'updatedAt', 'profile'],
      relations: {
        profile: {
          fields: ['id', 'pseudo'],
        },
      },
    })
  }

  public async store({ request, auth }: HttpContextContract) {
    const { user } = auth
    const { title, text } = request.only(['title', 'text'])

    const event = await Event.create({
      userId: user!.id,
      title,
      text,
    })

    await event.load('profile')

    return event.serialize({
      fields: ['id', 'title', 'text', 'createdAt', 'updatedAt', 'profile'],
      relations: {
        profile: {
          fields: ['id', 'pseudo'],
        },
      },
    })
  }

  public async show({ params }: HttpContextContract) {
    const { id } = params

    const event = await Event.query().where('id', id).preload('profile').firstOrFail()

    return event.serialize({
      fields: ['id', 'title', 'text', 'createdAt', 'updatedAt', 'profile'],
      relations: {
        profile: {
          fields: ['id', 'pseudo'],
        },
      },
    })
  }

  public async update({ params, request }: HttpContextContract) {
    const { id } = params
    const { title, text } = request.only(['title', 'text'])

    const event = await Event.query().where('id', id).firstOrFail()

    event.title = title
    event.text = text

    await event.save()

    await event.load('profile')

    return event.serialize({
      fields: ['id', 'title', 'text', 'createdAt', 'updatedAt', 'profile'],
      relations: {
        profile: {
          fields: ['id', 'pseudo'],
        },
      },
    })
  }

  public async destroy({ params }: HttpContextContract) {
    const { id } = params

    const event = await Event.query().where('id', id).firstOrFail()

    await event.delete()

    return event
  }
}
