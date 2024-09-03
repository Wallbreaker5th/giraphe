<template>
  <div class="toolbar">
    <div class="toolbar-section toolbar-left">
      <el-radio-group :model-value="modelValue.tool" @update:model-value="updateTool">
        <el-radio-button v-for="tool in tools" :key="tool.name" :value="tool.name">
          {{ t(`canvas.toolbar.${tool.name}`) }}
        </el-radio-button>
      </el-radio-group>
    </div>
    <div class="toolbar-section toolbar-center">
      <el-radio-group :model-value="modelValue.shape" @update:model-value="updateShape">
        <el-radio-button v-for="shape in shapes" :key="shape.name" :value="shape.name">
          <ShapeIcon :shape="shape.name" />
        </el-radio-button>
      </el-radio-group>
    </div>
    <div class="toolbar-section toolbar-center">
      <el-switch
        v-model="modelValue.directedEdge"
        @change="updateDirectedEdge"
        :active-text="t('canvas.toolbar.directedEdge')"
      />
    </div>
    <div class="toolbar-section toolbar-right">
      <el-popconfirm
        :title="t('canvas.toolbar.confirmClear')"
        @confirm="cleanGraph"
        confirm-button-text="OK"
        cancel-button-text="Cancel"
      >
        <template #reference>
          <el-button type="danger" :title="t('canvas.toolbar.cleanGraph')">
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { Delete } from '@element-plus/icons-vue'
import ShapeIcon from '../ShapeIcon.vue'

interface ToolbarModel {
  tool: string
  shape: string
  directedEdge: boolean
}

export default defineComponent({
  name: 'Toolbar',
  props: {
    modelValue: {
      type: Object as PropType<ToolbarModel>,
      required: true
    }
  },
  components: {
    ShapeIcon,
    Delete
  },
  emits: ['update:modelValue', 'cleanGraph'],
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
    },
    updateDirectedEdge(newValue: boolean) {
      this.$emit('update:modelValue', { ...this.modelValue, directedEdge: newValue })
    },
    cleanGraph() {
      this.$emit('cleanGraph')
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
  justify-content: space-between;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 1200px;
}

.toolbar-section {
  display: flex;
  align-items: center;
  flex: 1;
}

.toolbar-left {
  justify-content: flex-start;
}

.toolbar-center {
  justify-content: center;
}

.toolbar-right {
  justify-content: flex-end;
}
</style>
