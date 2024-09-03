<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'ChooseLanguage',
  components: {
  },
  setup() {
    const { locale } = useI18n()

    const changeLanguage = (lang: string) => {
      locale.value = lang
      localStorage.setItem('language', lang)
    }

    onMounted(() => {
      const savedLanguage = localStorage.getItem('language')
      if (savedLanguage) {
        locale.value = savedLanguage
      }
    })

    return {
      changeLanguage
    }
  }
})
</script>

<template>
  <div class="language-switcher">
    <el-select v-model="$i18n.locale" @change="changeLanguage">
      <template #prefix>
        <el-icon>🌐</el-icon>
      </template>
      <el-option value="zh" label="中文"></el-option>
      <el-option value="en" label="English"></el-option>
    </el-select>
  </div>
</template>

<style scoped>
.language-switcher {
  margin-left: 1rem;
}
</style>