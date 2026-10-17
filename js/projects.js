/**
 * Project Management Module (HU11: Soporte para múltiples proyectos)
 */

class ProjectManager {
  constructor() {
    this.projects = window.dataStore.getProjects();
    this.currentProjectId = window.dataStore.getCurrentProjectId();
  }

  getProjects() {
    this.projects = window.dataStore.getProjects();
    return this.projects;
  }

  getCurrentProject() {
    this.projects = this.getProjects();
    this.currentProjectId = window.dataStore.getCurrentProjectId();
    if (this.currentProjectId === 'all') {
      return {
        id: 'all',
        name: window.i18n ? window.i18n.t('allProjects') : 'Todos los Proyectos',
        description: 'Vista global consolidada de todas las tareas de la organización.',
        color: '#6366f1',
        icon: '📁',
        targetDate: ''
      };
    }
    return this.projects.find(p => p.id === this.currentProjectId) || this.projects[0] || null;
  }

  setCurrentProject(id) {
    this.currentProjectId = id;
    window.dataStore.setCurrentProjectId(id);
    window.dataStore.addActivity('cambió al proyecto', this.getCurrentProject().name, 'project');
    
    // Refresh board & views
    if (window.TaskApp) {
      window.TaskApp.render();
    }
  }

  createProject(data) {
    if (!window.authManager.requirePermission('create_project', 'crear nuevos proyectos')) {
      return null;
    }

    if (!data.name || data.name.trim().length === 0) {
      window.TaskApp.showToast('El nombre del proyecto es obligatorio', 'warning');
      return null;
    }

    const projects = this.getProjects();
    const newProject = {
      id: 'proj-' + Date.now(),
      name: data.name.trim(),
      description: data.description ? data.description.trim() : '',
      color: data.color || '#6366f1',
      icon: data.icon || '📁',
      targetDate: data.targetDate || '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    projects.push(newProject);
    window.dataStore.saveProjects(projects);
    window.dataStore.addActivity('creó el proyecto', newProject.name, 'project');
    window.dataStore.addNotification('Nuevo Proyecto', `El proyecto "${newProject.name}" fue creado exitosamente.`, 'success');

    this.setCurrentProject(newProject.id);
    window.TaskApp.showToast(`Proyecto "${newProject.name}" creado con éxito.`, 'success');
    return newProject;
  }

  updateProject(id, data) {
    if (!window.authManager.requirePermission('edit_project', 'editar este proyecto')) {
      return null;
    }

    const projects = this.getProjects();
    const project = projects.find(p => p.id === id);
    if (!project) return null;

    project.name = data.name.trim();
    project.description = data.description ? data.description.trim() : '';
    project.color = data.color || project.color;
    project.icon = data.icon || project.icon;
    project.targetDate = data.targetDate || project.targetDate;

    window.dataStore.saveProjects(projects);
    window.dataStore.addActivity('actualizó la configuración de', project.name, 'project');
    window.TaskApp.showToast(`Proyecto "${project.name}" actualizado.`, 'success');

    if (window.TaskApp) {
      window.TaskApp.render();
    }
    return project;
  }

  deleteProject(id) {
    if (!window.authManager.requirePermission('delete_project', 'eliminar proyectos')) {
      return false;
    }

    const projects = this.getProjects();
    if (projects.length <= 1) {
      window.TaskApp.showToast('No puedes eliminar el único proyecto existente.', 'warning');
      return false;
    }

    const projectToDelete = projects.find(p => p.id === id);
    if (!projectToDelete) return false;

    if (!confirm(`¿Estás seguro de eliminar el proyecto "${projectToDelete.name}" y todas sus tareas asociadas?`)) {
      return false;
    }

    // Remove project
    const updatedProjects = projects.filter(p => p.id !== id);
    window.dataStore.saveProjects(updatedProjects);

    // Remove tasks associated with this project
    const tasks = window.dataStore.getTasks().filter(t => t.projectId !== id);
    window.dataStore.saveTasks(tasks);

    window.dataStore.addActivity('eliminó el proyecto', projectToDelete.name, 'project');
    window.dataStore.addNotification('Proyecto Eliminado', `El proyecto "${projectToDelete.name}" y sus tareas fueron eliminados.`, 'warning');

    // Switch to first remaining project
    this.setCurrentProject(updatedProjects[0].id);
    window.TaskApp.showToast(`Proyecto "${projectToDelete.name}" eliminado.`, 'info');
    return true;
  }

  getProjectStats(projectId) {
    const allTasks = window.dataStore.getTasks();
    const tasks = projectId === 'all' 
      ? allTasks 
      : allTasks.filter(t => t.projectId === projectId);

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const review = tasks.filter(t => t.status === 'review').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, review, todo, percentage };
  }
}

window.projectManager = new ProjectManager();
