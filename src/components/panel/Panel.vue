<template>
  <el-tabs v-model="activeTab">
    <el-tab-pane name="global" :label="$t('panel.globalSettings')">
      <GlobalPanel :graph="graph"/>
    </el-tab-pane>
    <el-tab-pane name="default" :label="$t('panel.defaultStyles')">
      <!-- Default style settings content will go here -->
    </el-tab-pane>
    <el-tab-pane v-if="selectedVertex" name="vertex" :label="$t('panel.vertexSettings')">
      <VertexPanel :vertex="selectedVertex" :defaultConfig="graph.defaultShapeConfig" @update:vertex="updateVertex" />
    </el-tab-pane>
    <el-tab-pane v-if="selectedEdge" name="edge" :label="$t('panel.edgeSettings')">
      <!-- Edge settings content will go here when an edge is selected -->
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { Vertex } from '@/models/vertex/Vertex';
import { Edge } from '@/models/egde/Edge';
import VertexPanel from './VertexPanel.vue';
import GlobalPanel from './GlobalPanel.vue';

export default {
  name: 'Panel',
  components: {
    VertexPanel,
    GlobalPanel
  },
  props: {
    selectedVertex: {
      type: Object as () => Vertex | null,
      default: null
    },
    selectedEdge: {
      type: Object as () => Edge | null,
      default: null
    },
    graph: {
      type: Object,
      required: true
    }
  },
  emits: ['update:graph', 'update:selectedVertex'],
  setup(props, { emit }) {
    const activeTab = ref('global');
    watch([() => props.selectedVertex, () => props.selectedEdge], ([newVertex, newEdge]) => {
      if (newVertex) {
        activeTab.value = 'vertex';
      } else if (newEdge) {
        activeTab.value = 'edge';
      } else {
        activeTab.value = 'global';
      }
    });

    return {
      activeTab,
    };
  },
  methods: {
    updateVertex(updatedVertex: Vertex) {
      if (this.selectedVertex) {
        if (updatedVertex.changeShape) {
          const newVertex = this.graph.changeVertexShape(this.selectedVertex, updatedVertex.shapeName);
          if (newVertex) {
            this.$emit('update:selectedVertex', newVertex);
          }
        } else {
          this.graph.updateVertex(this.selectedVertex, updatedVertex);
        }
        this.$emit('update:graph', this.graph);
      }
    }
  }
};
</script>

<style scoped>
/* Add any panel-specific styles here */
</style>
