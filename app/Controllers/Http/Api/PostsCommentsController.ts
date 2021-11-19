import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PostsComment from 'App/Models/PostsComment'

export default class PostsCommentsController {
  public async index({ request, params }: HttpContextContract) {
    // eslint-disable-next-line
    const { post_id } = params
    const page = request.input('page', 1)

    const comments = await PostsComment.query()
      .where('post_id', post_id)
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
    const { post_id } = params

    const { text } = request.only(['text'])

    const comment = await PostsComment.create({
      userId: user!.id,
      postId: post_id,
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
    const { id, post_id } = params

    const comment = await PostsComment.query()
      .where('id', id)
      .where('post_id', post_id)
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

  public async update({ params, request, auth }: HttpContextContract) {
    // eslint-disable-next-line
    const { id, post_id } = params

    const comment = await PostsComment.query()

      .where('id', id)
      .where('post_id', post_id)
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
