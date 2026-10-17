/**
 * Authentication & Role-Based Access Control (RBAC)
 * Covers HU01: Sistema de registro y autenticación
 * Covers HU15: Sistema de roles y permisos para usuarios
 */

const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  DEVELOPER: 'developer',
  VIEWER: 'viewer'
};

const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    'manage_users',
    'create_project',
    'edit_project',
    'delete_project',
    'create_task',
    'edit_task',
    'delete_task',
    'change_status',
    'assign_task',
    'comment_task',
    'export_data',
    'view_metrics'
  ],
  [ROLES.MANAGER]: [
    'create_project',
    'edit_project',
    'create_task',
    'edit_task',
    'delete_task',
    'change_status',
    'assign_task',
    'comment_task',
    'export_data',
    'view_metrics'
  ],
  [ROLES.DEVELOPER]: [
    'create_task',
    'edit_task_assigned',
    'change_status',
    'comment_task',
    'export_data',
    'view_metrics'
  ],
  [ROLES.VIEWER]: [
    'export_data',
    'view_metrics'
  ]
};

const ROLE_LABELS = {
  [ROLES.ADMIN]: { es: 'Administrador', en: 'Administrator', badgeClass: 'badge-admin', icon: '👑' },
  [ROLES.MANAGER]: { es: 'Gestor de Proyecto', en: 'Project Manager', badgeClass: 'badge-manager', icon: '💼' },
  [ROLES.DEVELOPER]: { es: 'Desarrollador', en: 'Developer', badgeClass: 'badge-dev', icon: '💻' },
  [ROLES.VIEWER]: { es: 'Observador', en: 'Viewer', badgeClass: 'badge-viewer', icon: '👁️' }
};

class AuthManager {
  constructor() {
    this.currentUser = window.dataStore.getCurrentUser();
  }

  getCurrentUser() {
    this.currentUser = window.dataStore.getCurrentUser();
    return this.currentUser;
  }

  login(email, password) {
    const users = window.dataStore.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, message: 'Usuario no encontrado con ese correo.' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Contraseña incorrecta.' };
    }

    this.currentUser = user;
    window.dataStore.setCurrentUser(user);
    window.dataStore.addActivity('inició sesión', user.name, 'auth');
    return { success: true, user };
  }

  register(name, email, password, role = ROLES.DEVELOPER) {
    const users = window.dataStore.getUsers();
    const cleanEmail = email.trim().toLowerCase();

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'Este correo electrónico ya está registrado.' };
    }

    if (!name || name.trim().length < 2) {
      return { success: false, message: 'El nombre debe tener al menos 2 caracteres.' };
    }

    if (!password || password.length < 3) {
      return { success: false, message: 'La contraseña debe tener al menos 3 caracteres.' };
    }

    const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newUser = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      password: password,
      role: role,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=${randomColor.replace('#','')}`,
      color: randomColor,
      isPremium: false
    };

    users.push(newUser);
    window.dataStore.saveUsers(users);
    this.currentUser = newUser;
    window.dataStore.setCurrentUser(newUser);
    window.dataStore.addActivity('se registró en la plataforma', newUser.name, 'auth');
    window.dataStore.addNotification('Cuenta Creada', `Bienvenido(a) ${newUser.name} a TaskFlow Pro.`, 'success');

    return { success: true, user: newUser };
  }

  logout() {
    // If logging out, we can switch to demo viewer or prompt login
    window.dataStore.addActivity('cerró sesión', this.currentUser.name, 'auth');
    // Open auth modal
    this.openAuthModal();
  }

  switchUser(userId) {
    const users = window.dataStore.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      this.currentUser = user;
      window.dataStore.setCurrentUser(user);
      window.dataStore.addActivity('cambió de usuario activo a', user.name, 'auth');
      return true;
    }
    return false;
  }

  hasPermission(permission, contextTask = null) {
    if (!this.currentUser) return false;
    const role = this.currentUser.role || ROLES.VIEWER;
    const permissions = ROLE_PERMISSIONS[role] || [];

    // Admins have blanket access
    if (role === ROLES.ADMIN) return true;

    // Check direct permission
    if (permissions.includes(permission)) return true;

    // Developers can edit their own tasks
    if (permission === 'edit_task' && role === ROLES.DEVELOPER) {
      if (contextTask && contextTask.assigneeId === this.currentUser.id) {
        return true;
      }
    }

    return false;
  }

  requirePermission(permission, actionLabel = 'realizar esta acción', contextTask = null) {
    if (this.hasPermission(permission, contextTask)) {
      return true;
    }

    const currentRoleLabel = this.getRoleLabel(this.currentUser.role);
    const msg = `Acceso Denegado: Tu rol de "${currentRoleLabel}" no tiene permisos para ${actionLabel}.`;
    
    if (window.TaskApp && window.TaskApp.showToast) {
      window.TaskApp.showToast(msg, 'warning');
    } else {
      alert(msg);
    }
    return false;
  }

  updateUserRole(userId, newRole) {
    if (!this.hasPermission('manage_users')) {
      return { success: false, message: 'Solo los administradores pueden cambiar roles.' };
    }

    const users = window.dataStore.getUsers();
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return { success: false, message: 'Usuario no encontrado.' };

    const oldRole = targetUser.role;
    targetUser.role = newRole;
    window.dataStore.saveUsers(users);

    // If current logged user updated themselves
    if (this.currentUser.id === userId) {
      this.currentUser.role = newRole;
      window.dataStore.setCurrentUser(this.currentUser);
    }

    window.dataStore.addActivity(
      `cambió el rol de ${targetUser.name} de ${this.getRoleLabel(oldRole)} a`,
      this.getRoleLabel(newRole),
      'role_change'
    );
    window.dataStore.addNotification(
      'Rol Actualizado',
      `El rol de ${targetUser.name} ha sido cambiado a ${this.getRoleLabel(newRole)}.`,
      'info'
    );

    return { success: true, user: targetUser };
  }

  getRoleLabel(role) {
    const lang = window.i18n ? window.i18n.currentLang : 'es';
    const roleInfo = ROLE_LABELS[role] || ROLE_LABELS[ROLES.DEVELOPER];
    return roleInfo[lang] || roleInfo.es;
  }

  getRoleBadge(role) {
    const roleInfo = ROLE_LABELS[role] || ROLE_LABELS[ROLES.DEVELOPER];
    const label = this.getRoleLabel(role);
    return `<span class="badge ${roleInfo.badgeClass}" title="Rol del usuario">${roleInfo.icon} ${label}</span>`;
  }

  openAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
      modal.classList.add('active');
    }
  }

  closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
      modal.classList.remove('active');
    }
  }
}

window.authManager = new AuthManager();
