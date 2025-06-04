
import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'

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
    const data = request.only(['name', 'description', 'price', 'stock', 'category_id'])
    
    // Converter category_id para categoryId (camelCase usado pelo Lucid)
    const productData = {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      categoryId: data.category_id || null
    }

    const product = await Product.create(productData)
    
    // Fazer preload da categoria antes de retornar
    await product.load('category')
    
    return response.json(product)
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
    const product = await Product.findOrFail(params.id)
    const data = request.only(['name', 'description', 'price', 'stock', 'category_id'])
    
    // Converter category_id para categoryId
    const updateData = {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      categoryId: data.category_id || null
    }

    product.merge(updateData)
    await product.save()
    
    // Fazer preload da categoria antes de retornar
    await product.load('category')
    
    return response.json(product)
  }

  // Outras funções
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
      const page = Number(request.input('page', 1))
      const limit = Number(request.input('limit', 25))

      // Validação básica
      if (page < 1) {
        return response.badRequest({ 
          message: 'Número da página deve ser maior que 0' 
        })
      }

      if (limit < 1 || limit > 100) {
        return response.badRequest({ 
          message: 'Limite deve estar entre 1 e 100' 
        })
      }

      const query = Product.query()
      query.orderBy('id', 'desc') 

      const products = await query.paginate(page, limit)

      // Estrutura correta baseada no AdonisJS
      const response_data = {
        data: products.all(), // ou products (se products já for o array)
        meta: {
          currentPage: products.currentPage,
          firstPage: products.firstPage || 1,
          lastPage: products.lastPage,
          perPage: products.perPage,
          total: products.total
        }
      }

      return response.ok(response_data)
    } catch (error) {
      console.error('Erro na paginação:', error)
      return response.internalServerError({ 
        message: 'Erro ao paginar produtos', 
        error: error.message 
      })
    }
  }


}

