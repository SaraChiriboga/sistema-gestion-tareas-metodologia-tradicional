/**
 * Task Management Module
 * HU02: Vista Kanban & Drag-and-Drop
 * HU03: Asignación de tareas a usuarios
 * HU06: Comentarios en tareas
 * HU07: Sistema de etiquetado
 * HU08: Integración con Google Calendar e iCal (.ics)
 * HU10: Archivos adjuntos
 * HU16: Sistema de prioridades
 * HU18: Recordatorios automáticos
 */

const PRIORITIES = {
  urgent: { id: 'urgent', label: 'Urgente', level: 4, color: '#ef4444', bg: '#fee2e2', text: '#991b1b', icon: '🔥' },
  high:   { id: 'high',   label: 'Alta',    level: 3, color: '#f97316', bg: '#ffedd5', text: '#9a3412', icon: '🔺' },
  medium: { id: 'medium', label: 'Media',   level: 2, color: '#3b82f6', bg: '#dbeafe', text: '#1e40af', icon: '🔹' },
  low:    { id: 'low',    label: 'Baja',    level: 1, color: '#10b981', bg: '#d1fae5', text: '#065f46', icon: '🟢' }
};

const STATUS_COLUMNS = [
  { id: 'todo',        label: 'Por Hacer',    icon: '📋', color: '#64748b' },
  { id: 'in_progress', label: 'En Progreso',  icon: '⏳', color: '#3b82f6' },
  { id: 'review',      label: 'En Revisión',  icon: '🔍', color: '#8b5cf6' },
  { id: 'done',        label: 'Completado',   icon: '✅', color: '#10b981' }
];

