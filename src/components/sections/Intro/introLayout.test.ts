import { describe, expect, it } from 'vitest';
import { ru } from '../../../content/ru';
import { buildIntroLayout } from './introLayout';

describe('intro layout', () => {
  it('GIVEN the same inputs WHEN built twice THEN the choreography is identical', () => {
    const a = buildIntroLayout(ru.intro.noise, ru.intro.keepers, { width: 1440, height: 900 });
    const b = buildIntroLayout(ru.intro.noise, ru.intro.keepers, { width: 1440, height: 900 });
    expect(a).toEqual(b);
  });

  it('GIVEN a desktop viewport WHEN built THEN every fragment and keeper owns a distinct grid cell inside the area', () => {
    const layout = buildIntroLayout(ru.intro.noise, ru.intro.keepers, { width: 1440, height: 900 });
    const cells = [...layout.fragments, ...layout.keepers].map((item) => `${item.gridX.toFixed(2)}:${item.gridY.toFixed(2)}`);
    expect(new Set(cells).size).toBe(cells.length);
    for (const item of [...layout.fragments, ...layout.keepers]) {
      expect(item.gridX).toBeGreaterThan(0);
      expect(item.gridX).toBeLessThan(100);
      expect(item.gridY).toBeGreaterThan(0);
      expect(item.gridY).toBeLessThan(100);
    }
  });

  it('GIVEN a phone viewport WHEN built THEN the choreography is compact', () => {
    const layout = buildIntroLayout(ru.intro.noise, ru.intro.keepers, { width: 390, height: 844 });
    expect(layout.columns).toBe(3);
    expect(layout.fragments.length).toBeLessThanOrEqual(18);
  });
});
