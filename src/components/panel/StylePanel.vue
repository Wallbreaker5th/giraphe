<template>
  <div class="style-panel">
    <h3>{{ $t('panel.defaultStyleSettingsFull') }}</h3>
    <el-form label-position="left" label-width="120px">
      <el-divider content-position="left">{{ $t('panel.vertexDefaults') }}</el-divider>
      <el-form-item :label="$t('panel.size')">
        <el-input-number v-model="localDefaultShapeConfig.size" :min="1" :max="100" :step="1" @change="emitUpdate" />
      </el-form-item>
      <el-form-item :label="$t('panel.fillColor')">
        <el-color-picker 
          v-model="localDefaultShapeConfig.fillColor" 
          @change="emitUpdate" 
          :predefine="lightColors"
          show-alpha
        />
      </el-form-item>
      <el-form-item :label="$t('panel.strokeColor')">
        <el-color-picker 
          v-model="localDefaultShapeConfig.strokeColor" 
          @change="emitUpdate" 
          :predefine="darkColors"
          show-alpha
        />
      </el-form-item>
      <el-form-item :label="$t('panel.strokeWidth')">
        <el-input-number v-model="localDefaultShapeConfig.strokeWidth" :min="0" :max="10" :step="0.5" @change="emitUpdate" />
      </el-form-item>
      <el-form-item :label="$t('panel.textSize')">
        <el-input-number v-model="localDefaultShapeConfig.textSize" :min="1" :max="100" :step="1" @change="emitUpdate" />
      </el-form-item>
      <el-form-item :label="$t('panel.widthScale')">
        <el-input-number v-model="localDefaultShapeConfig.widthScale" :min="0.1" :max="5" :step="0.1" @change="emitUpdate" />
      </el-form-item>

      <el-divider content-position="left">{{ $t('panel.edgeDefaults') }}</el-divider>
      <el-form-item :label="$t('panel.directed')">
        <el-switch v-model="localDefaultEdgeConfig.directed" @change="emitUpdate" />
      </el-form-item>
      <el-form-item :label="$t('panel.curve')">
        <el-switch v-model="localDefaultEdgeConfig.curve" @change="emitUpdate" />
      </el-form-item>
      <el-form-item :label="$t('panel.strokeColor')">
        <el-color-picker 
          v-model="localDefaultEdgeConfig.strokeColor" 
          @change="emitUpdate"
          :predefine="darkColors"
          show-alpha
        />
      </el-form-item>
      <el-form-item :label="$t('panel.strokeWidth')">
        <el-input-number v-model="localDefaultEdgeConfig.strokeWidth" :min="1" :max="10" :step="0.5" @change="emitUpdate" />
      </el-form-item>
      <el-form-item :label="$t('panel.strokeStyle')">
        <el-select v-model="localDefaultEdgeConfig.strokeStyle" @change="emitUpdate">
          <el-option value="solid" :label="$t('panel.solid')"></el-option>
          <el-option value="dashed" :label="$t('panel.dashed')"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('panel.labelTextColor')">
        <el-color-picker 
          v-model="localDefaultEdgeConfig.labelTextColor" 
          @change="emitUpdate"
          :predefine="darkColors"
          show-alpha
        />
      </el-form-item>
      <el-form-item :label="$t('panel.labelTextFontSize')">
        <el-input-number v-model="localDefaultEdgeConfig.labelTextFontSize" :min="8" :max="24" :step="1" @change="emitUpdate" />
      </el-form-item>
      <el-form-item :label="$t('panel.labelTextStrokeColor')">
        <el-color-picker 
          v-model="localDefaultEdgeConfig.labelTextStrokeColor" 
          @change="emitUpdate"
          :predefine="lightColors"
          show-alpha
        />
      </el-form-item>
      <el-form-item :label="$t('panel.labelTextStrokeWidth')">
        <el-input-number v-model="localDefaultEdgeConfig.labelTextStrokeWidth" :min="0" :max="5" :step="0.5" @change="emitUpdate" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { ShapeConfig } from '../../models/vertex/Vertex';
import { EdgeConfig } from '../../models/egde/Edge';
import { darkColors, lightColors } from '../../models/ColorPanel';

export default defineComponent({
  name: 'StylePanel',
  props: {
    defaultShapeConfig: {
      type: Object as PropType<ShapeConfig>,
      required: true,
    },
    defaultEdgeConfig: {
      type: Object as PropType<EdgeConfig>,
      required: true,
    },
  },
  emits: ['update:defaultShapeConfig', 'update:defaultEdgeConfig'],
  setup(props, { emit }) {
    const localDefaultShapeConfig = ref<ShapeConfig>({ ...props.defaultShapeConfig });
    const localDefaultEdgeConfig = ref<EdgeConfig>({ ...props.defaultEdgeConfig });

    watch(() => props.defaultShapeConfig, (newConfig) => {
      localDefaultShapeConfig.value = { ...newConfig };
    }, { deep: true });

    watch(() => props.defaultEdgeConfig, (newConfig) => {
      localDefaultEdgeConfig.value = { ...newConfig };
    }, { deep: true });

    const emitUpdate = () => {
      emit('update:defaultShapeConfig', { ...localDefaultShapeConfig.value });
      emit('update:defaultEdgeConfig', { ...localDefaultEdgeConfig.value });
    };

    return {
      localDefaultShapeConfig,
      localDefaultEdgeConfig,
      emitUpdate,
      darkColors,
      lightColors,
    };
  },
});
</script>

<style scoped>
.style-panel {
  padding: 0px 16px;
}

h3 {
  margin: 0px;
}
</style>
