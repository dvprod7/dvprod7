<template>
    <div>
        <h1 class="text-3xl">{{ t('hero.profile') }}</h1>
    </div>
</template>
<script>
import { useI18n } from 'vue-i18n';

export default {
  setup() {
    const { t } = useI18n();
    return { t };
  }
}
</script>