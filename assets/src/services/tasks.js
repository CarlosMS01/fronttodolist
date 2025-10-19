import { API_URL } from '../config.js';

export async function getTasks() {
    const res = await fetch(`${API_URL}/api/tasks`, {
        method: 'GET',
        credentials: 'include'
    });
    return res.json();
}