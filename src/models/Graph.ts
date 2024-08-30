import { CoordinateSystem } from './coordinateSystem/CoordinateSystem';
import Cartesian from './coordinateSystem/Cartesian';
import { ShapeConfig, defaultShapeConfig, Vertex } from './vertex/Vertex';
import { Circle } from './vertex/Circle';
import { Square } from './vertex/Square';
import { XY } from './coordinateSystem/XY';
import { Edge, EdgeConfig, defaultEdgeConfig } from './egde/Edge';
import Polar from './coordinateSystem/Polar';

interface CoordinateSystemState {
  system: CoordinateSystem;
  enabled: boolean;
}

export class Graph {
  coordinateSystems: CoordinateSystemState[];
  vertices: Vertex[];
  edges: Edge[];
  defaultShapeConfig: ShapeConfig = defaultShapeConfig;
  defaultEdgeConfig: EdgeConfig = defaultEdgeConfig;

  constructor() {
    this.coordinateSystems = [
      { system: new Cartesian("Cartesian", 80, 80), enabled: true },
      { system: new Polar("Polar", { x: 0, y: 0 }, 160), enabled: true },
      { system: new Cartesian("Cartesian from selected vertex", 40, 40, "#bbb", { x: 0, y: 0 }, 2), enabled: false },
      { system: new Polar("Polar from selected vertex", { x: 0, y: 0 }, 80, "#aaf", 2), enabled: false },
    ];
    this.vertices = [];
    this.edges = [];
  }

  getGridSVG(bounds: { x: number; y: number; width: number; height: number }, zoom: number): SVGElement[] {
    let svgObjects: SVGElement[] = [];

    for (const { system, enabled } of this.coordinateSystems) {
      if (enabled) {
        svgObjects = svgObjects.concat(system.getSVGObjects(bounds, zoom));
      }
    }

    return svgObjects;
  }

  getVertexSVG(selectedVertex: Vertex | null): SVGElement[] {
    let svgObjects: SVGElement[] = [];

    for (const vertex of this.vertices) {
      svgObjects.push(vertex.getSVGElement(selectedVertex === vertex));
    }

    return svgObjects;
  }

  getEdgeSVG(selectedEdge: Edge | null): SVGElement[] {
    let svgObjects: SVGElement[] = [];

    for (const edge of this.edges) {
      svgObjects.push(edge.getSVGElement(selectedEdge === edge));
    }

    return svgObjects;
  }

  getSVG(): SVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    // Calculate the bounding box
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    this.vertices.forEach(vertex => {
      const { x, y } = vertex.position;
      minX = Math.min(minX, x - (vertex.config.size || vertex.defaultConfig.size));
      minY = Math.min(minY, y - (vertex.config.size || vertex.defaultConfig.size));
      maxX = Math.max(maxX, x + (vertex.config.size || vertex.defaultConfig.size));
      maxY = Math.max(maxY, y + (vertex.config.size || vertex.defaultConfig.size));
    });

