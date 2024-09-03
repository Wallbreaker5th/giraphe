<template>
  <el-tabs v-model="activeTab" class="full-height-tabs" tab-position="top">
    <el-tab-pane name="global" :label="$t('panel.globalSettings')" class="full-height-pane">
      <GlobalPanel :graph="graph" @update:graph="updateGraph" />
    </el-tab-pane>
    <el-tab-pane name="default" :label="$t('panel.defaultStyles')" class="full-height-pane">
      <StylePanel 
        :defaultShapeConfig="graph.defaultShapeConfig" 
        :defaultEdgeConfig="graph.defaultEdgeConfig" 
        @update:defaultShapeConfig="updateDefaultShapeConfig"
        @update:defaultEdgeConfig="updateDefaultEdgeConfig"
      />
    </el-tab-pane>
    <el-tab-pane v-if="selectedVertex" name="vertex" :label="$t('panel.vertexSettings')" class="full-height-pane">
      <VertexPanel :vertex="selectedVertex" :defaultConfig="graph.defaultShapeConfig" @update:vertex="updateVertex" />
    </el-tab-pane>
    <el-tab-pane v-if="selectedEdge" name="edge" :label="$t('panel.edgeSettings')" class="full-height-pane">
      <EdgePanel :edge="selectedEdge" :defaultConfig="graph.defaultEdgeConfig" @update:edge="updateEdge" />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { ref, watch } from 'vue';
import { Vertex } from '../../models/vertex/Vertex';
import { Edge } from '../../models/egde/Edge';
import VertexPanel from './VertexPanel.vue';
import EdgePanel from './EdgePanel.vue';
import GlobalPanel from './GlobalPanel.vue';
import StylePanel from './StylePanel.vue';
import { Graph } from '../../models/Graph';

export default {
  name: 'Panel',
  components: {
    VertexPanel,
    EdgePanel,
    GlobalPanel,
    StylePanel
  },
  props: {
    selectedVertex: {
      type: Object as () => Vertex | null,
      default: null
    },
    selectedEdge: {
      type: Object as () => Edge | null,
      default: null,
    },
    graph: {
      type: Object as () => Graph,
      required: true
    }
  },
  emits: ['update:graph', 'update:selectedVertex', 'update:selectedEdge'],
  setup(props) {
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
    updateGraph(updatedGraph: any) {
      console.log('updateGraph', updatedGraph);
      this.$emit('update:graph', updatedGraph);
    },
    updateVertex(updatedVertex: Vertex & { changeShape?: boolean }) {
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
    },
    updateEdge(updatedEdge: Edge) {
      if (this.selectedEdge) {
        this.graph.updateEdge(this.selectedEdge, updatedEdge);
        this.$emit('update:graph', this.graph);
        this.$emit('update:selectedEdge', updatedEdge);
      }
    },
    updateDefaultShapeConfig(updatedConfig: any) {
      Object.assign(this.graph.defaultShapeConfig, updatedConfig);
      this.$emit('update:graph', this.graph);
    },
    updateDefaultEdgeConfig(updatedConfig: any) {
      Object.assign(this.graph.defaultEdgeConfig, updatedConfig);
      this.$emit('update:graph', this.graph);
    }
  }
};
</script>

<style scoped>
.full-height-tabs {
  height: 100%;
}

.full-height-pane {
  overflow: scroll;
  height: 100%;
}
</style>
