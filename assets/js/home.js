import { getCurrentUser, logout } from '../src/services/auth.js';
import { getTasks } from '../src/services/tasks.js';


// =======================
// Obtener el usuario y cargar tareas
// =======================
window.addEventListener('DOMContentLoaded', async () => {
    const user = await getCurrentUser();

    if (user.error || !user.username) {
        document.getElementById('mensaje').textContent = "No hay un usuario";
    } else {
        document.getElementById('username').textContent = user.username;
    }
});


// =======================
// Cerrar sesión
// =======================
document.getElementById('btn-logout').addEventListener('click', () => { logout(); });


// =======================
// Mostrar semanas
// =======================
const weekRangeEl = document.querySelector('.week-range');
const prevBtn = document.querySelector('.prev-week');
const nextBtn = document.querySelector('.next-week');
const dayColumns = document.querySelectorAll('.day-column');

let currentDate = new Date();

// Función para obtener el inicio y fin de semana (domingo a sábado)
function getWeekRange(date) {
    const dayOfWeek = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
}

// Formatear fecha (ej: "12 Oct" o "30 Dic")
function formatDate(date) {
    const options = { day: 'numeric', month: 'short' };
    return date.toLocaleDateString('es-MX', options);
}

// Mostrar rango en el span
function updateWeekDisplay() {
    const { startOfWeek, endOfWeek } = getWeekRange(currentDate);
    const year = startOfWeek.getFullYear();
    weekRangeEl.textContent = `Semana del ${formatDate(startOfWeek)} al ${formatDate(endOfWeek)} ${year}`;
    loadTasksForWeek(startOfWeek, endOfWeek);
}

// Cargar tareas del usuario por semana
async function loadTasksForWeek(startOfWeek, endOfWeek) {
    try {
        const tasks = await getTasks();

        if (!tasks) {
            console.log("No tienes tareas para esta semana");
        } else {
            // Limpiar listas previas
            dayColumns.forEach(col => col.querySelector('.task-list').innerHTML = '');

            // Filtrar tareas de esta semana
            const weekTasks = tasks.filter(t => {
                const created = new Date(t.created_at);
                return created >= startOfWeek && created <= endOfWeek;
            });

            // Insertar cada tarea en su día correspondiente
            weekTasks.forEach(t => {
                const created = new Date(t.created_at);
                const dayIndex = created.getDay();
                const taskList = dayColumns[dayIndex].querySelector('.task-list');

                const div = document.createElement('div');
                div.className = 'task-item';
                div.textContent = t.title;

                taskList.appendChild(div);
            });
        }
    } catch (err) {
        console.log("Error de conexión con el servidor");
    }
}

prevBtn.addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() - 7);
    updateWeekDisplay();
});

nextBtn.addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() + 7);
    updateWeekDisplay();
});

updateWeekDisplay();


// =======================
// Acción y animación para ocultar las tareas
// =======================
document.querySelectorAll('.toggle-day').forEach(dayHeader => {
    const taskList = dayHeader.nextElementSibling;
    const label = dayHeader.querySelector('.day-toggle-label');

    dayHeader.addEventListener('click', () => {
        taskList.classList.toggle('collapsed');

        const isCollapsed = taskList.classList.contains('collapsed');
        label.textContent = isCollapsed ? 'Mostrar ▼' : 'Ocultar ▲';
    });
});