const PRESET_TAG_COLORS = {
  'Frontend': { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
  'Backend': { bg: '#ede9fe', text: '#5b21b6', border: '#c4b5fd' },
  'UI/UX': { bg: '#fce7f3', text: '#9d174d', border: '#fbcfe8' },
  'Bug': { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
  'Seguridad': { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
  'API': { bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe' },
  'DevOps': { bg: '#ccfbf1', text: '#115e59', border: '#99f6e4' },
  'Base de Datos': { bg: '#e2e8f0', text: '#334155', border: '#cbd5e1' }
};

class TaskManager {
  constructor() {
    this.tasks = window.dataStore.getTasks();
    this.activeTaskModalId = null;
    this.draggedTaskId = null;
  }

  getTasks() {
    this.tasks = window.dataStore.getTasks();
    return this.tasks;
  }

  getProjectTasks(projectId) {
    const all = this.getTasks();
    if (!projectId || projectId === 'all') return all;
    return all.filter(t => t.projectId === projectId);
  }

  getTaskById(id) {
    return this.getTasks().find(t => t.id === id) || null;
  }

  createTask(data) {
    if (!window.authManager.requirePermission('create_task', 'crear nuevas tareas')) {
      return null;
    }

    if (!data.title || data.title.trim().length === 0) {
      window.TaskApp.showToast('El título de la tarea es requerido', 'warning');
      return null;
    }

    const currentProject = window.projectManager.getCurrentProject();
    const projectId = data.projectId || (currentProject.id === 'all' ? 'proj-1' : currentProject.id);

    const newTask = {
      id: 'task-' + Date.now(),
      projectId: projectId,
      title: data.title.trim(),
      description: data.description ? data.description.trim() : '',
      status: data.status || 'todo',
      priority: data.priority || 'medium', // HU16
      assigneeId: data.assigneeId || null, // HU03
      tags: data.tags || [],               // HU07
      dueDate: data.dueDate || '',
      estimatedHours: data.estimatedHours ? Number(data.estimatedHours) : 0,
      createdAt: new Date().toISOString().split('T')[0],
      attachments: data.attachments || [], // HU10
      comments: []                         // HU06
    };

    const tasks = this.getTasks();
    tasks.push(newTask);
    window.dataStore.saveTasks(tasks);

    // Activity log
    window.dataStore.addActivity('creó la tarea', newTask.title, 'task_create');

    // Notify assignee if assigned (HU05 simulated email notification)
    if (newTask.assigneeId) {
      const assignee = window.dataStore.getUsers().find(u => u.id === newTask.assigneeId);
      if (assignee) {
        window.dataStore.addNotification(
          'Nueva Tarea Asignada',
          `Se te ha asignado la tarea "${newTask.title}" con prioridad ${PRIORITIES[newTask.priority].label}.`,
          'info'
        );
      }
    }

    window.TaskApp.showToast(`Tarea creada correctamente`, 'success');
    window.TaskApp.render();
    return newTask;
  }

  updateTask(id, data) {
    const task = this.getTaskById(id);
    if (!task) return null;

    if (!window.authManager.requirePermission('edit_task', 'modificar esta tarea', task)) {
      return null;
    }

    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    const oldAssigneeId = task.assigneeId;
    const oldStatus = task.status;
    const oldPriority = task.priority;

    tasks[index] = {
      ...task,
      title: data.title ? data.title.trim() : task.title,
      description: data.description !== undefined ? data.description.trim() : task.description,
      status: data.status || task.status,
      priority: data.priority || task.priority,
      assigneeId: data.assigneeId !== undefined ? data.assigneeId : task.assigneeId,
      tags: data.tags !== undefined ? data.tags : task.tags,
      dueDate: data.dueDate !== undefined ? data.dueDate : task.dueDate,
      estimatedHours: data.estimatedHours !== undefined ? Number(data.estimatedHours) : task.estimatedHours,
      attachments: data.attachments !== undefined ? data.attachments : task.attachments
    };

    window.dataStore.saveTasks(tasks);
    window.dataStore.addActivity('actualizó la tarea', tasks[index].title, 'task_update');

    // Check status change log
    if (oldStatus !== tasks[index].status) {
      const col = STATUS_COLUMNS.find(c => c.id === tasks[index].status);
      window.dataStore.addActivity(`cambió estado a "${col ? col.label : tasks[index].status}" de`, tasks[index].title, 'task_status');
    }

    // Check new assignment notification (HU05)
    if (tasks[index].assigneeId && tasks[index].assigneeId !== oldAssigneeId) {
      const assignee = window.dataStore.getUsers().find(u => u.id === tasks[index].assigneeId);
      if (assignee) {
        window.dataStore.addNotification(
          'Tarea Asignada',
          `Se te asignó la tarea "${tasks[index].title}".`,
          'info'
        );
      }
    }

    window.TaskApp.showToast('Tarea actualizada', 'success');
    window.TaskApp.render();
    return tasks[index];
  }

  deleteTask(id) {
    const task = this.getTaskById(id);
    if (!task) return false;

    if (!window.authManager.requirePermission('delete_task', 'eliminar tareas')) {
      return false;
    }

    if (!confirm(`¿Estás seguro de eliminar la tarea "${task.title}"?`)) {
      return false;
    }

    const tasks = this.getTasks().filter(t => t.id !== id);
    window.dataStore.saveTasks(tasks);
    window.dataStore.addActivity('eliminó la tarea', task.title, 'task_delete');
    window.TaskApp.showToast(`Tarea eliminada`, 'info');
    window.TaskApp.render();
    return true;
  }

  updateTaskStatus(id, newStatus) {
    if (!window.authManager.requirePermission('change_status', 'mover tareas')) {
      return false;
    }

    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) return false;

    if (task.status === newStatus) return true;

    task.status = newStatus;
    window.dataStore.saveTasks(tasks);

    const col = STATUS_COLUMNS.find(c => c.id === newStatus);
    const colName = col ? col.label : newStatus;
    window.dataStore.addActivity(`movió a "${colName}" la tarea`, task.title, 'task_status');

    if (newStatus === 'done') {
      window.TaskApp.showToast(`🎉 ¡Tarea "${task.title}" completada!`, 'success');
    }

    window.TaskApp.render();
    return true;
  }

  // HU06: Comentarios
  addComment(taskId, content) {
    if (!content || content.trim().length === 0) return null;

    if (!window.authManager.requirePermission('comment_task', 'agregar comentarios')) {
      return null;
    }

    const user = window.authManager.getCurrentUser();
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return null;

    if (!task.comments) task.comments = [];

    const newComment = {
      id: 'c-' + Date.now(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: content.trim(),
      createdAt: new Date().toISOString()
    };

    task.comments.push(newComment);
    window.dataStore.saveTasks(tasks);
    window.dataStore.addActivity('comentó en la tarea', task.title, 'comment');

    // Notify assignee if someone else commented
    if (task.assigneeId && task.assigneeId !== user.id) {
      window.dataStore.addNotification(
        'Nuevo Comentario',
        `${user.name} comentó en tu tarea "${task.title}": "${content.trim().slice(0, 50)}..."`,
        'info'
      );
    }

    return newComment;
  }

  deleteComment(taskId, commentId) {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.comments) return false;

    const user = window.authManager.getCurrentUser();
    const comment = task.comments.find(c => c.id === commentId);
    if (!comment) return false;

    // Only comment owner or admin can delete
    if (comment.userId !== user.id && user.role !== 'admin') {
      window.TaskApp.showToast('Solo puedes eliminar tus propios comentarios', 'warning');
      return false;
    }

    task.comments = task.comments.filter(c => c.id !== commentId);
    window.dataStore.saveTasks(tasks);
    return true;
  }

  // HU10: Archivos Adjuntos
  addAttachment(taskId, fileObj) {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return null;

    if (!task.attachments) task.attachments = [];

    const newAttachment = {
      id: 'att-' + Date.now(),
      name: fileObj.name,
      size: fileObj.size,
      type: fileObj.type,
      dataUrl: fileObj.dataUrl || null
    };

    task.attachments.push(newAttachment);
    window.dataStore.saveTasks(tasks);
    window.dataStore.addActivity('adjuntó un archivo a', task.title, 'attachment');
    return newAttachment;
  }

  deleteAttachment(taskId, attachmentId) {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.attachments) return false;

    task.attachments = task.attachments.filter(a => a.id !== attachmentId);
    window.dataStore.saveTasks(tasks);
    return true;
  }

  // HU08: Google Calendar & .ics export
  getGoogleCalendarUrl(task) {
    const title = encodeURIComponent(task.title);
    const details = encodeURIComponent(
      (task.description || '') + `\n\nPrioridad: ${task.priority.toUpperCase()}\nEstado: ${task.status}`
    );
    
    // Dates formatted YYYYMMDD
    let dateStr = '';
    if (task.dueDate) {
      const cleanDate = task.dueDate.replace(/-/g, '');
      dateStr = `${cleanDate}/${cleanDate}`;
    } else {
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
      dateStr = `${today}/${today}`;
    }

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dateStr}`;
  }

  downloadIcsFile(task) {
    const dt = task.dueDate ? task.dueDate.replace(/-/g, '') : new Date().toISOString().split('T')[0].replace(/-/g, '');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//TaskFlow Pro//ES',
      'BEGIN:VEVENT',
      `UID:${task.id}@taskflowpro.local`,
      `DTSTAMP:${dt}T090000Z`,
      `DTSTART;VALUE=DATE:${dt}`,
      `DTEND;VALUE=DATE:${dt}`,
      `SUMMARY:${task.title}`,
      `DESCRIPTION:${task.description || ''}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tarea-${task.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // HU18: Chequeo de Recordatorios Automáticos
  checkReminders() {
    const today = new Date().toISOString().split('T')[0];
    const tasks = this.getTasks();
    const currentUser = window.authManager.getCurrentUser();

    const overdueTasks = tasks.filter(t => t.status !== 'done' && t.dueDate && t.dueDate < today);
    const todayTasks = tasks.filter(t => t.status !== 'done' && t.dueDate === today);

    return {
      overdue: overdueTasks,
      today: todayTasks,
      hasAlerts: overdueTasks.length > 0 || todayTasks.length > 0
    };
  }

  // Tag color helper
  getTagStyle(tagName) {
    return PRESET_TAG_COLORS[tagName] || { bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe' };
  }
}

window.taskManager = new TaskManager();
