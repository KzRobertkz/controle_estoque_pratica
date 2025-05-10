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

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/register', [AuthController, 'register']).as('auth.register')

router.post('/login', [AuthController, 'login']).as('auth.login')

router.delete('/logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())

router.get('/me', [AuthController, 'me']).as('auth.me')


// start/routes.ts

router
  .group(() => {
    
    // Products routes
    router.get('/products', '#controllers/products_controller.index')
    router.post('/products', '#controllers/products_controller.store')
  })
  .middleware(middleware.auth())

