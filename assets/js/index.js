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
// Registro de usuarios (Logica)
// =======================
const btnRegister = document.getElementById('btn-register');

async function registerTodolist(e) {
    e.preventDefault();

    btnRegister.disabled = true;
    btnRegister.textContent = "Procesando...";

    const username = document.getElementById('username');
    const email = document.getElementById('email-register');
    const password = document.getElementById('password-register');

    const valores = {
        username: username.value.trim(),
        email: email.value.trim(),
        password: password.value.trim()
    };

    const errores = validateRegister(valores);

    if (errores.length > 0) {
        mostrarMensaje('error', errores.join("\n"), { animacion: 'shake' });
        btnRegister.disabled = false;
        btnRegister.textContent = "Crear cuenta";
        return;
    }

    try {
        const res = await register(valores);

        if (res.message) {
            mostrarMensaje('exito', res.message, { animacion: 'fade' });
            document.getElementById("register-form").reset();
            formLogin.classList.add('active');
            formRegister.classList.remove('active');
        } else {
            mostrarMensaje('error', res.error || 'Error en el registro');
        }
    } catch (err) {
        mostrarMensaje('error', 'Error de conexión con el servidor');
    } finally {
        btnRegister.disabled = false;
        btnRegister.textContent = "Crear cuenta";
    }
}

document.getElementById('register-form').addEventListener('submit', registerTodolist);


// =======================
// Validaciones para el username, email y password del registro
// =======================
function validateRegister({ username, email, password }) {
    const errores = [];

    if (!username || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(username)) {
        errores.push("Nombre de usuario inválido solo debe contener espacios, mayusculas y minusculas.");
    }

    if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        errores.push("Correo inválido");
    }

    if (!password || password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password) ||
        !/[\W_]/.test(password)) {
        errores.push("La contraseña no cumple los requisitos");
    }

    return errores;
}

// =======================
// inicialización
// =======================
lookCursor();
robot();
passwordFocus();