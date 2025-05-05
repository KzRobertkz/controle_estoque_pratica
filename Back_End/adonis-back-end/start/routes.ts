/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import UsersController from '#controllers/users_controller'


router.group(() => {
  router.get('/list', [UsersController, 'index'])        // GET /api/users/list     -lista de usuarios
  router.post('/', [UsersController, 'store'])           // POST /api/users         -cria o usuario
  router.get('/:id', [UsersController, 'show'])          // GET /api/users/:id      -lista somente 1 usuario pelo seu ID
  router.put('/:id', [UsersController, 'update'])        // PUT /api/users/:id      -altera dados pelo ID
  router.delete('/:id', [UsersController, 'destroy'])    // DELETE /api/users/:id   -deleta usuarios pelo ID
}).prefix('/api/users')


router.get('/api/ping', async () => {
  return { message: 'pong from Adonis' }  //  Teste para exibir na tela de Home uma msg que prova que o adonis esta conectado no front end
})