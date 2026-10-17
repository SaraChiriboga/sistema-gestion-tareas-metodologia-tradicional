/**
 * Dashboard & Metrics Module (HU13: Dashboard de métricas y reportes de actividad)
 * Native SVG charts - 100% offline, zero external dependencies
 */

class DashboardManager {
  renderDashboard(containerId = 'dashboardView') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const currentProject = window.projectManager.getCurrentProject();
    const tasks = window.taskManager.getProjectTasks(currentProject ? currentProject.id : 'all');
    const users = window.dataStore.getUsers();
    const activityLog = window.dataStore.getActivityLog();
    const today = new Date().toISOString().split('T')[0];

    // Compute metrics
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const review = tasks.filter(t => t.status === 'review').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const urgent = tasks.filter(t => t.priority === 'urgent').length;
    const overdue = tasks.filter(t => t.status !== 'done' && t.dueDate && t.dueDate < today).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Estimated hours
    const totalHours = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
    const completedHours = tasks
      .filter(t => t.status === 'done')
      .reduce((sum, t) => sum + (t.estimatedHours || 0), 0);

    container.innerHTML = `
      <div class="dashboard-header">
        <div>
          <h2 class="dashboard-title">
            <span>📊</span> Dashboard de Métricas: <strong>${currentProject.name}</strong>
          </h2>
          <p class="dashboard-subtitle">
            Análisis en tiempo real de rendimiento, distribución de trabajo y registro de actividad colaborativa.
          </p>
        </div>
        <div class="dashboard-actions">
          <button class="btn btn-secondary" onclick="window.exportManager.exportCsv()">
            📥 Exportar Métricas (CSV)
          </button>
        </div>
      </div>

      <!-- KPI Stat Cards -->
      <div class="kpi-grid">
        <div class="kpi-card kpi-total">
          <div class="kpi-icon">📁</div>
          <div class="kpi-info">
            <span class="kpi-label">Total de Tareas</span>
            <span class="kpi-value">${total}</span>
            <span class="kpi-sub">${totalHours}h estimadas en total</span>
          </div>
        </div>

        <div class="kpi-card kpi-done">
          <div class="kpi-icon">✅</div>
          <div class="kpi-info">
            <span class="kpi-label">Tareas Completadas</span>
            <span class="kpi-value">${completed} <small>(${completionRate}%)</small></span>
            <div class="kpi-progress-bar">
              <div class="kpi-progress-fill" style="width: ${completionRate}%"></div>
            </div>
          </div>
        </div>

        <div class="kpi-card kpi-progress">
          <div class="kpi-icon">⏳</div>
          <div class="kpi-info">
            <span class="kpi-label">En Progreso / Revisión</span>
            <span class="kpi-value">${inProgress + review}</span>
            <span class="kpi-sub">${inProgress} activas • ${review} en revisión</span>
          </div>
        </div>

        <div class="kpi-card kpi-urgent">
          <div class="kpi-icon">🔥</div>
          <div class="kpi-info">
            <span class="kpi-label">Urgentes / Vencidas</span>
            <span class="kpi-value">${urgent + overdue}</span>
            <span class="kpi-sub">${urgent} con prioridad urgente • ${overdue} vencidas</span>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-grid">
        <!-- Chart 1: Donut Chart - Tareas por Estado -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Distribución por Estado</h3>
            <span class="chart-badge">${total} Tareas</span>
          </div>
          <div class="chart-body">
            ${this.renderDonutChart([
              { label: 'Por Hacer', count: todo, color: '#64748b' },
              { label: 'En Progreso', count: inProgress, color: '#3b82f6' },
              { label: 'En Revisión', count: review, color: '#8b5cf6' },
              { label: 'Completado', count: completed, color: '#10b981' }
            ], total)}
          </div>
        </div>

        <!-- Chart 2: Bar Chart - Tareas por Prioridad (HU16) -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Distribución por Prioridad (HU16)</h3>
            <span class="chart-badge">Criticidad</span>
          </div>
          <div class="chart-body">
            ${this.renderPriorityBarChart(tasks)}
          </div>
        </div>

        <!-- Chart 3: Workload by User (HU03) -->
        <div class="chart-card chart-wide">
          <div class="chart-header">
            <h3>Carga de Trabajo por Miembro (HU03)</h3>
            <span class="chart-badge">${users.length} Miembros</span>
          </div>
          <div class="chart-body">
            ${this.renderUserWorkloadChart(tasks, users)}
          </div>
        </div>
      </div>

      <!-- Activity Timeline (HU13: Reportes de Actividad) -->
      <div class="activity-section">
        <div class="activity-header">
          <h3>🕒 Registro de Actividad Colaborativa Reciente</h3>
          <span class="badge badge-dev">Auditoría en Vivo</span>
        </div>
        <div class="activity-feed">
          ${activityLog.length === 0 
            ? '<p class="text-muted text-center py-4">No hay actividades recientes registradas.</p>'
            : activityLog.slice(0, 15).map(item => this.renderActivityItem(item)).join('')
          }
        </div>
      </div>
    `;
  }

  renderDonutChart(data, total) {
    if (total === 0) {
      return '<div class="empty-chart">Sin tareas en este proyecto</div>';
    }

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    let accumulatedOffset = 0;

    const circles = data.map(item => {
      const percentage = item.count / total;
      const strokeDash = percentage * circumference;
      const strokeDashoffset = -accumulatedOffset;
      accumulatedOffset += strokeDash;

      return `
        <circle
          cx="80" cy="80" r="${radius}"
          fill="transparent"
          stroke="${item.color}"
          stroke-width="24"
          stroke-dasharray="${strokeDash} ${circumference - strokeDash}"
          stroke-dashoffset="${strokeDashoffset}"
          class="donut-segment"
        >
          <title>${item.label}: ${item.count} (${Math.round(percentage * 100)}%)</title>
        </circle>
      `;
    }).join('');

    const legend = data.map(item => {
      const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
      return `
        <div class="donut-legend-item">
          <span class="legend-dot" style="background: ${item.color}"></span>
          <span class="legend-name">${item.label}</span>
          <strong class="legend-val">${item.count} <small>(${pct}%)</small></strong>
        </div>
      `;
    }).join('');

    return `
      <div class="donut-container">
        <div class="donut-svg-wrapper">
          <svg viewBox="0 0 160 160" class="donut-svg">
            ${circles}
            <circle cx="80" cy="80" r="46" fill="var(--bg-card)" />
            <text x="80" y="75" text-anchor="middle" class="donut-center-total">${total}</text>
            <text x="80" y="93" text-anchor="middle" class="donut-center-sub">Tareas</text>
          </svg>
        </div>
        <div class="donut-legend">
          ${legend}
        </div>
      </div>
    `;
  }

  renderPriorityBarChart(tasks) {
    const total = tasks.length || 1;
    const prioCounts = {
      urgent: tasks.filter(t => t.priority === 'urgent').length,
      high:   tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low:    tasks.filter(t => t.priority === 'low').length
    };

    const maxCount = Math.max(...Object.values(prioCounts), 1);

    const prios = [
      { id: 'urgent', name: '🔥 Urgente', count: prioCounts.urgent, color: '#ef4444' },
      { id: 'high',   name: '🔺 Alta',    count: prioCounts.high,   color: '#f97316' },
      { id: 'medium', name: '🔹 Media',   count: prioCounts.medium, color: '#3b82f6' },
      { id: 'low',    name: '🟢 Baja',    count: prioCounts.low,    color: '#10b981' }
    ];

    return `
      <div class="bar-chart-vertical">
        ${prios.map(p => {
          const heightPct = Math.round((p.count / maxCount) * 100);
          const sharePct = Math.round((p.count / total) * 100);
          return `
            <div class="bar-col">
              <div class="bar-tooltip">${p.count} (${sharePct}%)</div>
              <div class="bar-track">
                <div class="bar-fill" style="height: ${heightPct}%; background-color: ${p.color};"></div>
              </div>
              <span class="bar-label">${p.name}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderUserWorkloadChart(tasks, users) {
    const unassignedTasks = tasks.filter(t => !t.assigneeId).length;
    const userStats = users.map(user => {
      const userTasks = tasks.filter(t => t.assigneeId === user.id);
      const done = userTasks.filter(t => t.status === 'done').length;
      return {
        user,
        total: userTasks.length,
        done: done,
        inProgress: userTasks.length - done
      };
    });

    if (unassignedTasks > 0) {
      userStats.push({
        user: { name: 'Sin Asignar', avatar: '', role: 'none' },
        total: unassignedTasks,
        done: 0,
        inProgress: unassignedTasks
      });
    }

    const maxTasks = Math.max(...userStats.map(s => s.total), 1);

    return `
      <div class="user-workload-list">
        ${userStats.map(stat => {
          const widthPct = Math.round((stat.total / maxTasks) * 100);
          return `
            <div class="workload-row">
              <div class="workload-user">
                ${stat.user.avatar 
                  ? `<img src="${stat.user.avatar}" class="avatar-sm" alt="${stat.user.name}">`
                  : `<div class="avatar-sm avatar-fallback">👤</div>`
                }
                <div class="workload-name">
                  <strong>${stat.user.name}</strong>
                  ${stat.user.role && stat.user.role !== 'none' 
                    ? `<span class="workload-role">${window.authManager.getRoleLabel(stat.user.role)}</span>` 
                    : ''
                  }
                </div>
              </div>

              <div class="workload-bar-wrap">
                <div class="workload-bar-track">
                  <div class="workload-bar-fill" style="width: ${widthPct}%; background-color: var(--primary);"></div>
                </div>
              </div>

              <div class="workload-counts">
                <span class="badge badge-default">${stat.total} tareas</span>
                <small class="text-muted">(${stat.done} listas)</small>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderActivityItem(item) {
    const formattedDate = new Date(item.timestamp).toLocaleString('es-ES', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    let icon = '⚡';
    if (item.type === 'task_create') icon = '➕';
    if (item.type === 'task_status') icon = '🔄';
    if (item.type === 'assignment') icon = '👤';
    if (item.type === 'comment') icon = '💬';
    if (item.type === 'project') icon = '📁';
    if (item.type === 'auth') icon = '🔑';
    if (item.type === 'role_change') icon = '🛡️';

    return `
      <div class="activity-item">
        <div class="activity-icon-badge">${icon}</div>
        <div class="activity-content">
          <p class="activity-text">
            <strong>${item.userName}</strong> ${item.action} <span class="activity-target">"${item.target}"</span>
          </p>
          <span class="activity-time">${formattedDate}</span>
        </div>
      </div>
    `;
  }
}

window.dashboardManager = new DashboardManager();