    // Add some padding
    const padding = 20;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    // Set the viewBox and size attributes
    const width = maxX - minX;
    const height = maxY - minY;
    svg.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`);
    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());

    // Add edges
    const edgeSVG = this.getEdgeSVG(null); // No edge selected
    edgeSVG.forEach(element => svg.appendChild(element));

    // Add vertices
    const vertexSVG = this.getVertexSVG(null); // No vertex selected
    vertexSVG.forEach(element => svg.appendChild(element));

    return svg;
  }

  toggleCoordinateSystem(index: number): void {
    if (index >= 0 && index < this.coordinateSystems.length) {
      this.coordinateSystems[index].enabled = !this.coordinateSystems[index].enabled;
    }
  }

  toggleCoordinateSystemByVertex(vertex: Vertex | null): void {
    if (vertex) {
      this.coordinateSystems[2].enabled = true;
      this.coordinateSystems[3].enabled = true;
      this.coordinateSystems[2].system.origin = vertex.position;
      this.coordinateSystems[3].system.origin = vertex.position;
      this.coordinateSystems[0].system.color = "#eee";
      this.coordinateSystems[1].system.color = "#eef";
    } else {
      this.coordinateSystems[2].enabled = false;
      this.coordinateSystems[3].enabled = false;
      this.coordinateSystems[0].system.color = "#ccc";
      this.coordinateSystems[1].system.color = "#bbf";
    }
  }

  addCoordinateSystem(system: CoordinateSystem, enabled: boolean = true): void {
    this.coordinateSystems.push({ system, enabled });
  }

  getBestSnapPosition(position: XY, distanceThreshold: number, zoom: number): XY {
    let bestSnapPosition: XY = position;
    let minDistance = 0;
    let maxPriority = 0;

    for (const { system, enabled } of this.coordinateSystems) {
      if (enabled) {
        const snapPositions = system.getSnapPositions(position, zoom);
        for (const { snapPosition, distance, priority } of snapPositions) {
          if (distance <= distanceThreshold / zoom) {
            if (priority > maxPriority || (priority === maxPriority && distance < minDistance)) {
              bestSnapPosition = snapPosition;
              minDistance = distance;
              maxPriority = priority;
            }
          }
        }
      }
    }

    return bestSnapPosition;
  }

  addVertex(vertex: Vertex): void {
    this.vertices.push(vertex);
  }

  addVertexByShape(shape: string, position: XY, text: string, config: Partial<ShapeConfig>): void {
    let newVertex: Vertex;

    switch (shape.toLowerCase()) {
      case 'circle':
        newVertex = new Circle(position, text, config, this.defaultShapeConfig);
        break;
      case 'square':
        newVertex = new Square(position, text, config, this.defaultShapeConfig);
        break;
      default:
        throw new Error(`Unsupported shape: ${shape}`);
    }

    this.addVertex(newVertex);
  }

  removeVertex(vertex: Vertex): void {
    const index = this.vertices.indexOf(vertex);
    if (index !== -1) {
      this.vertices.splice(index, 1);
      // Remove related edges
      this.edges = this.edges.filter(edge => edge.start !== vertex && edge.end !== vertex);
    }
  }

  addEdge(start: Vertex, end: Vertex, config: Partial<EdgeConfig> = {}): void {
    const newEdge = new Edge(start, end, config, this.defaultEdgeConfig);
    this.edges.push(newEdge);
  }

  removeEdge(edge: Edge): void {
    const index = this.edges.indexOf(edge);
    if (index !== -1) {
      this.edges.splice(index, 1);
    }
  }

  changeVertexShape(vertex: Vertex, newShape: string): Vertex | null {
    const index = this.vertices.indexOf(vertex);
    if (index !== -1) {
      let newVertex: Vertex;

      switch (newShape.toLowerCase()) {
        case 'circle':
          newVertex = new Circle(vertex.position, vertex.text, vertex.config, this.defaultShapeConfig);
          break;
        case 'square':
          newVertex = new Square(vertex.position, vertex.text, vertex.config, this.defaultShapeConfig);
          break;
        default:
          throw new Error(`Unsupported shape: ${newShape}`);
      }

      this.vertices[index] = newVertex;

      // Update edges
      this.edges.forEach(edge => {
        if (edge.start === vertex) edge.start = newVertex;
        if (edge.end === vertex) edge.end = newVertex;
      });

      return newVertex;
    }
    return null;
  }

  updateVertex(vertex: Vertex, updatedVertex: Vertex): void {
    const index = this.vertices.indexOf(vertex);
    if (index !== -1) {
      // Update the vertex properties
      this.vertices[index].position = updatedVertex.position;
      this.vertices[index].text = updatedVertex.text;
      this.vertices[index].config = { ...updatedVertex.config };

      // Update edges
      this.edges.forEach(edge => {
        if (edge.start === vertex) edge.start = this.vertices[index];
        if (edge.end === vertex) edge.end = this.vertices[index];
      });
    }
  }

  updateEdge(edge: Edge, updatedEdge: Edge): void {
    const index = this.edges.indexOf(edge);
    if (index !== -1) {
      // Update the edge properties
      this.edges[index].start = updatedEdge.start;
      this.edges[index].end = updatedEdge.end;
      this.edges[index].config = { ...updatedEdge.config };
    }
  }
}
