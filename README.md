# 📝 Frontend para ToDo List — Validación Visual de Endpoints

Este proyecto es el frontend complementario para el backend de ToDo List desarrollado con Flask. Su propósito es validar visualmente los endpoints del backend, simular flujos reales de usuario y demostrar la sincronización entre capas. Incluye animaciones con GSAP, formularios funcionales y una interfaz clara para crear, editar y eliminar tareas.

## 💻 Tecnologías utilizadas

- 🟧 HTML: estructura semántica de la interfaz
- 🔵 CSS: estilos visuales y responsividad
- 🟨 JavaScript: lógica de interacción con el backend
- 🔄 Live Server: recarga automática para desarrollo ágil

## 📦 Instalación local

1. Clona el repositorio
```bash
git clone https://github.com/CarlosMS01/fronttodolist.git
cd fronttodolist
```
2. Abre el archivo `index.html` con Live Server
3. Asegúrate de que el backend esté corriendo en `http://localhost:5000`

## 📁 Estructura de carpetas

```bash
fronttodolist/
├── assets/
│   ├── css/
│   │   └── home.css
│   │   └── index.css
│   ├── js/
│   │   └── home.js
│   │   └── index_animations.js
│   │   └── index.js
│   ├── pages/
│   │   └── home.html
│   ├── src/
│   │   └── services/
│   │   │   └── auth.js
│   │   └── config.js
├── index.html
├── README.md
```

## 📁 Descripción de carpetas y archivos

`assets/`
Contiene todos los recursos estáticos del proyecto.
**css/** → Estilos específicos por vista (`index.css`, `home.css`).

- **img/** → Imágenes o íconos usados en la interfaz.

- **js/** → Scripts asociados a cada página del frontend.
  - `index_animations.js` → Manejo de las animaciones que se aplican al login.
  - `index.js` → Lógica y eventos del login/registro.
  - `home.js` → Manejo del CRUD de tareas y comportamiento de la vista principal.

`pages`
Contiene las páginas HTML del proyecto.

- `index.html` → Página de inicio/login del usuario.
- `home.html` → Panel principal donde se muestran y gestionan las tareas.

`src`
Código fuente de la lógica del proyecto.

- **services/** → Servicios que se comunican con la API.
  - `auth.js` → Maneja login, registro y validación de sesión.
  - `tasks.js` → CRUD de tareas (crear, leer, actualizar, eliminar).
- **config.js** → Configuración general (por ejemplo, API_URL o variables globales).
