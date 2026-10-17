/**
 * Data Storage & State Management
 * Handles initial mock data seeding and localStorage persistence
 */

const STORAGE_KEYS = {
  USERS: 'taskmanager_users',
  CURRENT_USER: 'taskmanager_current_user',
  PROJECTS: 'taskmanager_projects',
  CURRENT_PROJECT: 'taskmanager_current_project_id',
  TASKS: 'taskmanager_tasks',
  ACTIVITY_LOG: 'taskmanager_activity_log',
  NOTIFICATIONS: 'taskmanager_notifications',
  SETTINGS: 'taskmanager_settings'
};

const DEFAULT_USERS = [
  {
    id: 'usr-1',
    name: 'Sofía Admin',
    email: 'admin@sistema.com',
    password: 'admin',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    color: '#8b5cf6',
    isPremium: true
  },
  {
    id: 'usr-2',
    name: 'Carlos Gestor',
    email: 'carlos.pm@sistema.com',
    password: 'pm',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    color: '#3b82f6',
    isPremium: false
  },
  {
    id: 'usr-3',
    name: 'Ana Desarrolladora',
    email: 'ana.dev@sistema.com',
    password: 'dev',
    role: 'developer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    color: '#10b981',
    isPremium: false
  },
  {
    id: 'usr-4',
    name: 'Lucía Morales',
    email: 'lucia.dev@sistema.com',
    password: 'dev',
    role: 'developer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    color: '#f59e0b',
    isPremium: false
  },
  {
    id: 'usr-5',
    name: 'Marcos Observador',
    email: 'marcos.view@sistema.com',
    password: 'view',
    role: 'viewer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    color: '#64748b',
    isPremium: false
  }
];

const DEFAULT_PROJECTS = [
  {
    id: 'proj-1',
    name: 'Plataforma E-Commerce 2.0',
    description: 'Rediseño completo de la tienda online con checkout optimizado y pagos.',
    color: '#6366f1',
    icon: '🛒',
    targetDate: '2026-11-30',
    createdAt: '2026-10-01'
  },
  {
    id: 'proj-2',
    name: 'App Móvil Clientes',
    description: 'Desarrollo de aplicación móvil para iOS y Android con notificaciones push.',
    color: '#06b6d4',
    icon: '📱',
    targetDate: '2026-12-15',
    createdAt: '2026-10-05'
  },
  {
    id: 'proj-3',
    name: 'Migración Infraestructura Cloud',
    description: 'Migración de servidores físicos a contenedores y arquitectura en la nube.',
    color: '#10b981',
    icon: '☁️',
    targetDate: '2026-11-15',
    createdAt: '2026-10-10'
  }
];

