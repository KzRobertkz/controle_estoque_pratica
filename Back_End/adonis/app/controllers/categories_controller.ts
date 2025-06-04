import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'

export default class CategoriesController {
  async index({ response }: HttpContext) {
    try {
      // Busca todas as categorias ordenadas por nome
      const categories = await Category.query()
        .orderBy('name', 'asc')
        .select(['id', 'name', 'description'])
      
      return response.ok(categories)
    } catch (error) {
      return response.internalServerError({ 
        message: 'Erro ao buscar categorias',
        error: error.message 
      })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['name', 'description'])
      const category = await Category.create(data)
      
      return response.json(category)
    } catch (error) {
      return response.internalServerError({
        message: 'Erro ao criar categoria',
        error: error.message
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.id)
      return response.ok(category)
    } catch (error) {
      return response.notFound({
        message: 'Categoria não encontrada'
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.id)
      const data = request.only(['name', 'description'])
      
      category.merge(data)
      await category.save()
      
      return response.json(category)
    } catch (error) {
      return response.internalServerError({
        message: 'Erro ao atualizar categoria',
        error: error.message
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.id)
      await category.delete()
      
      return response.ok({
        message: 'Categoria excluída com sucesso'
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Erro ao excluir categoria',
        error: error.message
      })
    }
  }
}