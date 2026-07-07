import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { CheckCircle, Mail } from 'lucide-react'
import type { DatosComprador } from '../../types'

export const OrderConfirmationPage = () => {
  const { id }       = useParams<{ id: string }>()
  const navigate     = useNavigate()
  const location     = useLocation()
  const comprador    = location.state?.comprador as DatosComprador | undefined

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-4 py-16 text-center">
      {/* Ícono de éxito */}
      <CheckCircle className="h-12 w-12 text-[#ff9d00]" aria-hidden="true" />

      {/* Título */}
      <div className="flex flex-col gap-2">
        <h1 className="font-sans text-2xl font-bold tracking-tight text-[#f3f3f3]">
          {comprador ? `¡Gracias, ${comprador.nombre.split(' ')[0]}!` : 'Orden registrada'}
        </h1>
        <p className="font-sans text-sm text-[#8a8a8a]">
          Tu pedido fue procesado correctamente.
        </p>
      </div>

      {/* ID de transacción */}
      <div className="w-full border border-neutral-800 bg-[#1a1a1a] p-6 text-left">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#8a8a8a]">
          ID de Transacción
        </p>
        <p className="font-mono text-sm font-bold text-[#ff9d00] break-all">
          {id}
        </p>
      </div>

      {/* Aviso de email */}
      {comprador?.email && (
        <div className="flex w-full items-start gap-3 border border-neutral-800 bg-[#1a1a1a] p-5 text-left">
          <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#8a8a8a]" />
          <p className="font-sans text-sm text-[#8a8a8a]">
            Te enviamos un email de confirmación a{' '}
            <span className="font-mono text-[#f3f3f3]">{comprador.email}</span>
            {' '}con los detalles de tu pedido. En breve nos comunicaremos con vos para coordinar la entrega.
          </p>
        </div>
      )}

      {/* Datos de contacto ingresados */}
      {comprador && (
        <div className="w-full border border-neutral-800 bg-[#1a1a1a] p-6 text-left">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#8a8a8a]">
            Tus datos registrados
          </p>
          <dl className="flex flex-col gap-2">
            {[
              ['Nombre',    comprador.nombre],
              ['Email',     comprador.email],
              ['Teléfono',  comprador.telefono],
              ...(comprador.notas ? [['Notas', comprador.notas]] : []),
            ].map(([label, value]) => (
              <div key={label} className="flex gap-3">
                <dt className="w-24 flex-shrink-0 font-mono text-xs text-[#8a8a8a]">{label}</dt>
                <dd className="font-sans text-sm text-[#f3f3f3]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Acción */}
      <button
        onClick={() => void navigate('/')}
        className="border border-neutral-800 px-6 py-3 font-sans text-sm text-[#f3f3f3] hover:border-neutral-600 transition-colors"
      >
        Volver al catálogo
      </button>
    </div>
  )
}