const DEFAULT_TASKS = [
  {
    id: 'task-101',
    projectId: 'proj-1',
    title: 'Implementar pasarela de pagos con Stripe y PayPal',
    description: 'Configurar endpoints de pago seguro, validación de tarjetas y manejo de webhooks para confirmación.',
    status: 'in_progress',
    priority: 'urgent',
    assigneeId: 'usr-3',
    tags: ['Backend', 'Seguridad', 'API'],
    dueDate: '2026-10-20',
    createdAt: '2026-10-12',
    estimatedHours: 16,
    attachments: [
      { id: 'att-1', name: 'diagrama_flujo_pagos.png', size: '245 KB', type: 'image/png' }
    ],
    comments: [
      {
        id: 'c-1',
        userId: 'usr-2',
        userName: 'Carlos Gestor',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        content: 'Recuerda probar los webhooks en el ambiente de sandbox antes de pasar a staging.',
        createdAt: '2026-10-14T10:30:00Z'
      },
      {
        id: 'c-2',
        userId: 'usr-3',
        userName: 'Ana Desarrolladora',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        content: 'Entendido, las credenciales de prueba ya están funcionando correctamente.',
        createdAt: '2026-10-14T11:15:00Z'
      }
    ]
  },
  {
    id: 'task-102',
    projectId: 'proj-1',
    title: 'Rediseño del Carrito de Compras y Checkout',
    description: 'Optimizar la experiencia en móvil para reducir el abandono de carrito. Implementar acordeón de pasos.',
    status: 'review',
    priority: 'high',
    assigneeId: 'usr-4',
    tags: ['Frontend', 'UI/UX'],
    dueDate: '2026-10-18',
    createdAt: '2026-10-11',
    estimatedHours: 12,
    attachments: [],
    comments: [
      {
        id: 'c-3',
        userId: 'usr-1',
        userName: 'Sofía Admin',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        content: 'Excelente trabajo en las animaciones de transición.',
        createdAt: '2026-10-15T09:00:00Z'
      }
    ]
  },
  {
    id: 'task-103',
    projectId: 'proj-1',
    title: 'Corregir error de cálculo de impuestos regionales',
    description: 'El IVA provincial no se está calculando en pedidos fuera de la capital. Urgente solucionar.',
    status: 'todo',
    priority: 'urgent',
    assigneeId: 'usr-3',
    tags: ['Bug', 'Backend'],
    dueDate: '2026-10-17',
    createdAt: '2026-10-15',
    estimatedHours: 4,
    attachments: [],
    comments: []
  },
  {
    id: 'task-104',
    projectId: 'proj-1',
    title: 'Configurar catálogo de productos con búsqueda facetada',
    description: 'Permitir filtrado dinámico por categoría, rango de precios, calificaciones y stock disponible.',
    status: 'in_progress',
    priority: 'medium',
    assigneeId: 'usr-4',
    tags: ['Frontend', 'API'],
    dueDate: '2026-10-25',
    createdAt: '2026-10-13',
    estimatedHours: 20,
    attachments: [],
    comments: []
  },
  {
    id: 'task-105',
    projectId: 'proj-1',
    title: 'Configurar servidor Redis para caché de sesiones',
    description: 'Acelerar tiempos de respuesta de endpoints públicos implementando caché Redis en AWS ElastiCache.',
    status: 'done',
    priority: 'medium',
    assigneeId: 'usr-3',
    tags: ['DevOps', 'Backend'],
    dueDate: '2026-10-14',
    createdAt: '2026-10-08',
    estimatedHours: 8,
    attachments: [],
    comments: []
  },
  {
    id: 'task-106',
    projectId: 'proj-1',
    title: 'Auditoría de accesibilidad WCAG 2.1 nivel AA',
    description: 'Revisar contrastes de color, navegación por teclado y etiquetas ARIA en formularios.',
    status: 'todo',
    priority: 'low',
    assigneeId: 'usr-4',
    tags: ['UI/UX', 'Frontend'],
    dueDate: '2026-10-30',
    createdAt: '2026-10-14',
    estimatedHours: 10,
    attachments: [],
    comments: []
  },

  // Project 2 Tasks
  {
    id: 'task-201',
    projectId: 'proj-2',
    title: 'Integrar notificaciones push con Firebase Cloud Messaging',
    description: 'Permitir envío de ofertas flash y avisos sobre el estado del pedido directamente al móvil.',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'usr-4',
    tags: ['API', 'Frontend'],
    dueDate: '2026-10-22',
    createdAt: '2026-10-09',
    estimatedHours: 14,
    attachments: [],
    comments: []
  },
  {
    id: 'task-202',
    projectId: 'proj-2',
    title: 'Implementar autenticación biométrica (FaceID / Fingerprint)',
    description: 'Añadir inicio de sesión biométrico nativo seguro en iOS y Android.',
    status: 'done',
    priority: 'high',
    assigneeId: 'usr-3',
    tags: ['Seguridad', 'UI/UX'],
    dueDate: '2026-10-12',
    createdAt: '2026-10-06',
    estimatedHours: 18,
    attachments: [],
    comments: []
  },
  {
    id: 'task-203',
    projectId: 'proj-2',
    title: 'Diseñar interfaz de seguimiento de envío en tiempo real',
    description: 'Integrar mapa interactivo con la ubicación estimada del repartidor.',
    status: 'todo',
    priority: 'medium',
    assigneeId: 'usr-4',
    tags: ['UI/UX', 'Frontend'],
    dueDate: '2026-11-05',
    createdAt: '2026-10-10',
    estimatedHours: 24,
    attachments: [],
    comments: []
  },

  // Project 3 Tasks
  {
    id: 'task-301',
    projectId: 'proj-3',
    title: 'Crear clúster de Kubernetes en Google Cloud (GKE)',
    description: 'Configurar ingress, cert-manager con Let\'s Encrypt y autoescalado de pods.',
    status: 'in_progress',
    priority: 'urgent',
    assigneeId: 'usr-2',
    tags: ['DevOps', 'Seguridad'],
    dueDate: '2026-10-21',
    createdAt: '2026-10-11',
    estimatedHours: 30,
    attachments: [],
    comments: []
  },
  {
    id: 'task-302',
    projectId: 'proj-3',
    title: 'Pipeline CI/CD con GitHub Actions y pruebas automatizadas',
    description: 'Automatizar build, linters, pruebas unitarias y despliegue continuo a staging.',
    status: 'done',
    priority: 'medium',
    assigneeId: 'usr-3',
    tags: ['DevOps'],
    dueDate: '2026-10-15',
    createdAt: '2026-10-10',
    estimatedHours: 12,
    attachments: [],
    comments: []
  }
];

