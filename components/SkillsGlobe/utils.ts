/**
 * Generates evenly-distributed points on a sphere using the Fibonacci lattice
 * (golden-ratio-based spiral). This produces a visually uniform spread for
 * skill nodes without requiring editors to enter coordinates in the CMS.
 */
export function generateFibonacciSpherePositions(
  count: number,
  radius = 2.5,
): [number, number, number][] {
  const positions: [number, number, number][] = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let idx = 0; idx < count; idx++) {
    const theta = Math.acos(1 - (2 * (idx + 0.5)) / count);
    const phi = (2 * Math.PI * idx) / goldenRatio;

    const xCoord = radius * Math.sin(theta) * Math.cos(phi);
    const yCoord = radius * Math.sin(theta) * Math.sin(phi);
    const zCoord = radius * Math.cos(theta);

    positions.push([xCoord, yCoord, zCoord]);
  }

  return positions;
}
