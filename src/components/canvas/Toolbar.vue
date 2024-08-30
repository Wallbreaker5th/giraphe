<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <el-radio-group :model-value="modelValue.tool" @update:model-value="updateTool">
        <el-radio-button v-for="tool in tools" :key="tool.name" :value="tool.name">
          {{ t(`canvas.toolbar.${tool.name}`) }}
        </el-radio-button>
      </el-radio-group>
    </div>
    <div class="toolbar-right">
      <el-radio-group :model-value="modelValue.shape" @update:model-value="updateShape">
        <el-radio-button v-for="shape in shapes" :key="shape.name" :value="shape.name">
          {{ shape.name }}
        </el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Tool {
  name: string
}

interface Shape {
  name: string
}

interface ToolbarModel {
  tool: string
  shape: string
}

export default defineComponent({
  name: 'Toolbar',
  props: {
    modelValue: {
      type: Object as PropType<ToolbarModel>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      tools: [
        { name: 'select' },
        { name: 'link' },
        { name: 'delete' },
      ],
      shapes: [
        { name: 'circle' },
        { name: 'square' },
      ],
    }
  },
  methods: {
    updateTool(newTool: string) {
      this.$emit('update:modelValue', { ...this.modelValue, tool: newTool })
    },
    updateShape(newShape: string) {
      this.$emit('update:modelValue', { ...this.modelValue, shape: newShape })
    }
  },
  computed: {
    t() {
      return useI18n().t
    }
  }
})
</script>

<style scoped>
.toolbar {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
}
</style>
