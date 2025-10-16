// =======================
// Imports
// =======================
import { lookCursor, robot, passwordFocus, mostrarMensaje } from './index_animations.js';
import { login, register } from '../src/services/auth.js';


// =======================
// Cambio Login / Registro
// =======================
const btnShowLogin = document.getElementById('show-login');
const btnShowRegister = document.getElementById('show-register');
const formLogin = document.getElementById('login-form');
const formRegister = document.getElementById('register-form');

btnShowLogin.onclick = () => {
    formLogin.classList.add('active');
    formRegister.classList.remove('active');
};

btnShowRegister.onclick = () => {
    formRegister.classList.add('active');
    formLogin.classList.remove('active');
};


// =======================
// Inicio de sesión (Logica)
// =======================
const btnLogin = document.getElementById('btn-login');

async function loginTodolist(e) {
    e.preventDefault();

    btnLogin.disabled = true;
    btnLogin.textContent = "Procesando...";

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const errores = validateLogin({ email, password });

    if (errores.length > 0) {
        mostrarMensaje('error', errores.join("\n"), { animacion: 'shake' });
        btnLogin.disabled = false;
        btnLogin.textContent = "Entrar";
        return;
    }

    try {
        const res = await login({ email, password });

        if (res.message) {
            mostrarMensaje('exito', res.message);
            window.location.href = './assets/pages/home.html';
        } else {
            mostrarMensaje('error', res.error || 'Credenciales inválidas');
        }
    }
    catch (err) {
        mostrarMensaje('error', 'Error de conexión con el servidor');
    } finally {
        btnLogin.disabled = false;
        btnLogin.textContent = "Entrar";
    }
}

document.getElementById('login-form').addEventListener('submit', loginTodolist);


// =======================
// Validaciones para el email y password del login
// =======================
function validateLogin({ email, password }) {
    const errores = [];

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errores.push("Correo inválido");
    }

    if (!password) {
        errores.push("Contraseña requerida");
    }

    return errores;
}


// =======================
// inicialización
// =======================
lookCursor();
robot();
passwordFocus();