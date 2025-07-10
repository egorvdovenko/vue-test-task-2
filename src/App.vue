<script setup lang="ts">
import AppLanguageSwitcher from '@/components/AppLanguageSwitcher.vue'
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="l-container">
        <div class="app-header__content">
          <router-link to="/" class="app-header__logo">
            {{ $t('app.title') }}
          </router-link>
          <nav class="app-header__nav">
            <router-link to="/" class="nav-link">
              {{ $t('navigation.home') }}
            </router-link>
            <router-link to="/order" class="nav-link">
              {{ $t('navigation.orders') }}
            </router-link>
          </nav>
          <div class="app-header__actions">
            <AppLanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
    <main class="main-content">
      <router-view />
    </main>
    <footer class="app-footer">
      <div class="l-container">
        <div class="app-footer__content">
          <div class="app-footer__copyright">
            <p>© 2025 {{ $t('app.title') }}. {{ $t('footer.allRightsReserved') }}</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style lang="scss">
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>

<style lang="scss" scoped>
.app-header {
  background: var(--surface-color);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md) 0;
    gap: var(--spacing-lg);

    @media (max-width: 768px) {
      flex-wrap: wrap;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) 0;
    }
  }

  &__logo {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    text-decoration: none;

    &:hover {
      color: var(--primary-color);
    }

    @media (max-width: 768px) {
      font-size: 1.25rem;
      order: 1;
    }
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    flex: 1;
    justify-content: center;

    @media (max-width: 768px) {
      flex: none;
      width: 100%;
      justify-content: center;
      gap: var(--spacing-md);
      order: 3;
    }
  }

  &__actions {
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
      order: 2;
    }
  }
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  padding: var(--spacing-sm) var(--spacing-md);
  transition: all 0.2s ease;

  &:hover {
    color: var(--text-primary);
    background-color: var(--background-secondary);
  }

  &.router-link-active {
    color: var(--primary-color);
    font-weight: 600;
  }

  @media (max-width: 768px) {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: 0.875rem;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
  }
}
</style>

<style lang="scss" scoped>
.app-footer {
  background: var(--text-primary);
  margin-top: auto;

  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-md) 0;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: var(--spacing-md);
      text-align: center;
    }
  }

  &__copyright {
    p {
      margin: 0;
      font-size: 0.875rem;
      color: var(--text-muted);
    }
  }
}
</style>
