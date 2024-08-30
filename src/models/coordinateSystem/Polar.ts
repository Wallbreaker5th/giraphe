import { CoordinateSystem } from './CoordinateSystem';
import { XY } from './XY';

class Polar implements CoordinateSystem {
  type: string = 'polar';
  name: string;
  origin: XY;
  radiusStep: number;
  angleStep: number = Math.PI / 6; // 30 degrees in radians
  color: string;
  priorityOffset: number;

  constructor(
    name: string, origin: XY = { x: 0, y: 0 }, radiusStep: number = 50,
    color: string = '#bbf', priorityOffset: number = 0
  ) {
    this.name = name;
    this.origin = origin;
    this.radiusStep = radiusStep;
    this.color = color;
    this.priorityOffset = priorityOffset;
  }

  getPosition(coords: number[]): XY {
    if (coords.length !== 2) {
      throw new Error('Polar coordinates must have exactly 2 values');
    }
    const [r, theta] = coords;
    return {
      x: this.origin.x + r * Math.cos(theta),
      y: this.origin.y + r * Math.sin(theta)
    };
  }

  getXYStep(zoom: number): XY {
    const step = Math.max(1, Math.pow(2, Math.ceil(-Math.log2(zoom)))) * this.radiusStep;
    return { x: step, y: step };
  }

  getSnapPositions(position: XY, zoom: number): { snapPosition: XY; distance: number; priority: number }[] {
    const snapPositions: { snapPosition: XY; distance: number; priority: number }[] = [];
    const { x: step } = this.getXYStep(zoom);

    // Convert to polar coordinates
    const dx = position.x - this.origin.x;
    const dy = position.y - this.origin.y;
    const r = Math.sqrt(dx * dx + dy * dy);
    const theta = Math.atan2(dy, dx);

    // Check four adjacent grid points
    const adjacentPoints = [
      { r: Math.floor(r / step) * step, theta: Math.floor(theta / this.angleStep) * this.angleStep },
      { r: Math.floor(r / step) * step, theta: Math.ceil(theta / this.angleStep) * this.angleStep },
      { r: Math.ceil(r / step) * step, theta: Math.floor(theta / this.angleStep) * this.angleStep },
      { r: Math.ceil(r / step) * step, theta: Math.ceil(theta / this.angleStep) * this.angleStep }
    ];

    adjacentPoints.forEach(point => {
      const snapPoint = this.getPosition([point.r, point.theta]);
      const distance = Math.sqrt(Math.pow(position.x - snapPoint.x, 2) + Math.pow(position.y - snapPoint.y, 2));
      snapPositions.push({
        snapPosition: snapPoint,
        distance: distance,
        priority: 2 + this.priorityOffset
      });
    });

    // Snap to nearest radius
    const nearestR = Math.round(r / step) * step;
    const snapR = this.getPosition([nearestR, theta]);
    snapPositions.push({
      snapPosition: snapR,
      distance: Math.abs(r - nearestR),
      priority: 1 + this.priorityOffset
    });

    // Snap to nearest angle
    const nearestTheta = Math.round(theta / this.angleStep) * this.angleStep;
    const snapTheta = this.getPosition([r, nearestTheta]);
    snapPositions.push({
      snapPosition: snapTheta,
      distance: r * Math.abs(theta - nearestTheta),
      priority: 1 + this.priorityOffset
    });

    return snapPositions;
  }

  getSVGObjects(bounds: { x: number; y: number; width: number; height: number }, zoom: number): SVGElement[] {
    const svgObjects: SVGElement[] = [];
    const svgNS = "http://www.w3.org/2000/svg";
    const { x: step } = this.getXYStep(zoom);

    const maxRadius = Math.sqrt(
      Math.max(
        Math.pow(bounds.x - this.origin.x, 2) + Math.pow(bounds.y - this.origin.y, 2),
        Math.pow(bounds.x + bounds.width - this.origin.x, 2) + Math.pow(bounds.y - this.origin.y, 2),
        Math.pow(bounds.x - this.origin.x, 2) + Math.pow(bounds.y + bounds.height - this.origin.y, 2),
        Math.pow(bounds.x + bounds.width - this.origin.x, 2) + Math.pow(bounds.y + bounds.height - this.origin.y, 2)
      )
    );

    for (let r = step; r <= maxRadius; r += step) {
      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("cx", this.origin.x.toString());
      circle.setAttribute("cy", (-this.origin.y).toString());
      circle.setAttribute("r", r.toString());
      circle.setAttribute("fill", "none");
      circle.setAttribute("stroke", this.color);
      circle.setAttribute("stroke-width", (1 / zoom).toString());
      svgObjects.push(circle);
    }

    // Draw radial lines
    for (let theta = 0; theta < 2 * Math.PI; theta += this.angleStep) {
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", this.origin.x.toString());
      line.setAttribute("y1", (-this.origin.y).toString());
      line.setAttribute("x2", (this.origin.x + maxRadius * Math.cos(theta)).toString());
      line.setAttribute("y2", (-this.origin.y - maxRadius * Math.sin(theta)).toString());
      line.setAttribute("stroke", this.color);
      line.setAttribute("stroke-width", (1 / zoom).toString());
      svgObjects.push(line);
    }

    return svgObjects;
  }
}

export default Polar;
