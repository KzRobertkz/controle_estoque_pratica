import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  // GET /api/users/list
  async index({}: HttpContext) {
    return await User.all()
  }

  // POST /api/users
  async store({ request }: HttpContext) {
    const data = request.only(['fullName', 'email', 'password'])
    const user = await User.create(data)
    return user
  }

  // GET /api/users/:id
  async show({ params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return user
  }

  // PUT /api/users/:id
  async update({ params, request }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const data = request.only(['fullName', 'email', 'password'])
    user.merge(data)
    await user.save()
    return user
  }

  // DELETE /api/users/:id
  async destroy({ params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return { message: 'Usuário deletado com sucesso.' }
  }

  
}

