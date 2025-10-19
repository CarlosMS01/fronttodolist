import { getCurrentUser, logout } from '../src/services/auth.js';


// =======================
// Obtener el usuario y cargar tareas
// =======================


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

// Función simulada (sustituye con tu real get_tasks)
async function get_tasks() {
    return [
        { id: 1, title: "Comprar pan", created_at: "2025-10-19T10:00:00Z" },
        { id: 2, title: "Ir al gym", created_at: "2025-10-17T09:30:00Z" },
        { id: 3, title: "Estudiar JS", created_at: "2025-10-20T15:00:00Z" },
        { id: 4, title: "Llamar a Juan", created_at: "2025-10-21T12:00:00Z" },
        { id: 5, title: "Estudiar JS", created_at: "2025-10-29T15:00:00Z" }
    ];
}

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
    const tasks = await get_tasks();

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