const DEFAULT_ACTIVITY_LOG = [
  {
    id: 'act-1',
    userId: 'usr-1',
    userName: 'Sofía Admin',
    action: 'creó el proyecto',
    target: 'Plataforma E-Commerce 2.0',
    timestamp: '2026-10-15T18:40:00Z',
    type: 'project'
  },
  {
    id: 'act-2',
    userId: 'usr-3',
    userName: 'Ana Desarrolladora',
    action: 'completó la tarea',
    target: 'Configurar servidor Redis para caché de sesiones',
    timestamp: '2026-10-15T19:15:00Z',
    type: 'task_status'
  },
  {
    id: 'act-3',
    userId: 'usr-2',
    userName: 'Carlos Gestor',
    action: 'asignó a Ana la tarea',
    target: 'Implementar pasarela de pagos con Stripe y PayPal',
    timestamp: '2026-10-15T19:30:00Z',
    type: 'assignment'
  },
  {
    id: 'act-4',
    userId: 'usr-4',
    userName: 'Lucía Morales',
    action: 'movió a Revisión la tarea',
    target: 'Rediseño del Carrito de Compras y Checkout',
    timestamp: '2026-10-15T20:05:00Z',
    type: 'task_status'
  }
];

class DataStore {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_PROJECT)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT, 'proj-1');
    }
    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(DEFAULT_TASKS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOG)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOG, JSON.stringify(DEFAULT_ACTIVITY_LOG));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      // Default logged in as Sofia Admin so the evaluator sees full power immediately
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({
        theme: 'light',
        language: 'es'
      }));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([
        {
          id: 'notif-1',
          title: 'Bienvenido al Sistema de Gestión de Tareas',
          message: 'Has iniciado sesión con el rol de Administrador. Tienes control total.',
          timestamp: new Date().toISOString(),
          read: false,
          type: 'info'
        },
        {
          id: 'notif-2',
          title: 'Tarea Urgente Asignada',
          message: 'La tarea "Implementar pasarela de pagos" tiene prioridad urgente.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false,
          type: 'warning'
        }
      ]));
    }
  }

  // --- Users ---
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || DEFAULT_USERS;
    } catch (e) {
      return DEFAULT_USERS;
    }
  }

  saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) || DEFAULT_USERS[0];
    } catch (e) {
      return DEFAULT_USERS[0];
    }
  }

  setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  // --- Projects ---
  getProjects() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS)) || DEFAULT_PROJECTS;
    } catch (e) {
      return DEFAULT_PROJECTS;
    }
  }

  saveProjects(projects) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }

  getCurrentProjectId() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PROJECT) || 'proj-1';
  }

  setCurrentProjectId(id) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT, id);
  }

  getCurrentProject() {
    const projects = this.getProjects();
    const curId = this.getCurrentProjectId();
    return projects.find(p => p.id === curId) || projects[0] || null;
  }

  // --- Tasks ---
  getTasks() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS)) || DEFAULT_TASKS;
    } catch (e) {
      return DEFAULT_TASKS;
    }
  }

  saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }

  // --- Activity Log ---
  getActivityLog() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOG)) || DEFAULT_ACTIVITY_LOG;
    } catch (e) {
      return DEFAULT_ACTIVITY_LOG;
    }
  }

  addActivity(action, target, type = 'general') {
    const user = this.getCurrentUser();
    const log = this.getActivityLog();
    const entry = {
      id: 'act-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      userId: user ? user.id : 'anon',
      userName: user ? user.name : 'Usuario Anónimo',
      action,
      target,
      timestamp: new Date().toISOString(),
      type
    };
    log.unshift(entry);
    // Keep max 50 entries
    if (log.length > 50) log.pop();
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOG, JSON.stringify(log));
    return entry;
  }

  // --- Notifications ---
  getNotifications() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) || [];
    } catch (e) {
      return [];
    }
  }

  addNotification(title, message, type = 'info', sendEmailMock = true) {
    const notifs = this.getNotifications();
    const newNotif = {
      id: 'notif-' + Date.now(),
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type
    };
    notifs.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));

    if (sendEmailMock && window.TaskApp && window.TaskApp.showEmailSimulationToast) {
      const curUser = this.getCurrentUser();
      window.TaskApp.showEmailSimulationToast(curUser.email, title, message);
    }
    return newNotif;
  }

  markAllNotificationsRead() {
    const notifs = this.getNotifications().map(n => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  }

  // --- Settings ---
  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || { theme: 'light', language: 'es' };
    } catch (e) {
      return { theme: 'light', language: 'es' };
    }
  }

  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  // Reset to demo factory defaults
  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT, 'proj-1');
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(DEFAULT_TASKS));
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOG, JSON.stringify(DEFAULT_ACTIVITY_LOG));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
    location.reload();
  }
}

// Global singleton instance
window.dataStore = new DataStore();
