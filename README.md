# TaskFlow Pro - Sistema de Gestión de Tareas Colaborativas

Sistema de gestión ágil de tareas desarrollado exclusivamente con **HTML5, CSS3 y JavaScript moderno (ES6+)**, sin dependencias externas, frameworks pesados ni bases de datos complejas. Toda la persistencia se gestiona en el navegador mediante `localStorage`.

---

## 🚀 Cómo Ejecutar la Aplicación

Simplemente abre el archivo [`index.html`](file:///c:/Users/saril/Desktop/metodologias%20sistema/index.html) en cualquier navegador web moderno (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari, etc.).

No se requiere ningún comando de instalación (`npm`, `yarn`, `pip`, etc.) ni servidor web. Funciona 100% de manera local y offline.

---

## 📋 Matriz de Cumplimiento del Backlog de Historias de Usuario

Se han implementado **las 20 Historias de Usuario** del documento del Backlog, con especial énfasis y robustez en las **9 historias prioritarias solicitadas**:

| ID | Historia de Usuario | Priorizada | Estado | Módulo Principal |
|---|---|:---:|:---:|---|
| **HU01** | Implementar sistema de registro y autenticación | ⭐ **SÍ** | ✅ Completada | [`js/auth.js`](file:///c:/Users/saril/Desktop/metodologias%20sistema/js/auth.js) |
| **HU02** | Agregar un tablero principal con vista Kanban | | ✅ Completada | [`js/app.js`](file:///c:/Users/saril/Desktop/metodologias%20sistema/js/app.js) |
| **HU03** | Añadir funcionalidad para asignar tareas a usuarios | ⭐ **SÍ** | ✅ Completada | [`js/tasks.js`](file:///c:/Users/saril/Desktop/metodologias%20sistema/js/tasks.js) |
| **HU04** | Crear filtros avanzados para buscar tareas | ⭐ **SÍ** | ✅ Completada | [`js/filters.js`](file:///c:/Users/saril/Desktop/metodologias%20sistema/js/filters.js) |
| **HU05** | Implementar notificaciones por correo electrónico | | ✅ Completada | [`js/app.js`](file:///c:/Users/saril/Desktop/metodologias%20sistema/js/app.js) |
| **HU06** | Desarrollar funcionalidad para agregar comentarios en tareas | | ✅ Completada | [`js/tasks.js`](file:///c:/Users/saril/Desktop/metodologias%20sistema/js/tasks.js) |
| **HU07** | Desarrollar funcionalidad de etiquetado para tareas | ⭐ **SÍ** | ✅ Completada | [`js/tasks.js`](file:///c:/Users/saril/Desktop/metodologias%20sistema/js/tasks.js) |
| **HU08** | Configurar integraciones con Google Calendar | | ✅ Completada | [`js/tasks.js`](file:///c:/Users/saril/Desktop/metodologias%20sistema/js/tasks.js) |
| **HU09** | Optimizar velocidad de carga del tablero principal | | ✅ Completada | Arquitectura Vanilla JS (<20ms) |
| **HU10** | Crear funcionalidad para archivos adjuntos en tareas | | ✅ Completada | [`js/tasks.js`](file:///c:/Users/saril/Desktop/metodologias%20sistema/js/tasks.js) |
| **HU11** | Añadir soporte para múltiples proyectos por usuario | ⭐ **SÍ** | ✅ Completada | [`js/projects.js`](file:///c:/Users/saril/Desktop/metodologias%20sistema/js/projects.js) |
| **HU12** | Implementar soporte multilingüe en la aplicación | | ✅ Completada | [`js/i18n.js`](file:///c:/Users/saril/Desktop/metodologias%20sistema/js/i18n.js) |
| **HU13** | Crear dashboard de métricas y reportes de actividad | ⭐ **SÍ** | ✅ Completada | [`js/dashboard.js`](file:///c:/Users/saril/Desktop/metodologias%20sistema/js/dashboard.js) |
| **HU14** | Permitir la exportación de datos a Excel | | ✅ Completada | [`js/export.js`](file:///c:/Users/saril/Desktop/metodologias%20sistema/js/export.js) |
| **HU15** | Crear sistema de roles y permisos para usuarios | ⭐ **SÍ** | ✅ Completada | [`js/auth.js`](file:///c:/Users/saril/Desktop/metodologias%20sistema/js/auth.js) |
| **HU16** | Añadir un sistema de prioridades para las tareas | ⭐ **SÍ** | ✅ Completada | [`js/tasks.js`](file:///c:/Users/saril/Desktop/metodologias%20sistema/js/tasks.js) |
| **HU17** | Mejorar el diseño de la interfaz de usuario | ⭐ **SÍ** | ✅ Completada | [`css/style.css`](file:///c:/Users/saril/Desktop/metodologias%20sistema/css/style.css) |
| **HU18** | Añadir recordatorios automáticos para tareas pendientes | | ✅ Completada | [`js/tasks.js`](file:///c:/Users/saril/Desktop/metodologias%20sistema/js/tasks.js) |
| **HU19** | Crear tutorial interactivo para nuevos usuarios | | ✅ Completada | [`js/tutorial.js`](file:///c:/Users/saril/Desktop/metodologias%20sistema/js/tutorial.js) |
| **HU20** | Integrar pagos para cuentas premium | | ✅ Completada | [`js/premium.js`](file:///c:/Users/saril/Desktop/metodologias%20sistema/js/premium.js) |

---

## 🌟 Detalle de las 9 Historias Prioritarias

### 1. HU04: Filtros Avanzados para Buscar Tareas
- **Búsqueda Instantánea**: Búsqueda en tiempo real que evalúa simultáneamente título, descripción, etiquetas y nombre de la persona asignada.
- **Filtros Combinados**: Filtra por prioridad (`Urgente`, `Alta`, `Media`, `Baja`), por estado (`Por Hacer`, `En Progreso`, `En Revisión`, `Completado`), por usuario asignado, por etiquetas (`#Frontend`, `#Backend`, `#Bug`, etc.) y por fechas (`Vencidas`, `Hoy`, `Esta Semana`, `Sin Fecha`).
- **Ordenamiento Multicriterio**: Ordena por criticidad de prioridad, fecha de vencimiento más próxima, más recientes o alfabético.
- **Contadores y Limpieza**: Botón dinámico con insignia que indica cuántos filtros están activos y permite limpiarlos con un solo clic.

### 2. HU15: Sistema de Roles y Permisos (RBAC)
- **Roles Configurados**:
  - 👑 **Administrador**: Control total. Gestión de proyectos, tareas, reportes y cambio dinámico de roles de usuarios.
  - 💼 **Gestor de Proyecto**: Crear y administrar proyectos, delegar tareas, asignar prioridades y revisar métricas.
  - 💻 **Desarrollador**: Crear tareas, mover tarjetas en el tablero, editar tareas que le fueron asignadas y comentar.
  - 👁️ **Observador**: Acceso de solo lectura al tablero, lista y métricas.
- **Modal de Gestión de Roles**: Permite al Administrador cambiar los roles de los miembros en tiempo real desde la barra lateral.
- **Guardias de Seguridad**: Intentar una acción no permitida despliega un mensaje claro con el motivo según el rol activo.

### 3. HU13: Dashboard de Métricas y Reportes de Actividad
- **Pestaña Dedicada**: Alterna entre la vista Kanban, el Dashboard y la Vista Lista.
- **Tarjetas KPI**: Resumen numérico en tiempo real de Tareas Totales, Horas Estimadas, Tareas Completadas (con barra de porcentaje animada), En Progreso y Tareas Críticas/Vencidas.
- **Gráficos SVG Nativos** (100% offline sin bibliotecas externas):
  - Gráfico Circular (Donut) de distribución por estado con leyendas dinámicas y porcentajes.
  - Gráfico de Barras verticales de distribución por prioridad.
  - Gráfico de Barras horizontales con la carga de trabajo y tareas resueltas por miembro del equipo.
- **Feed de Actividad en Vivo (Auditoría)**: Línea de tiempo que registra en tiempo real quién creó, movió, comentó o completó cada tarea.

### 4. HU17: Mejorar el Diseño de la Interfaz de Usuario
- **Diseño Moderno y Profesional**: Inspirado en interfaces ágiles contemporáneas con tipografía limpia, paleta de colores armónica, sombras suaves y bordes redondeados.
- **Modo Oscuro / Modo Claro**: Alternador con ícono en la cabecera que conmuta temas al instante y guarda la preferencia del usuario en `localStorage`.
- **Efectos y Microinteracciones**: Elevación de tarjetas al pasar el cursor (`transform: translateY(-2px)`), animaciones de apertura de ventanas modales con desenfoque de fondo (`backdrop-filter: blur`), y notificaciones flotantes (Toast) con iconos.
- **Diseño Adaptable (Responsive)**: Optimizado para monitores de escritorio, portátiles, tablets y pantallas móviles.

### 5. HU07: Funcionalidad de Etiquetado para Tareas
- Las tareas pueden tener múltiples etiquetas personalizadas o predefinidas (`#Frontend`, `#Backend`, `#UI/UX`, `#Bug`, `#Seguridad`, `#API`, `#DevOps`, `#Base de Datos`).
- Cada etiqueta cuenta con una gama de colores distintiva (texto y fondo).
- **Filtrado Rápido con un Clic**: Al hacer clic en cualquier etiqueta dentro de una tarjeta del tablero, se aplica automáticamente como filtro en la barra superior.

### 6. HU03: Asignación de Tareas a Usuarios
- Selector de usuarios en el modal de creación y edición con nombre y rol.
- En las tarjetas del tablero Kanban se muestra el avatar con tooltip informativo.
- Filtro en la barra superior para ver "Mis tareas", las tareas asignadas a un colaborador específico o tareas "Sin Asignar".

### 7. HU01: Sistema de Registro y Autenticación
- Registro de nuevos usuarios con nombre, correo, contraseña y selección de rol.
- Inicio de sesión con validación de credenciales.
- **Selector de Acceso Rápido Demo**: Permite alternar en 1 clic entre cuentas preconfiguradas:
  - `Sofía (Administrador)`
  - `Carlos (Gestor de Proyecto)`
  - `Ana (Desarrollador)`
  - `Marcos (Observador)`

### 8. HU11: Múltiples Proyectos por Usuario
- Selector de proyectos en el encabezado y en la barra lateral.
- Vista consolidada (`Todos los Proyectos`) o filtrada por proyecto individual (`Plataforma E-Commerce 2.0`, `App Móvil Clientes`, `Migración Infraestructura Cloud`).
- Barra de progreso por proyecto con porcentaje de completitud y total de tareas.
- Modal para crear nuevos proyectos con personalización de color, ícono emoji, descripción y fecha objetivo.

### 9. HU16: Sistema de Prioridades para Tareas
- 4 niveles claramente diferenciados:
  - 🔥 **Urgente** (Rojo vibrante)
  - 🔺 **Alta** (Naranja)
  - 🔹 **Media** (Azul)
  - 🟢 **Baja** (Verde esmeralda)
- Cada tarjeta del tablero incluye una cinta lateral de color según su prioridad y una insignia visual.
- Ordenamiento y filtrado por nivel de urgencia.

---

## 📁 Estructura del Código

```text
metodologias sistema/
├── index.html          # Estructura semántica, vistas Kanban, Dashboard, Lista y modales
├── README.md           # Documentación completa del proyecto
├── css/
│   └── style.css       # Sistema de diseño, temas (claro/oscuro), Kanban, gráficos y responsividad
└── js/
    ├── data.js         # Estado inicial, datos de prueba (seed data) y almacenamiento en localStorage
    ├── i18n.js         # Diccionario y motor multilingüe Español / Inglés (HU12)
    ├── auth.js         # Autenticación (HU01) y matriz de roles y permisos RBAC (HU15)
    ├── projects.js     # Gestión de múltiples proyectos (HU11)
    ├── tasks.js        # Lógica de tareas: Kanban, asignación, comentarios, tags, adjuntos, prioridades
    ├── filters.js      # Filtros avanzados y búsqueda en tiempo real (HU04)
    ├── dashboard.js    # Métricas, gráficos nativos SVG y feed de actividad (HU13)
    ├── export.js       # Exportación a Excel/CSV con BOM UTF-8 y respaldo JSON (HU14)
    ├── tutorial.js     # Guía interactiva paso a paso para nuevos usuarios (HU19)
    ├── premium.js      # Modal de suscripción y pasarela de pago simulada (HU20)
    └── app.js          # Controlador principal, eventos, temas, arrastre y notificaciones (HU17, HU05)
```
