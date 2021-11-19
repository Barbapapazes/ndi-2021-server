import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'
import SignupValidator from 'App/Validators/SignupValidator'

export default class AuthController {
  public async login({ request, auth }: HttpContextContract) {
    const { email, password, rememberMe } = await request.validate(LoginValidator)

    await auth.attempt(email, password, rememberMe)

    return {
      login: 'ok',
    }
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.logout()

    return {
      logout: 'ok',
    }
  }

  public async signup({ request }: HttpContextContract) {
    const { email, password } = await request.validate(SignupValidator)

    const user = new User()

    user.email = email
    user.password = password

    await user.save()
    await user.related('profile').create({ userId: user.id })

    return {
      signup: 'ok',
    }
  }
}
