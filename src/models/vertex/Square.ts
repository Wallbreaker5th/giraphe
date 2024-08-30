import { BaseVertex, ShapeConfig } from './Vertex';
import { XY } from '../coordinateSystem/XY';

const ratio = Math.sqrt(Math.PI / 4);

export class Square extends BaseVertex {
  constructor(position: XY, text: string = '', config: Partial<ShapeConfig> = {}, defaultConfig: ShapeConfig) {
    super(position, text, config, defaultConfig);
    this.shapeName = 'square';
  }

  getCoordinateFromAngle(angle: number): XY {
    const size = (this.config.size || this.defaultConfig.size) * ratio;
    const widthScale = this.config.widthScale || this.defaultConfig.widthScale;
    const halfWidth = (size * widthScale);
    const halfHeight = size;
    const { x, y } = this.position;

    // Normalize angle to 0-2π range
    const normalizedAngle = (angle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);

    if (normalizedAngle < Math.atan2(halfHeight, halfWidth)) {
      return { x: x + halfWidth, y: y + halfWidth * Math.tan(normalizedAngle) };
    } else if (normalizedAngle < Math.PI - Math.atan2(halfHeight, halfWidth)) {
      return { x: x + halfHeight / Math.tan(normalizedAngle), y: y + halfHeight };
    } else if (normalizedAngle < Math.PI + Math.atan2(halfHeight, halfWidth)) {
      return { x: x - halfWidth, y: y - halfWidth * Math.tan(normalizedAngle - Math.PI) };
    } else if (normalizedAngle < 2 * Math.PI - Math.atan2(halfHeight, halfWidth)) {
      return { x: x - halfHeight / Math.tan(normalizedAngle), y: y - halfHeight };
    } else {
      return { x: x + halfWidth, y: y + halfWidth * Math.tan(normalizedAngle) };
    }
  }

  getSVGElement(selected: boolean): SVGElement {
    const { x, y } = this.position;
    const size = (this.config.size || this.defaultConfig.size) * ratio;
    const fillColor = this.config.fillColor || this.defaultConfig.fillColor;
    const strokeColor = this.config.strokeColor || this.defaultConfig.strokeColor;
    const strokeWidth = this.config.strokeWidth || this.defaultConfig.strokeWidth;
    const textSize = this.config.textSize || this.defaultConfig.textSize;
    const widthScale = this.config.widthScale || this.defaultConfig.widthScale;

    const svgNS = "http://www.w3.org/2000/svg";
    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", (x - size * widthScale).toString());
    rect.setAttribute("y", (-y - size).toString());
    rect.setAttribute("width", (size * widthScale * 2).toString());
    rect.setAttribute("height", (size * 2).toString());
    rect.setAttribute("fill", fillColor);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", (strokeWidth + (selected ? 2 : 0)).toString());

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
      group.appendChild(rect);
      group.appendChild(text);

      return group;
    }

    return rect;
  }
}
