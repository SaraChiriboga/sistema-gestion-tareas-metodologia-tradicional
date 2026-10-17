/**
 * Premium Upgrade & Simulated Payments (HU20: Integrar pagos para cuentas premium)
 */

class PremiumManager {
  openModal() {
    const modal = document.getElementById('premiumModal');
    if (modal) {
      modal.classList.add('active');
    }
  }

  closeModal() {
    const modal = document.getElementById('premiumModal');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  processPayment(event) {
    if (event) event.preventDefault();

    const btn = document.getElementById('btnPaySubmit');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '⏳ Procesando pago seguro...';
    }

    setTimeout(() => {
      const user = window.authManager.getCurrentUser();
      user.isPremium = true;

      // Update in users list
      const users = window.dataStore.getUsers();
      const idx = users.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        users[idx].isPremium = true;
        window.dataStore.saveUsers(users);
      }

      window.dataStore.setCurrentUser(user);
      window.dataStore.addActivity('se actualizó al Plan Pro Premium ⭐', user.name, 'auth');
      window.dataStore.addNotification(
        '¡Bienvenido a TaskFlow Premium!',
        'Tu suscripción Pro está activa. Gracias por apoyar el desarrollo de la plataforma.',
        'success'
      );

      if (btn) {
        btn.disabled = false;
        btn.innerHTML = 'Pagar $9.00 USD / Mes';
      }

      this.closeModal();
      window.TaskApp.showToast('🎉 ¡Felicidades! Tu cuenta ha sido actualizada al Plan Pro Premium.', 'success');
      window.TaskApp.render();
    }, 1200);
  }
}

window.premiumManager = new PremiumManager();
