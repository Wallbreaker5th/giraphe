import { XY } from './XY';

export interface CoordinateSystem {
  type: string;
  name: string;

  /**
   * Get a position from an array of coordinates
   * @param coords Array of coordinates
   * @returns Position object with x and y properties
   */
  getPosition(coords: number[]): XY;
  
  /**
   * Get snap positions with their distances and priority given a position
   * @param position The current position to find snap positions for
   * @returns An array of objects containing snap positions, their distances from the given position, and priorities
   */
  getSnapPositions(position: XY, zoom: number): { snapPosition: XY; distance: number; priority: number }[];

  /**
   * Get SVG objects given a bounding rectangle
   * @param bounds Bounding rectangle { x, y, width, height }
   * @returns Array of SVG objects
   */
  getSVGObjects(bounds: { x: number; y: number; width: number; height: number }, zoom: number): SVGElement[];
}
