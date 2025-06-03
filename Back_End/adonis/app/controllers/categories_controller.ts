import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'

export default class CategoriesController {
  /**
   * Listar todas as categorias
   */
  async index({ response }: HttpContext) {
    try {
      const categories = await Category.query()
        .orderBy('name', 'asc')
      
      return response.ok({
        data: categories,
        message: 'Categorias listadas com sucesso'
      })
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
      return response.internalServerError({
        message: 'Erro ao buscar categorias',
        error: error.message
      })
    }
  }

  /**
   * Criar nova categoria
   */
  async store({ request, response }: HttpContext) {
    try {
      console.log('\nDados da categoria:', request.body())
      
      const data = request.only(['name', 'description'])
      
      // Validar campos obrigatórios
      if (!data.name || !data.name.trim()) {
        return response.badRequest({
          message: 'Nome da categoria é obrigatório'
        })
      }

      // Limpar dados
      const categoryData = {
        name: data.name.trim(),
        description: data.description ? data.description.trim() : null
      }

      // Verificar se já existe uma categoria com o mesmo nome
      const existingCategory = await Category.query()
        .where('name', 'ilike', categoryData.name)
        .first()

      if (existingCategory) {
        return response.badRequest({
          message: 'Já existe uma categoria com este nome'
        })
      }

      // Criar categoria
      const category = await Category.create(categoryData)
      
      console.log('Categoria criada:', category)
      
      return response.created({
        ...category.toJSON(),
        message: 'Categoria criada com sucesso'
      })
    } catch (error) {
      console.error('Erro ao criar categoria:', error)
      return response.internalServerError({
        message: 'Erro ao criar categoria',
        error: error.message
      })
    }
  }

  /**
   * Atualizar categoria
   */
  async update({ request, response }: HttpContext) {
    try {
      const categoryId = request.param('id')
      const data = request.only(['name', 'description'])

      if (!categoryId) {
        return response.badRequest({
          message: 'ID da categoria não fornecido'
        })
      }

      const category = await Category.find(categoryId)
      if (!category) {
        return response.notFound({
          message: 'Categoria não encontrada'
        })
      }

      // Validar nome se fornecido
      if (data.name && !data.name.trim()) {
        return response.badRequest({
          message: 'Nome da categoria não pode estar vazio'
        })
      }

      // Verificar duplicata se o nome foi alterado
      if (data.name && data.name.trim() !== category.name) {
        const existingCategory = await Category.query()
          .where('name', 'ilike', data.name.trim())
          .where('id', '!=', categoryId)
          .first()

        if (existingCategory) {
          return response.badRequest({
            message: 'Já existe uma categoria com este nome'
          })
        }
      }

      // Atualizar campos
      if (data.name) category.name = data.name.trim()
      if (data.description !== undefined) {
        category.description = data.description ? data.description.trim() : null
      }

      await category.save()

      return response.ok({
        ...category.toJSON(),
        message: 'Categoria atualizada com sucesso'
      })
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error)
      return response.internalServerError({
        message: 'Erro ao atualizar categoria',
        error: error.message
      })
    }
  }

  /**
   * Excluir categoria
   */
  async destroy({ request, response }: HttpContext) {
    try {
      const categoryId = request.param('id')
      
      if (!categoryId) {
        return response.badRequest({
          message: 'ID da categoria não fornecido'
        })
      }

      const category = await Category.find(categoryId)
      if (!category) {
        return response.notFound({
          message: 'Categoria não encontrada'
        })
      }

      // Verificar se há produtos usando esta categoria
      // Assumindo que você tem um relacionamento configurado
      // const productsCount = await category.related('products').query().count('* as total')
      // if (productsCount[0].total > 0) {
      //   return response.badRequest({
      //     message: 'Não é possível excluir categoria que possui produtos associados'
      //   })
      // }

      await category.delete()
      
      return response.ok({
        message: 'Categoria excluída com sucesso'
      })
    } catch (error) {
      console.error('Erro ao excluir categoria:', error)
      return response.internalServerError({
        message: 'Erro ao excluir categoria',
        error: error.message
      })
    }
  }

  /**
   * Mostrar categoria específica
   */
  async show({ request, response }: HttpContext) {
    try {
      const categoryId = request.param('id')
      
      if (!categoryId) {
        return response.badRequest({
          message: 'ID da categoria não fornecido'
        })
      }

      const category = await Category.find(categoryId)
      if (!category) {
        return response.notFound({
          message: 'Categoria não encontrada'
        })
      }

      return response.ok({
        data: category,
        message: 'Categoria encontrada'
      })
    } catch (error) {
      console.error('Erro ao buscar categoria:', error)
      return response.internalServerError({
        message: 'Erro ao buscar categoria',
        error: error.message
      })
    }
  }
}