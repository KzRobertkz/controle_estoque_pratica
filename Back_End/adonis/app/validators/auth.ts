import vine from '@vinejs/vine'

const password = vine.string().minLength(8)

export const registerValidator = vine.compile(
  vine.object({
    full_name: vine.string().minLength(3).maxLength(30),
    email: vine.string().email().normalizeEmail().unique(async (db, value) => {
      const match = await db.from('users').select('id').where('email', value).first()
      if (match) {
        throw new Error('Este email já está em uso.')
      }
      return true
    }),
    password,
  })
)




export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(5), // valida senha com tamanho mínimo
  })
)

