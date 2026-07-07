import emailjs from '@emailjs/browser'
import type { CompraItem, DatosComprador } from '../types'

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  as string | undefined
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  as string | undefined

/**
 * Envía el email de confirmación al comprador.
 * Si las vars de entorno no están configuradas, no hace nada (fail-silent).
 */
export const sendOrderConfirmation = async (params: {
  comprador: DatosComprador
  transaccionId: string
  items: CompraItem[]
  total: number
}): Promise<void> => {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) return

  const itemsText = params.items
    .map(i => `• ${i.nombre} × ${i.cantidad}  →  $ ${i.subtotal.toLocaleString('es-AR')}`)
    .join('\n')

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      to_email:       params.comprador.email,
      to_name:        params.comprador.nombre,
      transaccion_id: params.transaccionId,
      items_list:     itemsText,
      total:          '$ ' + params.total.toLocaleString('es-AR'),
    },
    PUBLIC_KEY,
  )
}
