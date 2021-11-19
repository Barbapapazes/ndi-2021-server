import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'

export default class PostsController {
  public async index({ request }: HttpContextContract) {
    const page = request.input('page', 1)

    const posts = await Post.query().preload('profile').paginate(page)

    return posts.serialize({
      fields: ['id', 'title', 'text', 'createdAt', 'updatedAt', 'profile'],
      relations: {
        profile: {
          fields: ['pseudo'],
        },
      },
    })
  }

  public async store({ request, auth }: HttpContextContract) {
    const { user } = auth
    const { title, text } = request.only(['title', 'text'])

    const post = await Post.create({
      userId: user!.id,
      title,
      text,
    })

    await post.load('profile')

    return post.serialize({
      fields: ['id', 'title', 'text', 'createdAt', 'updatedAt', 'profile'],
      relations: {
        profile: {
          fields: ['pseudo'],
        },
      },
    })
  }

  public async show({ params }: HttpContextContract) {
    const { id } = params

    const post = await Post.query().where('id', id).preload('profile').firstOrFail()

    return post.serialize({
      fields: ['id', 'title', 'text', 'createdAt', 'updatedAt', 'profile'],
      relations: {
        profile: {
          fields: ['pseudo'],
        },
      },
    })
  }

  public async update({ params, request }: HttpContextContract) {
    const { id } = params
    const { title, text } = request.only(['title', 'text'])

    const post = await Post.query().where('id', id).firstOrFail()

    post.title = title
    post.text = text

    await post.save()

    await post.load('profile')

    return post.serialize({
      fields: ['id', 'title', 'text', 'createdAt', 'updatedAt', 'profile'],
      relations: {
        profile: {
          fields: ['pseudo'],
        },
      },
    })
  }

  public async destroy() {
    // TODO: Implement delete post using soft delete
  }
}
