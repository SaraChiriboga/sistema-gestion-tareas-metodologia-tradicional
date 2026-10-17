/**
 * Export & Backup Module (HU14: Exportación de datos a Excel)
 */

class ExportManager {
  exportCsv() {
    const currentProject = window.projectManager.getCurrentProject();
    const tasks = window.taskManager.getProjectTasks(currentProject ? currentProject.id : 'all');
    const users = window.dataStore.getUsers();
    const projects = window.dataStore.getProjects();

    const headers = [
      'ID',
      'Proyecto',
      'Título',
      'Descripción',
      'Estado',
      'Prioridad',
      'Asignado a',
      'Etiquetas',
      'Fecha Vencimiento',
      'Horas Estimadas',
      'Fecha Creación',
      'Comentarios'
    ];

    const rows = tasks.map(t => {
      const proj = projects.find(p => p.id === t.projectId);
      const assignee = users.find(u => u.id === t.assigneeId);
      const statusObj = STATUS_COLUMNS.find(s => s.id === t.status);
      const priorityObj = PRIORITIES[t.priority];

      return [
        t.id,
        proj ? proj.name : t.projectId,
        `"${(t.title || '').replace(/"/g, '""')}"`,
        `"${(t.description || '').replace(/"/g, '""')}"`,
        statusObj ? statusObj.label : t.status,
        priorityObj ? priorityObj.label : t.priority,
        assignee ? assignee.name : 'Sin Asignar',
        `"${(t.tags || []).join(', ')}"`,
        t.dueDate || 'Sin fecha',
        t.estimatedHours || 0,
        t.createdAt || '',
        (t.comments || []).length
      ].join(';');
    });

    // Add BOM for Microsoft Excel UTF-8 support
    const csvContent = '\uFEFF' + headers.join(';') + '\r\n' + rows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];
    const projSlug = currentProject ? currentProject.name.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'todos';
    link.download = `reporte_tareas_${projSlug}_${dateStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.dataStore.addActivity('exportó datos a Excel (CSV)', currentProject.name, 'export');
    window.TaskApp.showToast('Archivo CSV generado para Excel exitosamente', 'success');
  }

  exportJson() {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      projects: window.dataStore.getProjects(),
      tasks: window.dataStore.getTasks(),
      users: window.dataStore.getUsers()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `backup_sistema_tareas_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.TaskApp.showToast('Copia de seguridad JSON descargada', 'success');
  }
}

window.exportManager = new ExportManager();
