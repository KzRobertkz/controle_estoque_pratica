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
    router.get('/products', '#controllers/products_controller.index')
    router.get('/products/recent', '#controllers/products_controller.getRecent')

    router.post('/products', '#controllers/products_controller.store')
    router.put('/products/:id', '#controllers/products_controller.update')  
    router.delete('/products/:id', '#controllers/products_controller.destroy')

  })
  .middleware(middleware.auth())




