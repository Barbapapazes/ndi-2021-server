/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { message: "Welcome to the Nuit de l'info 2021" }
})

Route.group(() => {
  Route.post('/login', 'AuthController.login')
  Route.post('/logout', 'AuthController.logout')

  Route.post('/signup', 'AuthController.signup')
})
  .prefix('auth')
  .namespace('App/Controllers/Http/Auth')

Route.group(() => {
  Route.delete('/users/:id', 'UsersController.destroy')

  Route.get('/profiles/me', 'ProfilesController.me')
  Route.patch('/profiles/:id', 'ProfilesController.update')

  Route.resource('/posts', 'PostsController').apiOnly()
  Route.resource('posts.comments', 'PostsCommentsController').apiOnly()

  Route.resource('/events', 'EventsController').apiOnly()
  Route.resource('events.comments', 'EventsCommentsController').apiOnly()
})
  .prefix('api')
  .middleware('auth')
  .namespace('App/Controllers/Http/Api')
