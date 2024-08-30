import { XY } from '../coordinateSystem/XY';
import { Vertex } from '../vertex/Vertex';

export interface EdgeConfig {
  directed: boolean;
  strokeColor: string;
  strokeWidth: number;
  strokeStyle: string;
  labelText: string;
  labelTextColor: string;
  labelTextFontSize: number;
  labelTextStrokeColor: string;
  labelTextStrokeWidth: number;
}

export const defaultEdgeConfig: EdgeConfig = {
  directed: false,
  strokeColor: 'black',
  strokeWidth: 2,
  strokeStyle: 'solid',
  labelText: '',
  labelTextColor: 'black',
  labelTextFontSize: 16,
  labelTextStrokeColor: 'white',
  labelTextStrokeWidth: 3,
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
    const group = document.createElementNS(svgNS, "g");

    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", startPos.x.toString());
    line.setAttribute("y1", (-startPos.y).toString());
    line.setAttribute("x2", endPos.x.toString());
    line.setAttribute("y2", (-endPos.y).toString());
    line.setAttribute("stroke", this.config.strokeColor || this.defaultConfig.strokeColor);
    line.setAttribute("stroke-width", ((this.config.strokeWidth || this.defaultConfig.strokeWidth) + (selected ? 2 : 0)).toString());
    line.setAttribute("stroke-dasharray", this.config.strokeStyle === 'dashed' ? "5,5" : "");

    group.appendChild(line);

    if (this.config.directed || this.defaultConfig.directed) {
      const arrowhead = this.createArrowhead(startPos, endPos);
      group.appendChild(arrowhead);
    }

    if (this.config.labelText || this.defaultConfig.labelText) {
      const label = this.createLabel(startPos, endPos);
      group.appendChild(label);
    }

    return group;
  }

  createArrowhead(start: XY, end: XY): SVGElement {
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const arrowSize = 10;

    const x1 = end.x - arrowSize * Math.cos(angle - Math.PI / 6);
    const y1 = end.y - arrowSize * Math.sin(angle - Math.PI / 6);
    const x2 = end.x - arrowSize * Math.cos(angle + Math.PI / 6);
    const y2 = end.y - arrowSize * Math.sin(angle + Math.PI / 6);

    const svgNS = "http://www.w3.org/2000/svg";
    const arrowhead = document.createElementNS(svgNS, "polygon");
    arrowhead.setAttribute("points", `${end.x},${-end.y} ${x1},${-y1} ${x2},${-y2}`);
    arrowhead.setAttribute("fill", this.config.strokeColor || this.defaultConfig.strokeColor);

    return arrowhead;
  }

  createLabel(start: XY, end: XY): SVGElement {
    const svgNS = "http://www.w3.org/2000/svg";
    const text = document.createElementNS(svgNS, "text");
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;

    text.setAttribute("x", midX.toString());
    text.setAttribute("y", (-midY).toString());
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("font-size", (this.config.labelTextFontSize || this.defaultConfig.labelTextFontSize).toString());
    text.setAttribute("fill", this.config.labelTextColor || this.defaultConfig.labelTextColor);
    text.setAttribute("stroke", this.config.labelTextStrokeColor || this.defaultConfig.labelTextStrokeColor);
    text.setAttribute("stroke-width", (this.config.labelTextStrokeWidth || this.defaultConfig.labelTextStrokeWidth).toString());
    text.setAttribute("paint-order", "stroke");
    text.textContent = this.config.labelText || this.defaultConfig.labelText;

    return text;
  }
}
