<template>
  <div class="global-panel">
    <h3>{{ $t('panel.globalSettingsFull') }}</h3>
    <el-form label-position="left" label-width="100px">
      <el-form-item :label="$t('panel.export')">
        <el-button @click="exportSvg">{{ $t('panel.exportSvg') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Graph } from '@/models/Graph';

export default defineComponent({
  name: 'GlobalPanel',
  props: {
    graph: {
      type: Object as PropType<Graph>,
      required: true,
    },
  },
  methods: {
    exportSvg() {
      const svg = this.graph.getSVG();
      const svgString = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'graph.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
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

