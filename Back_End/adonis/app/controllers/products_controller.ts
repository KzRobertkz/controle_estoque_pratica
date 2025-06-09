import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import Product from '#models/product'
import { DateTime } from 'luxon'

@inject()
export default class ProductsController {
  async index({ request, response }: HttpContext) {
    try {
      const page = Number(request.input('page', 1))  // página atual, default 1
      const search = request.input('search', '')     // texto para buscar

      const limit = 12
      const query = Product.query()

      if (search) {
        query.where('name', 'like', `%${search}%`)
      }

      query.orderBy('created_at', 'desc') 
      query.preload('category')

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
      const data = request.only(['name', 'description', 'price', 'stock', 'category_id', 'validate_date'])
      
      // Log para debug
      console.log('Dados recebidos:', data)

      // Tratamento da data
      let validateDate = null
      if (data.validate_date) {
        validateDate = DateTime.fromISO(data.validate_date)
        if (!validateDate.isValid) {
          return response.badRequest({
            message: 'Data de validade inválida'
          })
        }
      }

      const productData = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        categoryId: data.category_id,
        validate_date: validateDate // Usar a data convertida
      }

      // Log para debug
      console.log('Dados processados:', productData)

      const product = await Product.create(productData)
      await product.load('category')

      return response.json(product)
    } catch (error) {
      console.error('Erro ao criar produto:', error)
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

  async update({ params, request, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      const data = request.only(['name', 'description', 'price', 'stock', 'category_id', 'validate_date'])
      
      // Log para debug
      console.log('Dados recebidos:', data)
      
      // Tratamento específico para a data
      let validadeDate = null
      if (data.validate_date) {
        try {
          validadeDate = DateTime.fromISO(data.validate_date)
          if (!validadeDate.isValid) {
            throw new Error('Data inválida')
          }
        } catch (error) {
          console.error('Erro ao processar data:', error)
          return response.badRequest({
            message: 'Data de validade inválida',
            error: error.message
          })
        }
      }

      const productData = {
        name: data.name || product.name,
        description: data.description,
        price: data.price ? Number(data.price) : product.price,
        stock: data.stock ? Number(data.stock) : product.stock,
        categoryId: data.category_id || product.categoryId,
        validate_date: validadeDate
      }

      // Log para debug dos dados processados
      console.log('Dados processados:', {
        ...productData,
        validate_date: productData.validate_date ? productData.validate_date.toISO() : null
      })

      try {
        await product.merge(productData).save()
        await product.load('category')
        
        // Log do produto salvo
        console.log('Produto atualizado:', product.toJSON())
        
        return response.json(product)
      } catch (saveError) {
        console.error('Erro ao salvar:', saveError)
        throw saveError
      }

    } catch (error) {
      console.error('Erro detalhado:', error)
      return response.internalServerError({
        message: 'Erro ao atualizar produto',
        error: error.message,
        stack: error.stack
      })
    }
  }

  
  // Outras funções
  public async getRecent({ response }: HttpContext) {
    try {
      const recentProducts = await Product
        .query()
        .orderBy('id', 'desc') // Ordenação primária por ID decrescente
        .orderBy('created_at', 'desc') // Ordenação secundária por data
        .limit(2) // limite para 2 produtos mais recentes
        .preload('category') // Carrega a relação com categoria
        .select(['id', 'name', 'price', 'created_at', 'updated_at', 'category_id'])
        .exec()
      
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
      const products = await Product.query()
        .orderBy('created_at', 'desc')
        .limit(50) // Últimos 50 produtos para histórico
        
      return response.ok(products)
    } catch (error) {
      return response.internalServerError({ 
        message: 'Erro ao buscar histórico', 
        error: error.message 
      })
    }
  }

  public async getPages({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = 25

      const query = Product.query()
        .orderBy('id', 'desc') // Ordenação primária por ID decrescente
        .orderBy('created_at', 'desc') // Ordenação secundária por data de criação
        .preload('category')
  
      const products = await query.paginate(page, limit)
  
      return response.ok(products)
    } catch (error) {
      return response.internalServerError({
        message: 'Erro ao buscar histórico',
        error: error.message
      })
    }
  }
}

