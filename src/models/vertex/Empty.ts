import { XY } from '../coordinateSystem/XY';
import { BaseVertex, ShapeConfig, defaultShapeConfig } from './Vertex';

export class Empty extends BaseVertex {  
  constructor(position: XY, text: string = '', config: Partial<ShapeConfig> = {}, defaultConfig: ShapeConfig = defaultShapeConfig) {
    super(position, text, config, defaultConfig);
    this.shapeName = 'empty';
  }

  getCoordinateFromAngle(angle: number): XY {
    // Since Empty has no size, it always returns its position
    return this.position;
  }

  getSVGElement(selected: boolean): SVGElement {
    // Empty vertex has no visual representation
    const svgNS = "http://www.w3.org/2000/svg";
    return document.createElementNS(svgNS, "g");
  }
}

