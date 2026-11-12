# PDAU Frontend

Frontend web de la **Plataforma de Denuncias Anónimas Universitarias (PDAU)**. La aplicación permite a la comunidad universitaria registrar denuncias, adjuntar evidencias y consultar el estado de sus casos mediante un token de seguimiento. También proporciona un panel para que los administradores gestionen y den seguimiento a las denuncias.

Este proyecto se integra con el backend de PDAU, desarrollado con Spring Boot:

<https://github.com/BSebastianGonzalez/pdau-be>

## Funcionalidades

### Flujo para la comunidad universitaria

- Página de inicio con información general de la plataforma.
- Consulta de información y orientación legal.
- Registro de denuncias sin crear una cuenta de usuario.
- Selección de una o varias categorías para clasificar la denuncia.
- Registro de título y descripción del caso.
- Carga de evidencias asociadas a la denuncia.
- Confirmación de creación con token único de seguimiento.
- Consulta del estado de una denuncia mediante su token.
- Visualización de la respuesta y estado actual del caso.

### Panel administrativo

- Inicio de sesión para administradores.
- Recuperación y restablecimiento de contraseña.
- Listado de denuncias activas y archivadas.
- Consulta detallada de cada denuncia.
- Filtrado por categorías, estados y departamentos.
- Asignación de denuncias a departamentos responsables.
- Actualización del estado de una denuncia.
- Registro y consulta de comentarios administrativos.
- Consulta del historial de cambios de estado.
- Archivo y desarchivo de denuncias.
- Gestión de administradores, categorías, estados y departamentos.
- Visualización de estadísticas de denuncias.
- Consulta de acciones realizadas por administradores para fines de auditoría.

## Flujo principal

1. La persona accede al formulario de registro y selecciona las categorías correspondientes.
2. El frontend envía la denuncia al backend y recibe un token de seguimiento.
3. La persona conserva el token para consultar posteriormente el estado del caso.
4. El equipo administrativo inicia sesión y revisa las denuncias recibidas.
5. Desde el panel, el administrador puede asignar el caso, cambiar su estado, agregar comentarios y consultar evidencias.
6. La persona consulta los avances utilizando su token, sin necesidad de registrarse.

## Stack tecnológico

- React 19
- JavaScript
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- ESLint
- Node.js y npm

## Requisitos

- Node.js 18 o superior
- npm
- Una instancia activa del backend de PDAU

## Configuración desde cero

### 1. Clonar el repositorio

```bash
git clone https://github.com/BSebastianGonzalez/pdau-fe.git
cd pdau-fe
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar la URL del backend

Crea un archivo `.env` o `.env.local` en la raíz del proyecto:

```properties
VITE_API_URL=http://localhost:8080
```

La aplicación utiliza esta variable como URL base para las peticiones realizadas con Axios. Si el backend está desplegado en otro entorno, reemplaza el valor por la URL correspondiente.

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible normalmente en:

```text
http://localhost:5173
```

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Iniciar el servidor de desarrollo con Vite |
| `npm run build` | Generar el bundle de producción |
| `npm run preview` | Previsualizar el bundle de producción |
| `npm run lint` | Analizar el código con ESLint |

## Rutas principales

### Comunidad universitaria

| Ruta | Descripción |
|---|---|
| `/` | Página principal |
| `/complaint` | Información sobre el proceso de denuncia |
| `/register` | Registro de una nueva denuncia |
| `/finished_register` | Confirmación y token de seguimiento |
| `/consult` | Consulta de una denuncia |
| `/consult_response` | Resultado de la consulta |
| `/law_frame` | Consulta de información legal |

### Administración

| Ruta | Descripción |
|---|---|
| `/admin_login` | Inicio de sesión administrativo |
| `/admin_main` | Página principal del panel |
| `/read_complaint` | Listado y consulta de denuncias |
| `/complaint_checkout` | Detalle y gestión de una denuncia |
| `/archived_complaints` | Denuncias archivadas |
| `/data` | Gestión de datos de configuración |
| `/data_update` | Actualización de datos |
| `/statistics` | Estadísticas |
| `/audit_statistics` | Estadísticas de auditoría |
| `/audit_actions` | Acciones administrativas |
| `/forgot_password` | Solicitud de recuperación de contraseña |
| `/admin_password_confirm` | Confirmación del cambio de contraseña |

## Integración con la API

La comunicación con el backend está centralizada en servicios JavaScript y utiliza Axios como cliente HTTP:

```text
src/
├── api/             # Configuración del cliente HTTP
├── services/        # Integración con los recursos de la API
├── components/      # Componentes reutilizables
├── modules/         # Componentes organizados por dominio y rol
├── pages/           # Vistas asociadas a las rutas
├── assets/          # Recursos estáticos del frontend
└── App.jsx          # Enrutamiento principal
```

Los servicios principales son:

- `ComplaintService`: denuncias, categorías, estados, departamentos y evidencias.
- `AdminService`: autenticación, administradores y recuperación de contraseña.
- `CommentService`: comentarios asociados a denuncias.
- `StateChangeService`: historial de cambios de estado.
- `FileComplaintService`: operaciones de archivo y desarchivo.

## Arquitectura frontend

La aplicación utiliza una arquitectura basada en componentes y módulos por dominio:

- **Pages:** componen las vistas completas asociadas a cada ruta.
- **Modules:** agrupan componentes de usuario, administración, denuncias, estadísticas y autenticación.
- **Services:** encapsulan las peticiones HTTP y mantienen separada la integración con la API.
- **Components:** contienen elementos reutilizables como botones, campos, etiquetas de estado y contenedores.
- **React Router:** administra la navegación del cliente.
- **Vite:** proporciona el entorno de desarrollo y el proceso de construcción.

## Construcción y despliegue

Generar el bundle de producción:

```bash
npm run build
```

El resultado se genera en la carpeta `dist/`. Este contenido puede desplegarse en plataformas de hosting estático como Vercel, Netlify o un servidor Nginx.

El repositorio incluye configuración para Vercel mediante `vercel.json`. Asegúrate de configurar `VITE_API_URL` como variable de entorno en la plataforma de despliegue.

## Consideraciones

- El anonimato se implementa en el flujo funcional: la persona no necesita una cuenta para registrar o consultar una denuncia.
- El token de seguimiento debe conservarse para consultar posteriormente el caso.
- El frontend requiere que el backend esté disponible y permita las solicitudes CORS desde el dominio de la aplicación.
- Las rutas administrativas deben utilizarse junto con el flujo de autenticación implementado por la aplicación.
- La URL del backend no debe escribirse directamente en los componentes; debe configurarse mediante `VITE_API_URL`.
