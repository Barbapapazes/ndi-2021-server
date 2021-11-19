import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'

export default class UsersController {
  public async destroy({ auth }: HttpContextContract) {
    const { user } = auth

    const profile = await Profile.query().where('user_id', user!.id).firstOrFail()

    await profile.delete()
    await user!.delete()

    return user
  }
}
