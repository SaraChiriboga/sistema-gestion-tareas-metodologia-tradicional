/**
 * Main Application Controller (TaskFlow Pro)
 * Coordinates UI, Kanban Drag & Drop, Views, Themes, Modals, Toasts
 */

class TaskFlowApp {
  constructor() {
    this.currentView = 'kanban'; // 'kanban' | 'dashboard' | 'list'
    this.editingTaskId = null;
    this.init();
  }

  init() {
    // Initialize Theme
    const settings = window.dataStore.getSettings();
    if (settings.theme === 'dark') {
      document.body.classList.add('dark-theme');
    }

    // Bind Global Events
    this.bindEvents();

    // Check reminders (HU18)
    this.checkDueReminders();

    // Initial render
    this.render();
  }

  bindEvents() {
    // Navigation Tabs
    const tabKanban = document.getElementById('tabKanban');
    const tabDashboard = document.getElementById('tabDashboard');
    const tabList = document.getElementById('tabList');

    if (tabKanban) tabKanban.addEventListener('click', () => this.switchView('kanban'));
    if (tabDashboard) tabDashboard.addEventListener('click', () => this.switchView('dashboard'));
    if (tabList) tabList.addEventListener('click', () => this.switchView('list'));

    // Search & Filter Inputs
    const searchInput = document.getElementById('searchQuery');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        window.filterManager.setFilter('query', e.target.value);
      });
    }

    const filterPriority = document.getElementById('filterPriority');
    if (filterPriority) {
      filterPriority.addEventListener('change', (e) => {
        window.filterManager.setFilter('priority', e.target.value);
      });
    }

    const filterStatus = document.getElementById('filterStatus');
    if (filterStatus) {
      filterStatus.addEventListener('change', (e) => {
        window.filterManager.setFilter('status', e.target.value);
      });
    }

    const filterAssignee = document.getElementById('filterAssignee');
    if (filterAssignee) {
      filterAssignee.addEventListener('change', (e) => {
        window.filterManager.setFilter('assigneeId', e.target.value);
      });
    }

    const filterTag = document.getElementById('filterTag');
    if (filterTag) {
      filterTag.addEventListener('change', (e) => {
        window.filterManager.setFilter('tag', e.target.value);
      });
    }

    const filterDate = document.getElementById('filterDate');
    if (filterDate) {
      filterDate.addEventListener('change', (e) => {
        window.filterManager.setFilter('dateFilter', e.target.value);
      });
    }

    const sortBy = document.getElementById('sortBy');
    if (sortBy) {
      sortBy.addEventListener('change', (e) => {
        window.filterManager.setFilter('sortBy', e.target.value);
      });
    }

    const btnClearFilters = document.getElementById('btnClearFilters');
    if (btnClearFilters) {
      btnClearFilters.addEventListener('click', () => {
        window.filterManager.clearFilters();
      });
    }

    // Theme Toggle (HU17)
    const btnThemeToggle = document.getElementById('btnThemeToggle');
    if (btnThemeToggle) {
      btnThemeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Language Toggle (HU12)
    const btnLangToggle = document.getElementById('btnLangToggle');
    if (btnLangToggle) {
      btnLangToggle.addEventListener('click', () => {
        const nextLang = window.i18n.currentLang === 'es' ? 'en' : 'es';
        window.i18n.setLanguage(nextLang);
        btnLangToggle.textContent = nextLang === 'es' ? '🇪🇸 ES' : '🇺🇸 EN';
        this.render();
      });
    }

    // Project Form Submit
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
      projectForm.addEventListener('submit', (e) => this.handleProjectFormSubmit(e));
    }

    // Task Form Submit
    const taskForm = document.getElementById('taskForm');
    if (taskForm) {
      taskForm.addEventListener('submit', (e) => this.handleTaskFormSubmit(e));
    }

    // Comment Input Enter key (HU06)
    const commentInput = document.getElementById('commentInput');
    if (commentInput) {
      commentInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.handleCommentSubmit(e);
        }
      });
    }

    // Attachment Input (HU10)
    const attachmentInput = document.getElementById('taskAttachmentInput');
    if (attachmentInput) {
      attachmentInput.addEventListener('change', (e) => this.handleAttachmentUpload(e));
    }

    // Notifications Toggle (HU05)
    const btnNotifications = document.getElementById('btnNotifications');
    if (btnNotifications) {
      btnNotifications.addEventListener('click', () => this.toggleNotificationsDrawer());
    }

    // Click outside dropdowns & drawers
    document.addEventListener('click', (e) => {
      const userMenu = document.getElementById('userDropdownMenu');
      const userBtn = document.getElementById('userProfileBtn');
      if (userMenu && userMenu.classList.contains('active') && !userMenu.contains(e.target) && !userBtn.contains(e.target)) {
        userMenu.classList.remove('active');
      }
    });
  }

  toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    const settings = window.dataStore.getSettings();
    settings.theme = isDark ? 'dark' : 'light';
    window.dataStore.saveSettings(settings);

    const btnTheme = document.getElementById('btnThemeToggle');
    if (btnTheme) {
      btnTheme.innerHTML = isDark ? '☀️' : '🌙';
      btnTheme.title = isDark ? 'Modo Claro' : 'Modo Oscuro';
    }
    this.showToast(`Modo ${isDark ? 'Oscuro' : 'Claro'} activado`, 'info');
  }

  switchView(viewName) {
    this.currentView = viewName;
    ['kanban', 'dashboard', 'list'].forEach(v => {
      const tab = document.getElementById(`tab${v.charAt(0).toUpperCase() + v.slice(1)}`);
      const view = document.getElementById(`${v}View`);
      if (tab) tab.classList.toggle('active', v === viewName);
      if (view) view.style.display = v === viewName ? 'block' : 'none';
    });

    const filtersSection = document.getElementById('filtersSection');
    if (filtersSection) {
      filtersSection.style.display = viewName === 'dashboard' ? 'none' : 'flex';
    }

    this.render();
  }

  render() {
    this.renderHeader();
    this.renderSidebarProjects();
    this.renderFilterOptions();

    if (this.currentView === 'kanban') {
      this.renderKanbanBoard();
    } else if (this.currentView === 'dashboard') {
      window.dashboardManager.renderDashboard('dashboardView');
    } else if (this.currentView === 'list') {
      this.renderListView();
    }

    this.updateNotificationBadge();
  }

  renderHeader() {
    const user = window.authManager.getCurrentUser();
    const currentProject = window.projectManager.getCurrentProject();

    // User display
    const userAvatarEl = document.getElementById('headerUserAvatar');
    const userNameEl = document.getElementById('headerUserName');
    const userRoleEl = document.getElementById('headerUserRole');

    if (userAvatarEl) {
      userAvatarEl.src = user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`;
    }
    if (userNameEl) {
      userNameEl.innerHTML = `${user.name} ${user.isPremium ? '⭐' : ''}`;
    }
    if (userRoleEl) {
      userRoleEl.innerHTML = window.authManager.getRoleBadge(user.role);
    }

    // Active project pill in top bar
    const activeProjectPill = document.getElementById('headerActiveProject');
    if (activeProjectPill && currentProject) {
      activeProjectPill.innerHTML = `
        <span class="project-pill-icon">${currentProject.icon}</span>
        <span class="project-pill-name">${currentProject.name}</span>
      `;
    }
  }

  renderSidebarProjects() {
    const projects = window.projectManager.getProjects();
    const currentProj = window.projectManager.getCurrentProject();
    const container = document.getElementById('sidebarProjectsList');
    if (!container) return;

    let html = `
      <div 
        class="project-item ${currentProj.id === 'all' ? 'active' : ''}" 
        onclick="window.projectManager.setCurrentProject('all')"
      >
        <span class="project-item-icon">📁</span>
        <div class="project-item-info">
          <span class="project-item-name">Todos los Proyectos</span>
          <small class="project-item-count">${window.taskManager.getTasks().length} tareas</small>
        </div>
      </div>
    `;

    projects.forEach(p => {
      const stats = window.projectManager.getProjectStats(p.id);
      const isActive = currentProj && currentProj.id === p.id;

      html += `
        <div 
          class="project-item ${isActive ? 'active' : ''}" 
          onclick="window.projectManager.setCurrentProject('${p.id}')"
          style="--project-color: ${p.color}"
        >
          <span class="project-item-icon">${p.icon || '📁'}</span>
          <div class="project-item-info">
            <span class="project-item-name">${p.name}</span>
            <div class="project-item-progress">
              <div class="project-progress-bar">
                <div class="project-progress-fill" style="width: ${stats.percentage}%; background-color: ${p.color}"></div>
              </div>
              <small class="project-stats-text">${stats.completed}/${stats.total} (${stats.percentage}%)</small>
            </div>
          </div>
          ${window.authManager.hasPermission('delete_project') && projects.length > 1 ? `
            <button class="project-item-action" title="Eliminar proyecto" onclick="event.stopPropagation(); window.projectManager.deleteProject('${p.id}')">✕</button>
          ` : ''}
        </div>
      `;
    });

    container.innerHTML = html;
  }

  renderFilterOptions() {
    const tasks = window.taskManager.getTasks();
    const users = window.dataStore.getUsers();

    // Populate Tag dropdown (HU07)
    const filterTag = document.getElementById('filterTag');
    if (filterTag && filterTag.options.length <= 1) {
      const allTags = new Set();
      tasks.forEach(t => (t.tags || []).forEach(tag => allTags.add(tag)));
      allTags.forEach(tag => {
        const opt = document.createElement('option');
        opt.value = tag;
        opt.textContent = `#${tag}`;
        filterTag.appendChild(opt);
      });
    }

    // Populate Assignee dropdown (HU03)
    const filterAssignee = document.getElementById('filterAssignee');
    if (filterAssignee && filterAssignee.options.length <= 2) {
      users.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.id;
        opt.textContent = `${u.name} (${window.authManager.getRoleLabel(u.role)})`;
        filterAssignee.appendChild(opt);
      });
    }

    // Show active filter badge
    const activeCount = window.filterManager.getActiveFilterCount();
    const activeBadge = document.getElementById('activeFilterCountBadge');
    const btnClearFilters = document.getElementById('btnClearFilters');

    if (activeBadge) {
      activeBadge.textContent = activeCount;
      activeBadge.style.display = activeCount > 0 ? 'inline-block' : 'none';
    }
    if (btnClearFilters) {
      btnClearFilters.style.display = activeCount > 0 ? 'inline-flex' : 'none';
    }
  }

  // --- HU02: TABLERO KANBAN ---
  renderKanbanBoard() {
    const currentProject = window.projectManager.getCurrentProject();
    const allProjectTasks = window.taskManager.getProjectTasks(currentProject ? currentProject.id : 'all');
    const filteredTasks = window.filterManager.applyFilters(allProjectTasks);
    const users = window.dataStore.getUsers();

    // Update counter display
    const counterDisplay = document.getElementById('tasksCountDisplay');
    if (counterDisplay) {
      counterDisplay.textContent = `Mostrando ${filteredTasks.length} de ${allProjectTasks.length} tareas`;
    }

    // Render columns
    STATUS_COLUMNS.forEach(col => {
      const colTasks = filteredTasks.filter(t => t.status === col.id);
      const colContainer = document.getElementById(`kanbanCol-${col.id}`);
      const countBadge = document.getElementById(`countBadge-${col.id}`);

      if (countBadge) {
        countBadge.textContent = colTasks.length;
      }

      if (colContainer) {
        colContainer.innerHTML = colTasks.length === 0
          ? `<div class="kanban-empty-dropzone" data-status="${col.id}">Arrastra tareas aquí</div>`
          : colTasks.map(task => this.renderTaskCard(task, users)).join('');

        // Setup drop target listeners
        colContainer.ondragover = (e) => {
          e.preventDefault();
          colContainer.classList.add('drag-hover');
        };
        colContainer.ondragleave = () => {
          colContainer.classList.remove('drag-hover');
        };
        colContainer.ondrop = (e) => {
          e.preventDefault();
          colContainer.classList.remove('drag-hover');
          const taskId = e.dataTransfer.getData('text/plain');
          if (taskId) {
            window.taskManager.updateTaskStatus(taskId, col.id);
          }
        };
      }
    });
  }

  renderTaskCard(task, users) {
    const priority = PRIORITIES[task.priority] || PRIORITIES.medium;
    const assignee = users.find(u => u.id === task.assigneeId);
    const today = new Date().toISOString().split('T')[0];
    const isOverdue = task.dueDate && task.dueDate < today && task.status !== 'done';
    const isToday = task.dueDate && task.dueDate === today;

    // Tags markup (HU07)
    const tagsHtml = (task.tags || []).map(t => {
      const style = window.taskManager.getTagStyle(t);
      return `
        <span 
          class="task-tag" 
          style="background: ${style.bg}; color: ${style.text}; border-color: ${style.border};"
          onclick="event.stopPropagation(); window.filterManager.setFilter('tag', '${t}')"
          title="Filtrar por etiqueta #${t}"
        >
          #${t}
        </span>
      `;
    }).join('');

    return `
      <div 
        class="task-card priority-accent-${task.priority} ${isOverdue ? 'card-overdue' : ''}" 
        id="card-${task.id}"
        draggable="true"
        ondragstart="window.TaskApp.handleDragStart(event, '${task.id}')"
        onclick="window.TaskApp.openTaskModal('${task.id}')"
      >
        <div class="task-card-header">
          <span 
            class="badge priority-badge" 
            style="background-color: ${priority.bg}; color: ${priority.text};"
            title="Prioridad: ${priority.label} (HU16)"
          >
            ${priority.icon} ${priority.label}
          </span>
          <div class="task-card-actions">
            <button 
              class="btn-icon-sm" 
              title="Añadir a Google Calendar (HU08)"
              onclick="event.stopPropagation(); window.open(window.taskManager.getGoogleCalendarUrl(window.taskManager.getTaskById('${task.id}')), '_blank')"
            >
              📅
            </button>
            ${window.authManager.hasPermission('delete_task') ? `
              <button 
                class="btn-icon-sm btn-delete-card" 
                title="Eliminar tarea"
                onclick="event.stopPropagation(); window.taskManager.deleteTask('${task.id}')"
              >
                ✕
              </button>
            ` : ''}
          </div>
        </div>

        <h4 class="task-card-title">${task.title}</h4>

        ${task.description ? `<p class="task-card-desc">${task.description}</p>` : ''}

        ${tagsHtml ? `<div class="task-card-tags">${tagsHtml}</div>` : ''}

        <div class="task-card-footer">
          <div class="task-card-meta">
            ${task.dueDate ? `
              <span class="task-due-date ${isOverdue ? 'due-overdue' : (isToday ? 'due-today' : '')}" title="Fecha de vencimiento">
                🕒 ${task.dueDate} ${isOverdue ? '⚠️' : ''}
              </span>
            ` : ''}

            ${(task.comments && task.comments.length > 0) ? `
              <span class="task-meta-badge" title="${task.comments.length} comentarios (HU06)">
                💬 ${task.comments.length}
              </span>
            ` : ''}

            ${(task.attachments && task.attachments.length > 0) ? `
              <span class="task-meta-badge" title="${task.attachments.length} archivos adjuntos (HU10)">
                📎 ${task.attachments.length}
              </span>
            ` : ''}
          </div>

          <div class="task-card-assignee">
            ${assignee ? `
              <img 
                src="${assignee.avatar}" 
                class="avatar-xs" 
                alt="${assignee.name}" 
                title="Asignado a: ${assignee.name} (${window.authManager.getRoleLabel(assignee.role)})"
              >
            ` : `
              <span class="unassigned-avatar" title="Sin asignar (HU03)">👤</span>
            `}
          </div>
        </div>
      </div>
    `;
  }

  handleDragStart(event, taskId) {
    event.dataTransfer.setData('text/plain', taskId);
    event.dataTransfer.effectAllowed = 'move';
    const card = document.getElementById(`card-${taskId}`);
    if (card) {
      setTimeout(() => card.classList.add('dragging'), 0);
    }
  }

  // --- Vista Lista ---
  renderListView() {
    const container = document.getElementById('listView');
    if (!container) return;

    const currentProject = window.projectManager.getCurrentProject();
    const tasks = window.filterManager.applyFilters(
      window.taskManager.getProjectTasks(currentProject ? currentProject.id : 'all')
    );
    const users = window.dataStore.getUsers();

    container.innerHTML = `
      <div class="list-view-table-card">
        <table class="list-table">
          <thead>
            <tr>
              <th>Prioridad</th>
              <th>Título</th>
              <th>Estado</th>
              <th>Asignado</th>
              <th>Vencimiento</th>
              <th>Etiquetas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${tasks.length === 0 ? `
              <tr><td colspan="7" class="text-center py-4">No se encontraron tareas con los filtros actuales.</td></tr>
            ` : tasks.map(task => {
              const priority = PRIORITIES[task.priority] || PRIORITIES.medium;
              const statusObj = STATUS_COLUMNS.find(s => s.id === task.status);
              const assignee = users.find(u => u.id === task.assigneeId);
              return `
                <tr onclick="window.TaskApp.openTaskModal('${task.id}')" style="cursor: pointer;">
                  <td>
                    <span class="badge" style="background:${priority.bg}; color:${priority.text}">
                      ${priority.icon} ${priority.label}
                    </span>
                  </td>
                  <td><strong>${task.title}</strong></td>
                  <td>
                    <span class="badge badge-default">${statusObj ? statusObj.label : task.status}</span>
                  </td>
                  <td>
                    ${assignee ? `
                      <div class="user-chip-sm">
                        <img src="${assignee.avatar}" class="avatar-xs">
                        <span>${assignee.name}</span>
                      </div>
                    ` : '<span class="text-muted">Sin asignar</span>'}
                  </td>
                  <td>${task.dueDate || '<span class="text-muted">—</span>'}</td>
                  <td>
                    ${(task.tags || []).map(t => `<span class="badge badge-tag">#${t}</span>`).join(' ')}
                  </td>
                  <td>
                    <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); window.TaskApp.openTaskModal('${task.id}')">
                      Ver / Editar
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // --- Modal de Tarea (Crear / Editar) ---
  openTaskModal(taskId = null, defaultStatus = 'todo') {
    this.editingTaskId = taskId;
    const modal = document.getElementById('taskModal');
    const form = document.getElementById('taskForm');
    const titleModal = document.getElementById('taskModalTitle');
    const commentsSection = document.getElementById('taskCommentsSection');
    const attachmentsSection = document.getElementById('taskAttachmentsSection');
    const calendarSection = document.getElementById('taskCalendarSection');

    // Populate Assignee Select Options
    const assigneeSelect = document.getElementById('taskAssignee');
    if (assigneeSelect) {
      assigneeSelect.innerHTML = `<option value="">Sin Asignar</option>`;
      window.dataStore.getUsers().forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.id;
        opt.textContent = `${u.name} — ${window.authManager.getRoleLabel(u.role)}`;
        assigneeSelect.appendChild(opt);
      });
    }

    if (taskId) {
      const task = window.taskManager.getTaskById(taskId);
      if (!task) return;

      titleModal.textContent = 'Editar Tarea';
      document.getElementById('taskTitle').value = task.title;
      document.getElementById('taskDesc').value = task.description || '';
      document.getElementById('taskStatus').value = task.status;
      document.getElementById('taskPriority').value = task.priority;
      document.getElementById('taskAssignee').value = task.assigneeId || '';
      document.getElementById('taskDueDate').value = task.dueDate || '';
      document.getElementById('taskTags').value = (task.tags || []).join(', ');
      document.getElementById('taskHours').value = task.estimatedHours || '';

      // Show Comments & Attachments & Calendar options
      commentsSection.style.display = 'block';
      attachmentsSection.style.display = 'block';
      calendarSection.style.display = 'flex';

      this.renderTaskComments(task);
      this.renderTaskAttachments(task);
    } else {
      titleModal.textContent = 'Nueva Tarea';
      form.reset();
      document.getElementById('taskStatus').value = defaultStatus;
      document.getElementById('taskPriority').value = 'medium';

      commentsSection.style.display = 'none';
      attachmentsSection.style.display = 'none';
      calendarSection.style.display = 'none';
    }

    modal.classList.add('active');
  }

  closeTaskModal() {
    const modal = document.getElementById('taskModal');
    if (modal) modal.classList.remove('active');
    this.editingTaskId = null;
  }

  handleTaskFormSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDesc').value;
    const status = document.getElementById('taskStatus').value;
    const priority = document.getElementById('taskPriority').value;
    const assigneeId = document.getElementById('taskAssignee').value || null;
    const dueDate = document.getElementById('taskDueDate').value;
    const tagsRaw = document.getElementById('taskTags').value;
    const estimatedHours = document.getElementById('taskHours').value;

    const tags = tagsRaw
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(t => t.length > 0);

    const taskData = {
      title,
      description,
      status,
      priority,
      assigneeId,
      dueDate,
      tags,
      estimatedHours
    };

    if (this.editingTaskId) {
      window.taskManager.updateTask(this.editingTaskId, taskData);
    } else {
      window.taskManager.createTask(taskData);
    }

    this.closeTaskModal();
  }

  // --- Comentarios (HU06) ---
  renderTaskComments(task) {
    const container = document.getElementById('commentsList');
    if (!container) return;

    const comments = task.comments || [];
    const curUser = window.authManager.getCurrentUser();

    if (comments.length === 0) {
      container.innerHTML = '<p class="text-muted text-sm py-2">No hay comentarios aún. ¡Sé el primero en comentar!</p>';
      return;
    }

    container.innerHTML = comments.map(c => {
      const timeStr = new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = new Date(c.createdAt).toLocaleDateString();
      const canDelete = c.userId === curUser.id || curUser.role === 'admin';

      return `
        <div class="comment-item">
          <img src="${c.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${c.userName}`}" class="avatar-sm">
          <div class="comment-body">
            <div class="comment-header">
              <strong>${c.userName}</strong>
              <small class="text-muted">${dateStr} ${timeStr}</small>
              ${canDelete ? `
                <button 
                  class="btn-icon-xs" 
                  title="Eliminar comentario"
                  onclick="window.TaskApp.deleteComment('${c.id}')"
                >✕</button>
              ` : ''}
            </div>
            <p class="comment-text">${c.content}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  handleCommentSubmit(e) {
    e.preventDefault();
    if (!this.editingTaskId) return;

    const input = document.getElementById('commentInput');
    const text = input.value.trim();
    if (!text) return;

    const added = window.taskManager.addComment(this.editingTaskId, text);
    if (added) {
      input.value = '';
      const task = window.taskManager.getTaskById(this.editingTaskId);
      this.renderTaskComments(task);
      this.render(); // update card comments count
    }
  }

  deleteComment(commentId) {
    if (!this.editingTaskId) return;
    window.taskManager.deleteComment(this.editingTaskId, commentId);
    const task = window.taskManager.getTaskById(this.editingTaskId);
    this.renderTaskComments(task);
    this.render();
  }

  // --- Archivos Adjuntos (HU10) ---
  renderTaskAttachments(task) {
    const container = document.getElementById('attachmentsList');
    if (!container) return;

    const attachments = task.attachments || [];
    if (attachments.length === 0) {
      container.innerHTML = '<p class="text-muted text-sm py-2">No hay archivos adjuntos.</p>';
      return;
    }

    container.innerHTML = attachments.map(att => `
      <div class="attachment-item">
        <span class="attachment-icon">📎</span>
        <div class="attachment-details">
          <span class="attachment-name">${att.name}</span>
          <small class="text-muted">${att.size}</small>
        </div>
        <button 
          class="btn-icon-xs" 
          title="Eliminar archivo"
          onclick="window.TaskApp.deleteAttachment('${att.id}')"
        >✕</button>
      </div>
    `).join('');
  }

  handleAttachmentUpload(e) {
    const file = e.target.files[0];
    if (!file || !this.editingTaskId) return;

    const sizeFormatted = file.size > 1024 * 1024 
      ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
      : (file.size / 1024).toFixed(1) + ' KB';

    const reader = new FileReader();
    reader.onload = (event) => {
      window.taskManager.addAttachment(this.editingTaskId, {
        name: file.name,
        size: sizeFormatted,
        type: file.type,
        dataUrl: event.target.result
      });

      const task = window.taskManager.getTaskById(this.editingTaskId);
      this.renderTaskAttachments(task);
      this.render();
      window.TaskApp.showToast(`Archivo "${file.name}" adjuntado`, 'success');
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // reset
  }

  deleteAttachment(attachmentId) {
    if (!this.editingTaskId) return;
    window.taskManager.deleteAttachment(this.editingTaskId, attachmentId);
    const task = window.taskManager.getTaskById(this.editingTaskId);
    this.renderTaskAttachments(task);
    this.render();
  }

  // --- Google Calendar & iCal Export (HU08) ---
  addCurrentTaskToCalendar() {
    if (!this.editingTaskId) return;
    const task = window.taskManager.getTaskById(this.editingTaskId);
    if (!task) return;
    const url = window.taskManager.getGoogleCalendarUrl(task);
    window.open(url, '_blank');
  }

  downloadCurrentTaskIcs() {
    if (!this.editingTaskId) return;
    const task = window.taskManager.getTaskById(this.editingTaskId);
    if (!task) return;
    window.taskManager.downloadIcsFile(task);
    this.showToast('Archivo de calendario .ics descargado', 'success');
  }

  // --- Modal de Proyecto (Crear / Editar) ---
  openProjectModal() {
    if (!window.authManager.requirePermission('create_project', 'crear proyectos')) {
      return;
    }
    const modal = document.getElementById('projectModal');
    if (modal) modal.classList.add('active');
  }

  closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) modal.classList.remove('active');
  }

  handleProjectFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('projectName').value;
    const description = document.getElementById('projectDesc').value;
    const color = document.getElementById('projectColor').value;
    const icon = document.getElementById('projectIcon').value;
    const targetDate = document.getElementById('projectTargetDate').value;

    window.projectManager.createProject({ name, description, color, icon, targetDate });
    this.closeProjectModal();
    document.getElementById('projectForm').reset();
  }

  // --- Modal de Roles y Usuarios (HU15) ---
  openRolesModal() {
    if (!window.authManager.hasPermission('manage_users')) {
      window.authManager.requirePermission('manage_users', 'gestionar roles y usuarios');
      return;
    }

    const modal = document.getElementById('rolesModal');
    const tableBody = document.getElementById('rolesUsersTableBody');
    if (!modal || !tableBody) return;

    const users = window.dataStore.getUsers();
    tableBody.innerHTML = users.map(u => `
      <tr>
        <td>
          <div class="user-chip-sm">
            <img src="${u.avatar}" class="avatar-xs">
            <div>
              <strong>${u.name}</strong>
              <br><small class="text-muted">${u.email}</small>
            </div>
          </div>
        </td>
        <td>
          <select 
            class="form-control form-control-sm" 
            onchange="window.authManager.updateUserRole('${u.id}', this.value); window.TaskApp.render();"
          >
            <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>👑 Administrador</option>
            <option value="manager" ${u.role === 'manager' ? 'selected' : ''}>💼 Gestor de Proyecto</option>
            <option value="developer" ${u.role === 'developer' ? 'selected' : ''}>💻 Desarrollador</option>
            <option value="viewer" ${u.role === 'viewer' ? 'selected' : ''}>👁️ Observador</option>
          </select>
        </td>
        <td>
          <span class="badge ${u.isPremium ? 'badge-urgent' : 'badge-default'}">
            ${u.isPremium ? '⭐ Premium' : 'Estándar'}
          </span>
        </td>
      </tr>
    `).join('');

    modal.classList.add('active');
  }

  closeRolesModal() {
    const modal = document.getElementById('rolesModal');
    if (modal) modal.classList.remove('active');
  }

  // --- Centro de Notificaciones & Simulador de Correo (HU05) ---
  toggleNotificationsDrawer() {
    const drawer = document.getElementById('notificationsDrawer');
    if (!drawer) return;

    drawer.classList.toggle('active');
    if (drawer.classList.contains('active')) {
      this.renderNotificationsList();
      window.dataStore.markAllNotificationsRead();
      this.updateNotificationBadge();
    }
  }

  renderNotificationsList() {
    const container = document.getElementById('notificationsList');
    if (!container) return;

    const notifs = window.dataStore.getNotifications();
    if (notifs.length === 0) {
      container.innerHTML = '<p class="text-muted text-center py-4">No tienes notificaciones pendientes.</p>';
      return;
    }

    container.innerHTML = notifs.map(n => {
      const time = new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `
        <div class="notif-item ${n.read ? 'read' : 'unread'}">
          <div class="notif-header">
            <strong>${n.title}</strong>
            <small class="text-muted">${time}</small>
          </div>
          <p class="notif-body">${n.message}</p>
        </div>
      `;
    }).join('');
  }

  updateNotificationBadge() {
    const badge = document.getElementById('notificationsUnreadBadge');
    if (!badge) return;

    const unreadCount = window.dataStore.getNotifications().filter(n => !n.read).length;
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'inline-flex' : 'none';
  }

  showEmailSimulationToast(email, title, message) {
    const toast = document.createElement('div');
    toast.className = 'email-toast';
    toast.innerHTML = `
      <div class="email-toast-header">
        <span>📧 <strong>Notificación por Correo (HU05)</strong></span>
        <button class="email-toast-close" onclick="this.parentElement.parentElement.remove()">✕</button>
      </div>
      <div class="email-toast-recipient">Para: <em>${email}</em></div>
      <div class="email-toast-subject">Asunto: <strong>${title}</strong></div>
      <div class="email-toast-msg">${message}</div>
    `;

    const container = document.getElementById('emailToastContainer') || document.body;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 6000);
  }

  // --- Recordatorios automáticos (HU18) ---
  checkDueReminders() {
    const reminders = window.taskManager.checkReminders();
    const banner = document.getElementById('remindersBanner');
    if (!banner) return;

    if (reminders.hasAlerts) {
      let msg = '';
      if (reminders.overdue.length > 0) {
        msg += `⚠️ Tienes <strong>${reminders.overdue.length} tarea(s) vencida(s)</strong> que requieren atención. `;
      }
      if (reminders.today.length > 0) {
        msg += `📅 <strong>${reminders.today.length} tarea(s)</strong> vencen hoy.`;
      }
      banner.innerHTML = `
        <div class="reminder-content">
          <span>${msg}</span>
          <button class="btn btn-sm btn-secondary" onclick="window.filterManager.setFilter('dateFilter', 'overdue')">Ver Vencidas</button>
        </div>
        <button class="btn-icon-xs" onclick="document.getElementById('remindersBanner').style.display='none'">✕</button>
      `;
      banner.style.display = 'flex';
    } else {
      banner.style.display = 'none';
    }
  }

  // --- Sistema de Notificaciones Toast Flotantes ---
  showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';
    if (type === 'danger') icon = '❌';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-msg">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // Toggle user dropdown
  toggleUserDropdown() {
    const menu = document.getElementById('userDropdownMenu');
    if (menu) menu.classList.toggle('active');
  }

  // Quick switch user demo (HU01, HU15)
  quickSwitchUser(userId) {
    window.authManager.switchUser(userId);
    const user = window.authManager.getCurrentUser();
    this.showToast(`Has cambiado a: ${user.name} (${window.authManager.getRoleLabel(user.role)})`, 'info');
    const menu = document.getElementById('userDropdownMenu');
    if (menu) menu.classList.remove('active');
    this.render();
  }
}

// Instantiate on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.TaskApp = new TaskFlowApp();
});
