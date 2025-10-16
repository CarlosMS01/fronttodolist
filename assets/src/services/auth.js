import { API_URL } from '../config.js';

export async function register({ username, email, password }) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include'
    });
    return res.json();
}

export async function login({ email, password }) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
    });
    return res.json();
}

export async function getCurrentUser() {
    const res = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include'
    });
    return res.json();
}

export async function logout() {
    const res = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
    });

    if (res.ok) {
        window.location.href = '/fronttodolist/index.html';
    } else {
        console.error('Error al cerrar sesión:', res.status);
    }
}