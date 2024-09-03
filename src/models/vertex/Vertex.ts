import { XY } from '../coordinateSystem/XY';

export interface ShapeConfig {
  size: number;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  textSize: number;
  widthScale: number;
}

export const defaultShapeConfig: ShapeConfig = {
  size: 20,
  fillColor: '#ffffff',
  strokeColor: '#000000',
  strokeWidth: 2,
  textSize: 20,
  widthScale: 1
};

export interface Vertex {
  position: XY;
  text: string;
  config: Partial<ShapeConfig>;
  defaultConfig: ShapeConfig;
  shapeName: string;

  getCoordinateFromAngle(angle: number): XY;
  getSVGElement(selected: boolean): SVGElement;
}

export abstract class BaseVertex implements Vertex {
  position: XY;
  text: string;
  config: Partial<ShapeConfig>;
  defaultConfig: ShapeConfig;
  shapeName: string;

  constructor(position: XY, text: string, config: Partial<ShapeConfig>, defaultConfig: ShapeConfig) {
    this.position = position;
    this.text = text;
    this.config = config;
    this.defaultConfig = defaultConfig;
    this.shapeName = '';
  }

  abstract getCoordinateFromAngle(angle: number): XY;
  abstract getSVGElement(selected: boolean): SVGElement;
}
