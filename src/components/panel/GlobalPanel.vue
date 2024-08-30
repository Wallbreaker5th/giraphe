<template>
  <div class="global-panel">
    <h3>{{ $t('panel.globalSettingsFull') }}</h3>
    <el-form label-position="left" label-width="60px">
      <el-form-item :label="$t('panel.export')">
        <el-button @click="exportSvg">{{ $t('panel.exportSvg') }}</el-button>
      </el-form-item>
      <el-form-item :label="$t('panel.coordinateSystems')">
        <div style="display: flex; flex-direction: column; align-items: flex-start;">
          <div v-for="(system, index) in graph.coordinateSystems" :key="index">
            <el-checkbox v-model="system.enabled" @change="updateCoordinateSystem()">
              {{ system.system.name }}
            </el-checkbox>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { Graph } from '../../models/Graph';

export default defineComponent({
  name: 'GlobalPanel',
  props: {
    graph: {
      type: Object as () => Graph,
      required: true,
    },
  },
  emits: ['update:graph'],
  setup(props, { emit }) {
    const localGraph = ref(props.graph);

    watch(() => props.graph, (newGraph) => {
      localGraph.value = newGraph;
    });

    const updateCoordinateSystem = () => {
      emit('update:graph', localGraph.value);
    };

    const exportSvg = () => {
      const svg = localGraph.value.getSVG();
      const svgString = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'graph.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return {
      localGraph,
      updateCoordinateSystem,
      exportSvg,
    };
  },
});
</script>

<style scoped>
.global-panel {
  padding: 0px 16px;
  overflow-x: scroll;
  overflow-y: scroll;
  height: 100%;
}

h3 {
  margin: 0px;
}
</style>
