/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

// Rota inicial
router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Rotas públicas de autenticação
router.post('/register', [AuthController, 'register']).as('auth.register')
router.post('/login', [AuthController, 'login']).as('auth.login')

// Grupo de rotas protegidas
router.group(() => {
  // Rotas de autenticação protegidas
  router.delete('/logout', [AuthController, 'logout']).as('auth.logout')
  router.get('/me', [AuthController, 'me']).as('auth.me')
  router.get('/users', [AuthController, 'index']).as('users.index')

  // Rotas do usuário
  router.put('/auth/update-email', [AuthController, 'updateEmail'])
  router.put('/auth/update-name', [AuthController, 'updateName'])
  router.put('/auth/update-password', [AuthController, 'updatePassword'])
  router.delete('/auth/delete-user', [AuthController, 'deleteUser'])

  // Rotas de produtos
  router.get('/products', '#controllers/products_controller.index')
  router.post('/products', '#controllers/products_controller.store')
  router.put('/products/:id', '#controllers/products_controller.update')
  router.delete('/products/:id', '#controllers/products_controller.destroy')

  // Rotas de configurações globais de produtos
  router.get('/settings', '#controllers/settings_controller.index')
  router.put('/settings', '#controllers/settings_controller.update')

  // Rotas de Categorias dos produtos
  router.get('/categories', '#controllers/categories_controller.index')
  router.post('/categories', '#controllers/categories_controller.store')
  router.get('/categories/:id', '#controllers/categories_controller.show')
  router.put('/categories/:id', '#controllers/categories_controller.update')
  router.delete('/categories/:id', '#controllers/categories_controller.destroy')
  
  // Rotas de consultas específicas de produtos
  router.get('/products/recent', '#controllers/products_controller.getRecent')
  router.get('/products/recent/history', '#controllers/products_controller.getHistory')
  router.get('/products/recent/history/page', '#controllers/products_controller.getPages')
  
}).middleware(middleware.auth())




