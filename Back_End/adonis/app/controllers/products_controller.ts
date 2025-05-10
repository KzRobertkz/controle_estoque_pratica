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
      console.log('Request body:', request.body())
      
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
      console.error('Error creating product:', error)
      return response.internalServerError({ 
        message: 'Erro ao criar produto', 
        error: error.message 
      })
    }
  }
}

