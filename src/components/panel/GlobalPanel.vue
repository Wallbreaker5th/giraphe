<template>
  <div class="global-panel">
    <h3>{{ $t('panel.globalSettingsFull') }}</h3>
    <el-form label-position="left" label-width="60px">
      <el-form-item :label="$t('panel.saveLoad')" label-position="top">
        <el-button @click="saveGraph">{{ $t('panel.saveGraph') }}</el-button>
        <el-button @click="loadGraph">{{ $t('panel.loadGraph') }}</el-button>
      </el-form-item>
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

    const saveGraph = () => {
      const jsonString = localGraph.value.toJSON();
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'graph.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const loadGraph = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const json = e.target?.result as string;
            const newGraph = Graph.fromJSON(json);
            emit('update:graph', newGraph);
          };
          reader.readAsText(file);
        }
      };
      input.click();
    };

    return {
      localGraph,
      updateCoordinateSystem,
      exportSvg,
      saveGraph,
      loadGraph,
    };
  },
});
</script>

<style scoped>
.global-panel {
  padding: 0px 16px;
}

h3 {
  margin: 0px;
}
</style>
