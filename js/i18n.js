/**
 * Multilingual Support (HU12: Implementar soporte multilingüe)
 * Complete Spanish / English translation strings and helper
 */

const TRANSLATIONS = {
  es: {
    // Brand & General
    appTitle: 'TaskFlow Pro',
    appSubtitle: 'Gestión Ágil y Colaborativa',
    searchPlaceholder: 'Buscar por título, etiquetas o persona...',
    clearFilters: 'Limpiar Filtros',
    filterBy: 'Filtrar por',
    sortBy: 'Ordenar por',
    all: 'Todos',
    none: 'Ninguno',
    cancel: 'Cancelar',
    save: 'Guardar',
    create: 'Crear',
    delete: 'Eliminar',
    edit: 'Editar',
    close: 'Cerrar',
    confirm: 'Confirmar',
    actions: 'Acciones',
    loading: 'Cargando...',

    // Navigation
    navKanban: 'Tablero Kanban',
    navDashboard: 'Dashboard & Métricas',
    navListView: 'Vista de Lista',
    navProjects: 'Proyectos',
    navMembers: 'Miembros & Roles',
    navTutorial: 'Guía Rápida',
    navSettings: 'Configuración',

    // User & Roles (HU01, HU15)
    roleAdmin: 'Administrador',
    roleManager: 'Gestor de Proyecto',
    roleDeveloper: 'Desarrollador',
    roleViewer: 'Observador',
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    logout: 'Cerrar Sesión',
    switchUser: 'Cambiar Usuario',
    manageRoles: 'Gestión de Roles',
    quickLogin: 'Acceso Rápido Demo',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    fullName: 'Nombre Completo',
    role: 'Rol Asignado',

    // Projects (HU11)
    newProject: 'Nuevo Proyecto',
    editProject: 'Editar Proyecto',
    deleteProject: 'Eliminar Proyecto',
    projectName: 'Nombre del Proyecto',
    projectDesc: 'Descripción',
    projectColor: 'Color / Ícono',
    projectTargetDate: 'Fecha Objetivo',
    allProjects: 'Todos los Proyectos',
    projectProgress: 'Progreso del Proyecto',

    // Kanban Columns (HU02)
    colTodo: 'Por Hacer',
    colInProgress: 'En Progreso',
    colReview: 'En Revisión',
    colDone: 'Completado',
    addTask: 'Añadir Tarea',

    // Task Details & Fields (HU03, HU07, HU16)
    taskTitle: 'Título de la Tarea',
    taskDesc: 'Descripción de la Tarea',
    priority: 'Prioridad',
    priorityUrgent: 'Urgente',
    priorityHigh: 'Alta',
    priorityMedium: 'Media',
    priorityLow: 'Baja',
    assignee: 'Asignado a',
    unassigned: 'Sin asignar',
    tags: 'Etiquetas',
    addTag: '+ Etiqueta',
    dueDate: 'Fecha de Vencimiento',
    estimatedHours: 'Horas Estimadas',
    attachments: 'Archivos Adjuntos (HU10)',
    addAttachment: 'Subir Archivo',
    comments: 'Comentarios (HU06)',
    writeComment: 'Escribe un comentario...',
    postComment: 'Publicar Comentario',
    addToGoogleCalendar: 'Añadir a Google Calendar',
    downloadIcs: 'Descargar .ICS',

    // Filters (HU04)
    filterPriority: 'Prioridad',
    filterStatus: 'Estado',
    filterTag: 'Etiqueta',
    filterAssignee: 'Asignado',
    filterDate: 'Vencimiento',
    overdue: 'Vencidas',
    today: 'Para Hoy',
    thisWeek: 'Esta Semana',
    sortDueDate: 'Fecha Vencimiento',
    sortPriority: 'Prioridad (Mayor a menor)',
    sortCreated: 'Más recientes',
    sortAlphabetical: 'Alfabético (A-Z)',

    // Dashboard & Metrics (HU13)
    dashTitle: 'Métricas & Reportes de Actividad',
    statTotalTasks: 'Total Tareas',
    statCompletedTasks: 'Tareas Completadas',
    statInProgress: 'En Progreso',
    statUrgentTasks: 'Urgentes / Vencidas',
    chartStatus: 'Tareas por Estado',
    chartPriority: 'Distribución por Prioridad',
    chartAssignees: 'Carga de Trabajo por Miembro',
    activityFeed: 'Feed de Actividad en Vivo',
    noActivity: 'No hay actividades recientes registradas.',

    // Export & Premium & Notifications (HU05, HU14, HU20)
    exportExcel: 'Exportar a Excel (CSV)',
    exportJson: 'Copia de Seguridad (JSON)',
    premiumBanner: 'Mejora a Premium',
    premiumBadge: 'PRO',
    upgradeModalTitle: 'Planes y Suscripción Premium',
    simulatedEmailAlert: 'Simulación de Correo Electrónico',
    notificationsTitle: 'Centro de Notificaciones'
  },
  en: {
    // Brand & General
    appTitle: 'TaskFlow Pro',
    appSubtitle: 'Agile & Collaborative Management',
    searchPlaceholder: 'Search by title, tags or assignee...',
    clearFilters: 'Clear Filters',
    filterBy: 'Filter by',
    sortBy: 'Sort by',
    all: 'All',
    none: 'None',
    cancel: 'Cancel',
    save: 'Save',
    create: 'Create',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    confirm: 'Confirm',
    actions: 'Actions',
    loading: 'Loading...',

    // Navigation
    navKanban: 'Kanban Board',
    navDashboard: 'Dashboard & Metrics',
    navListView: 'List View',
    navProjects: 'Projects',
    navMembers: 'Members & Roles',
    navTutorial: 'Quick Tour',
    navSettings: 'Settings',

    // User & Roles (HU01, HU15)
    roleAdmin: 'Administrator',
    roleManager: 'Project Manager',
    roleDeveloper: 'Developer',
    roleViewer: 'Viewer',
    login: 'Log In',
    register: 'Sign Up',
    logout: 'Log Out',
    switchUser: 'Switch User',
    manageRoles: 'Role Management',
    quickLogin: 'Quick Demo Login',
    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    role: 'Assigned Role',

    // Projects (HU11)
    newProject: 'New Project',
    editProject: 'Edit Project',
    deleteProject: 'Delete Project',
    projectName: 'Project Name',
    projectDesc: 'Description',
    projectColor: 'Color / Icon',
    projectTargetDate: 'Target Date',
    allProjects: 'All Projects',
    projectProgress: 'Project Progress',

    // Kanban Columns (HU02)
    colTodo: 'To Do',
    colInProgress: 'In Progress',
    colReview: 'In Review',
    colDone: 'Completed',
    addTask: 'Add Task',

    // Task Details & Fields (HU03, HU07, HU16)
    taskTitle: 'Task Title',
    taskDesc: 'Task Description',
    priority: 'Priority',
    priorityUrgent: 'Urgent',
    priorityHigh: 'High',
    priorityMedium: 'Medium',
    priorityLow: 'Low',
    assignee: 'Assignee',
    unassigned: 'Unassigned',
    tags: 'Tags',
    addTag: '+ Tag',
    dueDate: 'Due Date',
    estimatedHours: 'Estimated Hours',
    attachments: 'Attachments (HU10)',
    addAttachment: 'Upload File',
    comments: 'Comments (HU06)',
    writeComment: 'Write a comment...',
    postComment: 'Post Comment',
    addToGoogleCalendar: 'Add to Google Calendar',
    downloadIcs: 'Download .ICS',

    // Filters (HU04)
    filterPriority: 'Priority',
    filterStatus: 'Status',
    filterTag: 'Tag',
    filterAssignee: 'Assignee',
    filterDate: 'Due Date',
    overdue: 'Overdue',
    today: 'Due Today',
    thisWeek: 'This Week',
    sortDueDate: 'Due Date',
    sortPriority: 'Priority (High to Low)',
    sortCreated: 'Most Recent',
    sortAlphabetical: 'Alphabetical (A-Z)',

    // Dashboard & Metrics (HU13)
    dashTitle: 'Metrics & Activity Reports',
    statTotalTasks: 'Total Tasks',
    statCompletedTasks: 'Completed Tasks',
    statInProgress: 'In Progress',
    statUrgentTasks: 'Urgent / Overdue',
    chartStatus: 'Tasks by Status',
    chartPriority: 'Priority Distribution',
    chartAssignees: 'Workload by Member',
    activityFeed: 'Live Activity Feed',
    noActivity: 'No recent activity recorded.',

    // Export & Premium & Notifications (HU05, HU14, HU20)
    exportExcel: 'Export to Excel (CSV)',
    exportJson: 'Backup (JSON)',
    premiumBanner: 'Upgrade to Premium',
    premiumBadge: 'PRO',
    upgradeModalTitle: 'Premium Plans & Subscription',
    simulatedEmailAlert: 'Email Dispatch Simulation',
    notificationsTitle: 'Notification Center'
  }
};

class I18nManager {
  constructor() {
    const settings = window.dataStore ? window.dataStore.getSettings() : { language: 'es' };
    this.currentLang = settings.language || 'es';
  }

  t(key) {
    const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.es;
    return dict[key] || key;
  }

  setLanguage(lang) {
    if (TRANSLATIONS[lang]) {
      this.currentLang = lang;
      if (window.dataStore) {
        const settings = window.dataStore.getSettings();
        settings.language = lang;
        window.dataStore.saveSettings(settings);
      }
      this.updateDOM();
    }
  }

  updateDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && this.t(key)) {
        el.textContent = this.t(key);
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key && this.t(key)) {
        el.placeholder = this.t(key);
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key && this.t(key)) {
        el.title = this.t(key);
      }
    });
  }
}

window.i18n = new I18nManager();
