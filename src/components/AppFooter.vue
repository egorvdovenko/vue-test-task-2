<template>
  <footer class="app-footer">
    <div class="container">
      <div class="app-footer__content">
        <div class="app-footer__copyright">
          <p>© 2025 {{ $t('app.title') }}. {{ $t('footer.allRightsReserved') }}</p>
        </div>
      </div>
    </div>
  </footer>
</template>

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
      color: #9ca3af;
    }
  }
}
</style>
