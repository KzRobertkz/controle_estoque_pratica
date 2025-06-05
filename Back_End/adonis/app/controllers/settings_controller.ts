import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import GlobalSetting from '#models/global_setting'

@inject()
export default class SettingsController {
  async index({ response }: HttpContext) {
    try {
      // Busca configuração existente ou cria nova com valores padrão
      const settings = await GlobalSetting.firstOrCreate(
        { id: 1 }, // critério de busca
        {
          defaultMinStock: 5,
          daysBeforeExpiryNotification: 30,
          notifyLowStock: true,
          notifyBeforeExpiry: true,
          enableEmailNotifications: false,
          enableStockAlerts: true,
          enableExpiryAlerts: true
        }
      )
      
      return response.ok(settings)
    } catch (error) {
      return response.internalServerError({
        message: 'Erro ao buscar configurações globais',
        error: error.message
      })
    }
  }

  async update({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'defaultMinStock',
        'daysBeforeExpiryNotification',
        'notifyLowStock',
        'notifyBeforeExpiry',
        'enableEmailNotifications',
        'enableStockAlerts',
        'enableExpiryAlerts'
      ])

      // Busca a configuração existente ou cria nova
      let settings = await GlobalSetting.firstOrCreate(
        { id: 1 }, // critério de busca
        {} // valores padrão vazios pois vamos atualizar com data
      )
      
      settings.merge(data)
      await settings.save()

      return response.ok(settings)
    } catch (error) {
      return response.internalServerError({
        message: 'Erro ao atualizar configurações globais',
        error: error.message
      })
    }
  }
}