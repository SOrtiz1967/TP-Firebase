# 🎸 Kultrumm Shop

> E-commerce de instrumentos musicales construido como Trabajo Práctico integrador con Firebase como backend.

![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

---

## 🛠️ Tecnologías

| Capa | Tecnología |
|---|---|
| 🖥️ Frontend | React 19 + TypeScript + Vite |
| 🎨 Estilos | Tailwind CSS |
| 🔀 Routing | React Router v7 |
| ☁️ Backend / DB | Firebase (Firestore + Auth) |
| 🚀 Hosting | Firebase Hosting |
| 📧 Email | EmailJS |
| 🖼️ Iconos | Lucide React |

---

## ✨ Funcionalidades

### 🛍️ Tienda pública
- Catálogo con filtros por categoría y búsqueda en tiempo real
- Modal de detalle de producto con especificaciones
- Carrito persistente (Context API)
- Checkout con datos del comprador y confirmación de orden
- Envío automático de email de confirmación vía EmailJS

### 🔐 Panel de administración
> Requiere login con custom claim `admin`

- ABM de productos (crear, editar, eliminar)
- Listado de compras con detalle de ítems y comprador
- Dashboard con métricas básicas

---

## ⚙️ Variables de entorno

Crear un archivo `.env` en la raíz de `kultrumm-shop/` con:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Opcionales — si no se configuran, el email de confirmación se omite silenciosamente
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

---

## 📦 Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | 🔥 Servidor de desarrollo |
| `npm run build` | 📦 Build de producción |
| `npm run preview` | 👁️ Preview del build |
| `npm run lint` | 🔍 Linter |
| `npm run deploy` | 🚀 Build + deploy completo a Firebase |
| `npm run deploy:hosting` | 🌐 Deploy solo de Hosting |
| `npm run deploy:rules` | 📋 Deploy solo de reglas de Firestore |

---

## 🗄️ Scripts de administración

> Requieren `scripts/serviceAccountKey.json` (Service Account de Firebase).

```bash
# Cargar productos de prueba iniciales
npx ts-node scripts/seed.ts

# Asignar rol de administrador a un usuario (por UID o email)
npx ts-node scripts/set-admin-claim.ts
```

---

## 🔒 Seguridad (Firestore Rules)

- 🟢 **Productos** — lectura pública; escritura solo con custom claim `admin: true`
- 🟡 **Compras** — cualquier cliente puede crear (checkout sin cuenta); lectura y modificación solo para admins
- 🔴 **Todo lo demás** — denegado por defecto
