import { getCurrentUser, logout } from '../src/services/auth.js';
import { getTasks, createTask, getTask, updateTask, deleteTask } from '../src/services/tasks.js';


// =======================
// Función centralizada de alertas
// =======================
function showAlert(icon, title, text, timer = 0, html = null) {
    Swal.fire({
        icon,
        title,
        text: html ? undefined : text,
        html: html || undefined,
        showConfirmButton: !timer,
        timer: timer || undefined
    });
}


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
            card.dataset.id = t.id;

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
        showAlert('error', 'Error de conexión', 'No se pudo conectar con el servidor. Intenta nuevamente.');
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
// Modal: animaciones para nueva tarea
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
        document.getElementById("taskForm").reset();
    });
};
closeBtn.addEventListener('click', closeModal);


// =======================
// Formulario: crear nueva tarea
// =======================
const btnCreateTask = document.getElementById('btn-create-task');

async function createTaskModal() {
    btnCreateTask.disabled = true;
    btnCreateTask.textContent = "Procesando...";

    const title = document.getElementById('title');
    const description = document.getElementById('description');

    const status = document.getElementById('status');
    const selectedStatus = status.value;

    const priority = document.getElementById('priority');
    const selectedPriority = priority.value;

    const fieldsTask = {
        title: title.value.trim(),
        description: description.value.trim()
    };

    const errorsTask = validateFields(fieldsTask);

    if (errorsTask.length > 0) {
        showAlert('warning', 'Campos incompletos', '', 0, errorsTask.join('<br>'));
        btnCreateTask.disabled = false;
        btnCreateTask.textContent = "Guardar";
        return;
    }

    const data = {
        title: title.value.trim(),
        description: description.value.trim(),
        status: selectedStatus,
        priority: selectedPriority
    };

    try {
        const res = await createTask(data);

        if (res.message) {
            showAlert('success', 'Tarea creada exitosamente', '', 2000);
            setTimeout(() => {
                document.getElementById("taskForm").reset();
                updateWeekDisplay();
            }, 1500);
        } else {
            showAlert('error', 'Error en el registro', '');
        }
    } catch {
        showAlert('error', 'Error de conexión', 'No se pudo conectar con el servidor. Intenta nuevamente.');
    } finally {
        btnCreateTask.disabled = false;
        btnCreateTask.textContent = "Guardar";
    }
}

document.getElementById('taskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    createTaskModal();
    closeModal();
});


// =======================
// Modal: animaciones para editar tarea
// =======================
const closeEditBtn = document.getElementById('closeModalEditBtn');
const modalEdit = document.getElementById('taskModalEdit');
const modalContentEdit = modalEdit.querySelector('.modal-content-edit');

const mLine = gsap.timeline({ paused: true, reversed: true });
mLine.fromTo(modalContentEdit,
    { y: -50, opacity: 0, scale: 0.9 },
    { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
);

const closeEditModal = () => {
    mLine.reverse();
    mLine.eventCallback("onReverseComplete", () => {
        modalEdit.hidden = true;
        document.getElementById("taskForm").reset();
    });
};
closeEditBtn.addEventListener('click', closeEditModal);


// =======================
// Click: mostrar informacion de una tarea en el formulario
// =======================
document.addEventListener('click', async e => {

    const card = e.target.closest('.task-card');
    if (!card) return;

    const idTarea = card.dataset.id;

    try {
        const tarea = await getTask(idTarea);

        if (tarea.error) {
            showAlert(
                'error',
                'Error al obtener la tarea',
                tarea.error.message || 'Ocurrió un problema al cargar los datos'
            );
            return;
        }

        document.getElementById('title-edit').value = tarea.title;
        document.getElementById('description-edit').value = tarea.description;
        document.getElementById('status-edit').value = tarea.status;
        document.getElementById('priority-edit').value = tarea.priority;

        document.getElementById('taskFormEdit').dataset.id = tarea.id;

        if (mLine.reversed()) {
            modalEdit.hidden = false;
            mLine.play();
        }
    } catch {
        showAlert('error', 'Error al obtener la tarea', 'Ocurrió un problema al cargar los datos');
    }

});


// =======================
// Formulario: editar una tarea
// =======================
const btnEditTask = document.getElementById('btn-edit-task');

async function editTaskModal() {
    btnEditTask.disabled = true;
    btnEditTask.textContent = "Procesando...";

    const title = document.getElementById('title-edit');
    const description = document.getElementById('description-edit');

    const status = document.getElementById('status-edit');
    const selectedStatus = status.value;

    const priority = document.getElementById('priority-edit');
    const selectedPriority = priority.value;

    const fieldsTask = {
        title: title.value.trim(),
        description: description.value.trim()
    };

    const errorsTask = validateFields(fieldsTask);

    if (errorsTask.length > 0) {
        showAlert('warning', 'Campos incompletos', '', 0, errorsTask.join('<br>'));
        btnEditTask.disabled = false;
        btnEditTask.textContent = "Guardar";
        return;
    }

    const data = {
        title: title.value.trim(),
        description: description.value.trim(),
        status: selectedStatus,
        priority: selectedPriority
    };

    try {
        const idTarea = document.getElementById('taskFormEdit').dataset.id;
        const res = await updateTask(idTarea, data);

        if (res.message) {
            showAlert('success', 'Tarea actualizada exitosamente', '', 2000);
            setTimeout(() => {
                document.getElementById("taskForm").reset();
                updateWeekDisplay();
            }, 1500);
        } else {
            showAlert('error', 'Error en el registro', '');
        }
    } catch {
        showAlert('error', 'Error de conexión', 'No se pudo conectar con el servidor. Intenta nuevamente.');
    } finally {
        btnEditTask.disabled = false;
        btnEditTask.textContent = "Guardar";
    }
}

document.getElementById('taskFormEdit').addEventListener('submit', (e) => {
    e.preventDefault();
    editTaskModal();
    closeEditModal();
});


// =======================
// Validaciones para los campos { title, description }
// =======================
function validateFields({ title, description }) {
    const errores = [];

    if (!title || !/^[\p{L}\p{N}\p{P}\p{Zs}]+$/u.test(title.trim())) {
        errores.push("El titulo contiene caracteres inválidos.");
    }

    if (!description || !/^[\p{L}\p{N}\p{P}\p{Zs}]+$/u.test(description.trim())) {
        errores.push("La descripción contiene caracteres inválidos.");
    }

    return errores;
}


// =======================
// Eliminación de una tarea
// =======================
const btnDeleteTask = document.getElementById('btn-delete-task');

btnDeleteTask.addEventListener('click', async () => {
    const idTarea = document.getElementById('taskFormEdit').dataset.id;
    if (!idTarea) return;

    Swal.fire({
        title: '¿Seguro que deseas eliminar esta tarea?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (!result.isConfirmed) return;

        try {
            const res = await deleteTask(idTarea);

            if (res.message) {
                showAlert('success', 'Tarea eliminada', res.message, 2000);
                closeEditModal();
                updateWeekDisplay();
            } else {
                showAlert('error', 'Error', res.error || "Error al eliminar");
            }
        } catch (err) {
            showAlert('error', 'Error de conexión', "Error de conexión con el servidor");
        }
    });
});
