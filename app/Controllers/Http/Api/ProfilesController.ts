import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'

export default class ProfilesController {
  public async me({ auth }: HttpContextContract) {
    const { user } = auth

    const profile = await Profile.query().where('user_id', user!.id).firstOrFail()

    await profile.load('user')

    return profile.serialize({
      fields: ['pseudo', 'user'],
      relations: {
        user: {
          fields: ['email'],
        },
      },
    })
  }
}
