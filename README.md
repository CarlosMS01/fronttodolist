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
├── index.html
├── README.md
```

## 🧪 Funcionalidades del Frontend

- **Login**: formulario con validación, muestra token y estado
- **Home**: 
  - Vista principal con `header`
  - Formulario para crear nuevas tareas.
  - Formulario para editar tareas.

## 🎯 Animaciones GSAP

#### Funciones disponibles en index_animations:
- `lookCursor()` – Sigue el cursor con elementos visuales del robot.
- `robot()` – Anima el robot y su sombra.
- `passwordFocus()` – Oculta el ojo del robot al enfocar campos de contraseña.
- `mostrarMensaje()` – Muestra un mensaje animado con `GSAP` (desplazamiento y opacidad).

```js
// Importar funciones
import { lookCursor, robot, passwordFocus, mostrarMensaje } from './animaciones.js';
```