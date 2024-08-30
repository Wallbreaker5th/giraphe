<template>
  <div class="edge-panel">
    <h3>{{ $t('panel.edgeSettingsFull') }}</h3>
    <el-form label-position="left" label-width="100px">
      <el-form-item :label="$t('panel.directed')">
        <el-switch v-model="localEdge.config.directed" @change="emitUpdate" />
      </el-form-item>
      <el-form-item :label="$t('panel.strokeColor')">
        <el-color-picker 
          v-model="localEdge.config.strokeColor" 
          @change="emitUpdate"
          :placeholder="defaultConfig.strokeColor"
          :predefine="darkColors"
          show-alpha
        />
      </el-form-item>
      <el-form-item :label="$t('panel.strokeWidth')">
        <el-input-number v-model="localEdge.config.strokeWidth" :min="1" :max="10" :step="0.5" @change="emitUpdate"
          :placeholder="defaultConfig.strokeWidth.toString()" />
      </el-form-item>
      <el-form-item :label="$t('panel.strokeStyle')">
        <el-select v-model="localEdge.config.strokeStyle" @change="emitUpdate">
          <el-option value="solid" :label="$t('panel.solid')"></el-option>
          <el-option value="dashed" :label="$t('panel.dashed')"></el-option>
        </el-select>
      </el-form-item>
      
      <el-divider content-position="left">{{ $t('panel.label') }}</el-divider>
      
      <el-form-item :label="$t('panel.labelText')">
        <el-input v-model="localEdge.config.labelText" @change="emitUpdate" />
      </el-form-item>
      <el-form-item :label="$t('panel.labelTextColor')">
        <el-color-picker 
          v-model="localEdge.config.labelTextColor" 
          @change="emitUpdate"
          :placeholder="defaultConfig.labelTextColor"
          :predefine="darkColors"
          show-alpha
        />
      </el-form-item>
      <el-form-item :label="$t('panel.labelTextFontSize')">
        <el-input-number v-model="localEdge.config.labelTextFontSize" :min="8" :max="24" :step="1" @change="emitUpdate"
          :placeholder="defaultConfig.labelTextFontSize.toString()" />
      </el-form-item>
      <el-form-item :label="$t('panel.labelTextStrokeColor')">
        <el-color-picker 
          v-model="localEdge.config.labelTextStrokeColor" 
          @change="emitUpdate"
          :placeholder="defaultConfig.labelTextStrokeColor"
          :predefine="lightColors"
          show-alpha
        />
      </el-form-item>
      <el-form-item :label="$t('panel.labelTextStrokeWidth')">
        <el-input-number v-model="localEdge.config.labelTextStrokeWidth" :min="0" :max="5" :step="0.5"
          @change="emitUpdate" :placeholder="defaultConfig.labelTextStrokeWidth.toString()" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { Edge, EdgeConfig } from '@/models/egde/Edge';
import { darkColors, lightColors } from '../../models/ColorPanel';
import { da } from 'element-plus/es/locales.mjs';

export default defineComponent({
  name: 'EdgePanel',
  props: {
    edge: {
      type: Object as PropType<Edge>,
      required: true,
    },
    defaultConfig: {
      type: Object as PropType<EdgeConfig>,
      required: true,
    },
  },
  data() {
    return {
      darkColors: darkColors,
      lightColors: lightColors,
    };
  },
  emits: ['update:edge'],
  setup(props, { emit }) {
    const localEdge = ref<Edge>({ ...props.edge });

    watch(() => props.edge, (newEdge) => {
      localEdge.value = { ...newEdge };
    }, { deep: true });

    const emitUpdate = () => {
      emit('update:edge', localEdge.value);
    };

    return {
      localEdge,
      emitUpdate,
    };
  },
});
</script>

<style scoped>
.edge-panel {
  padding: 0px 16px;
}

h3 {
  margin: 0px;
}
</style>