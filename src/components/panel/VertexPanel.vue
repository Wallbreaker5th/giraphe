<template>
  <div class="vertex-panel">
    <h3>{{ $t('panel.vertexSettingsFull') }}</h3>
    <el-form label-position="left" label-width="100px">
      <el-form-item :label="$t('panel.position')">
        <el-input-number v-model="localVertex.position.x" :step="10" :label="$t('panel.positionX')" @change="emitUpdate" />
        <el-input-number v-model="localVertex.position.y" :step="10" :label="$t('panel.positionY')" @change="emitUpdate" />
      </el-form-item>
      <el-form-item :label="$t('panel.text')">
        <el-input v-model="localVertex.text" @change="emitUpdate" />
      </el-form-item>
      <el-form-item :label="$t('panel.size')">
        <el-input-number v-model="localVertex.config.size" :min="1" :max="100" :step="1" @change="emitUpdate" :placeholder="defaultConfig.size.toString()" />
      </el-form-item>
      <el-form-item :label="$t('panel.fillColor')">
        <el-color-picker v-model="localVertex.config.fillColor" @change="emitUpdate" :placeholder="defaultConfig.fillColor" />
      </el-form-item>
      <el-form-item :label="$t('panel.strokeColor')">
        <el-color-picker v-model="localVertex.config.strokeColor" @change="emitUpdate" :placeholder="defaultConfig.strokeColor" />
      </el-form-item>
      <el-form-item :label="$t('panel.strokeWidth')">
        <el-input-number v-model="localVertex.config.strokeWidth" :min="0" :max="10" :step="0.5" @change="emitUpdate" :placeholder="defaultConfig.strokeWidth.toString()" />
      </el-form-item>
      <el-form-item :label="$t('panel.textSize')">
        <el-input-number v-model="localVertex.config.textSize" :min="1" :max="100" :step="1" @change="emitUpdate" :placeholder="defaultConfig.textSize.toString()" />
      </el-form-item>
      <el-form-item :label="$t('panel.widthScale')">
        <el-input-number v-model="localVertex.config.widthScale" :min="0.1" :max="5" :step="0.1" @change="emitUpdate" :placeholder="defaultConfig.widthScale.toString()" />
      </el-form-item>
      <el-form-item :label="$t('panel.shape')">
        <el-select v-model="localVertex.shapeName" @change="changeShape">
          <el-option value="circle" :label="$t('panel.circle')"></el-option>
          <el-option value="square" :label="$t('panel.square')"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { Vertex, ShapeConfig } from '@/models/vertex/Vertex';

export default defineComponent({
  name: 'VertexPanel',
  props: {
    vertex: {
      type: Object as PropType<Vertex>,
      required: true,
    },
    defaultConfig: {
      type: Object as PropType<ShapeConfig>,
      required: true,
    },
  },
  emits: ['update:vertex'],
  setup(props, { emit }) {
    const localVertex = ref<Vertex>({ ...props.vertex });

    watch(() => props.vertex, (newVertex) => {
      localVertex.value = { ...newVertex };
    }, { deep: true });

    const emitUpdate = () => {
      console.log('emit update')
      emit('update:vertex', localVertex.value);
    };

    const changeShape = () => {
      emit('update:vertex', { ...localVertex.value, changeShape: true });
    };

    return {
      localVertex,
      emitUpdate,
      changeShape,
    };
  },
});
</script>

<style scoped>
.vertex-panel {
  padding: 0px 16px;
}

h3 {
  margin: 0px;
}
</style>
