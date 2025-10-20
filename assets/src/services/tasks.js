import { API_URL } from '../config.js';

export async function getTasks() {
    const res = await fetch(`${API_URL}/api/tasks`, {
        method: 'GET',
        credentials: 'include'
    });
    return res.json();
}

export async function createTask({ title, description, status, priority }) {
    const res = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, status, priority }),
        credentials: 'include'
    });
    return res.json();
}