import { CoordinateSystem } from './CoordinateSystem';
import { XY } from './XY';

class Cartesian implements CoordinateSystem {
  type: string = 'cartesian';
  name: string;
  scaleX: number;
  scaleY: number;
  color: string;
  origin: XY;
  priorityOffset: number;

  constructor(
    name: string, scaleX: number = 1, scaleY: number = 1, color: string = '#ccc',
    origin: XY = { x: 0, y: 0 }, priorityOffset: number = 0
  ) {
    this.name = name;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.color = color;
    this.origin = origin;
    this.priorityOffset = priorityOffset;
  }

  getPosition(coords: number[]): XY {
    if (coords.length !== 2) {
      throw new Error('Cartesian coordinates must have exactly 2 values');
    }
    return {
      x: this.origin.x + coords[0] * this.scaleX,
      y: this.origin.y + coords[1] * this.scaleY
    };
  }

  getXYStep(zoom: number): XY {
    const multiInt = Math.max(1, Math.pow(2, Math.ceil(-Math.log2(zoom))));
    return {
      x: multiInt * this.scaleX,
      y: multiInt * this.scaleY
    };
  }

  getSnapPositions(position: XY, zoom: number): { snapPosition: XY; distance: number; priority: number }[] {
    const snapPositions: { snapPosition: XY; distance: number; priority: number }[] = [];

    // Calculate the nearest grid point
    const { x: xStep, y: yStep } = this.getXYStep(zoom);
    const nearestGridX = Math.round((position.x - this.origin.x) / xStep) * xStep + this.origin.x;
    const nearestGridY = Math.round((position.y - this.origin.y) / yStep) * yStep + this.origin.y;
    const nearestGridPoint = { x: nearestGridX, y: nearestGridY };
    const distanceToGridPoint = Math.sqrt(Math.pow(position.x - nearestGridX, 2) + Math.pow(position.y - nearestGridY, 2));

    snapPositions.push({
      snapPosition: nearestGridPoint,
      distance: distanceToGridPoint,
      priority: 2 + this.priorityOffset
    });

    // Calculate the nearest grid lines
    const nearestGridLineX = Math.round((position.x - this.origin.x) / xStep) * xStep + this.origin.x;
    const nearestGridLineY = Math.round((position.y - this.origin.y) / yStep) * yStep + this.origin.y;

    // Snap to X grid line
    const distanceToXLine = Math.abs(position.x - nearestGridLineX);
    snapPositions.push({
      snapPosition: { x: nearestGridLineX, y: position.y },
      distance: distanceToXLine,
      priority: 1 + this.priorityOffset
    });

    // Snap to Y grid line
    const distanceToYLine = Math.abs(position.y - nearestGridLineY);
    snapPositions.push({
      snapPosition: { x: position.x, y: nearestGridLineY },
      distance: distanceToYLine,
      priority: 1 + this.priorityOffset
    });

    return snapPositions;
  }

  getSVGObjects(bounds: { x: number; y: number; width: number; height: number }, zoom: number): SVGElement[] {
    const svgObjects: SVGElement[] = [];
    const svgNS = "http://www.w3.org/2000/svg";

    const { x: stepX, y: stepY } = this.getXYStep(zoom);

    // Calculate the range of integers to draw lines for
    const minX = Math.ceil((bounds.x - this.origin.x) / stepX);
    const maxX = Math.floor((bounds.x + bounds.width - this.origin.x) / stepX);
    const minY = Math.ceil((bounds.y + this.origin.y) / stepY);
    const maxY = Math.floor((bounds.y + bounds.height + this.origin.y) / stepY);

    // Draw vertical lines
    for (let x = minX; x <= maxX; x++) {
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", (x * stepX + this.origin.x).toString());
      line.setAttribute("y1", bounds.y.toString());
      line.setAttribute("x2", (x * stepX + this.origin.x).toString());
      line.setAttribute("y2", (bounds.y + bounds.height).toString());
      line.setAttribute("stroke", this.color);
      line.setAttribute("stroke-width", (1 / zoom).toString());
      svgObjects.push(line);
    }

    // Draw horizontal lines
    for (let y = minY; y <= maxY; y++) {
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", bounds.x.toString());
      line.setAttribute("y1", (y * stepY - this.origin.y).toString());
      line.setAttribute("x2", (bounds.x + bounds.width).toString());
      line.setAttribute("y2", (y * stepY - this.origin.y).toString());
      line.setAttribute("stroke", this.color);
      line.setAttribute("stroke-width", (1 / zoom).toString());
      svgObjects.push(line);
    }

    return svgObjects;
  }

  setOrigin(newOrigin: XY): void {
    this.origin = newOrigin;
  }
}

export default Cartesian;
