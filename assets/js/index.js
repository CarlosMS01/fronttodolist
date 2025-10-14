// =======================
// Imports
// =======================
import { lookCursor, robot, passwordFocus, mostrarMensaje } from './index_animations.js';


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

const btnLogin = document.getElementById('btn-login');

btnLogin.onclick = () => {
    mostrarMensaje('exito', "Mensaje de prueba")
}


// =======================
// inicialización
// =======================
lookCursor();
robot();
passwordFocus();