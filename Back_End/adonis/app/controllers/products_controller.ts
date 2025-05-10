// app/controllers/products_controller.js
import { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'

export default class ProductsController {
  async index({ response }: HttpContext) {
    try {
      const products = await Product.all()
      return products
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
}

