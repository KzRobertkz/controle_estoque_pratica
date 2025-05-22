import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'


export default class AuthController {
  
  async register({ request, response }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    await User.create(data)
  
    return response.created({ message: 'Usuário criado com sucesso' })
  }
  
  
  async login({ request }: HttpContext) {
    const {email, password} = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)

    return User.accessTokens.create(user)
  }
  
  async logout({ auth }: HttpContext) {
    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)  

    return { message: 'success' }
  }
  
  async me({ auth }: HttpContext) {
    await auth.check()
    return {
      user: auth.user?.serialize(), // adiciona o .serialize()
    }
  }
  
  async index({ auth, response }: HttpContext) {
    try {
      // Verifica autenticação
      await auth.check()
      
      // Busca todos os usuários ordenados por ID
      const users = await User.query()
        .select('id', 'fullName', 'email', 'createdAt')
        .orderBy('id', 'asc')
      
      return response.json(users)
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      
      if (error.name === 'AuthenticationException') {
        return response.status(401).json({
          message: 'Não autorizado'
        })
      }
      
      return response.status(500).json({
        message: 'Erro ao buscar usuários',
        error: error.message
      })
    }
  }
  
}



