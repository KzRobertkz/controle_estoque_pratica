// app/controllers/products_controller.js
import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'

export default class ProductsController {
  async index({ request, response }: HttpContext) {
    try {
      const page = Number(request.input('page', 1))  // página atual, default 1
      const search = request.input('search', '')     // texto para buscar

      const limit = 10
      const query = Product.query()

      if (search) {
        query.where('name', 'like', `%${search}%`)
      }

      query.orderBy('created_at', 'desc') 

      const products = await query.paginate(page, limit)

      return response.ok(products)  // products possui {data: [...], meta: {...}, links: {...}}
    } catch (error) {
      return response.internalServerError({ 
        message: 'Erro ao buscar produtos', 
        error: error.message 
      })
    }
  }

  
  async store({ request, response }: HttpContext) {
    try {
      // Log request body for debugging
      console.log('\nDados do produto:', request.body())
      
      // Get data from request
      const data = request.only(['name', 'description', 'price', 'stock'])
      
      // Validate that required fields exist
      if (!data.name || !data.price || data.stock === undefined) {
        return response.badRequest({ 
          message: 'Campos nome, preço e estoque são obrigatórios'
        })
      }
      
      // Ensure price and stock are numbers
      data.price = Number(data.price)
      data.stock = Number(data.stock)
      
      // Create product
      const product = await Product.create(data)
      
      return response.created(product)
    } catch (error) {
      console.error('Erro ao criar o produto:', error)
      return response.internalServerError({ 
        message: 'Erro ao criar produto', 
        error: error.message 
      })
    }
  }

  async destroy({ request, response }: HttpContext) {
    try {
      // Adicionando log para depuração
      console.log('\nParâmetros recebidos:', request.params())
      
      const productId = request.param('id')
      console.log('\nID do produto excluido:', productId)
      
      if (!productId) {
        return response.badRequest({ message: 'ID do produto não fornecido' })
      }
      
      const product = await Product.find(productId)

      if (!product) {
        return response.notFound({ message: 'Produto não encontrado' })
      }

      await product.delete()
      return response.ok({ message: 'Produto excluído com sucesso' })
    } catch (error) {
      console.error('Erro ao excluir o produto:', error)
      return response.internalServerError({
        message: 'Erro ao excluir produto',
        error: error.message
      })
    }
  }

  async update({ request, response }: HttpContext) {
    try {
      const productId = request.param('id')
      const data = request.only(['name', 'description', 'price', 'stock'])

      if (!productId) {
        return response.badRequest({ message: 'ID do produto não fornecido' })
      }

      const product = await Product.find(productId)
      if (!product) {
        return response.notFound({ message: 'Produto não encontrado' })
      }

      product.name = data.name ?? product.name
      product.description = data.description ?? product.description
      product.price = data.price !== undefined ? Number(data.price) : product.price
      product.stock = data.stock !== undefined ? Number(data.stock) : product.stock

      await product.save()

      return response.ok(product)
    } catch (error) {
      console.error('Erro ao atualizar produto:', error)
      return response.internalServerError({ message: 'Erro ao atualizar produto', error: error.message })
    }
  }

  public async getRecent({ response }: HttpContext) {
    try {
      const recentProducts = await Product
        .query()
        .orderBy('id', 'desc') // Ordenação por ID decrescente
        .orderBy('created_at', 'desc') // Ordenação secundária por data
        .limit(2) // limite para 2 produtos mais recentes
        .select(['id', 'name', 'price', 'created_at'])
        .exec()
      
      // Log para debug
      console.log('Produtos recentes:', recentProducts)
      
      return response.ok(recentProducts)
    } catch (error) {
      console.error('Erro ao buscar produtos recentes:', error)
      return response.internalServerError({
        message: 'Erro ao buscar produtos recentes',
        error: error.message
      })
    }
  }

  public async getHistory({ response }: HttpContext) {
    try {
      const recentProductsHistory = await Product
        .query()
        .orderBy('id', 'desc') // Ordena primariamente pelo id
        .select(['id', 'name', 'price', 'created_at'])
        .limit(20) // limite para 20 itens no histórico
        .exec()
      
      // Log para debug
      console.log('Histórico de produtos:', recentProductsHistory)
      
      return response.ok(recentProductsHistory)
    } catch (error) {
      console.error('Erro ao buscar histórico de produtos:', error)
      return response.internalServerError({
        message: 'Erro ao buscar histórico de produtos',
        error: error.message
      })
    }
  }

}

