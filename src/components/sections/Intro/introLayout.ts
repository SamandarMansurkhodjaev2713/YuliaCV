import { createSeededRandom } from '../../../lib/seededRandom';

export type FragmentKind = 'text' | 'box' | 'pill';

export interface FragmentLayout {
  readonly id: string;
  readonly text: string;
  readonly kind: FragmentKind;
  /** Resting position on the grid, in percent of the overlay. */
  readonly gridX: number;
  readonly gridY: number;
  /** Offset from the grid cell while the fragment is still "noise", in pixels. */
  readonly noiseDx: number;
  readonly noiseDy: number;
  readonly noiseRotate: number;
  readonly noiseOpacity: number;
  readonly size: number;
}

export interface KeeperLayout {
  readonly id: string;
  readonly text: string;
  readonly gridX: number;
  readonly gridY: number;
}

export interface IntroLayout {
  readonly fragments: readonly FragmentLayout[];
  readonly keepers: readonly KeeperLayout[];
  readonly columns: number;
  readonly rows: number;
  /** Grid bounds in percent: [left, top, width, height]. */
  readonly area: readonly [number, number, number, number];
}

interface Viewport {
  readonly width: number;
  readonly height: number;
}

const KINDS: readonly FragmentKind[] = ['text', 'box', 'text', 'pill', 'text', 'box'];

/**
 * Builds the deterministic intro choreography: every fragment owns a grid cell (the "system")
 * plus a scattered offset (the "noise") it starts from. Keepers take the middle row.
 */
export function buildIntroLayout(
  noise: readonly string[],
  keepers: readonly string[],
  viewport: Viewport,
  seed = 7,
): IntroLayout {
  const random = createSeededRandom(seed);
  const compact = viewport.width < 768;
  const noiseCount = compact ? Math.min(noise.length, 18) : noise.length;
  const columns = compact ? 3 : 6;
  const total = noiseCount + keepers.length;
  const rows = Math.ceil(total / columns);
  const area: readonly [number, number, number, number] = compact ? [8, 15, 84, 70] : [7, 16, 86, 68];
  const cellWidth = area[2] / columns;
  const cellHeight = area[3] / rows;

  const cellCenter = (column: number, row: number) => ({
    x: area[0] + (column + 0.5) * cellWidth,
    y: area[1] + (row + 0.5) * cellHeight,
  });

  const keeperRow = Math.floor(rows / 2);
  const keeperStart = Math.floor((columns - keepers.length) / 2);
  const reserved = new Set<string>();
  const keeperLayouts = keepers.map((text, index) => {
    const column = keeperStart + index;
    reserved.add(`${column}:${keeperRow}`);
    const { x, y } = cellCenter(column, keeperRow);
    return { id: `keeper-${index}`, text, gridX: x, gridY: y };
  });

  const freeCells: Array<{ column: number; row: number }> = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      if (!reserved.has(`${column}:${row}`)) freeCells.push({ column, row });
    }
  }

  const fragments = noise.slice(0, noiseCount).map((text, index) => {
    const cell = freeCells[index] ?? { column: index % columns, row: Math.floor(index / columns) };
    const { x, y } = cellCenter(cell.column, cell.row);
    const scatterX = 5 + random() * 90;
    const scatterY = 8 + random() * 84;
    return {
      id: `fragment-${index}`,
      text,
      kind: KINDS[index % KINDS.length] ?? 'text',
      gridX: x,
      gridY: y,
      noiseDx: ((scatterX - x) / 100) * viewport.width,
      noiseDy: ((scatterY - y) / 100) * viewport.height,
      noiseRotate: (random() - 0.5) * 18,
      noiseOpacity: 0.3 + random() * 0.55,
      size: compact ? 0.56 + random() * 0.16 : 0.58 + random() * 0.24,
    };
  });

  return { fragments, keepers: keeperLayouts, columns, rows, area };
}
