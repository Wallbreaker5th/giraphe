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
  offsetAngle: number;
  curve: boolean;
}

export const defaultEdgeConfig: EdgeConfig = {
  directed: false,
  strokeColor: '#000000',
  strokeWidth: 2,
  strokeStyle: 'solid',
  labelText: '',
  labelTextColor: '#000000',
  labelTextFontSize: 16,
  labelTextStrokeColor: '#ffffff',
  labelTextStrokeWidth: 3,
  offsetAngle: 0,
  curve: true
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
    const offsetAngle = (this.config.offsetAngle || this.defaultConfig.offsetAngle) / 180 * Math.PI;
    const realAngle = Math.atan2(this.end.position.y - this.start.position.y,
      this.end.position.x - this.start.position.x)
    const startAngle = realAngle + offsetAngle;
    const endAngle = realAngle + Math.PI - offsetAngle;

    const startPos = this.start.getCoordinateFromAngle(startAngle);
    const endPos = this.end.getCoordinateFromAngle(endAngle);

    const svgNS = "http://www.w3.org/2000/svg";
    const group = document.createElementNS(svgNS, "g");

    if (!this.config.curve || offsetAngle === 0) {
      const endPosShrunk = (
        this.config.directed || this.defaultConfig.directed ? 
          { x: endPos.x - Math.cos(realAngle) * 4.9 * Math.sqrt(3), y: endPos.y - Math.sin(realAngle) * 4.9 * Math.sqrt(3) } : 
          endPos
      );
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", startPos.x.toString());
      line.setAttribute("y1", (-startPos.y).toString());
      line.setAttribute("x2", endPosShrunk.x.toString());
      line.setAttribute("y2", (-endPosShrunk.y).toString());
      line.setAttribute("stroke", this.config.strokeColor || this.defaultConfig.strokeColor);
      line.setAttribute("stroke-width", ((this.config.strokeWidth || this.defaultConfig.strokeWidth) + (selected ? 2 : 0)).toString());
      line.setAttribute("stroke-dasharray", (this.config.strokeStyle || this.defaultConfig.strokeStyle) === 'dashed' ? "5,5" : "");
      
      group.appendChild(line);
    } else {
      const dis = Math.sqrt((endPos.x - startPos.x) ** 2 + (endPos.y - startPos.y) ** 2);
      const radius = Math.abs(dis / 2 / Math.sin(offsetAngle));
      const sweepFlag = offsetAngle > 0 ? 1 : 0;
      const largeArcFlag = Math.abs(offsetAngle) > Math.PI / 2 ? 1 : 0;

      // Calculate the center position of the arc
      const centerAngle = startAngle - Math.PI / 2 * Math.sign(offsetAngle);
      const centerX = startPos.x + radius * Math.cos(centerAngle);
      const centerY = startPos.y + radius * Math.sin(centerAngle);
      console.log(centerAngle, centerX, centerY)

      // Calculate the shrunk end position
      const shrinkAngle = (this.config.directed || this.defaultConfig.directed) ? 4.9 / radius : 0;
      const endAngleFromCenter = Math.atan2(endPos.y - centerY, endPos.x - centerX);
      const shrunkEndAngle = endAngleFromCenter + shrinkAngle * Math.sign(offsetAngle);
      const shrunkEndPos = {
        x: centerX + radius * Math.cos(shrunkEndAngle),
        y: centerY + radius * Math.sin(shrunkEndAngle)
      };

      const path = document.createElementNS(svgNS, "path");
      const d = `M ${startPos.x} ${-startPos.y} A ${Math.abs(radius)} ${Math.abs(radius)} 0 ${largeArcFlag} ${sweepFlag} ${shrunkEndPos.x} ${-shrunkEndPos.y}`;
      path.setAttribute("d", d);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", this.config.strokeColor || this.defaultConfig.strokeColor);
      path.setAttribute("stroke-width", ((this.config.strokeWidth || this.defaultConfig.strokeWidth) + (selected ? 2 : 0)).toString());
      path.setAttribute("stroke-dasharray", this.config.strokeStyle === 'dashed' ? "5,5" : "");
      
      group.appendChild(path);
    }


    if (this.config.directed || this.defaultConfig.directed) {
      const arrowhead = this.createArrowhead(startPos, endPos, offsetAngle);
      group.appendChild(arrowhead);
    }

    if (this.config.labelText || this.defaultConfig.labelText) {
      const label = this.createLabel(startPos, endPos, offsetAngle);
      group.appendChild(label);
    }

    return group;
  }

  createArrowhead(start: XY, end: XY, offsetAngle: number): SVGElement {
    const angle = Math.atan2(end.y - start.y, end.x - start.x) - offsetAngle;
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

  createLabel(start: XY, end: XY, offsetAngle: number): SVGElement {
    const svgNS = "http://www.w3.org/2000/svg";
    const text = document.createElementNS(svgNS, "text");
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const delta = { x: end.x - start.x, y: end.y - start.y };
    const dis = Math.sqrt(delta.x ** 2 + delta.y ** 2);
    const offset = (
      offsetAngle == 0 ?
       0 :
       dis / 2 / Math.sin(offsetAngle) * (1 - Math.cos(offsetAngle))
    );
    const offsetDir = { x: -delta.y, y: delta.x };
    const offsetDirNormalized = { x: offsetDir.x / dis, y: offsetDir.y / dis };
    const textX = midX + offset * offsetDirNormalized.x;
    const textY = midY + offset * offsetDirNormalized.y;

    text.setAttribute("x", textX.toString());
    text.setAttribute("y", (-textY).toString());
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("font-size", (this.config.labelTextFontSize || this.defaultConfig.labelTextFontSize).toString());
    text.setAttribute("fill", this.config.labelTextColor || this.defaultConfig.labelTextColor);
    text.setAttribute("stroke", this.config.labelTextStrokeColor || this.defaultConfig.labelTextStrokeColor);
    text.setAttribute("stroke-width", (this.config.labelTextStrokeWidth || this.defaultConfig.labelTextStrokeWidth).toString());
    text.setAttribute("stroke-linejoin", "round");
    text.setAttribute("paint-order", "stroke");
    text.textContent = this.config.labelText || this.defaultConfig.labelText;

    return text;
  }
}
