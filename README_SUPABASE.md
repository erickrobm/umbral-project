# Integración de Supabase para Umbral

Este proyecto ha sido integrado con Supabase para Autenticación y Base de Datos.

## Instrucciones de Configuración

### 1. Variables de Entorno

Crea o actualiza tu archivo `.env` en el directorio raíz con tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=tu_url_del_proyecto
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

Puedes encontrar estas credenciales en tu Panel de Control de Supabase bajo `Settings > API`.

### 2. Esquema de Base de Datos

Necesitas crear las tablas requeridas en tu proyecto de Supabase.

1. Ve al [Editor SQL](https://supabase.com/dashboard/project/_/sql) en tu Panel de Control de Supabase.
2. Copia el contenido del archivo `supabase_schema.sql` ubicado en la raíz de este proyecto.
3. Pégalo en el Editor SQL y ejecútalo.

Esto creará:
- Tabla `profiles` (perfiles)
- Tabla `envelopes` (sobres/presupuestos)
- Tabla `accounts` (cuentas)
- Tabla `goals` (metas)
- Políticas de seguridad a nivel de fila (Row Level Security - RLS) para proteger los datos del usuario.
- Triggers para crear automáticamente un perfil cuando un usuario se registra.

### 3. Autenticación

La aplicación ahora crea una sesión persistente.
- **Iniciar Sesión**: `/login`
- **Registrarse**: `/register`
- **Rutas Protegidas**: Todas las rutas del dashboard están protegidas y redirigen al inicio de sesión si no hay autenticación.

### 4. Persistencia de Datos

La aplicación está configurada para guardar:
- Perfil de Usuario (Moneda, Ingresos, Patrimonio Neto)
- Sobres (Categorías de presupuesto)
- Cuentas (Activos y saldos)

Todo lo que crees en la interfaz de usuario se guardará en tu base de datos de Supabase en tiempo real.

