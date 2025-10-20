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

        if (!tasks || tasks.length === 0) {
            console.log("No tienes tareas para esta semana");
            return;
        }

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

            // Crear el contenedor principal de la tarea
            const card = document.createElement('div');
            card.className = 'task-card';

            // Título
            const title = document.createElement('h4');
            title.className = 'task-title';
            title.textContent = t.title;

            // Descripción
            const desc = document.createElement('p');
            desc.className = 'task-description';
            desc.textContent = t.description || "Sin descripción";

            // Contenedor de información adicional
            const info = document.createElement('div');
            info.className = 'task-info';

            // Prioridad
            const priority = document.createElement('div');
            priority.className = `task-priority ${t.priority}`;
            priority.textContent = `Prioridad: ${t.priority}`;

            // Estado
            const statusClass = t.status.replace(/\s+/g, '-');
            const status = document.createElement('div');
            status.className = `task-status ${statusClass}`;
            status.textContent = `Estado: ${t.status}`;

            // Añadir prioridad y estado dentro del div info
            info.appendChild(priority);
            info.appendChild(status);

            // Agregar todo al card
            card.appendChild(title);
            card.appendChild(desc);
            card.appendChild(info);

            // Insertar la tarjeta en el día correspondiente
            taskList.appendChild(card);
        });
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
// Modal: formulario para nueva tarea
// =======================
const openTaskModal = document.getElementById('task-new');
const closeBtn = document.getElementById('closeModalBtn');
const modal = document.getElementById('taskModal');
const modalContent = modal.querySelector('.modal-content');

const tline = gsap.timeline({ paused: true, reversed: true });
tline.fromTo(modalContent,
    { y: -50, opacity: 0, scale: 0.9 },
    { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
);

// Abrir modal
openTaskModal.addEventListener('click', () => {
    modal.hidden = false;
    tline.play();
});

// Cerrar modal
const closeModal = () => {
    tline.reverse();
    tline.eventCallback("onReverseComplete", () => {
        modal.hidden = true;
    });
};
closeBtn.addEventListener('click', closeModal);


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
