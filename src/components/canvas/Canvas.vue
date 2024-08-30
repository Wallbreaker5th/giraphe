<template>
  <div class="canvas-container">
    <Toolbar class="toolbar" v-model="toolbarModel" />
    <svg ref="svgRef" :width="width" :height="height" @mousemove="handleMouseMove" @wheel="handleWheel"
      @mousedown="handleMouseDown" @mouseup="handleMouseUp" @mouseleave="handleMouseLeave">
      <g
        :transform="`translate(${viewpoint.x}, ${- viewpoint.y}), translate(${width / 2}, ${height / 2}), scale(${viewpoint.zoom})`">
        <g ref="gridSVGRef" />
        <g ref="edgeSVGRef" />
        <g ref="pendingEdgeSVGRef" />
        <g ref="vertexSVGRef" />
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import { Graph } from '../../models/Graph'
import { Vertex } from '../../models/vertex/Vertex'
import Toolbar from './Toolbar.vue'
import { Edge } from '../../models/egde/Edge'
import { Empty } from '../../models/vertex/Empty'
import { XY } from '../../models/coordinateSystem/XY'

export default {
  name: 'Canvas',
  components: {
    Toolbar
  },
  props: {
    graph: {
      type: Object as () => Graph,
      required: true,
    },
    viewpoint: {
      type: Object as () => { x: number; y: number; zoom: number },
      required: true,
    },
    selectedVertex: {
      type: Object as () => Vertex | null,
      required: false,
      default: null,
    },
    selectedEdge: {
      type: Object as () => Edge | null,
      required: false,
      default: null,
    }
  },
  emits: ['update:graph', 'update:viewpoint', 'vertex-select', 'edge-select'],
  data() {
    return {
      width: 0,
      height: 0,
      isDragging: false,
      hasDragged: false,
      lastMousePosition: { x: 0, y: 0 },
      vertexDraggingTarget: { x: 0, y: 0 },
      gridSVGElements: [] as SVGElement[],
      vertexSVGElements: [] as SVGElement[],
      edgeSVGElements: [] as SVGElement[],
      draggedVertex: null as Vertex | null,
      edgeStartVertex: null as Vertex | null,
      toolbarModel: { tool: 'select', shape: 'circle', directedEdge: false },
      snapThreshold: 10,
      clickedEdge: null as Edge | null,
    }
  },
  watch: {
    toolbarModel: {
      handler() {
        this.edgeStartVertex = null;
        this.$emit("vertex-select", null);
        this.$emit("edge-select", null);
      },
      deep: true
    },
    graph: {
      handler() {
        this.updateGraphSVG();
      },
      deep: true
    },
    edgeStartVertex: {
      handler() {
        this.updatePendingEdge(null);
      },
    },
    viewpoint: {
      handler() {
        this.updateGraphSVG();
      },
      deep: true
    },
    selectedVertex: {
      handler() {
        this.updateGraphSVG();
      },
    },
    selectedEdge: {
      handler() {
        this.updateGraphSVG();
      },
    }
  },
  computed: {
    svgRef() {
      return this.$refs.svgRef as HTMLElement
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.resizeSVG()
      window.addEventListener('resize', this.resizeSVG)
      this.updateGraphSVG()
      this.updatePendingEdge(null)
    })
  },
  methods: {
    resizeSVG() {
      if (this.svgRef) {
        const container = this.svgRef.parentElement
        if (container) {
          this.width = container.clientWidth
          this.height = container.clientHeight
          this.updateGraphSVG()
        } else {
          console.error('Container element not found')
        }
      } else {
        console.error('SVG ref not set')
      }
    },
    updateGraphSVG() {
      const bounds = {
        x: -this.width / (2 * this.viewpoint.zoom) - this.viewpoint.x / this.viewpoint.zoom,
        y: -this.height / (2 * this.viewpoint.zoom) + this.viewpoint.y / this.viewpoint.zoom,
        width: this.width / this.viewpoint.zoom,
        height: this.height / this.viewpoint.zoom
      }
      this.gridSVGElements = this.graph.getGridSVG(bounds, this.viewpoint.zoom)
      this.vertexSVGElements = this.graph.getVertexSVG(this.selectedVertex)
      this.edgeSVGElements = this.graph.getEdgeSVG(this.selectedEdge)

      // Update grid elements
      const gridGroup = this.$refs.gridSVGRef as SVGElement
      if (gridGroup) {
        gridGroup.innerHTML = '';
        this.gridSVGElements.forEach(element => {
          gridGroup.appendChild(element);
        });
      }

      // Update edge elements
      const edgeGroup = this.$refs.edgeSVGRef as SVGElement
      if (edgeGroup) {
        edgeGroup.innerHTML = '';
        this.edgeSVGElements.forEach((element, index) => {
          element.addEventListener('mousedown', (event) => this.handleEdgeMouseDown(event, this.graph.edges[index]));
          element.addEventListener('mouseup', (event) => this.handleEdgeMouseUp(event, this.graph.edges[index]));
          edgeGroup.appendChild(element);
        });
      }

      // Update vertex elements
      const vertexGroup = this.$refs.vertexSVGRef as SVGElement
      if (vertexGroup) {
        vertexGroup.innerHTML = '';
        this.vertexSVGElements.forEach((element, index) => {
          element.addEventListener('mousedown', (event) => this.handleVertexMouseDown(event, this.graph.vertices[index]));
          element.addEventListener('mouseup', (event) => this.handleVertexMouseUp(event, this.graph.vertices[index]));
          vertexGroup.appendChild(element);
        });
      }
    },
    updatePendingEdge(e: MouseEvent | null) {
      if (e === null) {
        const pendingEdgeGroup = this.$refs.pendingEdgeSVGRef as SVGElement
        if (pendingEdgeGroup) {
          pendingEdgeGroup.innerHTML = '';
        }
        return;
      }
      if (this.toolbarModel.tool === 'link' && this.edgeStartVertex) {
        const svgRect = this.svgRef.getBoundingClientRect();
        const x = (e.clientX - svgRect.left - this.width / 2 - this.viewpoint.x) / this.viewpoint.zoom;
        const y = -(e.clientY - svgRect.top - this.height / 2 + this.viewpoint.y) / this.viewpoint.zoom;
        const endPosition = {
          x: x,
          y: y
        };
        console.log('End position:', endPosition);
        const emptyEndVertex = new Empty(endPosition);
        const pendingEdge = new Edge(this.edgeStartVertex, emptyEndVertex, { directed: this.toolbarModel.directedEdge }, this.graph.defaultEdgeConfig);
        const pendingEdgeGroup = this.$refs.pendingEdgeSVGRef as SVGElement
        if (pendingEdgeGroup) {
          pendingEdgeGroup.innerHTML = '';
          const pendingEdgeSVG = pendingEdge.getSVGElement(false);
          pendingEdgeGroup.appendChild(pendingEdgeSVG);
        }
      }
    },
    getBestSnapPosition(position: XY) {
      return this.graph.getBestSnapPosition(position, this.snapThreshold, this.viewpoint.zoom)
    },
    handleMouseDown(event: MouseEvent) {
      if (event.button === 0 && !this.draggedVertex) {
        this.isDragging = true
        this.hasDragged = false
        this.lastMousePosition = { x: event.clientX, y: event.clientY }
        if (this.toolbarModel.tool === 'link') {
          // Stop linking when clicking on empty space
          this.edgeStartVertex = null;
          const pendingEdgeGroup = this.$refs.pendingEdgeSVGRef as SVGElement;
          if (pendingEdgeGroup) {
            pendingEdgeGroup.innerHTML = '';
          }
        }
      }
    },
    handleMouseUp(event: MouseEvent) {
      if (event.button === 0) {
        if (!this.hasDragged && this.toolbarModel.tool === 'select') {
          const svgRect = this.svgRef.getBoundingClientRect();
          const x = (event.clientX - svgRect.left - this.width / 2 - this.viewpoint.x) / this.viewpoint.zoom;
          const y = -(event.clientY - svgRect.top - this.height / 2 + this.viewpoint.y) / this.viewpoint.zoom;
          const snapPosition = this.getBestSnapPosition({ x, y });
          this.graph.addVertexByShape(this.toolbarModel.shape, snapPosition, (this.graph.vertices.length + 1).toString(), {});
          this.$emit('update:graph', this.graph);
        }
        this.isDragging = false
        this.draggedVertex = null
        this.hasDragged = false
      }
    },
    handleMouseLeave() {
      this.isDragging = false
      this.draggedVertex = null
      // this.hasDragged = false
      // this.edgeStartVertex = null;
    },
    handleMouseMove(event: MouseEvent) {
      if (this.isDragging) {
        const dx = event.clientX - this.lastMousePosition.x
        const dy = event.clientY - this.lastMousePosition.y
        if (dx !== 0 || dy !== 0) {
          this.hasDragged = true
        }
        if (this.draggedVertex && this.toolbarModel.tool === 'select') {
          this.vertexDraggingTarget.x += dx / this.viewpoint.zoom;
          this.vertexDraggingTarget.y -= dy / this.viewpoint.zoom;
          const snapPosition = this.getBestSnapPosition(this.vertexDraggingTarget);

          this.draggedVertex.position = snapPosition;
          this.lastMousePosition = { x: event.clientX, y: event.clientY }
          this.$emit('update:graph', this.graph);
        } else {
          this.$emit('update:viewpoint', {
            ...this.viewpoint,
            x: this.viewpoint.x + dx,
            y: this.viewpoint.y - dy
          })
          this.lastMousePosition = { x: event.clientX, y: event.clientY }
        }
      }
      this.updatePendingEdge(event)
    },
    handleWheel(event: WheelEvent) {
      event.preventDefault();
      const zoomFactor = event.deltaY > 0 ? 1 / 1.1 : 1.1;
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      const svgRect = this.svgRef.getBoundingClientRect();
      const viewX = (mouseX - svgRect.left - this.width / 2);
      const viewY = - (mouseY - svgRect.top - this.height / 2);

      const newScale = this.viewpoint.zoom * zoomFactor;
      const newX = viewX + (this.viewpoint.x - viewX) * zoomFactor;
      const newY = viewY + (this.viewpoint.y - viewY) * zoomFactor;

      this.$emit('update:viewpoint', {
        ...this.viewpoint,
        x: newX,
        y: newY,
        zoom: newScale
      });
      this.updatePendingEdge(event)
    },
    handleVertexMouseDown(event: MouseEvent, vertex: Vertex) {
      event.stopPropagation();
      if (this.toolbarModel.tool === 'select') {
        this.isDragging = true;
        this.draggedVertex = vertex;
        this.lastMousePosition = { x: event.clientX, y: event.clientY };
        this.vertexDraggingTarget = { x: vertex.position.x, y: vertex.position.y };
      }
    },
    handleVertexMouseUp(event: MouseEvent, vertex: Vertex) {
      event.stopPropagation();
      if (!this.hasDragged) {
        this.handleVertexClick(vertex);
      }
      this.isDragging = false;
      this.draggedVertex = null;
      this.hasDragged = false;
    },
    handleVertexClick(vertex: Vertex) {
      if (this.toolbarModel.tool === 'select') {
        if (this.selectedVertex === vertex) {
          this.$emit('vertex-select', null);
        } else {
          this.$emit('vertex-select', vertex);
        }
      } else if (this.toolbarModel.tool === 'link') {
        if (!this.edgeStartVertex) {
          this.edgeStartVertex = vertex;
        } else {
          this.graph.addEdge(this.edgeStartVertex, vertex, { directed: this.toolbarModel.directedEdge });
          this.edgeStartVertex = null;
          this.$emit('update:graph', this.graph);
        }
      } else if (this.toolbarModel.tool === 'delete') {
        this.graph.removeVertex(vertex);
        this.$emit('update:graph', this.graph);
      }
    },
    handleEdgeMouseDown(event: MouseEvent, edge: Edge) {
      event.stopPropagation();
      this.clickedEdge = edge;
      this.isDragging = true;
      this.hasDragged = false;
    },
    handleEdgeMouseUp(event: MouseEvent, edge: Edge) {
      event.stopPropagation();
      if (!this.hasDragged && this.clickedEdge === edge) {
        this.handleEdgeClick(edge);
      }
      this.isDragging = false;
      this.clickedEdge = null;
      this.hasDragged = false;
    },
    handleEdgeClick(edge: Edge) {
      if (this.toolbarModel.tool === 'select') {
        if (this.selectedEdge === edge) {
          this.$emit('edge-select', null);
        } else {
          this.$emit('edge-select', edge);
        }
      } else if (this.toolbarModel.tool === 'delete') {
        this.graph.removeEdge(edge);
        this.$emit('update:graph', this.graph);
      }
      console.log('Edge clicked:', edge);
    },
  },
}
</script>

<style scoped>
.canvas-container {
  font-family: 'Segoe UI', 'Lucida Sans Unicode', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  width: 100%;
  height: 100%;
  user-select: none;
  position: relative;
}

svg {
  display: block;
}

.toolbar {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}
</style>