/**
 * Advanced Filters & Search (HU04: Filtros avanzados para buscar tareas)
 */

class FilterManager {
  constructor() {
    this.filters = {
      query: '',
      priority: 'all',
      status: 'all',
      assigneeId: 'all',
      tag: 'all',
      dateFilter: 'all',
      sortBy: 'created_desc'
    };
  }

  getFilters() {
    return this.filters;
  }

  setFilter(key, value) {
    this.filters[key] = value;
    if (window.TaskApp) {
      window.TaskApp.render();
    }
  }

  clearFilters() {
    this.filters = {
      query: '',
      priority: 'all',
      status: 'all',
      assigneeId: 'all',
      tag: 'all',
      dateFilter: 'all',
      sortBy: 'created_desc'
    };

    // Update input UI elements
    const searchInput = document.getElementById('searchQuery');
    if (searchInput) searchInput.value = '';

    const filterPriority = document.getElementById('filterPriority');
    if (filterPriority) filterPriority.value = 'all';

    const filterStatus = document.getElementById('filterStatus');
    if (filterStatus) filterStatus.value = 'all';

    const filterAssignee = document.getElementById('filterAssignee');
    if (filterAssignee) filterAssignee.value = 'all';

    const filterTag = document.getElementById('filterTag');
    if (filterTag) filterTag.value = 'all';

    const filterDate = document.getElementById('filterDate');
    if (filterDate) filterDate.value = 'all';

    const sortBy = document.getElementById('sortBy');
    if (sortBy) sortBy.value = 'created_desc';

    if (window.TaskApp) {
      window.TaskApp.render();
    }
  }

  getActiveFilterCount() {
    let count = 0;
    if (this.filters.query.trim().length > 0) count++;
    if (this.filters.priority !== 'all') count++;
    if (this.filters.status !== 'all') count++;
    if (this.filters.assigneeId !== 'all') count++;
    if (this.filters.tag !== 'all') count++;
    if (this.filters.dateFilter !== 'all') count++;
    return count;
  }

  applyFilters(tasks) {
    const users = window.dataStore.getUsers();
    const today = new Date().toISOString().split('T')[0];

    // Compute start and end of this week
    const now = new Date();
    const firstDay = new Date(now.setDate(now.getDate() - now.getDay() + 1)).toISOString().split('T')[0];
    const lastDay = new Date(now.setDate(now.getDate() - now.getDay() + 7)).toISOString().split('T')[0];

    let result = tasks.filter(task => {
      // 1. Text search
      if (this.filters.query.trim().length > 0) {
        const q = this.filters.query.toLowerCase().trim();
        const titleMatch = task.title.toLowerCase().includes(q);
        const descMatch = (task.description || '').toLowerCase().includes(q);
        const tagMatch = (task.tags || []).some(t => t.toLowerCase().includes(q));
        
        let assigneeMatch = false;
        if (task.assigneeId) {
          const user = users.find(u => u.id === task.assigneeId);
          if (user && user.name.toLowerCase().includes(q)) assigneeMatch = true;
        }

        if (!titleMatch && !descMatch && !tagMatch && !assigneeMatch) {
          return false;
        }
      }

      // 2. Priority filter
      if (this.filters.priority !== 'all' && task.priority !== this.filters.priority) {
        return false;
      }

      // 3. Status filter
      if (this.filters.status !== 'all' && task.status !== this.filters.status) {
        return false;
      }

      // 4. Assignee filter
      if (this.filters.assigneeId !== 'all') {
        if (this.filters.assigneeId === 'unassigned') {
          if (task.assigneeId) return false;
        } else if (task.assigneeId !== this.filters.assigneeId) {
          return false;
        }
      }

      // 5. Tag filter
      if (this.filters.tag !== 'all') {
        if (!task.tags || !task.tags.includes(this.filters.tag)) {
          return false;
        }
      }

      // 6. Date filter
      if (this.filters.dateFilter !== 'all') {
        if (this.filters.dateFilter === 'overdue') {
          if (!task.dueDate || task.dueDate >= today || task.status === 'done') return false;
        } else if (this.filters.dateFilter === 'today') {
          if (task.dueDate !== today) return false;
        } else if (this.filters.dateFilter === 'this_week') {
          if (!task.dueDate || task.dueDate < firstDay || task.dueDate > lastDay) return false;
        } else if (this.filters.dateFilter === 'no_date') {
          if (task.dueDate) return false;
        }
      }

      return true;
    });

    // 7. Sort
    result.sort((a, b) => {
      if (this.filters.sortBy === 'priority_desc') {
        const prioLevels = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (prioLevels[b.priority] || 0) - (prioLevels[a.priority] || 0);
      }
      if (this.filters.sortBy === 'dueDate_asc') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (this.filters.sortBy === 'title_asc') {
        return a.title.localeCompare(b.title);
      }
      // default: created_desc
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });

    return result;
  }
}

window.filterManager = new FilterManager();
