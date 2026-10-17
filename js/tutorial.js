/**
 * Interactive Onboarding Tutorial (HU19: Tutorial interactivo para nuevos usuarios)
 */

class TutorialManager {
  constructor() {
    this.currentStep = 0;
    this.steps = [
      {
        title: '¡Bienvenido a TaskFlow Pro! 👋',
        text: 'Esta plataforma te permite gestionar tareas ágiles con Kanban, métricas y colaboración en tiempo real.',
        target: null
      },
      {
        title: 'Múltiples Proyectos (HU11) 📁',
        text: 'Organiza el trabajo en diferentes proyectos independientes. Cambia de proyecto o añade uno nuevo desde aquí.',
        target: '#projectSelector'
      },
      {
        title: 'Tablero Kanban Interactivo (HU02) 📋',
        text: 'Arrastra y suelta (Drag & Drop) tarjetas entre columnas para actualizar el estado del flujo de trabajo al instante.',
        target: '#kanbanView'
      },
      {
        title: 'Filtros Avanzados y Búsqueda (HU04) 🔍',
        text: 'Filtra al instante por prioridad, etiquetas, personas asignadas o estado de vencimiento para encontrar cualquier tarea.',
        target: '#filtersSection'
      },
      {
        title: 'Asignación, Prioridades y Etiquetas (HU03, HU07, HU16) 🏷️',
        text: 'Crea nuevas tareas con criticidad urgente/alta/media/baja, etiquetas personalizadas y asignación de colaboradores.',
        target: '#btnNewTask'
      },
      {
        title: 'Dashboard de Métricas & Actividad (HU13) 📊',
        text: 'Revisa gráficos en tiempo real de carga de trabajo, distribución por estado y registro de auditoría de cada acción.',
        target: '#tabDashboard'
      },
      {
        title: 'Roles y Permisos (HU15) 🛡️',
        text: 'Prueba la plataforma cambiando entre Administrador, Gestor, Desarrollador y Observador para ver los permisos en acción.',
        target: '#userProfileBtn'
      }
    ];
  }

  start() {
    this.currentStep = 0;
    this.showStep();
  }

  showStep() {
    const step = this.steps[this.currentStep];
    if (!step) {
      this.close();
      return;
    }

    let overlay = document.getElementById('tutorialOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'tutorialOverlay';
      overlay.className = 'tutorial-overlay';
      document.body.appendChild(overlay);
    }

    overlay.style.display = 'flex';

    // Remove previous target highlights
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
    });

    if (step.target) {
      const targetEl = document.querySelector(step.target);
      if (targetEl) {
        targetEl.classList.add('tutorial-highlight');
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    overlay.innerHTML = `
      <div class="tutorial-card">
        <div class="tutorial-card-header">
          <span class="tutorial-step-indicator">Paso ${this.currentStep + 1} de ${this.steps.length}</span>
          <button class="btn-icon" onclick="window.tutorialManager.close()">✕</button>
        </div>
        <div class="tutorial-card-body">
          <h3 class="tutorial-card-title">${step.title}</h3>
          <p class="tutorial-card-text">${step.text}</p>
        </div>
        <div class="tutorial-card-footer">
          <button class="btn btn-secondary btn-sm" onclick="window.tutorialManager.close()">Omitir</button>
          <div class="tutorial-nav-buttons">
            ${this.currentStep > 0 ? `<button class="btn btn-secondary btn-sm" onclick="window.tutorialManager.prev()">Anterior</button>` : ''}
            <button class="btn btn-primary btn-sm" onclick="window.tutorialManager.next()">
              ${this.currentStep === this.steps.length - 1 ? '¡Finalizar!' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  next() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.showStep();
    } else {
      this.close();
      window.TaskApp.showToast('¡Has completado el tutorial! Explora la aplicación con libertad.', 'success');
    }
  }

  prev() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.showStep();
    }
  }

  close() {
    const overlay = document.getElementById('tutorialOverlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
    });
  }
}

window.tutorialManager = new TutorialManager();
