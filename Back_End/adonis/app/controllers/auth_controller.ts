import { loginValidator, registerValidator, deleteUserValidator, updateEmailValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
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
      user: auth.user?.serialize(),
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

  async updateEmail({ auth, request, response }: HttpContext) {
    try {
      // Verifica se o usuário está autenticado
      await auth.check()
      const user = auth.user!

      // Valida os dados da requisição
      const { email } = await request.validateUsing(updateEmailValidator)

      // Atualiza o email do usuário
      user.email = email
      await user.save()

      return response.json({
        message: 'Email atualizado com sucesso',
        user: {
          id: user.id,

          email: user.email,
          // Adicione outras propriedades do usuário que você precisa
        }
      })

    } catch (error) {
      console.error('Erro ao atualizar email:', error)

      if (error.name === 'AuthenticationException') {
        return response.status(401).json({
          message: 'Não autorizado',
        })
      }

      if (error.name === 'ValidationException') {
        return response.status(400).json({
          message: 'Dados inválidos',
          errors: error.messages,
        })
      }

      return response.status(500).json({
        message: 'Erro interno do servidor',
        error: error.message,
      })
    }
  }


  async deleteUser({ auth, request, response }: HttpContext) {
    try {
      // Verifica se o usuário está autenticado
      await auth.check()
      const user = auth.user!

      // Valida os dados da requisição
      const { password } = await request.validateUsing(deleteUserValidator)

      // Verifica se a senha está correta
      const isPasswordValid = await hash.verify(user.password, password)
      
      if (!isPasswordValid) {
        return response.status(400).json({
          message: 'Senha incorreta'
        })
      }

      // Remove todos os tokens de acesso do usuário
      await User.accessTokens.all(user).then(tokens => {
        tokens.forEach(token => {
          User.accessTokens.delete(user, token.identifier)
        })
      })

      // Exclui o usuário do banco de dados
      await user.delete()

      return response.json({
        message: 'Usuário excluído com sucesso'
      })

    } catch (error) {
      console.error('Erro ao excluir usuário:', error)
      
      if (error.name === 'AuthenticationException') {
        return response.status(401).json({
          message: 'Não autorizado'
        })
      }

      if (error.name === 'ValidationException') {
        return response.status(400).json({
          message: 'Dados inválidos',
          errors: error.messages
        })
      }
      
      return response.status(500).json({
        message: 'Erro interno do servidor',
        error: error.message
      })
    }
  }
}