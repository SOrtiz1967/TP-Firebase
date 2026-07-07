import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { CartItem } from './CartItem'
import { CartSummary } from './CartSummary'
import { EmptyState } from '../ui/EmptyState'
import { createOrder } from '../../services/orders.service'
import { sendOrderConfirmation } from '../../services/email.service'
import type { DatosComprador } from '../../types'

const genTransaccionId = () =>
  'SIM-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()

const EMPTY_COMPRADOR: DatosComprador = { nombre: '', email: '', telefono: '', notas: '' }

const isEmailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

export const CartPage = () => {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()

  const [comprador, setComprador] = useState<DatosComprador>(EMPTY_COMPRADOR)
  const [touched, setTouched]     = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const set = (field: keyof DatosComprador, value: string) =>
    setComprador(prev => ({ ...prev, [field]: value }))

  const errors = {
    nombre:   !comprador.nombre.trim()          ? 'Requerido' : null,
    email:    !isEmailValid(comprador.email)     ? 'Email inválido' : null,
    telefono: !comprador.telefono.trim()         ? 'Requerido' : null,
  }
  const hasErrors = Object.values(errors).some(Boolean)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (hasErrors) return

    setSubmitting(true)
    setSubmitError(null)

    const transaccionId = genTransaccionId()
    const orderItems = items.map(i => ({
      productoId: i.productoId,
      nombre:     i.nombre,
      precio:     i.precio,
      cantidad:   i.cantidad,
      subtotal:   i.precio * i.cantidad,
    }))

    try {
      await createOrder({ transaccionId, items: orderItems, total, estado: 'simulado', comprador })
      // Enviar email (no bloquea si falla)
      sendOrderConfirmation({ comprador, transaccionId, items: orderItems, total }).catch(() => {})
      clearCart()
      void navigate('/orden/' + transaccionId, { state: { comprador } })
    } catch {
      setSubmitError('No se pudo registrar la orden. Intentá de nuevo.')
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <EmptyState
          icon={<ShoppingCart className="h-10 w-10" />}
          message="Tu carrito está vacío."
          action={{ label: 'Ver catálogo', onClick: () => void navigate('/') }}
        />
      </div>
    )
  }

  const field = (id: keyof typeof errors, label: string, type = 'text', placeholder = '') => (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-mono text-xs text-[#8a8a8a]">
        {label} *
      </label>
      <input
        id={id}
        type={type}
        value={comprador[id] ?? ''}
        placeholder={placeholder}
        onChange={e => set(id, e.target.value)}
        className={`border bg-[#121212] px-3 py-2 font-sans text-sm text-[#f3f3f3] outline-none transition-colors ${
          touched && errors[id]
            ? 'border-[#dd3b3b]'
            : 'border-neutral-800 focus:border-neutral-600'
        }`}
      />
      {touched && errors[id] && (
        <p className="font-mono text-[10px] text-[#dd3b3b]">{errors[id]}</p>
      )}
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Encabezado */}
      <div className="mb-8 border-b border-neutral-800 pb-6">
        <p className="mb-1 font-mono text-xs uppercase tracking-widest text-[#8a8a8a]">
          Mi Selección
        </p>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-[#f3f3f3]">
          Carrito
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-8 lg:grid-cols-3"
      >
        {/* ── Lista de ítems ── */}
        <div className="lg:col-span-2">
          {items.map(item => (
            <CartItem key={item.productoId} item={item} />
          ))}
        </div>

        {/* ── Columna derecha: datos + resumen ── */}
        <div className="flex flex-col gap-4 lg:col-span-1">

          {/* Formulario de contacto */}
          <div className="border border-neutral-800 bg-[#1a1a1a] p-6">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[#8a8a8a]">
              Tus datos
            </p>
            <div className="flex flex-col gap-3">
              {field('nombre',   'Nombre completo', 'text',  'Juan García')}
              {field('email',    'Email',           'email', 'juan@ejemplo.com')}
              {field('telefono', 'Teléfono',        'tel',   '+54 9 11 1234-5678')}

              {/* Notas (opcional) */}
              <div className="flex flex-col gap-1">
                <label htmlFor="notas" className="font-mono text-xs text-[#8a8a8a]">
                  Notas <span className="text-[#4a4a4a]">(opcional)</span>
                </label>
                <textarea
                  id="notas"
                  rows={2}
                  value={comprador.notas ?? ''}
                  placeholder="Consultas, dirección de entrega, etc."
                  onChange={e => set('notas', e.target.value)}
                  className="border border-neutral-800 bg-[#121212] px-3 py-2 font-sans text-sm text-[#f3f3f3] outline-none focus:border-neutral-600 transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Resumen + botón submit */}
          <CartSummary
            total={total}
            isSubmitting={submitting}
            error={submitError}
          />
        </div>
      </form>
    </div>
  )
}
