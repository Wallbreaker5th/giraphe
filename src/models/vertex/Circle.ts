import { BaseVertex, ShapeConfig } from './Vertex';
import { XY } from '../coordinateSystem/XY';

export class Circle extends BaseVertex {
  constructor(position: XY, text: string = '', config: Partial<ShapeConfig> = {}, defaultConfig: ShapeConfig) {
    super(position, text, config, defaultConfig);
    this.shapeName = 'circle';
  }

  getCoordinateFromAngle(angle: number): XY {
    const radius = this.config.size || this.defaultConfig.size;
    const widthScale = this.config.widthScale || this.defaultConfig.widthScale;
    const adjustedAngle = Math.atan2(Math.sin(angle), Math.cos(angle) / widthScale);
    const x = this.position.x + radius * widthScale * Math.cos(adjustedAngle);
    const y = this.position.y + radius * Math.sin(adjustedAngle);
    return { x, y };
  }

  getSVGElement(selected: boolean): SVGElement {
    const { x, y } = this.position;
    const radius = this.config.size || this.defaultConfig.size;
    const fillColor = this.config.fillColor || this.defaultConfig.fillColor;
    const strokeColor = this.config.strokeColor || this.defaultConfig.strokeColor;
    const strokeWidth = this.config.strokeWidth || this.defaultConfig.strokeWidth;
    const textSize = this.config.textSize || this.defaultConfig.textSize;
    const widthScale = this.config.widthScale || this.defaultConfig.widthScale;

    const svgNS = "http://www.w3.org/2000/svg";
    const ellipse = document.createElementNS(svgNS, "ellipse");
    ellipse.setAttribute("cx", x.toString());
    ellipse.setAttribute("cy", (-y).toString());
    ellipse.setAttribute("rx", (radius * widthScale).toString());
    ellipse.setAttribute("ry", radius.toString());
    ellipse.setAttribute("fill", fillColor);
    ellipse.setAttribute("stroke", strokeColor);
    ellipse.setAttribute("stroke-width", (strokeWidth + (selected ? 2 : 0)).toString());

    if (this.text) {
      const text = document.createElementNS(svgNS, "text");
      text.setAttribute("x", x.toString());
      text.setAttribute("y", (-y).toString());
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      text.setAttribute("fill", "black");
      text.setAttribute("font-size", textSize.toString() + "px");
      text.textContent = this.text;

      const group = document.createElementNS(svgNS, "g");
      group.appendChild(ellipse);
      group.appendChild(text);

      return group;
    }

    return ellipse;
  }
}
