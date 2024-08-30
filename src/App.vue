<script lang="ts">
import { defineComponent, ref } from 'vue'
import ChooseLanguage from './components/ChooseLanguage.vue'
import Canvas from './components/canvas/Canvas.vue'
import { Graph } from './models/Graph'
import { Vertex } from './models/vertex/Vertex';
import { Edge } from './models/egde/Edge';
import Panel from './components/panel/Panel.vue';
export default {
  name: 'App',
  components: {
    ChooseLanguage,
    Canvas,
    Panel
  },
  data() {
    let graph = new Graph();
    graph.addVertexByShape("circle", { x: 0, y: 0 }, "1", {});
    graph.addVertexByShape("circle", { x: 160, y: 0 }, "2", {});
    graph.addEdge(graph.vertices[0], graph.vertices[1]);
    return {
      selectedElement: null,
      graph: graph,
      viewpoint: {
        x: 0,
        y: 0,
        zoom: 1
      },
      selectedVertex: null as null | Vertex,
      selectedEdge: null as null | Edge,
    }
  },
  methods: {
  }
}
</script>

<template>
  <div class="app-container">
    <header>
      <h1>{{ $t('header.title') }}</h1>
      <ChooseLanguage />
    </header>
    <main>
      <div class="canvas-container">
        <Canvas :graph="graph" :viewpoint="viewpoint" :selectedVertex="selectedVertex" :selectedEdge="selectedEdge"
          @update:graph="graph = $event" @update:viewpoint="viewpoint = $event"
          @vertex-select="selectedVertex = $event; selectedEdge = null"
          @edge-select="selectedEdge = $event; selectedVertex = null" />
      </div>
      <aside class="side-panel">
        <div class="upper-panel">
          <p>{{ $t('sidepanel.description') }}</p>
        </div>
        <div class="lower-panel">
          <Panel :selectedVertex="selectedVertex" :selectedEdge="selectedEdge" :graph="graph"
            @update:graph="graph = $event" @update:selected-vertex="selectedVertex = $event" />
        </div>
      </aside>
    </main>
    <footer>
      <p>{{ $t('footer.by') }} <el-link href="https://wallbreaker5th.top" type="primary"
          :underline="false">Wallbreaker5th</el-link></p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.side-panel {
  display: flex;
  flex-direction: column;
  width: 300px;
  flex-shrink: 0;
}

.upper-panel {
  flex: 0 0 auto;
  padding: 0.5rem;
  font-size: 0.9em;
  line-height: 1.2;
}

.lower-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 0.5rem;
  border-top: 1px solid #ccc;
}

.canvas-container {
  flex: 1;
  overflow: hidden;
}

footer {
  flex-shrink: 0;
}
</style>