import { Vertex } from '../vertex/Vertex';

export interface EdgeConfig {
  directed: boolean;
}

export const defaultEdgeConfig: EdgeConfig = {
  directed: false,
};

export class Edge {
  start: Vertex;
  end: Vertex;
  config: Partial<EdgeConfig>;
  defaultConfig: EdgeConfig;

  constructor(start: Vertex, end: Vertex, config: Partial<EdgeConfig>, defaultConfig: EdgeConfig) {
    this.start = start;
    this.end = end;
    this.config = config;
    this.defaultConfig = defaultConfig;
  }

  getSVGElement(selected: boolean): SVGElement {
    const startAngle = Math.atan2(this.end.position.y - this.start.position.y, 
                                  this.end.position.x - this.start.position.x);
    const endAngle = startAngle + Math.PI;

    const startPos = this.start.getCoordinateFromAngle(startAngle);
    const endPos = this.end.getCoordinateFromAngle(endAngle);

    const svgNS = "http://www.w3.org/2000/svg";
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", startPos.x.toString());
    line.setAttribute("y1", (-startPos.y).toString());
    line.setAttribute("x2", endPos.x.toString());
    line.setAttribute("y2", (-endPos.y).toString());
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", (2 + (selected ? 2 : 0)).toString());

    if (this.config.directed || this.defaultConfig.directed) {
      const arrowhead = this.createArrowhead(startPos, endPos);
      const group = document.createElementNS(svgNS, "g");
      group.appendChild(line);
      group.appendChild(arrowhead);
      return group;
    }

    return line;
  }

  private createArrowhead(start: { x: number; y: number }, end: { x: number; y: number }): SVGElement {
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const arrowSize = 10;

    const x1 = end.x - arrowSize * Math.cos(angle - Math.PI / 6);
    const y1 = end.y - arrowSize * Math.sin(angle - Math.PI / 6);
    const x2 = end.x - arrowSize * Math.cos(angle + Math.PI / 6);
    const y2 = end.y - arrowSize * Math.sin(angle + Math.PI / 6);

    const svgNS = "http://www.w3.org/2000/svg";
    const arrowhead = document.createElementNS(svgNS, "polygon");
    arrowhead.setAttribute("points", `${end.x},${-end.y} ${x1},${-y1} ${x2},${-y2}`);
    arrowhead.setAttribute("fill", "black");

    return arrowhead;
  }
}
