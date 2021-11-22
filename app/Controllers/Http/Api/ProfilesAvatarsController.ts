import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import ProfileAvatarValidator from 'App/Validators/ProfileAvatarValidator'

export default class ProfilesAvatarsController {
  public async update({ request, auth }: HttpContextContract) {
    const { user } = auth

    const { avatar } = await request.validate(ProfileAvatarValidator)

    const profile = await Profile.findOrFail(user!.id)

    profile.avatar = Attachment.fromFile(avatar)

    await profile.save()
    await profile.load('user')

    return profile.serialize({
      fields: ['user_id', 'pseudo', 'user', 'avatar'],
      relations: {
        user: {
          fields: ['email'],
        },
      },
    })
  }

  public async destroy({ auth }) {
    const { user } = auth

    const profile = await Profile.findOrFail(user!.id)

    profile.avatar = null

    await profile.save()
    await profile.load('user')

    return profile.serialize({
      fields: ['user_id', 'pseudo', 'user', 'avatar'],
      relations: {
        user: {
          fields: ['email'],
        },
      },
    })
  }
}
