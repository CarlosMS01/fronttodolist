import { getCurrentUser, logout } from '../src/services/auth.js';

window.addEventListener('DOMContentLoaded', async () => {
    const user = await getCurrentUser();

    if (user.error || !user.username) {
        document.getElementById('mensaje').textContent = "No hay nada";
    } else {
        document.getElementById('username').textContent = user.username;
    }
});

document.getElementById('btn-logout').addEventListener('click', () => { logout(); });